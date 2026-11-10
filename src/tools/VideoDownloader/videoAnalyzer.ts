import type { DownloadProgressState, QualityOption, VideoAnalysisResult } from './types'
import {
  LARGE_FILE_WARNING_BYTES,
  MAX_IN_MEMORY_BLOB_BYTES,
  classifyUrlPlatform,
  extractFilenameFromUrl,
  extractYouTubeVideoId,
  getOfficialPlatformRoutes,
  getResolutionLabel,
  parseContentDispositionFilename,
  sanitizeDownloadFilename,
  validateAndNormalizeUrl,
} from './videoUtils'

const PROBE_TIMEOUT_MS = 12000
const VIDEO_META_TIMEOUT_MS = 8000

interface VideoElementMeta {
  loaded: boolean
  durationSeconds: number | null
  width: number | null
  height: number | null
  thumbnailUrl?: string
}

function parseContentRangeTotal(contentRange: string | null): number | null {
  if (!contentRange) return null
  const match = contentRange.match(/\/\s*(\d+)\s*$/)
  if (!match || !match[1]) return null
  const n = Number(match[1])
  return Number.isFinite(n) && n >= 0 ? n : null
}

function isSupportedVideoContentType(mimeType: string, isDirectMediaExt: boolean): boolean {
  if (!mimeType) return false
  if (mimeType === 'video/mp4' || mimeType === 'video/webm' || mimeType === 'application/mp4') {
    return true
  }
  if ((mimeType === 'application/octet-stream' || mimeType === 'binary/octet-stream') && isDirectMediaExt) {
    return true
  }
  return false
}

/**
 * Probes an offscreen HTMLVideoElement for genuine duration, resolution, and (when CORS permits)
 * a poster frame thumbnail without downloading the whole video file.
 */
async function probeVideoElementMetadata(
  url: string,
  withCrossOrigin: boolean
): Promise<VideoElementMeta> {
  if (typeof document === 'undefined') {
    return { loaded: false, durationSeconds: null, width: null, height: null }
  }

  return new Promise((resolve) => {
    const video = document.createElement('video')
    let settled = false

    const cleanup = () => {
      video.removeAttribute('src')
      try {
        video.load()
      } catch {
        // ignore cleanup error
      }
    }

    const finish = (result: VideoElementMeta) => {
      if (settled) return
      settled = true
      clearTimeout(timer)
      cleanup()
      resolve(result)
    }

    const timer = window.setTimeout(() => {
      finish({ loaded: false, durationSeconds: null, width: null, height: null })
    }, VIDEO_META_TIMEOUT_MS)

    if (withCrossOrigin) {
      video.crossOrigin = 'anonymous'
    }
    video.preload = 'metadata'
    video.muted = true
    video.playsInline = true

    video.onloadedmetadata = () => {
      const durationSeconds =
        Number.isFinite(video.duration) && video.duration > 0 ? video.duration : null
      const width = video.videoWidth > 0 ? video.videoWidth : null
      const height = video.videoHeight > 0 ? video.videoHeight : null

      if (!withCrossOrigin || !width || !height) {
        finish({ loaded: true, durationSeconds, width, height })
        return
      }

      // Seek briefly near frame 0.1s (or half duration if very short) to capture a thumbnail frame
      const seekTarget = durationSeconds ? Math.min(0.5, durationSeconds / 3) : 0.1
      const captureTimer = window.setTimeout(() => {
        finish({ loaded: true, durationSeconds, width, height })
      }, 1500)

      video.onseeked = () => {
        window.clearTimeout(captureTimer)
        let thumbnailUrl: string | undefined
        try {
          const canvas = document.createElement('canvas')
          const scale = Math.min(1, 640 / width)
          canvas.width = Math.max(1, Math.round(width * scale))
          canvas.height = Math.max(1, Math.round(height * scale))
          const ctx = canvas.getContext('2d')
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
            thumbnailUrl = canvas.toDataURL('image/jpeg', 0.82)
          }
        } catch {
          thumbnailUrl = undefined
        }
        finish({ loaded: true, durationSeconds, width, height, thumbnailUrl })
      }

      try {
        video.currentTime = seekTarget
      } catch {
        window.clearTimeout(captureTimer)
        finish({ loaded: true, durationSeconds, width, height })
      }
    }

    video.onerror = () => {
      finish({ loaded: false, durationSeconds: null, width: null, height: null })
    }

    video.src = url
  })
}

async function fetchMediaHeaders(rawUrl: string): Promise<Response> {
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined
  const check = validateAndNormalizeUrl(rawUrl, origin)
  if (!check.valid || !check.url) {
    throw new Error(check.error || 'Blocked unsafe URL.')
  }
  const safeHref = check.url.href

  const controller = new AbortController()
  const timeout = window.setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS)

  try {
    let response = await fetch(safeHref, {
      method: 'HEAD',
      mode: 'cors',
      credentials: 'omit',
      cache: 'no-store',
      signal: controller.signal,
    })

    // Some CDNs reject HEAD (405/501) or strip Content-Type on HEAD; verify with 1-byte Range GET
    if (
      response.status === 405 ||
      response.status === 501 ||
      (response.ok && !response.headers.get('content-type'))
    ) {
      response = await fetch(safeHref, {
        method: 'GET',
        headers: { Range: 'bytes=0-1' },
        mode: 'cors',
        credentials: 'omit',
        cache: 'no-store',
        signal: controller.signal,
      })
      try {
        await response.body?.cancel()
      } catch {
        // ignore stream cancel errors
      }
    }

    return response
  } finally {
    window.clearTimeout(timeout)
  }
}

/**
 * Analyzes a submitted video URL honestly without paid APIs or unsafe proxy bypassing.
 */
export async function analyzeVideoUrl(rawUrl: string): Promise<VideoAnalysisResult> {
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined
  const validation = validateAndNormalizeUrl(rawUrl, origin)

  if (!validation.valid || !validation.url) {
    return {
      normalizedUrl: rawUrl.trim(),
      platformId: 'other',
      platformName: 'Invalid URL',
      capability: 'invalid',
      statusLabel: 'Invalid URL',
      statusSummary: validation.error || 'Please provide a valid public https:// or http:// video URL.',
      explanation:
        'Check for typos, missing https:// scheme, unsafe schemes (like javascript: or data:), or local-only private IP addresses.',
      title: 'Invalid Media Link',
      filename: 'video.mp4',
      durationSeconds: null,
      width: null,
      height: null,
      mimeType: null,
      fileSizeBytes: null,
      isLargeFile: false,
      hasContentDispositionName: false,
      qualityOptions: [],
      officialLinks: [],
    }
  }

  const parsedUrl = validation.url
  const normalizedUrl = parsedUrl.toString()
  const detected = classifyUrlPlatform(parsedUrl)

  // Social / Streaming Platforms (non-direct MP4/WebM)
  if (
    detected.platformId === 'youtube' ||
    detected.platformId === 'instagram' ||
    detected.platformId === 'facebook' ||
    detected.platformId === 'twitter' ||
    detected.platformId === 'tiktok'
  ) {
    const routes = getOfficialPlatformRoutes(detected.platformId, normalizedUrl)
    const ytId = detected.platformId === 'youtube' ? extractYouTubeVideoId(parsedUrl) : null
    const thumbnailUrl = ytId ? `https://i.ytimg.com/vi/${ytId}/hqdefault.jpg` : undefined
    const isRestricted = detected.isPrivatePathHint

    return {
      normalizedUrl,
      platformId: detected.platformId,
      platformName: detected.platformName,
      capability: isRestricted ? 'restricted' : 'official-only',
      statusLabel: isRestricted ? 'Private or Restricted Content' : 'Official Download Available',
      statusSummary: isRestricted
        ? `${detected.platformName} story or authenticated page cannot be fetched without login.`
        : routes.summary,
      explanation: isRestricted
        ? 'This URL points to a login screen, story, or account-gated page. Xenova-World does not bypass authentication, login walls, or private viewing controls.'
        : routes.explanation,
      title: ytId ? `YouTube Video (${ytId})` : `${detected.platformName} Media Link`,
      filename: `${detected.platformId}-video.mp4`,
      thumbnailUrl,
      durationSeconds: null,
      width: null,
      height: null,
      mimeType: null,
      fileSizeBytes: null,
      isLargeFile: false,
      hasContentDispositionName: false,
      qualityOptions: [
        {
          id: 'platform-official',
          label: `${detected.platformName} Official Platform Route`,
          format: 'Platform Stream',
          resolution: 'Platform Controlled',
          fileSizeBytes: null,
          downloadableDirect: false,
          note: 'Direct browser extraction is restricted by platform policy / CORS.',
        },
      ],
      officialLinks: routes.officialLinks,
    }
  }

  // Direct MP4 / WebM or General Public Media Probe
  try {
    const res = await fetchMediaHeaders(normalizedUrl)

    if (res.status === 401 || res.status === 403) {
      return {
        normalizedUrl,
        platformId: detected.platformId,
        platformName: detected.platformName,
        capability: 'restricted',
        statusLabel: 'Private or Restricted Content',
        statusSummary: `Access denied by remote server (HTTP ${res.status}).`,
        explanation:
          'This video requires authentication, signed cookies, or access permissions that a public browser downloader must not bypass.',
        title: extractFilenameFromUrl(parsedUrl).title,
        filename: extractFilenameFromUrl(parsedUrl).filename,
        durationSeconds: null,
        width: null,
        height: null,
        mimeType: null,
        fileSizeBytes: null,
        isLargeFile: false,
        hasContentDispositionName: false,
        qualityOptions: [],
        officialLinks: [
          {
            label: 'Open Source URL',
            url: normalizedUrl,
            description: 'Open this URL directly where you are signed in.',
          },
        ],
      }
    }

    if (!res.ok) {
      return {
        normalizedUrl,
        platformId: detected.platformId,
        platformName: detected.platformName,
        capability: 'network-error',
        statusLabel: 'Unavailable Media',
        statusSummary: `Remote server returned HTTP ${res.status}.`,
        explanation:
          'The video file could not be accessed at this address (e.g., expired signed link, moved asset, or 404 Not Found).',
        title: extractFilenameFromUrl(parsedUrl).title,
        filename: extractFilenameFromUrl(parsedUrl).filename,
        durationSeconds: null,
        width: null,
        height: null,
        mimeType: null,
        fileSizeBytes: null,
        isLargeFile: false,
        hasContentDispositionName: false,
        qualityOptions: [],
        officialLinks: [],
      }
    }

    const rawMime = (res.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
    if (!isSupportedVideoContentType(rawMime, detected.isDirectMediaExt)) {
      return {
        normalizedUrl,
        platformId: detected.platformId,
        platformName: detected.platformName,
        capability: 'unsupported',
        statusLabel: 'Unsupported Source',
        statusSummary: `Endpoint returned "${rawMime || 'non-video content'}" instead of a direct MP4 or WebM file.`,
        explanation:
          'Webpages (text/html), playlists requiring JS decryption, or non-MP4/WebM streams cannot be saved directly without a direct public MP4/WebM file URL.',
        title: detected.platformName,
        filename: 'unsupported.mp4',
        durationSeconds: null,
        width: null,
        height: null,
        mimeType: rawMime || null,
        fileSizeBytes: null,
        isLargeFile: false,
        hasContentDispositionName: false,
        qualityOptions: [],
        officialLinks: [
          {
            label: 'Open Page Directly',
            url: normalizedUrl,
            description: 'View the page natively in a new tab.',
          },
        ],
      }
    }

    const isWebm = rawMime.includes('webm') || detected.platformId === 'direct-webm'
    const ext: 'mp4' | 'webm' = isWebm ? 'webm' : 'mp4'
    const effectiveMime = isWebm ? 'video/webm' : 'video/mp4'
    const finalPlatformId = isWebm ? 'direct-webm' : 'direct-mp4'

    // Extract Content-Disposition or fallback filename
    const dispHeader = res.headers.get('content-disposition')
    const parsedDispName = parseContentDispositionFilename(dispHeader)
    const fallbackUrlName = extractFilenameFromUrl(parsedUrl, effectiveMime)
    const safeFilename = parsedDispName
      ? sanitizeDownloadFilename(parsedDispName, ext)
      : fallbackUrlName.filename

    // Extract Content-Length or Content-Range size
    const lengthHeader = res.headers.get('content-length')
    const parsedLength =
      lengthHeader && /^\d+$/.test(lengthHeader) ? Number(lengthHeader) : null
    const fileSizeBytes = parsedLength ?? parseContentRangeTotal(res.headers.get('content-range'))

    // Inspect video duration, resolution, and frame thumbnail via browser video metadata
    const videoMeta = await probeVideoElementMetadata(normalizedUrl, true)
    const resolution = getResolutionLabel(videoMeta.width, videoMeta.height)
    const formatLabel: 'MP4' | 'WebM' = isWebm ? 'WebM' : 'MP4'
    const isLargeFile = Boolean(fileSizeBytes && fileSizeBytes > LARGE_FILE_WARNING_BYTES)

    const qualityOptions: QualityOption[] = [
      {
        id: 'direct-source',
        label: `Original ${formatLabel} Source — ${resolution}`,
        format: formatLabel,
        resolution,
        fileSizeBytes,
        downloadableDirect: true,
        note: isLargeFile
          ? 'Large file (>250 MB): native browser save recommended alongside Blob streaming.'
          : 'Verified CORS-accessible direct stream ready for browser download.',
      },
    ]

    return {
      normalizedUrl,
      platformId: finalPlatformId,
      platformName: isWebm ? 'Direct WebM Video' : 'Direct MP4 Video',
      capability: 'supported-direct',
      statusLabel: 'Supported Direct Download',
      statusSummary: `Verified direct ${formatLabel} video stream ready to download in your browser.`,
      explanation: parsedDispName
        ? `Server provided Content-Disposition filename "${safeFilename}" with CORS permission enabled.`
        : 'CORS permission verified. Your browser can stream download progress directly to disk without third-party proxies.',
      title: fallbackUrlName.title,
      filename: safeFilename,
      thumbnailUrl: videoMeta.thumbnailUrl,
      previewVideoUrl: normalizedUrl,
      durationSeconds: videoMeta.durationSeconds,
      width: videoMeta.width,
      height: videoMeta.height,
      mimeType: effectiveMime,
      fileSizeBytes,
      isLargeFile,
      hasContentDispositionName: Boolean(parsedDispName),
      qualityOptions,
      officialLinks: [],
    }
  } catch (err: unknown) {
    const isTimeout = err instanceof DOMException && err.name === 'AbortError'

    if (!isTimeout) {
      // Distinguish CORS-blocked live media from truly unreachable hosts via <video preload="metadata">
      const fallbackMeta = await probeVideoElementMetadata(normalizedUrl, false)
      if (fallbackMeta.loaded) {
        const isWebm = detected.platformId === 'direct-webm'
        const formatLabel: 'MP4' | 'WebM' = isWebm ? 'WebM' : 'MP4'
        const fallbackUrlName = extractFilenameFromUrl(parsedUrl, isWebm ? 'video/webm' : 'video/mp4')
        const resolution = getResolutionLabel(fallbackMeta.width, fallbackMeta.height)

        return {
          normalizedUrl,
          platformId: detected.platformId === 'other' ? 'direct-media' : detected.platformId,
          platformName: isWebm ? 'Direct WebM Video' : 'Direct Video File',
          capability: 'cors-restricted',
          statusLabel: 'CORS Restricted (Direct Open Available)',
          statusSummary:
            'The remote server blocks JavaScript cross-origin reads (missing Access-Control-Allow-Origin), so in-browser Blob progress download is blocked.',
          explanation:
            'Playable video metadata was detected cleanly, meaning the file is live — however, strict browser CORS policy prevents Xenova-World from reading its raw bytes for forced-filename Blob downloads. We never pretend CORS-blocked downloads support progress bars or run an open server proxy. Use the native browser tab link below to open or save directly.',
          title: fallbackUrlName.title,
          filename: fallbackUrlName.filename,
          previewVideoUrl: normalizedUrl,
          durationSeconds: fallbackMeta.durationSeconds,
          width: fallbackMeta.width,
          height: fallbackMeta.height,
          mimeType: isWebm ? 'video/webm' : 'video/mp4',
          fileSizeBytes: null,
          isLargeFile: false,
          hasContentDispositionName: false,
          qualityOptions: [
            {
              id: 'native-open',
              label: `Native Browser Source — ${resolution}`,
              format: formatLabel,
              resolution,
              fileSizeBytes: null,
              downloadableDirect: false,
              note: 'CORS blocked JS fetch(); use native browser open / Save Video As.',
            },
          ],
          officialLinks: [
            {
              label: 'Open Direct Video in New Tab',
              url: normalizedUrl,
              description: 'Let your browser open or save the file natively using its built-in controls.',
            },
          ],
        }
      }
    }

    return {
      normalizedUrl,
      platformId: detected.platformId,
      platformName: detected.platformName,
      capability: 'network-error',
      statusLabel: isTimeout ? 'Request Timed Out' : 'Network or Media Error',
      statusSummary: isTimeout
        ? 'The remote server did not respond within 12 seconds.'
        : 'Unable to connect to this URL, or the endpoint does not serve an accessible MP4/WebM video.',
      explanation:
        'Check your internet connection, confirm the URL has not expired, verify HTTPS accessibility, and ensure the server permits direct media requests.',
      title: extractFilenameFromUrl(parsedUrl).title,
      filename: extractFilenameFromUrl(parsedUrl).filename,
      durationSeconds: null,
      width: null,
      height: null,
      mimeType: null,
      fileSizeBytes: null,
      isLargeFile: false,
      hasContentDispositionName: false,
      qualityOptions: [],
      officialLinks: [],
    }
  }
}

/**
 * Streams a CORS-accessible MP4/WebM video in the browser with progress reporting and Blob cleanup.
 */
export async function downloadDirectVideo(
  rawUrl: string,
  filename: string,
  expectedMime: string | null,
  onProgress: (state: DownloadProgressState) => void,
  signal?: AbortSignal
): Promise<void> {
  const origin = typeof window !== 'undefined' ? window.location.origin : undefined
  const check = validateAndNormalizeUrl(rawUrl, origin)
  if (!check.valid || !check.url) {
    throw new Error(check.error || 'Unsafe or invalid download URL rejected.')
  }
  const safeHref = check.url.href

  onProgress({
    status: 'downloading',
    loadedBytes: 0,
    totalBytes: null,
    percent: 0,
    message: 'Connecting to media stream...',
  })

  const response = await fetch(safeHref, {
    method: 'GET',
    mode: 'cors',
    credentials: 'omit',
    cache: 'no-store',
    signal,
  })

  if (response.status === 401 || response.status === 403) {
    throw new Error(`Private or restricted resource (HTTP ${response.status}).`)
  }
  if (!response.ok) {
    throw new Error(`Download failed with HTTP ${response.status}.`)
  }

  const lengthHeader = response.headers.get('content-length')
  const totalBytes = lengthHeader && /^\d+$/.test(lengthHeader) ? Number(lengthHeader) : null

  if (totalBytes && totalBytes > MAX_IN_MEMORY_BLOB_BYTES) {
    throw new Error(
      `File exceeds safe in-browser memory limit (${Math.round(totalBytes / (1024 * 1024))} MB > 512 MB). Use "Open Direct File in New Tab" to save natively.`
    )
  }

  const headerMime = (response.headers.get('content-type') || '').split(';')[0].trim().toLowerCase()
  const finalMime = headerMime.includes('webm')
    ? 'video/webm'
    : expectedMime?.includes('webm')
    ? 'video/webm'
    : 'video/mp4'

  const dispName = parseContentDispositionFilename(response.headers.get('content-disposition'))
  const ext: 'mp4' | 'webm' = finalMime === 'video/webm' ? 'webm' : 'mp4'
  const resolvedFilename = sanitizeDownloadFilename(dispName || filename, ext)

  let blob: Blob
  if (response.body) {
    const reader = response.body.getReader()
    const chunks: Uint8Array[] = []
    let loadedBytes = 0

    while (true) {
      const { done, value } = await reader.read()
      if (done) break
      if (value) {
        loadedBytes += value.byteLength
        if (loadedBytes > MAX_IN_MEMORY_BLOB_BYTES) {
          try {
            await reader.cancel()
          } catch {
            // ignore cancel error
          }
          throw new Error(
            'Stream exceeded 512 MB browser RAM safety ceiling. Open the direct URL in a new tab to save huge files natively.'
          )
        }
        chunks.push(value)
        const percent =
          totalBytes && totalBytes > 0
            ? Math.min(100, Math.round((loadedBytes / totalBytes) * 100))
            : null
        onProgress({
          status: 'downloading',
          loadedBytes,
          totalBytes,
          percent,
          message:
            percent !== null
              ? `Downloading (${percent}%)...`
              : `Streaming media...`,
        })
      }
    }

    blob = new Blob(chunks as BlobPart[], { type: finalMime })
  } else {
    blob = await response.blob()
  }

  const objectUrl = URL.createObjectURL(blob)
  try {
    const anchor = document.createElement('a')
    anchor.href = objectUrl
    anchor.download = resolvedFilename
    anchor.style.display = 'none'
    document.body.appendChild(anchor)
    anchor.click()
    document.body.removeChild(anchor)
  } finally {
    window.setTimeout(() => {
      URL.revokeObjectURL(objectUrl)
    }, 1500)
  }

  onProgress({
    status: 'completed',
    loadedBytes: blob.size,
    totalBytes: blob.size,
    percent: 100,
    message: `Saved as ${resolvedFilename}`,
  })
}

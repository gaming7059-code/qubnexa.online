/**
 * QUBNEXA — YouTube Thumbnail Downloader Utilities
 * Pure client-side parsing, CDN resolution generation, and image download helpers.
 */

export type ResolutionId = 'maxres' | 'sd' | 'hq' | 'mq' | 'default'

export interface ThumbnailResolution {
  id: ResolutionId
  label: string
  resolution: string
  width: number
  height: number
  aspectRatio: '16:9' | '4:3'
  filename: string
  url: string
  webpUrl: string
  guaranteed: boolean
}

export interface YouTubeValidationResult {
  valid: boolean
  videoId: string | null
  error: string | null
  detectedType: 'watch' | 'shorts' | 'youtu.be' | 'embed' | 'live' | 'raw-id' | null
}

const YOUTUBE_ID_REGEX = /^[A-Za-z0-9_-]{11}$/
const ALLOWED_CDN_HOSTS = new Set(['i.ytimg.com', 'img.youtube.com'])

/**
 * Validates that an image URL belongs strictly to authorized YouTube CDN origins.
 */
export function isAllowedYouTubeCdnUrl(url: string): boolean {
  try {
    const parsed = new URL(url)
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return false
    }
    const host = parsed.hostname.toLowerCase()
    return ALLOWED_CDN_HOSTS.has(host) || host.endsWith('.ytimg.com')
  } catch {
    return false
  }
}

/**
 * Extracts and strictly validates an 11-character YouTube video ID.
 */
export function extractYouTubeVideoId(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()
  if (!trimmed) return null

  // 1. Direct 11-character video ID
  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return trimmed
  }

  // 2. Normalize potential URL string
  let urlString = trimmed
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlString)) {
    urlString = `https://${urlString}`
  }

  let parsed: URL
  try {
    parsed = new URL(urlString)
  } catch {
    return null
  }

  const hostname = parsed.hostname.toLowerCase()
  const pathname = parsed.pathname

  // Reject non-YouTube domains
  const isYouTube =
    hostname === 'youtube.com' ||
    hostname.endsWith('.youtube.com') ||
    hostname === 'youtu.be' ||
    hostname.endsWith('.youtu.be') ||
    hostname === 'youtube-nocookie.com' ||
    hostname.endsWith('.youtube-nocookie.com')

  if (!isYouTube) {
    return null
  }

  let candidate: string | null = null

  // youtu.be shortlinks: pathname is /VIDEO_ID
  if (hostname === 'youtu.be' || hostname.endsWith('.youtu.be')) {
    candidate = pathname.replace(/^\/+/, '').split('/')[0] || null
  } else {
    // Check search param 'v'
    const vParam = parsed.searchParams.get('v')
    if (vParam) {
      candidate = vParam
    } else {
      // Check paths: /shorts/ID, /embed/ID, /live/ID, /v/ID, /e/ID
      const parts = pathname.split('/').filter(Boolean)
      if (parts.length >= 2 && ['shorts', 'embed', 'live', 'v', 'e'].includes(parts[0])) {
        candidate = parts[1]
      }
    }
  }

  if (candidate && YOUTUBE_ID_REGEX.test(candidate)) {
    return candidate
  }

  return null
}

/**
 * Validates input and returns user-friendly error diagnostics.
 */
export function validateYouTubeInput(input: string): YouTubeValidationResult {
  const trimmed = input.trim()
  if (!trimmed) {
    return {
      valid: false,
      videoId: null,
      error: 'Please enter a YouTube video URL or video ID.',
      detectedType: null,
    }
  }

  if (YOUTUBE_ID_REGEX.test(trimmed)) {
    return {
      valid: true,
      videoId: trimmed,
      error: null,
      detectedType: 'raw-id',
    }
  }

  let urlString = trimmed
  if (!/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(urlString)) {
    urlString = `https://${urlString}`
  }

  let parsed: URL
  try {
    parsed = new URL(urlString)
  } catch {
    return {
      valid: false,
      videoId: null,
      error: 'Invalid URL format. Please enter a valid web link or video ID.',
      detectedType: null,
    }
  }

  const host = parsed.hostname.toLowerCase()
  const isYouTube =
    host === 'youtube.com' ||
    host.endsWith('.youtube.com') ||
    host === 'youtu.be' ||
    host.endsWith('.youtu.be') ||
    host === 'youtube-nocookie.com' ||
    host.endsWith('.youtube-nocookie.com')

  if (!isYouTube) {
    return {
      valid: false,
      videoId: null,
      error: 'The provided link is not from YouTube. Please provide a YouTube video link.',
      detectedType: null,
    }
  }

  const parts = parsed.pathname.split('/').filter(Boolean)
  if (parts.length > 0 && (parts[0].startsWith('@') || parts[0] === 'channel' || parts[0] === 'c' || parts[0] === 'user')) {
    return {
      valid: false,
      videoId: null,
      error: 'This is a YouTube channel or profile URL. Please provide a specific video URL.',
      detectedType: null,
    }
  }

  const videoId = extractYouTubeVideoId(trimmed)
  if (!videoId) {
    return {
      valid: false,
      videoId: null,
      error: 'Could not detect a valid 11-character YouTube video ID in this link.',
      detectedType: null,
    }
  }

  let detectedType: YouTubeValidationResult['detectedType'] = 'watch'
  if (host.includes('youtu.be')) detectedType = 'youtu.be'
  else if (parts[0] === 'shorts') detectedType = 'shorts'
  else if (parts[0] === 'embed') detectedType = 'embed'
  else if (parts[0] === 'live') detectedType = 'live'

  return {
    valid: true,
    videoId,
    error: null,
    detectedType,
  }
}

/**
 * Builds the standard thumbnail resolution metadata for a given YouTube video ID.
 */
export function getThumbnailResolutions(videoId: string): ThumbnailResolution[] {
  return [
    {
      id: 'maxres',
      label: 'Maximum Resolution (HD/4K)',
      resolution: '1280 × 720',
      width: 1280,
      height: 720,
      aspectRatio: '16:9',
      filename: `youtube-thumbnail-${videoId}-maxres-1280x720.jpg`,
      url: `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/maxresdefault.webp`,
      guaranteed: false,
    },
    {
      id: 'sd',
      label: 'Standard Definition (SD)',
      resolution: '640 × 480',
      width: 640,
      height: 480,
      aspectRatio: '4:3',
      filename: `youtube-thumbnail-${videoId}-sd-640x480.jpg`,
      url: `https://i.ytimg.com/vi/${videoId}/sddefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/sddefault.webp`,
      guaranteed: false,
    },
    {
      id: 'hq',
      label: 'High Quality (HQ)',
      resolution: '480 × 360',
      width: 480,
      height: 360,
      aspectRatio: '4:3',
      filename: `youtube-thumbnail-${videoId}-hq-480x360.jpg`,
      url: `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/hqdefault.webp`,
      guaranteed: true,
    },
    {
      id: 'mq',
      label: 'Medium Quality (MQ)',
      resolution: '320 × 180',
      width: 320,
      height: 180,
      aspectRatio: '16:9',
      filename: `youtube-thumbnail-${videoId}-mq-320x180.jpg`,
      url: `https://i.ytimg.com/vi/${videoId}/mqdefault.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/mqdefault.webp`,
      guaranteed: true,
    },
    {
      id: 'default',
      label: 'Default / Small Thumbnail',
      resolution: '120 × 90',
      width: 120,
      height: 90,
      aspectRatio: '4:3',
      filename: `youtube-thumbnail-${videoId}-default-120x90.jpg`,
      url: `https://i.ytimg.com/vi/${videoId}/default.jpg`,
      webpUrl: `https://i.ytimg.com/vi_webp/${videoId}/default.webp`,
      guaranteed: true,
    },
  ]
}

/**
 * Checks whether an image genuinely exists on YouTube CDN.
 * YouTube returns a 120x90 dummy image when maxres or sd is unavailable.
 */
export function probeThumbnailAvailability(url: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || typeof Image === 'undefined') {
      resolve(true)
      return
    }
    if (!isAllowedYouTubeCdnUrl(url)) {
      resolve(false)
      return
    }

    const img = new Image()
    let timedOut = false
    const timer = setTimeout(() => {
      timedOut = true
      img.onload = null
      img.onerror = null
      resolve(false)
    }, 5000)

    img.onload = () => {
      if (timedOut) return
      clearTimeout(timer)
      if (img.naturalWidth > 120 && img.naturalHeight > 90) {
        resolve(true)
      } else {
        resolve(false)
      }
    }

    img.onerror = () => {
      if (timedOut) return
      clearTimeout(timer)
      resolve(false)
    }

    img.src = url
  })
}

/**
 * Downloads a thumbnail file via client-side Canvas Blob conversion.
 * Avoids direct fetch while securing origin validation and local download.
 */
export function downloadThumbnailFile(url: string, filename: string): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false)
      return
    }

    if (!isAllowedYouTubeCdnUrl(url)) {
      resolve(false)
      return
    }

    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_')

    const img = new Image()
    img.crossOrigin = 'anonymous'

    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        canvas.width = img.naturalWidth
        canvas.height = img.naturalHeight
        const ctx = canvas.getContext('2d')
        if (!ctx) {
          window.open(url, '_blank', 'noopener,noreferrer')
          resolve(false)
          return
        }

        ctx.drawImage(img, 0, 0)
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              window.open(url, '_blank', 'noopener,noreferrer')
              resolve(false)
              return
            }
            const blobUrl = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = blobUrl
            link.download = sanitizedFilename
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            setTimeout(() => URL.revokeObjectURL(blobUrl), 1500)
            resolve(true)
          },
          'image/jpeg',
          0.98,
        )
      } catch {
        window.open(url, '_blank', 'noopener,noreferrer')
        resolve(false)
      }
    }

    img.onerror = () => {
      window.open(url, '_blank', 'noopener,noreferrer')
      resolve(false)
    }

    img.src = url
  })
}

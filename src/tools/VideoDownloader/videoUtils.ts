import type { LiveDetectionPreview, OfficialLink, PlatformId } from './types'

export const LARGE_FILE_WARNING_BYTES = 250 * 1024 * 1024 // 250 MB
export const MAX_IN_MEMORY_BLOB_BYTES = 512 * 1024 * 1024 // 512 MB

const UNSAFE_SCHEME_PATTERN = /^\s*(javascript|data|vbscript|file|blob|about|ftp|ftps|mailto|tel):/i

export interface UrlValidationResult {
  valid: boolean
  url?: URL
  error?: string
}

/**
 * Checks whether a hostname is a private, loopback, link-local, or internal address.
 */
export function isPrivateOrInternalHost(hostname: string): boolean {
  const host = hostname.toLowerCase().replace(/^\[|\]$/g, '')

  if (
    host === 'localhost' ||
    host === 'ip6-localhost' ||
    host === '0.0.0.0' ||
    host === '::' ||
    host === '::1' ||
    host.endsWith('.local') ||
    host.endsWith('.internal') ||
    host.endsWith('.localhost')
  ) {
    return true
  }

  // IPv6 private / link-local ranges (fc00::/7, fe80::/10, ::ffff:127/10/etc.)
  if (host.includes(':')) {
    if (
      host.startsWith('fe80:') ||
      host.startsWith('fc') ||
      host.startsWith('fd') ||
      host.startsWith('::ffff:')
    ) {
      return true
    }
    return false
  }

  // IPv4 dotted quad or integer decimal forms
  if (/^\d+$/.test(host)) {
    return true
  }

  const ipv4Match = host.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/)
  if (ipv4Match) {
    const a = Number(ipv4Match[1])
    const b = Number(ipv4Match[2])
    if (a === 10 || a === 127 || a === 0) return true
    if (a === 169 && b === 254) return true
    if (a === 192 && b === 168) return true
    if (a === 172 && b >= 16 && b <= 31) return true
    if (a === 100 && b >= 64 && b <= 127) return true
  }

  return false
}

/**
 * Checks strict domain/subdomain ownership without substring spoofing.
 */
export function hostMatchesDomain(hostname: string, domain: string): boolean {
  const lowerHost = hostname.toLowerCase()
  const lowerDomain = domain.toLowerCase()
  return lowerHost === lowerDomain || lowerHost.endsWith(`.${lowerDomain}`)
}

/**
 * Validates and normalizes user-submitted video URLs with strict scheme and SSRF-safe host checks.
 */
export function validateAndNormalizeUrl(rawInput: string, currentOrigin?: string): UrlValidationResult {
  const trimmed = rawInput.trim()

  if (!trimmed) {
    return { valid: false, error: 'Please paste or enter a video URL first.' }
  }

  if (UNSAFE_SCHEME_PATTERN.test(trimmed)) {
    return {
      valid: false,
      error: 'Unsafe URL scheme rejected. Only standard https:// or http:// links are permitted.',
    }
  }

  if (/\s/.test(trimmed)) {
    return { valid: false, error: 'Invalid URL: web addresses cannot contain spaces.' }
  }

  let parsed: URL
  try {
    parsed = new URL(trimmed)
  } catch {
    return {
      valid: false,
      error: 'Invalid URL format. Enter a full web address starting with https:// or http://.',
    }
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return {
      valid: false,
      error: `Unsupported protocol (${parsed.protocol}). Only https:// and http:// URLs are allowed.`,
    }
  }

  if (parsed.username || parsed.password) {
    return {
      valid: false,
      error: 'URLs containing embedded credentials are blocked for your security.',
    }
  }

  if (!parsed.hostname || (!parsed.hostname.includes('.') && parsed.hostname !== 'localhost')) {
    return { valid: false, error: 'Invalid URL hostname.' }
  }

  const isSameOrigin = Boolean(currentOrigin && parsed.origin === currentOrigin)
  if (!isSameOrigin && isPrivateOrInternalHost(parsed.hostname)) {
    return {
      valid: false,
      error: 'Private, loopback, or local-network addresses cannot be analyzed from external origins.',
    }
  }

  return { valid: true, url: parsed }
}

/**
 * Extracts a strict 11-character YouTube video ID if present.
 */
export function extractYouTubeVideoId(url: URL): string | null {
  const host = url.hostname.toLowerCase()
  let candidate: string | null = null

  if (hostMatchesDomain(host, 'youtu.be')) {
    candidate = url.pathname.replace(/^\/+/, '').split('/')[0] || null
  } else if (
    hostMatchesDomain(host, 'youtube.com') ||
    hostMatchesDomain(host, 'youtube-nocookie.com')
  ) {
    const vParam = url.searchParams.get('v')
    if (vParam) {
      candidate = vParam
    } else {
      const parts = url.pathname.split('/').filter(Boolean)
      if (parts.length >= 2 && ['shorts', 'embed', 'live', 'v'].includes(parts[0])) {
        candidate = parts[1]
      }
    }
  }

  if (candidate && /^[A-Za-z0-9_-]{11}$/.test(candidate)) {
    return candidate
  }

  return null
}

/**
 * Classifies platform or direct media file extension from a validated URL.
 */
export function classifyUrlPlatform(url: URL): {
  platformId: PlatformId
  platformName: string
  isDirectMediaExt: boolean
  isPrivatePathHint: boolean
} {
  const host = url.hostname.toLowerCase()
  const lowerPath = url.pathname.toLowerCase()

  if (lowerPath.endsWith('.mp4') || lowerPath.endsWith('.m4v')) {
    return {
      platformId: 'direct-mp4',
      platformName: 'Direct MP4 Video',
      isDirectMediaExt: true,
      isPrivatePathHint: /\/private\//i.test(lowerPath),
    }
  }

  if (lowerPath.endsWith('.webm')) {
    return {
      platformId: 'direct-webm',
      platformName: 'Direct WebM Video',
      isDirectMediaExt: true,
      isPrivatePathHint: /\/private\//i.test(lowerPath),
    }
  }

  if (
    hostMatchesDomain(host, 'youtube.com') ||
    hostMatchesDomain(host, 'youtu.be') ||
    hostMatchesDomain(host, 'youtube-nocookie.com')
  ) {
    return {
      platformId: 'youtube',
      platformName: 'YouTube',
      isDirectMediaExt: false,
      isPrivatePathHint: false,
    }
  }

  if (hostMatchesDomain(host, 'instagram.com') || hostMatchesDomain(host, 'instagr.am')) {
    const restrictedPath =
      lowerPath.startsWith('/stories/') ||
      lowerPath.startsWith('/accounts/login') ||
      lowerPath.includes('/challenge/')
    return {
      platformId: 'instagram',
      platformName: 'Instagram',
      isDirectMediaExt: false,
      isPrivatePathHint: restrictedPath,
    }
  }

  if (hostMatchesDomain(host, 'facebook.com') || hostMatchesDomain(host, 'fb.watch')) {
    const restrictedPath =
      lowerPath.startsWith('/login') ||
      lowerPath.includes('/groups/') && lowerPath.includes('private')
    return {
      platformId: 'facebook',
      platformName: 'Facebook',
      isDirectMediaExt: false,
      isPrivatePathHint: restrictedPath,
    }
  }

  if (hostMatchesDomain(host, 'x.com') || hostMatchesDomain(host, 'twitter.com')) {
    return {
      platformId: 'twitter',
      platformName: 'X / Twitter',
      isDirectMediaExt: false,
      isPrivatePathHint: lowerPath.startsWith('/i/flow/login'),
    }
  }

  if (hostMatchesDomain(host, 'tiktok.com')) {
    return {
      platformId: 'tiktok',
      platformName: 'TikTok',
      isDirectMediaExt: false,
      isPrivatePathHint: false,
    }
  }

  return {
    platformId: 'other',
    platformName: url.hostname,
    isDirectMediaExt: false,
    isPrivatePathHint: /\/(private|protected|login|signin)\b/i.test(lowerPath),
  }
}

/**
 * Provides instant UI detection feedback while the user types or pastes a URL.
 */
export function getLiveDetectionPreview(rawInput: string, currentOrigin?: string): LiveDetectionPreview {
  const trimmed = rawInput.trim()
  if (!trimmed) {
    return {
      isValidSyntax: false,
      platformId: null,
      platformName: 'Waiting for URL',
      badgeLabel: 'Paste a direct MP4/WebM link or video URL',
      tone: 'slate',
      hint: 'Supports public .mp4, .webm, and CORS-enabled media URLs directly in your browser.',
    }
  }

  const check = validateAndNormalizeUrl(trimmed, currentOrigin)
  if (!check.valid || !check.url) {
    return {
      isValidSyntax: false,
      platformId: null,
      platformName: 'Invalid URL',
      badgeLabel: 'Invalid or Blocked URL',
      tone: 'rose',
      hint: check.error || 'Enter a valid https:// or http:// URL.',
    }
  }

  const detected = classifyUrlPlatform(check.url)
  if (detected.isDirectMediaExt) {
    return {
      isValidSyntax: true,
      platformId: detected.platformId,
      platformName: detected.platformName,
      badgeLabel: `${detected.platformName} Detected`,
      tone: 'emerald',
      hint: 'Click Analyze to inspect MIME type, duration, resolution, and direct download availability.',
    }
  }

  if (detected.platformId === 'other') {
    return {
      isValidSyntax: true,
      platformId: 'other',
      platformName: detected.platformName,
      badgeLabel: 'Public Media Probe Ready',
      tone: 'cyan',
      hint: 'Click Analyze to verify whether this endpoint serves a direct MP4 or WebM file.',
    }
  }

  if (detected.isPrivatePathHint) {
    return {
      isValidSyntax: true,
      platformId: detected.platformId,
      platformName: detected.platformName,
      badgeLabel: `${detected.platformName} • Restricted / Login Path`,
      tone: 'amber',
      hint: 'Login-gated or private URLs cannot be accessed automatically without authentication.',
    }
  }

  return {
    isValidSyntax: true,
    platformId: detected.platformId,
    platformName: detected.platformName,
    badgeLabel: `${detected.platformName} Detected`,
    tone: 'cyan',
    hint: `${detected.platformName} restricts direct browser downloads. Analyze shows platform options & official routes.`,
  }
}

/**
 * Parses Content-Disposition headers safely (supports RFC 5987 filename*=UTF-8'' and filename="").
 */
export function parseContentDispositionFilename(header: string | null): string | null {
  if (!header) return null

  // 1. Try RFC 5987 UTF-8 encoded filename*
  const extMatch = header.match(/filename\*\s*=\s*(?:UTF-8''|utf-8'')([^;\r\n]+)/i)
  if (extMatch && extMatch[1]) {
    const raw = extMatch[1].trim().replace(/^["']|["']$/g, '')
    try {
      const decoded = decodeURIComponent(raw)
      if (decoded.trim()) return decoded.trim()
    } catch {
      if (raw.trim()) return raw.trim()
    }
  }

  // 2. Fallback to standard filename="..." or unquoted token
  const stdMatch = header.match(/filename\s*=\s*"([^"\r\n]+)"|filename\s*=\s*([^;\s\r\n]+)/i)
  const candidate = stdMatch?.[1] || stdMatch?.[2]
  return candidate ? candidate.trim() : null
}

function stripControlAndUnsafeFilenameChars(value: string): string {
  return Array.from(value)
    .filter((ch) => {
      const code = ch.charCodeAt(0)
      return code >= 32 && code !== 127 && !'<>:"|?*'.includes(ch)
    })
    .join('')
}

/**
 * Sanitizes filenames against path traversal, control chars, and invalid Windows characters.
 */
export function sanitizeDownloadFilename(
  rawName: string | null | undefined,
  fallbackExt: 'mp4' | 'webm' = 'mp4'
): string {
  const leafSegment = (rawName || '').split(/[\\/]/).pop() || ''
  const leaf = stripControlAndUnsafeFilenameChars(leafSegment.replace(/\.\./g, '')).trim()

  const baseClean = leaf && leaf !== '.' && leaf !== '..' ? leaf : `qubnexa-video.${fallbackExt}`
  const truncated = baseClean.length > 120 ? baseClean.slice(0, 120) : baseClean

  const lower = truncated.toLowerCase()
  if (lower.endsWith('.mp4') || lower.endsWith('.webm')) {
    return truncated
  }

  const stem = truncated.replace(/\.[^.]+$/, '') || 'qubnexa-video'
  return `${stem}.${fallbackExt}`
}

export function extractFilenameFromUrl(url: URL, mimeType?: string | null): {
  filename: string
  title: string
} {
  const ext: 'mp4' | 'webm' = mimeType?.toLowerCase().includes('webm') ? 'webm' : 'mp4'
  const lastSegment = url.pathname.split('/').filter(Boolean).pop() || ''
  let decodedSegment = lastSegment
  try {
    decodedSegment = decodeURIComponent(lastSegment)
  } catch {
    decodedSegment = lastSegment
  }

  const filename = sanitizeDownloadFilename(decodedSegment || `qubnexa-video.${ext}`, ext)
  const title =
    filename.replace(/\.(mp4|webm|m4v)$/i, '').replace(/[-_]+/g, ' ').trim() || 'Direct Video File'

  return { filename, title }
}

export function formatBytes(bytes: number | null | undefined): string {
  if (bytes === null || bytes === undefined || !Number.isFinite(bytes) || bytes < 0) {
    return 'Unknown size'
  }
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`
}

export function formatDuration(seconds: number | null | undefined): string {
  if (seconds === null || seconds === undefined || !Number.isFinite(seconds) || seconds <= 0) {
    return 'Unknown'
  }
  const total = Math.floor(seconds)
  const hrs = Math.floor(total / 3600)
  const mins = Math.floor((total % 3600) / 60)
  const secs = total % 60
  if (hrs > 0) {
    return `${hrs}:${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
  }
  return `${mins}:${String(secs).padStart(2, '0')}`
}

export function getResolutionLabel(width: number | null, height: number | null): string {
  if (!width || !height) return 'Original Source'
  const maxDim = Math.max(width, height)
  const minDim = Math.min(width, height)
  let tier = `${width}×${height}`
  if (minDim >= 2160 || maxDim >= 3840) tier = `4K UHD (${width}×${height})`
  else if (minDim >= 1440) tier = `1440p QHD (${width}×${height})`
  else if (minDim >= 1080) tier = `1080p Full HD (${width}×${height})`
  else if (minDim >= 720) tier = `720p HD (${width}×${height})`
  else if (minDim >= 480) tier = `480p SD (${width}×${height})`
  else tier = `${minDim}p (${width}×${height})`
  return tier
}

export function getOfficialPlatformRoutes(platformId: PlatformId, normalizedUrl: string): {
  summary: string
  explanation: string
  officialLinks: OfficialLink[]
} {
  switch (platformId) {
    case 'youtube':
      return {
        summary: 'YouTube restricts third-party direct video extraction.',
        explanation:
          'YouTube uses signed, expiring stream manifests and does not grant CORS access for direct MP4/WebM downloads in static browser tools. QUBNEXA does not bypass platform restrictions or DRM. Watch officially on YouTube or download your own uploaded videos via YouTube Studio / Google Takeout.',
        officialLinks: [
          {
            label: 'Watch on YouTube',
            url: normalizedUrl,
            description: 'Open this video directly on YouTube.',
          },
          {
            label: 'YouTube Studio (Own Videos)',
            url: 'https://studio.youtube.com/',
            description: 'Download MP4 copies of videos you uploaded to your channel.',
          },
          {
            label: 'Google Takeout Export',
            url: 'https://takeout.google.com/',
            description: 'Export your own YouTube content library in bulk.',
          },
        ],
      }
    case 'instagram':
      return {
        summary: 'Instagram requires authentication or official export for media saving.',
        explanation:
          'Instagram does not provide public CORS-enabled direct MP4 URLs for third-party web apps, and Stories or private posts require an authenticated session. QUBNEXA does not bypass login gates or private restrictions.',
        officialLinks: [
          {
            label: 'Open on Instagram',
            url: normalizedUrl,
            description: 'View the reel or post directly on Instagram.',
          },
          {
            label: 'Meta Accounts Center (Own Data)',
            url: 'https://accountscenter.instagram.com/info_and_permissions/',
            description: 'Request official downloads of your own Instagram reels and media.',
          },
        ],
      }
    case 'facebook':
      return {
        summary: 'Facebook streams are segmented and platform-restricted.',
        explanation:
          'Facebook uses authenticated DASH/HLS streaming without public CORS direct MP4 endpoints for external websites. Open the video directly on Facebook or export your own uploads through Meta Privacy Settings.',
        officialLinks: [
          {
            label: 'Open on Facebook',
            url: normalizedUrl,
            description: 'View this video or reel on Facebook.',
          },
          {
            label: 'Facebook Info Download',
            url: 'https://www.facebook.com/dyi/',
            description: 'Download your own uploaded Facebook videos safely.',
          },
        ],
      }
    case 'twitter':
      return {
        summary: 'X / Twitter post pages do not expose public CORS video URLs.',
        explanation:
          'Post links on x.com/twitter.com serve rendered webpage wrappers rather than direct MP4 files, and external browsers cannot scrape cross-origin feeds without a proxy.',
        officialLinks: [
          {
            label: 'Open Post on X',
            url: normalizedUrl,
            description: 'Open the original post on X (Twitter).',
          },
          {
            label: 'X Data Archive',
            url: 'https://x.com/settings/your_twitter_data',
            description: 'Download an official archive of your own media uploads.',
          },
        ],
      }
    case 'tiktok':
      return {
        summary: 'TikTok protects video feeds from automated cross-origin extraction.',
        explanation:
          'TikTok restricts cross-origin browser requests and requires either in-app Save (when enabled by the creator) or official account archive export.',
        officialLinks: [
          {
            label: 'Open on TikTok',
            url: normalizedUrl,
            description: 'View on TikTok and use Save Video if enabled by the creator.',
          },
          {
            label: 'TikTok Data Request Guide',
            url: 'https://support.tiktok.com/en/account-and-privacy/personalized-ads-and-data/requesting-your-data',
            description: 'Instructions to download your own TikTok videos officially.',
          },
        ],
      }
    default:
      return {
        summary: 'Direct browser download unavailable for this URL.',
        explanation: 'Open the source URL directly in your browser to inspect official viewing or saving options.',
        officialLinks: [
          {
            label: 'Open Source URL',
            url: normalizedUrl,
            description: 'Visit the source page directly.',
          },
        ],
      }
  }
}

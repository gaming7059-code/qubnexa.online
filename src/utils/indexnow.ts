/**
 * QUBNEXA IndexNow Engine & Payload Builder
 *
 * Provides pure utilities to validate, format, and safely construct
 * IndexNow submission requests for Bing, Yandex, Seznam, and other
 * participating search engines without exposing credentials in client builds.
 */

export const PRODUCTION_HOST = 'qubnexa.online'
export const PRODUCTION_ORIGIN = `https://${PRODUCTION_HOST}`
export const INDEXNOW_ENDPOINT = 'https://api.indexnow.org/indexnow'

export interface IndexNowPayload {
  host: string
  key: string
  keyLocation: string
  urlList: string[]
}

/**
 * Safely masks an API key for logs and reports (e.g. "ed59...2769").
 * Never prints full secret values.
 */
export function maskApiKey(key?: string | null): string {
  if (!key || typeof key !== 'string') return '[REDACTED]'
  const trimmed = key.trim()
  if (trimmed.length < 8) return '[REDACTED]'
  return `${trimmed.slice(0, 4)}...${trimmed.slice(-4)}`
}

/**
 * Extracts and deduplicates valid URLs from a sitemap XML string.
 * Strictly verifies all URLs belong to the canonical production origin.
 */
export function extractSitemapUrls(xmlContent: string, allowedHost: string = PRODUCTION_HOST): string[] {
  if (!xmlContent || typeof xmlContent !== 'string') return []
  const matches = xmlContent.match(/<loc>\s*(https?:\/\/[^\s<]+)\s*<\/loc>/gi) || []
  const urls: string[] = []

  for (const match of matches) {
    const rawUrl = match.replace(/<\/?loc>/gi, '').trim()
    try {
      const parsed = new URL(rawUrl)
      if (parsed.hostname.toLowerCase() === allowedHost.toLowerCase()) {
        urls.push(parsed.toString())
      }
    } catch {
      // Ignore malformed URLs
    }
  }

  // Deduplicate and sort while guaranteeing homepage is present
  const uniqueUrls = Array.from(new Set(urls))
  const home = `https://${allowedHost}/`
  if (!uniqueUrls.includes(home) && uniqueUrls.includes(`https://${allowedHost}`)) {
    uniqueUrls.push(home)
  }

  return uniqueUrls.sort()
}

/**
 * Validates an IndexNow payload against the official protocol specification.
 */
export function validateIndexNowPayload(payload: unknown): { valid: boolean; error?: string } {
  if (!payload || typeof payload !== 'object') {
    return { valid: false, error: 'Payload must be a non-null object' }
  }

  const p = payload as Partial<IndexNowPayload>

  if (!p.host || typeof p.host !== 'string' || p.host.trim().length === 0) {
    return { valid: false, error: 'Host is required and must be a valid string' }
  }

  if (!p.key || typeof p.key !== 'string' || !/^[a-f0-9]{8,128}$/i.test(p.key.trim())) {
    return { valid: false, error: 'Key must be a valid hex string between 8 and 128 characters' }
  }

  if (!p.keyLocation || typeof p.keyLocation !== 'string') {
    return { valid: false, error: 'keyLocation is required' }
  }

  try {
    const locUrl = new URL(p.keyLocation)
    if (locUrl.hostname.toLowerCase() !== p.host.toLowerCase()) {
      return { valid: false, error: 'keyLocation host must match payload host' }
    }
  } catch {
    return { valid: false, error: 'keyLocation must be a valid absolute URL' }
  }

  if (!Array.isArray(p.urlList) || p.urlList.length === 0) {
    return { valid: false, error: 'urlList must be a non-empty array' }
  }

  if (p.urlList.length > 10000) {
    return { valid: false, error: 'urlList cannot exceed 10,000 URLs per IndexNow specification' }
  }

  for (const url of p.urlList) {
    try {
      const parsed = new URL(url)
      if (parsed.hostname.toLowerCase() !== p.host.toLowerCase()) {
        return { valid: false, error: `URL ${url} does not belong to host ${p.host}` }
      }
    } catch {
      return { valid: false, error: `Invalid URL in urlList: ${url}` }
    }
  }

  return { valid: true }
}

/**
 * Builds the official IndexNow submission JSON payload.
 */
export function buildIndexNowPayload(
  key: string,
  urls: string[],
  host: string = PRODUCTION_HOST
): IndexNowPayload {
  const cleanKey = key.trim()
  const keyLocation = `https://${host}/${cleanKey}.txt`
  const deduplicatedUrls = Array.from(new Set(urls.map((u) => u.trim()))).filter((u) => u.length > 0)

  const payload: IndexNowPayload = {
    host,
    key: cleanKey,
    keyLocation,
    urlList: deduplicatedUrls,
  }

  const validation = validateIndexNowPayload(payload)
  if (!validation.valid) {
    throw new Error(`IndexNow Payload Validation Failed: ${validation.error}`)
  }

  return payload
}

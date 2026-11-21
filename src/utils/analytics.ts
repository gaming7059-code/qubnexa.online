/**
 * Centralized Google Analytics 4 (GA4) Configuration & Tracking Helper
 * Official Google tag (gtag.js) implementation for QUBNEXA
 */

export const GA_MEASUREMENT_ID =
  import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-F2NKLZ6T7C'

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
    __ENABLE_GA_TEST__?: boolean
  }
}

/**
 * Check if Google Analytics tracking should run in the current environment.
 * - Always disabled in Vite development mode (`npm run dev`)
 * - Disabled on localhost by default to prevent polluting production metrics
 * - Can be explicitly enabled in automated tests via `window.__ENABLE_GA_TEST__ = true`
 */
export const isAnalyticsEnabled = (): boolean => {
  if (typeof window === 'undefined') return false
  if (!GA_MEASUREMENT_ID || GA_MEASUREMENT_ID === 'G-XXXXXXXXXX') return false

  // Never track in Vite development mode
  if (import.meta.env.DEV) return false

  // Explicit opt-in for automated browser/Playwright verification
  if (
    window.__ENABLE_GA_TEST__ ||
    (typeof localStorage !== 'undefined' &&
      localStorage.getItem('__ENABLE_GA_TEST__') === 'true')
  ) {
    return true
  }

  // Disable on localhost / 127.0.0.1 in local preview builds
  const hostname = window.location.hostname
  const isLocal =
    hostname === 'localhost' ||
    hostname === '127.0.0.1' ||
    hostname === '[::1]' ||
    hostname.endsWith('.local')

  if (isLocal) {
    return false
  }

  return true
}

let isInitialized = false

/**
 * Initialize Google Analytics 4 using the official Google tag (gtag.js).
 * Configures gtag with `send_page_view: false` so that the React Router
 * SPA listener sends page_view events without duplicates.
 */
export const initGA = (): void => {
  if (typeof window === 'undefined') return
  if (!isAnalyticsEnabled()) return
  if (isInitialized) return

  window.dataLayer = window.dataLayer || []
  window.gtag = function () {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false, // Suppress automatic initial pageview to avoid duplicates with React Router
  })

  const existingScript = document.querySelector(
    `script[src*="googletagmanager.com/gtag/js"]`
  )
  if (!existingScript) {
    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`
    document.head.appendChild(script)
  }

  isInitialized = true
}

/**
 * Track a page view in Google Analytics 4.
 * Triggered on every client-side route navigation via React Router.
 */
export const trackPageView = (path: string, title?: string): void => {
  if (typeof window === 'undefined') return
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') return

  window.gtag('event', 'page_view', {
    page_path: path,
    page_location: window.location.href,
    page_title: title || document.title,
  })
}

/**
 * Track a custom event in Google Analytics 4.
 */
export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, unknown>
): void => {
  if (typeof window === 'undefined') return
  if (!isAnalyticsEnabled() || typeof window.gtag !== 'function') return

  window.gtag('event', eventName, eventParams)
}

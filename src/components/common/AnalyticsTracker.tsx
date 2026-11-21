import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { initGA, trackPageView } from '../../utils/analytics'

/**
 * Route change listener that triggers GA4 page_view tracking on client-side navigations.
 * Uses a MutationObserver to ensure document.title is updated by the new route before
 * firing the page_view event, preventing duplicate or stale title events.
 */
export const AnalyticsTracker: React.FC = () => {
  const location = useLocation()

  // Initialize GA4 script and config on initial mount
  useEffect(() => {
    initGA()
  }, [])

  // Fire page_view on initial mount and whenever location (pathname or search query) updates
  useEffect(() => {
    const pagePath = location.pathname + location.search
    let isTracked = false

    const initialTitle = document.title

    // If the title changes due to usePageSEO in the target component, track immediately
    const observer = new MutationObserver(() => {
      if (document.title !== initialTitle && !isTracked) {
        isTracked = true
        trackPageView(pagePath, document.title)
        observer.disconnect()
      }
    })

    const titleEl = document.querySelector('title')
    if (titleEl) {
      observer.observe(titleEl, { childList: true, characterData: true, subtree: true })
    }

    // Fallback: if title doesn't change or is already updated, send after a safe buffer
    const timer = setTimeout(() => {
      if (!isTracked) {
        isTracked = true
        trackPageView(pagePath, document.title)
        observer.disconnect()
      }
    }, 1000)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      if (!isTracked) {
        isTracked = true
        trackPageView(pagePath, document.title)
      }
    }
  }, [location.pathname, location.search])

  return null
}

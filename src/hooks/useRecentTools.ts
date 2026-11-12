import { useState, useEffect, useCallback, useMemo } from 'react'
import { ALL_TOOLS } from '../data/toolsData'
import type { Tool } from '../types/tools'
import {
  getRecentToolIds,
  clearRecentTools,
  RECENT_TOOLS_EVENT,
} from '../utils/recentTools'

export function useRecentTools() {
  const [recentIds, setRecentIds] = useState<string[]>(() => getRecentToolIds())

  useEffect(() => {
    const sync = () => setRecentIds(getRecentToolIds())
    window.addEventListener(RECENT_TOOLS_EVENT, sync)
    window.addEventListener('storage', sync)
    return () => {
      window.removeEventListener(RECENT_TOOLS_EVENT, sync)
      window.removeEventListener('storage', sync)
    }
  }, [])

  const recentTools = useMemo(() => {
    return recentIds
      .map((id) => ALL_TOOLS.find((tool) => tool.id === id))
      .filter((tool): tool is Tool => Boolean(tool))
  }, [recentIds])

  const clearHistory = useCallback(() => {
    clearRecentTools()
    setRecentIds([])
  }, [])

  return {
    recentTools,
    clearHistory,
    hasRecentTools: recentTools.length > 0,
  }
}

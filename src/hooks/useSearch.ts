import { useState, useMemo } from 'react'
import type { Tool } from '../types/tools'
import { searchTools } from '../utils/toolSearch'

export function useSearch(tools: Tool[]) {
  const [query, setQuery] = useState('')

  const filteredTools = useMemo(() => {
    return searchTools(tools, query)
  }, [tools, query])

  return {
    query,
    setQuery,
    filteredTools,
    hasResults: filteredTools.length > 0,
  }
}

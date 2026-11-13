import React, { useState, useMemo } from 'react'
import { ChevronRight, ChevronDown, Copy, Check } from 'lucide-react'

interface JsonTreeViewProps {
  data: unknown
  searchQuery?: string
  initialExpandedDepth?: number
}

interface TreeNodeProps {
  keyName?: string
  value: unknown
  depth: number
  searchQuery: string
  forceExpandAll?: boolean | null
}

const TreeNode: React.FC<TreeNodeProps> = ({
  keyName,
  value,
  depth,
  searchQuery,
  forceExpandAll,
}) => {
  const [userExpanded, setUserExpanded] = useState<boolean | null>(null)
  const [copied, setCopied] = useState<boolean>(false)

  const isObject = value !== null && typeof value === 'object' && !Array.isArray(value)
  const isArray = Array.isArray(value)
  const isExpandable = isObject || isArray

  // Search matching logic
  const queryLower = searchQuery.toLowerCase().trim()
  const keyMatches = keyName ? keyName.toLowerCase().includes(queryLower) : false

  const valueMatches = useMemo(() => {
    if (!queryLower) return false
    if (!isExpandable) {
      return String(value).toLowerCase().includes(queryLower)
    }
    // Deep match check for auto-expanding matching branches
    try {
      return JSON.stringify(value).toLowerCase().includes(queryLower)
    } catch {
      return false
    }
  }, [value, isExpandable, queryLower])

  // Derive effective expanded state cleanly without useEffect cascading renders
  const isExpanded = useMemo(() => {
    if (queryLower && valueMatches) return true
    if (forceExpandAll !== null && forceExpandAll !== undefined) return forceExpandAll
    if (userExpanded !== null) return userExpanded
    return depth < 2
  }, [queryLower, valueMatches, forceExpandAll, userExpanded, depth])

  const handleCopy = (e: React.MouseEvent) => {
    e.stopPropagation()
    const textToCopy = typeof value === 'string' ? value : JSON.stringify(value, null, 2)
    navigator.clipboard?.writeText(textToCopy)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // Render Primitive Values
  const renderPrimitiveValue = () => {
    if (value === null) {
      return <span className="text-rose-500 dark:text-rose-400 italic">null</span>
    }
    if (typeof value === 'boolean') {
      return (
        <span className="text-purple-600 dark:text-purple-400 font-semibold">
          {value ? 'true' : 'false'}
        </span>
      )
    }
    if (typeof value === 'number') {
      return <span className="text-amber-600 dark:text-amber-400 font-medium">{value}</span>
    }
    if (typeof value === 'string') {
      return (
        <span className="text-emerald-600 dark:text-emerald-400 break-all">
          &quot;{value}&quot;
        </span>
      )
    }
    return <span className="text-slate-600 dark:text-slate-400">{String(value)}</span>
  }

  const entries: [string, unknown][] = useMemo(() => {
    if (isArray) {
      return (value as unknown[]).map((val, idx) => [String(idx), val])
    }
    if (isObject) {
      return Object.entries(value as Record<string, unknown>)
    }
    return []
  }, [isArray, isObject, value])

  return (
    <div className="font-mono text-xs select-text leading-relaxed">
      <div
        className={`group flex items-center gap-1.5 py-0.5 px-1.5 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800/60 transition-colors ${
          keyMatches ? 'bg-amber-100/60 dark:bg-amber-950/40 text-amber-900 dark:text-amber-200' : ''
        }`}
      >
        {isExpandable ? (
          <button
            type="button"
            onClick={() => setUserExpanded(!isExpanded)}
            className="p-0.5 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
            aria-label={isExpanded ? 'Collapse node' : 'Expand node'}
          >
            {isExpanded ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronRight className="w-3.5 h-3.5" />
            )}
          </button>
        ) : (
          <span className="w-4 inline-block" />
        )}

        {/* Key Name */}
        {keyName !== undefined && (
          <span
            className={`font-semibold cursor-pointer ${
              keyMatches
                ? 'underline font-bold text-amber-700 dark:text-amber-300'
                : 'text-sky-700 dark:text-sky-300'
            }`}
            onClick={() => isExpandable && setUserExpanded(!isExpanded)}
          >
            {keyName}:
          </span>
        )}

        {/* Expandable summary or primitive value */}
        {isExpandable ? (
          <span
            className="text-slate-500 dark:text-slate-400 cursor-pointer"
            onClick={() => setUserExpanded(!isExpanded)}
          >
            {isArray ? (
              <>
                <span className="text-slate-600 dark:text-slate-300">[</span>
                {!isExpanded && <span className="text-[11px] px-1 text-slate-400">…</span>}
                <span className="text-slate-600 dark:text-slate-300">]</span>
                <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  {(value as unknown[]).length} items
                </span>
              </>
            ) : (
              <>
                <span className="text-slate-600 dark:text-slate-300">{'{'}</span>
                {!isExpanded && <span className="text-[11px] px-1 text-slate-400">…</span>}
                <span className="text-slate-600 dark:text-slate-300">{'}'}</span>
                <span className="text-[10px] ml-1.5 px-1.5 py-0.2 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400">
                  {Object.keys(value as Record<string, unknown>).length} keys
                </span>
              </>
            )}
          </span>
        ) : (
          <span
            className={
              valueMatches && !keyMatches
                ? 'bg-amber-100 dark:bg-amber-950/60 px-1 rounded text-amber-900 dark:text-amber-200'
                : ''
            }
          >
            {renderPrimitiveValue()}
          </span>
        )}

        {/* Copy button on hover */}
        <button
          type="button"
          onClick={handleCopy}
          className="opacity-0 group-hover:opacity-100 ml-auto p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-opacity"
          title="Copy node value"
        >
          {copied ? (
            <Check className="w-3 h-3 text-emerald-500" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>

      {/* Children */}
      {isExpandable && isExpanded && (
        <div className="pl-4 ml-1.5 border-l border-slate-200 dark:border-slate-800/80 space-y-0.5">
          {entries.map(([childKey, childVal]) => (
            <TreeNode
              key={childKey}
              keyName={childKey}
              value={childVal}
              depth={depth + 1}
              searchQuery={searchQuery}
              forceExpandAll={forceExpandAll}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export const JsonTreeView: React.FC<JsonTreeViewProps> = ({
  data,
  searchQuery = '',
  initialExpandedDepth = 2,
}) => {
  const [forceExpandAll, setForceExpandAll] = useState<boolean | null>(null)

  return (
    <div className="space-y-3">
      {/* Tree View Controls */}
      <div className="flex items-center justify-between text-xs px-2 py-1.5 bg-slate-100/60 dark:bg-slate-900/60 rounded-xl border border-slate-200/60 dark:border-slate-800/60">
        <span className="text-slate-500 dark:text-slate-400">
          Interactive Node Explorer
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setForceExpandAll(true)}
            className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Expand All
          </button>
          <button
            type="button"
            onClick={() => setForceExpandAll(false)}
            className="px-2 py-1 rounded-md bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-[11px] font-medium transition-colors cursor-pointer"
          >
            Collapse All
          </button>
        </div>
      </div>

      {/* Tree Content */}
      <div className="p-3 bg-slate-50 dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 max-h-[600px] overflow-auto">
        <TreeNode
          value={data}
          depth={initialExpandedDepth > 0 ? 0 : 3}
          searchQuery={searchQuery}
          forceExpandAll={forceExpandAll}
        />
      </div>
    </div>
  )
}

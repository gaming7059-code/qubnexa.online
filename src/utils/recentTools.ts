const RECENT_TOOLS_KEY = 'xw_recent_tools_v1'
export const RECENT_TOOLS_EVENT = 'xw-recent-tools-updated'
export const MAX_RECENT_TOOLS = 6

interface RecentToolEntry {
  id: string
  visitedAt: number
}

function readStorageEntries(): RecentToolEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = window.localStorage.getItem(RECENT_TOOLS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed.filter(
      (item): item is RecentToolEntry =>
        typeof item === 'object' &&
        item !== null &&
        typeof (item as RecentToolEntry).id === 'string' &&
        typeof (item as RecentToolEntry).visitedAt === 'number',
    )
  } catch {
    return []
  }
}

function writeStorageEntries(entries: RecentToolEntry[]): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(entries.slice(0, MAX_RECENT_TOOLS)))
    window.dispatchEvent(new CustomEvent(RECENT_TOOLS_EVENT))
  } catch {
    // Gracefully ignore unavailable or restricted storage environments
  }
}

export function getRecentToolIds(): string[] {
  return readStorageEntries()
    .slice(0, MAX_RECENT_TOOLS)
    .map((entry) => entry.id)
}

export function recordRecentTool(toolId: string): void {
  if (!toolId) return
  const existing = readStorageEntries().filter((entry) => entry.id !== toolId)
  const updated: RecentToolEntry[] = [{ id: toolId, visitedAt: Date.now() }, ...existing].slice(
    0,
    MAX_RECENT_TOOLS,
  )
  writeStorageEntries(updated)
}

export function clearRecentTools(): void {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.removeItem(RECENT_TOOLS_KEY)
    window.dispatchEvent(new CustomEvent(RECENT_TOOLS_EVENT))
  } catch {
    // Gracefully ignore unavailable or restricted storage environments
  }
}

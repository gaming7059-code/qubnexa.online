/**
 * QUBNEXA — JSON Formatter, Minifier, Validator & Analysis Engine
 * 100% Client-side, zero network dependencies, RFC 8259 compliant.
 */

export interface JsonStats {
  characters: number
  lines: number
  objects: number
  arrays: number
  keys: number
  maxDepth: number
  sizeBytes: number
}

export interface ValidationResult {
  isValid: boolean
  isEmpty: boolean
  error: string | null
  line: number | null
  column: number | null
  position: number | null
  parsedValue?: unknown
}

export type IndentType = 2 | 4 | 'tab'

export interface FormatOptions {
  indent: IndentType
  sortKeys?: boolean
}

/**
 * Extracts line and column numbers from a SyntaxError message or character offset.
 */
export function extractLineAndColumn(
  raw: string,
  error: Error
): { line: number | null; column: number | null; position: number | null } {
  const msg = error.message

  // Pattern 1: V8 format "at position 42 (line 2 column 5)"
  const v8LineColMatch = msg.match(/line (\d+) column (\d+)/i)
  if (v8LineColMatch) {
    const line = parseInt(v8LineColMatch[1], 10)
    const column = parseInt(v8LineColMatch[2], 10)
    const posMatch = msg.match(/position (\d+)/i)
    const position = posMatch ? parseInt(posMatch[1], 10) : null
    return { line, column, position }
  }

  // Pattern 2: V8 position only format "... at position 42"
  const posMatch = msg.match(/position (\d+)/i)
  if (posMatch) {
    const position = parseInt(posMatch[1], 10)
    if (!isNaN(position) && position >= 0 && position <= raw.length) {
      const textBefore = raw.slice(0, position)
      const lines = textBefore.split('\n')
      const line = lines.length
      const lastLine = lines[lines.length - 1]
      const column = lastLine.length + 1
      return { line, column, position }
    }
  }

  // Pattern 3: Firefox format "... at line 2 column 5 of the JSON data"
  const ffMatch = msg.match(/line (\d+) column (\d+)/i)
  if (ffMatch) {
    return {
      line: parseInt(ffMatch[1], 10),
      column: parseInt(ffMatch[2], 10),
      position: null,
    }
  }

  return { line: null, column: null, position: null }
}

/**
 * Validates a JSON string and extracts structured error metadata if invalid.
 */
export function validateJson(raw: string): ValidationResult {
  const trimmed = raw.trim()
  if (!trimmed) {
    return {
      isValid: false,
      isEmpty: true,
      error: 'Input is empty. Please enter or paste JSON to format.',
      line: null,
      column: null,
      position: null,
    }
  }

  try {
    const parsed = JSON.parse(raw)
    return {
      isValid: true,
      isEmpty: false,
      error: null,
      line: null,
      column: null,
      position: null,
      parsedValue: parsed,
    }
  } catch (err) {
    const errorObj = err instanceof Error ? err : new Error(String(err))
    const { line, column, position } = extractLineAndColumn(raw, errorObj)
    return {
      isValid: false,
      isEmpty: false,
      error: errorObj.message,
      line,
      column,
      position,
    }
  }
}

/**
 * Recursively sorts the keys of an object alphabetically without mutating array order.
 */
export function sortObjectKeys<T>(val: T): T {
  if (val === null || typeof val !== 'object') {
    return val
  }

  if (Array.isArray(val)) {
    return val.map((item) => sortObjectKeys(item)) as unknown as T
  }

  const obj = val as Record<string, unknown>
  const sortedObj: Record<string, unknown> = {}
  const keys = Object.keys(obj).sort()

  for (const key of keys) {
    sortedObj[key] = sortObjectKeys(obj[key])
  }

  return sortedObj as T
}

/**
 * Pretty prints JSON with configurable indentation and optional key sorting.
 */
export function formatJson(
  raw: string,
  options: FormatOptions = { indent: 2, sortKeys: false }
): { formatted: string; validation: ValidationResult } {
  const validation = validateJson(raw)
  if (!validation.isValid || validation.parsedValue === undefined) {
    return { formatted: '', validation }
  }

  let valueToSerialize = validation.parsedValue
  if (options.sortKeys) {
    valueToSerialize = sortObjectKeys(valueToSerialize)
  }

  const indentStr = options.indent === 'tab' ? '\t' : options.indent
  const formatted = JSON.stringify(valueToSerialize, null, indentStr)
  return { formatted, validation }
}

/**
 * Minifies JSON by stripping all optional whitespace.
 */
export function minifyJson(raw: string): { minified: string; validation: ValidationResult } {
  const validation = validateJson(raw)
  if (!validation.isValid || validation.parsedValue === undefined) {
    return { minified: '', validation }
  }

  const minified = JSON.stringify(validation.parsedValue)
  return { minified, validation }
}

/**
 * Calculates in-depth structural statistics for parsed JSON data.
 */
export function computeJsonStats(val: unknown, rawText: string): JsonStats {
  let objects = 0
  let arrays = 0
  let keys = 0
  let maxDepth = 0

  function traverse(node: unknown, depth: number) {
    if (depth > maxDepth) {
      maxDepth = depth
    }

    if (node === null || typeof node !== 'object') {
      return
    }

    if (Array.isArray(node)) {
      arrays++
      for (const item of node) {
        traverse(item, depth + 1)
      }
    } else {
      objects++
      const objKeys = Object.keys(node as Record<string, unknown>)
      keys += objKeys.length
      for (const key of objKeys) {
        traverse((node as Record<string, unknown>)[key], depth + 1)
      }
    }
  }

  traverse(val, 0)

  const characters = rawText.length
  const lines = rawText.length > 0 ? rawText.split('\n').length : 0
  // UTF-8 byte length
  const sizeBytes = new TextEncoder().encode(rawText).length

  return {
    characters,
    lines,
    objects,
    arrays,
    keys,
    maxDepth,
    sizeBytes,
  }
}

/**
 * Escapes a string so it can be safely placed inside a JSON string literal.
 */
export function escapeJsonString(text: string): string {
  return JSON.stringify(text)
}

/**
 * Unescapes an escaped JSON string.
 */
export function unescapeJsonString(text: string): { result: string; error?: string } {
  const trimmed = text.trim()
  if (!trimmed) return { result: '' }

  // If already enclosed in quotes, parse as JSON string literal
  if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
    try {
      const parsed = JSON.parse(trimmed)
      if (typeof parsed === 'string') {
        return { result: parsed }
      }
      return { result: String(parsed) }
    } catch (err) {
      return { result: text, error: (err as Error).message }
    }
  }

  // Otherwise wrap in quotes and attempt unescaping
  try {
    const wrapped = `"${trimmed.replace(/\\"/g, '"').replace(/"/g, '\\"')}"`
    const parsed = JSON.parse(wrapped)
    return { result: typeof parsed === 'string' ? parsed : text }
  } catch {
    // Basic replacement fallback
    const unescaped = text
      .replace(/\\n/g, '\n')
      .replace(/\\r/g, '\r')
      .replace(/\\t/g, '\t')
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, '\\')
    return { result: unescaped }
  }
}

/**
 * Rich, production-grade sample JSON representing a modern API payload.
 */
export const SAMPLE_JSON = `{
  "platform": "QUBNEXA",
  "tagline": "Explore. Create. Simplify.",
  "version": 2.4,
  "active": true,
  "developer": {
    "name": "Alex Mercer",
    "verified": true,
    "rating": 4.98,
    "socials": {
      "github": "https://github.com/gaming7059-code/qubnexa",
      "twitter": "@qubnexa_hub"
    }
  },
  "modules": [
    {
      "id": 101,
      "name": "YouTube Thumbnail Downloader",
      "category": "video-tools",
      "resolutions": ["1080p", "720p", "480p", "360p"],
      "enabled": true
    },
    {
      "id": 102,
      "name": "Image Resizer",
      "category": "image-tools",
      "formats": ["image/jpeg", "image/png", "image/webp"],
      "enabled": true
    },
    {
      "id": 103,
      "name": "Fancy Font Generator",
      "category": "text-writing",
      "stylesCount": 35,
      "unicodeSupported": true
    },
    {
      "id": 104,
      "name": "JSON Formatter & Validator",
      "category": "utilities",
      "features": ["Format", "Minify", "Tree View", "Stats"],
      "enabled": true
    }
  ],
  "performance": {
    "latencyMs": 12.4,
    "clientOnly": true,
    "memoryAllocMb": null
  },
  "tags": ["developer", "tools", "fast", "privacy-first", "✨"]
}`

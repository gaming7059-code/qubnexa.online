/**
 * QUBNEXA — Shared Unicode-Safe Text Transformation, Inversion & Repeat Utilities
 * Client-side only; zero external transmission and memory-bounded generation.
 */

export const MAX_REPEAT_COUNT = 1_000_000
export const MAX_OUTPUT_CHARS = 2_000_000
export const MAX_OUTPUT_BYTES = 4_000_000
export const MAX_LIVE_PREVIEW_CHARS = 120_000
export const MAX_USE_AS_INPUT_CHARS = 500_000
export const MAX_WHATSAPP_SHARE_CHARS = 1_800

export type TextInverterMode =
  | 'upside-down'
  | 'backwards'
  | 'reverse-each-word'
  | 'reverse-word-order'

export type RepeatSeparatorMode = 'newline' | 'space' | 'nothing' | 'custom'
export type RepeatTransformMode = 'normal' | 'upside-down' | 'backwards' | 'bold' | 'glitch'

export interface TextMetrics {
  words: number
  characters: number
  codeUnits: number
  lines: number
  bytes: number
}

export interface TextInvertResult {
  output: string
  unsupportedChars: string[]
  hasUnsupportedForUpsideDown: boolean
}

export interface RepeatEstimate {
  unitText: string
  separator: string
  unitChars: number
  unitBytes: number
  estimatedChars: number
  estimatedBytes: number
  isCountValid: boolean
  countError: string | null
  exceedsLimit: boolean
  limitReason: string | null
}

export interface RepeatResult extends RepeatEstimate {
  output: string
  previewOutput: string
  isPreviewTruncated: boolean
}

export interface WhatsAppShareResult {
  url: string
  wasTruncated: boolean
  sharedChars: number
}

const UPSIDE_DOWN_MAP: Readonly<Record<string, string>> = {
  a: 'ɐ',
  b: 'q',
  c: 'ɔ',
  d: 'p',
  e: 'ǝ',
  f: 'ɟ',
  g: 'ƃ',
  h: 'ɥ',
  i: 'ᴉ',
  j: 'ɾ',
  k: 'ʞ',
  l: 'l',
  m: 'ɯ',
  n: 'u',
  o: 'o',
  p: 'd',
  q: 'b',
  r: 'ɹ',
  s: 's',
  t: 'ʇ',
  u: 'n',
  v: 'ʌ',
  w: 'ʍ',
  x: 'x',
  y: 'ʎ',
  z: 'z',
  A: '∀',
  B: 'ᗺ',
  C: 'Ɔ',
  D: 'ᗡ',
  E: 'Ǝ',
  F: 'Ⅎ',
  G: 'פ',
  H: 'H',
  I: 'I',
  J: 'ſ',
  K: 'ꓘ',
  L: '˥',
  M: 'W',
  N: 'N',
  O: 'O',
  P: 'Ԁ',
  Q: 'Ό',
  R: 'ᴚ',
  S: 'S',
  T: '⊥',
  U: '∩',
  V: 'Λ',
  W: 'M',
  X: 'X',
  Y: '⅄',
  Z: 'Z',
  '0': '0',
  '1': 'Ɩ',
  '2': 'ᄅ',
  '3': 'Ɛ',
  '4': 'ㄣ',
  '5': 'ϛ',
  '6': '9',
  '7': 'ㄥ',
  '8': '8',
  '9': '6',
  '.': '˙',
  ',': "'",
  "'": ',',
  '"': '„',
  '`': ',',
  '!': '¡',
  '?': '¿',
  '&': '⅋',
  _: '‾',
  ';': '؛',
  '(': ')',
  ')': '(',
  '[': ']',
  ']': '[',
  '{': '}',
  '}': '{',
  '<': '>',
  '>': '<',
  '∴': '∵',
  '∵': '∴',
  '‿': '⁀',
  '⁀': '‿',
  '⁅': '⁆',
  '⁆': '⁅',
}

// Punctuation/symbols that remain visually neutral when flipped and should not raise warnings
const NEUTRAL_PASS_THROUGH = new Set(['-', '–', '—', '=', '+', '*', ':', '|', '~', '/', '\\'])

const GLITCH_ABOVE = ['\u030d', '\u030e', '\u0304', '\u0305', '\u033f', '\u0311', '\u0306', '\u0310']
const GLITCH_BELOW = ['\u0316', '\u0317', '\u0318', '\u0319', '\u031c', '\u031d', '\u0323', '\u0329']
const GLITCH_MID = ['\u0334', '\u0335', '\u0336', '\u0337']

const utf8Encoder = new TextEncoder()
const graphemeSegmenter =
  typeof Intl !== 'undefined' && typeof Intl.Segmenter === 'function'
    ? new Intl.Segmenter(undefined, { granularity: 'grapheme' })
    : null

/**
 * Splits text into user-perceived grapheme clusters so emoji ZWJ sequences,
 * combining accents, and Bengali/Hindi conjuncts or vowel signs stay intact.
 */
export function segmentGraphemes(text: string): string[] {
  if (!text) return []
  if (graphemeSegmenter) {
    const clusters: string[] = []
    for (const part of graphemeSegmenter.segment(text)) {
      clusters.push(part.segment)
    }
    return clusters
  }
  return Array.from(text)
}

export function getUtf8ByteLength(text: string): number {
  if (!text) return 0
  return utf8Encoder.encode(text).length
}

export function getTextMetrics(text: string): TextMetrics {
  if (!text) {
    return { words: 0, characters: 0, codeUnits: 0, lines: 0, bytes: 0 }
  }
  const trimmed = text.trim()
  const words = trimmed ? trimmed.split(/\s+/).length : 0
  const characters = segmentGraphemes(text).length
  const lines = text.split(/\r?\n/).length
  return {
    words,
    characters,
    codeUnits: text.length,
    lines,
    bytes: getUtf8ByteLength(text),
  }
}

export function formatBytesCompact(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

function flipLineUpsideDown(line: string, unsupportedSet: Set<string>): string {
  const clusters = segmentGraphemes(line)
  const flipped: string[] = []

  for (let i = clusters.length - 1; i >= 0; i--) {
    const ch = clusters[i]
    if (ch in UPSIDE_DOWN_MAP) {
      flipped.push(UPSIDE_DOWN_MAP[ch])
    } else if (/^\s+$/.test(ch) || NEUTRAL_PASS_THROUGH.has(ch)) {
      flipped.push(ch)
    } else {
      flipped.push(ch)
      unsupportedSet.add(ch)
    }
  }

  return flipped.join('')
}

/**
 * Transforms input text using one of the four Text Inverter modes.
 * Preserves Bengali, Hindi, combining clusters, emoji, and unsupported characters safely.
 */
export function invertText(text: string, mode: TextInverterMode): TextInvertResult {
  if (!text) {
    return {
      output: '',
      unsupportedChars: [],
      hasUnsupportedForUpsideDown: false,
    }
  }

  const normalized = text.replace(/\r\n/g, '\n')

  if (mode === 'upside-down') {
    const unsupportedSet = new Set<string>()
    const output = normalized
      .split('\n')
      .map((line) => flipLineUpsideDown(line, unsupportedSet))
      .join('\n')
    const unsupportedChars = Array.from(unsupportedSet)
    return {
      output,
      unsupportedChars,
      hasUnsupportedForUpsideDown: unsupportedChars.length > 0,
    }
  }

  if (mode === 'backwards') {
    const output = segmentGraphemes(normalized).reverse().join('')
    return { output, unsupportedChars: [], hasUnsupportedForUpsideDown: false }
  }

  if (mode === 'reverse-each-word') {
    const output = normalized
      .split(/(\s+)/)
      .map((segment) => {
        if (/^\s+$/.test(segment) || segment.length === 0) return segment
        return segmentGraphemes(segment).reverse().join('')
      })
      .join('')
    return { output, unsupportedChars: [], hasUnsupportedForUpsideDown: false }
  }

  // reverse-word-order: preserve line breaks while reversing word tokens per line
  const output = normalized
    .split('\n')
    .map((line) => {
      const trimmed = line.trim()
      if (!trimmed) return line
      return trimmed.split(/\s+/).reverse().join(' ')
    })
    .join('\n')

  return { output, unsupportedChars: [], hasUnsupportedForUpsideDown: false }
}

export function toBoldUnicode(text: string): string {
  if (!text) return ''
  let out = ''
  for (const ch of text) {
    const code = ch.codePointAt(0)
    if (code === undefined) continue
    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(0x1d400 + (code - 65))
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(0x1d41a + (code - 97))
    } else if (code >= 48 && code <= 57) {
      out += String.fromCodePoint(0x1d7ce + (code - 48))
    } else {
      out += ch
    }
  }
  return out
}

/**
 * Deterministic, bounded Unicode glitch/Zalgo transform applied only to ASCII
 * alphanumeric clusters so Indic scripts and emoji remain uncorrupted.
 */
export function toGlitchUnicode(text: string): string {
  if (!text) return ''
  const clusters = segmentGraphemes(text)
  let out = ''
  for (let i = 0; i < clusters.length; i++) {
    const cluster = clusters[i]
    if (/^[A-Za-z0-9]$/.test(cluster)) {
      const above = GLITCH_ABOVE[i % GLITCH_ABOVE.length]
      const below = GLITCH_BELOW[(i * 3) % GLITCH_BELOW.length]
      const mid = i % 3 === 0 ? GLITCH_MID[i % GLITCH_MID.length] : ''
      out += `${cluster}${above}${mid}${below}`
    } else {
      out += cluster
    }
  }
  return out
}

export function applyRepeatTransform(text: string, mode: RepeatTransformMode): string {
  if (!text || mode === 'normal') return text
  if (mode === 'upside-down') return invertText(text, 'upside-down').output
  if (mode === 'backwards') return invertText(text, 'backwards').output
  if (mode === 'bold') return toBoldUnicode(text)
  return toGlitchUnicode(text)
}

export function resolveSeparator(mode: RepeatSeparatorMode, customSeparator: string): string {
  switch (mode) {
    case 'newline':
      return '\n'
    case 'space':
      return ' '
    case 'nothing':
      return ''
    case 'custom':
      return customSeparator
  }
}

export function estimateRepeatOutput(params: {
  text: string
  count: number
  separatorMode: RepeatSeparatorMode
  customSeparator: string
  transformMode: RepeatTransformMode
}): RepeatEstimate {
  const { text, count, separatorMode, customSeparator, transformMode } = params
  const separator = resolveSeparator(separatorMode, customSeparator)

  if (!Number.isFinite(count) || !Number.isInteger(count) || count < 1) {
    return {
      unitText: '',
      separator,
      unitChars: 0,
      unitBytes: 0,
      estimatedChars: 0,
      estimatedBytes: 0,
      isCountValid: false,
      countError: 'Repeat count must be a whole number of at least 1.',
      exceedsLimit: false,
      limitReason: null,
    }
  }

  if (count > MAX_REPEAT_COUNT) {
    return {
      unitText: '',
      separator,
      unitChars: 0,
      unitBytes: 0,
      estimatedChars: 0,
      estimatedBytes: 0,
      isCountValid: false,
      countError: `Maximum allowed repeat count is ${MAX_REPEAT_COUNT.toLocaleString()} times.`,
      exceedsLimit: false,
      limitReason: null,
    }
  }

  const unitText = applyRepeatTransform(text, transformMode)
  if (!unitText) {
    return {
      unitText: '',
      separator,
      unitChars: 0,
      unitBytes: 0,
      estimatedChars: 0,
      estimatedBytes: 0,
      isCountValid: true,
      countError: null,
      exceedsLimit: false,
      limitReason: null,
    }
  }

  const unitChars = unitText.length
  const unitBytes = getUtf8ByteLength(unitText)
  const sepChars = separator.length
  const sepBytes = getUtf8ByteLength(separator)

  const estimatedChars = unitChars * count + sepChars * (count - 1)
  const estimatedBytes = unitBytes * count + sepBytes * (count - 1)

  if (estimatedChars > MAX_OUTPUT_CHARS || estimatedBytes > MAX_OUTPUT_BYTES) {
    return {
      unitText,
      separator,
      unitChars,
      unitBytes,
      estimatedChars,
      estimatedBytes,
      isCountValid: true,
      countError: null,
      exceedsLimit: true,
      limitReason: `Estimated output (${formatBytesCompact(estimatedBytes)}, ${estimatedChars.toLocaleString()} characters) exceeds the browser-safe limit of ${formatBytesCompact(MAX_OUTPUT_BYTES)} / ${MAX_OUTPUT_CHARS.toLocaleString()} characters. Lower the repeat count or shorten your input.`,
    }
  }

  return {
    unitText,
    separator,
    unitChars,
    unitBytes,
    estimatedChars,
    estimatedBytes,
    isCountValid: true,
    countError: null,
    exceedsLimit: false,
    limitReason: null,
  }
}

/**
 * Generates repeated text safely in a single String.prototype.repeat allocation
 * after enforcing pre-calculated character and byte limits.
 */
export function repeatText(params: {
  text: string
  count: number
  separatorMode: RepeatSeparatorMode
  customSeparator: string
  transformMode: RepeatTransformMode
}): RepeatResult {
  const estimate = estimateRepeatOutput(params)

  if (!estimate.isCountValid || estimate.exceedsLimit || !estimate.unitText) {
    return {
      ...estimate,
      output: '',
      previewOutput: '',
      isPreviewTruncated: false,
    }
  }

  const { count } = params
  const { unitText, separator } = estimate

  const output =
    count === 1
      ? unitText
      : separator === ''
      ? unitText.repeat(count)
      : (unitText + separator).repeat(count - 1) + unitText

  const isPreviewTruncated = output.length > MAX_LIVE_PREVIEW_CHARS
  const previewOutput = isPreviewTruncated ? output.slice(0, MAX_LIVE_PREVIEW_CHARS) : output

  return {
    ...estimate,
    output,
    previewOutput,
    isPreviewTruncated,
  }
}

export function buildWhatsAppShareUrl(text: string): WhatsAppShareResult {
  if (!text) {
    return { url: '', wasTruncated: false, sharedChars: 0 }
  }
  const clusters = segmentGraphemes(text)
  const wasTruncated = clusters.length > MAX_WHATSAPP_SHARE_CHARS
  const payload = wasTruncated ? `${clusters.slice(0, MAX_WHATSAPP_SHARE_CHARS).join('')}...` : text
  return {
    url: `https://wa.me/?text=${encodeURIComponent(payload)}`,
    wasTruncated,
    sharedChars: wasTruncated ? MAX_WHATSAPP_SHARE_CHARS : clusters.length,
  }
}

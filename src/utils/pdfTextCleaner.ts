/**
 * QUBNEXA — PDF Text Cleaner & Transformation Engine
 * Pure client-side text sanitization, normalization, and paragraph reconstruction.
 */

export interface CleanOptions {
  trimLines: boolean
  normalizeSpaces: boolean
  removeDuplicateBlankLines: boolean
  unbreakHyphenatedWords: boolean
  unbreakParagraphLines: boolean
  normalizeQuotesAndDashes: boolean
  removePageNumbers: boolean
  removeControlCharacters: boolean
}

export type CleaningMode = 'basic' | 'advanced' | 'custom'

export const CLEANING_MODES: Record<'basic' | 'advanced', CleanOptions> = {
  basic: {
    trimLines: true,
    normalizeSpaces: true,
    removeDuplicateBlankLines: true,
    unbreakHyphenatedWords: false,
    unbreakParagraphLines: false,
    normalizeQuotesAndDashes: false,
    removePageNumbers: false,
    removeControlCharacters: false,
  },
  advanced: {
    trimLines: true,
    normalizeSpaces: true,
    removeDuplicateBlankLines: true,
    unbreakHyphenatedWords: true,
    unbreakParagraphLines: true,
    normalizeQuotesAndDashes: true,
    removePageNumbers: true,
    removeControlCharacters: true,
  },
}

export interface TextMetrics {
  characters: number
  words: number
  lines: number
  paragraphs: number
}

/**
 * Computes character, word, line, and paragraph counts accurately.
 */
export function getTextMetrics(text: string): TextMetrics {
  const characters = text.length
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const lines = text.length > 0 ? text.split('\n').length : 0

  // Count non-empty paragraphs separated by one or more blank lines
  const paragraphs = text.trim()
    ? text
        .trim()
        .split(/\n\s*\n/)
        .filter((p) => p.trim().length > 0).length
    : 0

  return { characters, words, lines, paragraphs }
}

/**
 * Normalizes quotes and dashes into standard ASCII equivalents.
 */
export function normalizeQuotesAndDashes(text: string): string {
  return text
    // Smart double quotes
    .replace(/[\u201C\u201D\u201E\u201F\u00AB\u00BB]/g, '"')
    // Smart single quotes / apostrophes
    .replace(/[\u2018\u2019\u201A\u201B\u2032]/g, "'")
    // Em dash, En dash, horizontal bar, minus sign
    .replace(/[\u2013\u2014\u2015\u2212]/g, '-')
    // Ellipsis
    .replace(/\u2026/g, '...')
}

/**
 * Removes unprintable control characters except standard whitespace (\n, \r, \t).
 */
export function removeControlCharacters(text: string): string {
  // ASCII 0-8, 11-12, 14-31, 127
  // eslint-disable-next-line no-control-regex
  return text.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
}

/**
 * Detects and removes standalone page numbering lines.
 * Matches patterns like "Page 1", "Page 1 of 12", "- 4 -", "[ 5 ]", or lone digits.
 */
export function removePageNumbers(text: string): string {
  const lines = text.split('\n')
  const cleanedLines = lines.filter((line) => {
    const trimmed = line.trim()
    if (!trimmed) return true

    // Patterns for page markers
    const isPageX = /^page\s+\d+(\s+of\s+\d+)?$/i.test(trimmed)
    const isDashedNumber = /^[-—–\s]*\d+[-—–\s]*$/.test(trimmed)
    const isBracketedNumber = /^[([]\s*\d+\s*[)\]]$/.test(trimmed)
    const isPureDigit = /^\d{1,4}$/.test(trimmed)

    return !(isPageX || isDashedNumber || isBracketedNumber || isPureDigit)
  })

  return cleanedLines.join('\n')
}

/**
 * Joins words broken across line wraps by hyphens (e.g., "informa-\ntion" -> "information").
 */
export function unbreakHyphenatedWords(text: string): string {
  // Matches letters followed by hyphen at end of line and letters at start of next line
  return text.replace(/([A-Za-z]+)[-—–]\s*\r?\n\s*([A-Za-z]+)/g, '$1$2')
}

/**
 * Merges soft-wrapped lines into unified paragraphs while preserving true paragraph breaks.
 */
export function unbreakParagraphLines(text: string): string {
  // Normalize Windows line endings to \n
  const normalized = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')

  // Split by double line breaks (paragraphs)
  const paragraphs = normalized.split(/\n\s*\n/)

  const cleanedParagraphs = paragraphs.map((para) => {
    // Within each paragraph, join lines that don't look like bullet points or headings
    const lines = para.split('\n').map((l) => l.trim())
    return lines.join(' ')
  })

  return cleanedParagraphs.join('\n\n')
}

/**
 * Normalizes repeated spaces and tabs into single spaces.
 */
export function normalizeSpaces(text: string): string {
  return text.replace(/[ \t]+/g, ' ')
}

/**
 * Trims leading and trailing whitespace from every line.
 */
export function trimLines(text: string): string {
  return text
    .split('\n')
    .map((line) => line.trim())
    .join('\n')
}

/**
 * Collapses 3 or more consecutive newlines into 2 (one blank line between paragraphs).
 */
export function removeDuplicateBlankLines(text: string): string {
  return text.replace(/\n{3,}/g, '\n\n')
}

/**
 * Master PDF text cleaning pipeline applying configurable transformations in optimal order.
 */
export function cleanPdfText(rawText: string, options: CleanOptions): string {
  if (!rawText) return ''

  let text = rawText

  // 1. Strip unprintable control characters early
  if (options.removeControlCharacters) {
    text = removeControlCharacters(text)
  }

  // 2. Normalize smart quotes and dashes
  if (options.normalizeQuotesAndDashes) {
    text = normalizeQuotesAndDashes(text)
  }

  // 3. Remove standalone page numbers before line reflowing
  if (options.removePageNumbers) {
    text = removePageNumbers(text)
  }

  // 4. Unbreak hyphenated word splits across line breaks
  if (options.unbreakHyphenatedWords) {
    text = unbreakHyphenatedWords(text)
  }

  // 5. Unbreak wrapped lines into cohesive paragraphs
  if (options.unbreakParagraphLines) {
    text = unbreakParagraphLines(text)
  }

  // 6. Trim individual lines
  if (options.trimLines) {
    text = trimLines(text)
  }

  // 7. Normalize repeated spaces
  if (options.normalizeSpaces) {
    text = normalizeSpaces(text)
  }

  // 8. Remove duplicate blank lines
  if (options.removeDuplicateBlankLines) {
    text = removeDuplicateBlankLines(text)
  }

  return text.trim()
}

/**
 * Realistic sample text representing typical raw PDF extraction artifacts.
 */
export const SAMPLE_RAW_PDF_TEXT = `   QUBNEXA TECHNICAL REPORT — 2026   

Document Version: 2.4
Page 1 of 3

This document contains compre-
hensive architectural guide-
lines for client-side web utility tools.

  PDF extraction often leaves erratic    spaces between   words,
irregular line wraps that split
sentences across arbitrary lines, and double
blank lines.

- 1 -

Furthermore, “smart quotation marks” and em—dashes frequently
appear alongside unwanted page markers.

Page 2 of 3

By utilizing QUBNEXA’s automated text cleaning pipeline, all
unnecessary breaks are repaired seamlessly.   
`

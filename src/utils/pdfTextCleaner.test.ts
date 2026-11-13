import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  cleanPdfText,
  CLEANING_MODES,
  normalizeSpaces,
  trimLines,
  removeDuplicateBlankLines,
  unbreakHyphenatedWords,
  unbreakParagraphLines,
  normalizeQuotesAndDashes,
  removePageNumbers,
  removeControlCharacters,
  getTextMetrics,
  SAMPLE_RAW_PDF_TEXT,
} from './pdfTextCleaner.ts'

describe('PDF Text Cleaner Engine', () => {
  it('should normalize multiple spaces into single space', () => {
    const raw = 'This    has   too     many spaces.'
    assert.strictEqual(normalizeSpaces(raw), 'This has too many spaces.')
  })

  it('should trim leading and trailing spaces per line', () => {
    const raw = '  Line 1   \n   Line 2  \nLine 3   '
    assert.strictEqual(trimLines(raw), 'Line 1\nLine 2\nLine 3')
  })

  it('should collapse duplicate blank lines into single blank line', () => {
    const raw = 'Paragraph 1\n\n\n\n\nParagraph 2'
    assert.strictEqual(removeDuplicateBlankLines(raw), 'Paragraph 1\n\nParagraph 2')
  })

  it('should unbreak hyphenated words across line wraps', () => {
    const raw = 'This is an archi-\ntectural docu-\r\nment.'
    assert.strictEqual(unbreakHyphenatedWords(raw), 'This is an architectural document.')
  })

  it('should unbreak wrapped lines within paragraphs while preserving paragraph breaks', () => {
    const raw = 'First sentence\nof the first paragraph.\n\nSecond paragraph\nwith two lines.'
    const cleaned = unbreakParagraphLines(raw)
    assert.strictEqual(
      cleaned,
      'First sentence of the first paragraph.\n\nSecond paragraph with two lines.'
    )
  })

  it('should normalize smart curly quotes and dashes to standard ASCII', () => {
    const raw = '“QUBNEXA” — ‘The’ – Best…'
    assert.strictEqual(normalizeQuotesAndDashes(raw), '"QUBNEXA" - \'The\' - Best...')
  })

  it('should remove standalone page numbering artifacts', () => {
    const raw = 'Heading\nPage 1 of 5\nBody paragraph.\n- 2 -\nEnd.\n42'
    const cleaned = removePageNumbers(raw)
    assert.strictEqual(cleaned, 'Heading\nBody paragraph.\nEnd.')
  })

  it('should strip unprintable control characters', () => {
    const raw = 'Clean\x00Text\x07With\x1FControls'
    assert.strictEqual(removeControlCharacters(raw), 'CleanTextWithControls')
  })

  it('should execute Basic Cleanup mode correctly', () => {
    const raw = '  Hello    World!  \n\n\n\nThis is basic.   '
    const cleaned = cleanPdfText(raw, CLEANING_MODES.basic)
    assert.strictEqual(cleaned, 'Hello World!\n\nThis is basic.')
  })

  it('should execute Advanced Cleanup mode including unbreaking and normalization', () => {
    const raw = `  “QUBNEXA” archi-
tecture report.   

Page 1 of 10

It provides multi-
ple tools.  `
    const cleaned = cleanPdfText(raw, CLEANING_MODES.advanced)
    assert.ok(cleaned.includes('"QUBNEXA" architecture report.'))
    assert.ok(cleaned.includes('multiple tools.'))
    assert.ok(!cleaned.includes('Page 1 of 10'))
    assert.ok(!cleaned.includes('archi-\n'))
  })

  it('should accurately calculate text metrics (characters, words, lines, paragraphs)', () => {
    const text = 'Paragraph one has six words.\n\nParagraph two has five words.'
    const metrics = getTextMetrics(text)
    assert.strictEqual(metrics.paragraphs, 2)
    assert.strictEqual(metrics.lines, 3)
    assert.strictEqual(metrics.words, 10)
    assert.strictEqual(metrics.characters, text.length)
  })

  it('should clean SAMPLE_RAW_PDF_TEXT without error', () => {
    const cleaned = cleanPdfText(SAMPLE_RAW_PDF_TEXT, CLEANING_MODES.advanced)
    assert.ok(cleaned.length > 0)
    assert.ok(!cleaned.includes('Page 1 of 3'))
    assert.ok(!cleaned.includes('compre-\n'))
    assert.ok(cleaned.includes('comprehensive'))
  })
})

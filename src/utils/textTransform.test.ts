import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  MAX_LIVE_PREVIEW_CHARS,
  MAX_REPEAT_COUNT,
  MAX_WHATSAPP_SHARE_CHARS,
  buildWhatsAppShareUrl,
  estimateRepeatOutput,
  formatBytesCompact,
  getTextMetrics,
  invertText,
  repeatText,
  segmentGraphemes,
  toBoldUnicode,
  toGlitchUnicode,
} from './textTransform.ts'

test('getTextMetrics handles empty, English, Bengali, Hindi, and emoji text accurately', () => {
  assert.deepEqual(getTextMetrics(''), {
    words: 0,
    characters: 0,
    codeUnits: 0,
    lines: 0,
    bytes: 0,
  })

  const eng = getTextMetrics('Hello QUBNEXA\nLine two')
  assert.equal(eng.words, 4)
  assert.equal(eng.lines, 2)
  assert.equal(eng.characters, 22)

  // Family emoji ZWJ sequence should count as 1 user-perceived grapheme character
  const emojiMetrics = getTextMetrics('👨‍👩‍👧‍👦🎉')
  assert.equal(emojiMetrics.characters, 2)
  assert.equal(emojiMetrics.words, 1)

  // Bengali & Hindi metrics
  const indicMetrics = getTextMetrics('বাংলা ভাষা हिन्दी')
  assert.equal(indicMetrics.words, 3)
  assert.ok(indicMetrics.characters < indicMetrics.bytes)
})

test('invertText mode upside-down converts English/digits/punctuation and preserves Bengali, Hindi, emoji', () => {
  const res = invertText('Hello!', 'upside-down')
  assert.equal(res.output, '¡ollǝH')
  assert.equal(res.hasUnsupportedForUpsideDown, false)

  const brackets = invertText('(12)[ab]', 'upside-down')
  assert.equal(brackets.output, '[qɐ](ᄅƖ)')

  // Bengali, Hindi, and Emoji must never be deleted and must trigger helpful unsupported notice
  const mixed = invertText('Hi বাংলা नमस्ते 🚀', 'upside-down')
  assert.ok(mixed.hasUnsupportedForUpsideDown)
  assert.ok(mixed.output.includes('🚀'))
  assert.ok(mixed.unsupportedChars.includes('🚀'))
  // Grapheme clusters in Bengali/Hindi stay unbroken
  const bnClusters = segmentGraphemes('বাংলা')
  for (const cluster of bnClusters) {
    assert.ok(mixed.output.includes(cluster), `Missing Bengali cluster ${cluster}`)
  }
})

test('invertText mode backwards reverses full string and normalizes CRLF line breaks', () => {
  assert.equal(invertText('', 'backwards').output, '')
  assert.equal(invertText('Hello\r\nWorld', 'backwards').output, 'dlroW\nolleH')
  assert.equal(invertText('Go 👨‍👩‍👧‍👦!', 'backwards').output, '!👨‍👩‍👧‍👦 oG')
})

test('invertText mode reverse-each-word preserves word order and whitespace', () => {
  const res = invertText('Hello  QUBNEXA\nNew Tool', 'reverse-each-word')
  assert.equal(res.output, 'olleH  AXENBUQ\nweN looT')
})

test('invertText mode reverse-word-order reverses word tokens per line and keeps spelling', () => {
  const res = invertText('One Two Three\nFour Five', 'reverse-word-order')
  assert.equal(res.output, 'Three Two One\nFive Four')

  const indic = invertText('স্বাগতম QUBNEXA তে', 'reverse-word-order')
  assert.equal(indic.output, 'তে QUBNEXA স্বাগতম')
})

test('toBoldUnicode and toGlitchUnicode handle Latin and preserve non-Latin scripts', () => {
  const bold = toBoldUnicode('Ab1 বাংলা 😀')
  assert.ok(bold.startsWith('𝐀𝐛𝟏 বাংলা 😀'))

  const glitch = toGlitchUnicode('QUB বাংলা 🚀')
  assert.ok(glitch.includes('বাংলা 🚀'))
  assert.ok(glitch.length > 'QUB বাংলা 🚀'.length)
  assert.equal(toGlitchUnicode(''), '')
})

test('repeatText validates counts, supports separators, presets (including 100k), and enforces limits', () => {
  const invalidZero = estimateRepeatOutput({
    text: 'Hi',
    count: 0,
    separatorMode: 'space',
    customSeparator: '',
    transformMode: 'normal',
  })
  assert.equal(invalidZero.isCountValid, false)

  const invalidNeg = estimateRepeatOutput({
    text: 'Hi',
    count: -5,
    separatorMode: 'space',
    customSeparator: '',
    transformMode: 'normal',
  })
  assert.equal(invalidNeg.isCountValid, false)

  const overCount = estimateRepeatOutput({
    text: 'Hi',
    count: MAX_REPEAT_COUNT + 1,
    separatorMode: 'nothing',
    customSeparator: '',
    transformMode: 'normal',
  })
  assert.equal(overCount.isCountValid, false)

  // Standard custom separator + bold transform
  const custom = repeatText({
    text: 'Go',
    count: 3,
    separatorMode: 'custom',
    customSeparator: ' | ',
    transformMode: 'bold',
  })
  assert.equal(custom.output, '𝐆𝐨 | 𝐆𝐨 | 𝐆𝐨')
  assert.equal(custom.exceedsLimit, false)

  // Large 100,000 repeat of short string succeeds quickly and truncates live DOM preview safely
  const hundredK = repeatText({
    text: 'Hi',
    count: 100_000,
    separatorMode: 'newline',
    customSeparator: '',
    transformMode: 'normal',
  })
  assert.equal(hundredK.exceedsLimit, false)
  assert.equal(hundredK.output.length, 299_999)
  assert.equal(hundredK.isPreviewTruncated, true)
  assert.equal(hundredK.previewOutput.length, MAX_LIVE_PREVIEW_CHARS)

  // Huge payload exceeding safe byte/char limits must refuse allocation
  const oversized = repeatText({
    text: 'A'.repeat(100),
    count: 100_000,
    separatorMode: 'newline',
    customSeparator: '',
    transformMode: 'normal',
  })
  assert.equal(oversized.exceedsLimit, true)
  assert.ok(oversized.limitReason && oversized.limitReason.length > 0)
  assert.equal(oversized.output, '')
})

test('buildWhatsAppShareUrl encodes text cleanly and caps ultra-long messages', () => {
  const empty = buildWhatsAppShareUrl('')
  assert.equal(empty.url, '')

  const short = buildWhatsAppShareUrl('হ্যালো QUBNEXA! 🚀')
  assert.equal(short.wasTruncated, false)
  assert.ok(short.url.startsWith('https://wa.me/?text='))
  assert.equal(decodeURIComponent(short.url.replace('https://wa.me/?text=', '')), 'হ্যালো QUBNEXA! 🚀')

  const long = buildWhatsAppShareUrl('x'.repeat(MAX_WHATSAPP_SHARE_CHARS + 50))
  assert.equal(long.wasTruncated, true)
  assert.equal(long.sharedChars, MAX_WHATSAPP_SHARE_CHARS)
})

test('formatBytesCompact formats bytes, KB, and MB cleanly', () => {
  assert.equal(formatBytesCompact(500), '500 B')
  assert.equal(formatBytesCompact(2048), '2.0 KB')
  assert.equal(formatBytesCompact(2 * 1024 * 1024), '2.00 MB')
})

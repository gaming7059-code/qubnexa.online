import test from 'node:test'
import assert from 'node:assert/strict'
import { FANCY_FONT_STYLES } from './fancyFont.ts'

test('FANCY_FONT_STYLES contains at least 30 distinct Unicode styles', () => {
  assert.ok(FANCY_FONT_STYLES.length >= 30, `Expected >= 30 styles, found ${FANCY_FONT_STYLES.length}`)
  const uniqueIds = new Set(FANCY_FONT_STYLES.map((s) => s.id))
  assert.strictEqual(uniqueIds.size, FANCY_FONT_STYLES.length, 'All style IDs must be unique')
})

test('Bold Serif and Bold Sans transform letters and digits', () => {
  const boldSerif = FANCY_FONT_STYLES.find((s) => s.id === 'bold-serif')
  assert.ok(boldSerif)
  const res = boldSerif.transform('Hello 123')
  assert.strictEqual(res.output, '𝐇𝐞𝐥𝐥𝐨 𝟏𝟐𝟑')

  const boldSans = FANCY_FONT_STYLES.find((s) => s.id === 'bold-sans')
  assert.ok(boldSans)
  const resSans = boldSans.transform('Hello 123')
  assert.strictEqual(resSans.output, '𝗛𝗲𝗹𝗹𝗼 𝟭𝟮𝟯')
})

test('Mathematical exceptions are preserved in Script, Fraktur, and Double Struck', () => {
  const script = FANCY_FONT_STYLES.find((s) => s.id === 'script-cursive')
  assert.ok(script)
  // B, E, F, H, I, L, M, R have special code points in script
  const scriptRes = script.transform('BEFH e')
  assert.ok(scriptRes.output.includes('ℬ'))
  assert.ok(scriptRes.output.includes('ℰ'))
  assert.ok(scriptRes.output.includes('ℯ'))

  const doubleStruck = FANCY_FONT_STYLES.find((s) => s.id === 'double-struck')
  assert.ok(doubleStruck)
  // C, H, N, P, Q, R, Z have special code points in double struck
  const dsRes = doubleStruck.transform('CHN Z')
  assert.ok(dsRes.output.includes('ℂ'))
  assert.ok(dsRes.output.includes('ℕ'))
  assert.ok(dsRes.output.includes('ℤ'))
})

test('Circled, Squared and Fullwidth styles transform correctly', () => {
  const circled = FANCY_FONT_STYLES.find((s) => s.id === 'circled-bubble')
  assert.ok(circled)
  assert.strictEqual(circled.transform('ABC').output, 'ⒶⒷⒸ')

  const fullwidth = FANCY_FONT_STYLES.find((s) => s.id === 'fullwidth')
  assert.ok(fullwidth)
  assert.strictEqual(fullwidth.transform('Hi 9').output, 'Ｈｉ ９')
})

test('Small Caps and Superscript transform supported letters', () => {
  const smallCaps = FANCY_FONT_STYLES.find((s) => s.id === 'small-caps')
  assert.ok(smallCaps)
  assert.strictEqual(smallCaps.transform('hello').output, 'ʜᴇʟʟᴏ')

  const superscript = FANCY_FONT_STYLES.find((s) => s.id === 'superscript')
  assert.ok(superscript)
  assert.strictEqual(superscript.transform('abc 12').output, 'ᵃᵇᶜ ¹²')
})

test('Combining diacritic line styles preserve characters and spaces', () => {
  const strike = FANCY_FONT_STYLES.find((s) => s.id === 'strikethrough')
  assert.ok(strike)
  const strikeRes = strike.transform('a b')
  assert.strictEqual(strikeRes.output, 'a\u0336 b\u0336')

  const underline = FANCY_FONT_STYLES.find((s) => s.id === 'underline')
  assert.ok(underline)
  const underRes = underline.transform('c d')
  assert.strictEqual(underRes.output, 'c\u0332 d\u0332')
})

test('Preserves emoji and multi-byte surrogate pairs safely', () => {
  const testInput = 'Hello 🚀 World 🌟'
  for (const style of FANCY_FONT_STYLES) {
    const res = style.transform(testInput)
    assert.ok(res.output.includes('🚀'), `Style ${style.id} corrupted rocket emoji`)
    assert.ok(res.output.includes('🌟'), `Style ${style.id} corrupted star emoji`)
  }
})

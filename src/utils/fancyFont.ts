/**
 * QUBNEXA — Fancy Font Generator Unicode Engine
 * 35+ authentic copyable Unicode text transformations with surrogate-pair and emoji safety.
 */

export interface FancyFontStyle {
  id: string
  name: string
  category: 'Modern & Clean' | 'Classic & Gothic' | 'Enclosed & Bubble' | 'Decorative & Effects' | 'Sub & Super'
  samplePreview: string
  transform: (text: string) => { output: string; unsupportedChars: string[] }
}

// Unicode Exception Maps for Mathematical Alphanumeric Blocks
const SCRIPT_UPPER_EXCEPTIONS: Record<string, string> = {
  B: '\u212C', // ℬ
  E: '\u2130', // ℰ
  F: '\u2131', // ℱ
  H: '\u210B', // ℋ
  I: '\u2110', // ℐ
  L: '\u2112', // ℒ
  M: '\u2133', // ℳ
  R: '\u211B', // ℛ
}

const SCRIPT_LOWER_EXCEPTIONS: Record<string, string> = {
  e: '\u212F', // ℯ
  g: '\u210A', // ℊ
  o: '\u2134', // ℴ
}

const DOUBLE_STRUCK_EXCEPTIONS: Record<string, string> = {
  C: '\u2102', // ℂ
  H: '\u210D', // ℍ
  N: '\u2115', // ℕ
  P: '\u2119', // ℙ
  Q: '\u211A', // ℚ
  R: '\u211D', // ℝ
  Z: '\u2124', // ℤ
}

const FRAKTUR_EXCEPTIONS: Record<string, string> = {
  C: '\u212D', // ℭ
  H: '\u210C', // ℌ
  I: '\u2111', // ℑ
  R: '\u211C', // ℜ
  Z: '\u2128', // ℨ
}

// Small Caps Table
const SMALL_CAPS_MAP: Record<string, string> = {
  a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ғ', g: 'ɢ', h: 'ʜ', i: 'ɪ',
  j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ', q: 'ǫ', r: 'ʀ',
  s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x', y: 'ʏ', z: 'ᴢ',
  A: 'ᴀ', B: 'ʙ', C: 'ᴄ', D: 'ᴅ', E: 'ᴇ', F: 'ғ', G: 'ɢ', H: 'ʜ', I: 'ɪ',
  J: 'ᴊ', K: 'ᴋ', L: 'ʟ', M: 'ᴍ', N: 'ɴ', O: 'ᴏ', P: 'ᴘ', Q: 'ǫ', R: 'ʀ',
  S: 's', T: 'ᴛ', U: 'ᴜ', V: 'ᴠ', W: 'ᴡ', X: 'x', Y: 'ʏ', Z: 'ᴢ',
}

// Superscript Table
const SUPERSCRIPT_MAP: Record<string, string> = {
  a: 'ᵃ', b: 'ᵇ', c: 'ᶜ', d: 'ᵈ', e: 'ᵉ', f: 'ᶠ', g: 'ᵍ', h: 'ʰ', i: 'ⁱ',
  j: 'ʲ', k: 'ᵏ', l: 'ˡ', m: 'ᵐ', n: 'ⁿ', o: 'ᵒ', p: 'ᵖ', r: 'ʳ', s: 'ˢ',
  t: 'ᵗ', u: 'ᵘ', v: 'ᵛ', w: 'ʷ', x: 'ˣ', y: 'ʸ', z: 'ᶻ',
  A: 'ᴬ', B: 'ᴮ', D: 'ᴰ', E: 'ᴱ', G: 'ᴳ', H: 'ᴴ', I: 'ᴵ', J: 'ᴶ', K: 'ᴷ',
  L: 'ᴸ', M: 'ᴹ', N: 'ᴺ', O: 'ᴼ', P: 'ᴾ', R: 'ᴿ', T: 'ᵀ', U: 'ᵁ', V: 'ⱽ', W: 'ᵂ',
  '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹',
  '+': '⁺', '-': '⁻', '=': '⁼', '(': '⁽', ')': '⁾',
}

// Subscript Table
const SUBSCRIPT_MAP: Record<string, string> = {
  a: 'ₐ', e: 'ₑ', h: 'ₕ', i: 'ᵢ', j: 'ⱼ', k: 'ₖ', l: 'ₗ', m: 'ₘ', n: 'ₙ',
  o: 'ₒ', p: 'ₚ', r: 'ᵣ', s: 'ₛ', t: 'ₜ', u: 'ᵤ', v: 'ᵥ', x: 'ₓ',
  '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉',
  '+': '₊', '-': '₋', '=': '₌', '(': '₍', ')': '₎',
}

// Upside-Down Map
const UPSIDE_DOWN_MAP: Record<string, string> = {
  a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ', i: 'ᴉ',
  j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd', q: 'b', r: 'ɹ',
  s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x', y: 'ʎ', z: 'z',
  A: '∀', B: '𐐒', C: 'Ɔ', D: '◖', E: 'Ǝ', F: 'Ⅎ', G: '⅁', H: 'H', I: 'I',
  J: 'ſ', K: 'ʞ', L: '˥', M: 'W', N: 'N', O: 'O', P: 'Ԁ', Q: 'Ό', R: 'ᴚ',
  S: 'S', T: '⊥', U: '∩', V: 'Λ', W: 'M', X: 'X', Y: '⅄', Z: 'Z',
  '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ', '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
  '.': '˙', ',': "'", "'": ',', '"': '„', '!': '¡', '?': '¿', '<': '>', '>': '<',
  '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{', '&': '⅋', '_': '‾',
}

/**
 * Maps ASCII characters using block math offsets.
 */
function mapAlphabet(
  text: string,
  upperBase: number,
  lowerBase: number,
  digitBase?: number,
  upperExceptions?: Record<string, string>,
  lowerExceptions?: Record<string, string>,
): { output: string; unsupportedChars: string[] } {
  const chars = Array.from(text)
  let out = ''
  const unsupported = new Set<string>()

  for (const ch of chars) {
    if (upperExceptions && upperExceptions[ch]) {
      out += upperExceptions[ch]
      continue
    }
    if (lowerExceptions && lowerExceptions[ch]) {
      out += lowerExceptions[ch]
      continue
    }

    const code = ch.codePointAt(0)
    if (code === undefined) continue

    if (code >= 65 && code <= 90) {
      out += String.fromCodePoint(upperBase + (code - 65))
    } else if (code >= 97 && code <= 122) {
      out += String.fromCodePoint(lowerBase + (code - 97))
    } else if (digitBase !== undefined && code >= 48 && code <= 57) {
      out += String.fromCodePoint(digitBase + (code - 48))
    } else {
      out += ch
      if (/[A-Za-z0-9]/.test(ch)) {
        unsupported.add(ch)
      }
    }
  }

  return { output: out, unsupportedChars: Array.from(unsupported) }
}

/**
 * Maps dictionary lookup characters.
 */
function mapDictionary(
  text: string,
  dict: Record<string, string>,
  reverseOrder = false,
): { output: string; unsupportedChars: string[] } {
  const chars = Array.from(text)
  let out = ''
  const unsupported = new Set<string>()

  const targetChars = reverseOrder ? [...chars].reverse() : chars

  for (const ch of targetChars) {
    if (dict[ch]) {
      out += dict[ch]
    } else {
      out += ch
      if (/[A-Za-z0-9]/.test(ch)) {
        unsupported.add(ch)
      }
    }
  }

  return { output: out, unsupportedChars: Array.from(unsupported) }
}

/**
 * Applies combining Unicode diacritics onto each character.
 */
function mapCombiningMark(
  text: string,
  combiningChar: string,
): { output: string; unsupportedChars: string[] } {
  const chars = Array.from(text)
  let out = ''
  for (const ch of chars) {
    if (/\s/.test(ch)) {
      out += ch
    } else {
      out += `${ch}${combiningChar}`
    }
  }
  return { output: out, unsupportedChars: [] }
}

/**
 * Master catalog of 35 distinct Unicode styles.
 */
export const FANCY_FONT_STYLES: FancyFontStyle[] = [
  // 1-6: Standard Mathematical Alphabets
  {
    id: 'bold-serif',
    name: 'Bold (Serif)',
    category: 'Modern & Clean',
    samplePreview: '𝐁𝐨𝐥𝐝 𝐒𝐞𝐫𝐢𝐟',
    transform: (t) => mapAlphabet(t, 0x1d400, 0x1d41a, 0x1d7ce),
  },
  {
    id: 'bold-sans',
    name: 'Bold (Sans-Serif)',
    category: 'Modern & Clean',
    samplePreview: '𝗕𝗼𝗹𝗱 𝗦𝗮𝗻𝘀',
    transform: (t) => mapAlphabet(t, 0x1d5d4, 0x1d5ee, 0x1d7ec),
  },
  {
    id: 'italic-serif',
    name: 'Italic (Serif)',
    category: 'Modern & Clean',
    samplePreview: '𝐼𝑡𝑎𝑙𝑖𝑐 𝑆𝑒𝑟𝑖𝑓',
    transform: (t) => mapAlphabet(t, 0x1d434, 0x1d44e, undefined, undefined, { h: '\u210E' }),
  },
  {
    id: 'italic-sans',
    name: 'Italic (Sans-Serif)',
    category: 'Modern & Clean',
    samplePreview: '𝘐𝘵𝘢𝘭𝘪𝘤 𝘚𝘢𝘯𝘴',
    transform: (t) => mapAlphabet(t, 0x1d608, 0x1d622),
  },
  {
    id: 'bold-italic-serif',
    name: 'Bold Italic (Serif)',
    category: 'Modern & Clean',
    samplePreview: '𝑩𝒐𝒍𝒅 𝑰𝒕𝒂𝒍𝒊𝒄',
    transform: (t) => mapAlphabet(t, 0x1d468, 0x1d482),
  },
  {
    id: 'bold-italic-sans',
    name: 'Bold Italic (Sans)',
    category: 'Modern & Clean',
    samplePreview: '𝘽𝙤𝙡𝙙 𝙄𝙩𝙖𝙡𝙞𝙘',
    transform: (t) => mapAlphabet(t, 0x1d63c, 0x1d656),
  },

  // 7-11: Cursive & Calligraphy
  {
    id: 'script-cursive',
    name: 'Cursive / Script',
    category: 'Classic & Gothic',
    samplePreview: '𝒞𝓊𝓇𝓈𝒾𝓋ℯ',
    transform: (t) => mapAlphabet(t, 0x1d49c, 0x1d4b6, undefined, SCRIPT_UPPER_EXCEPTIONS, SCRIPT_LOWER_EXCEPTIONS),
  },
  {
    id: 'bold-script',
    name: 'Bold Script',
    category: 'Classic & Gothic',
    samplePreview: '𝓒𝓾𝓻𝓼𝓲𝓿𝓮 𝓑𝓸𝓵𝓭',
    transform: (t) => mapAlphabet(t, 0x1d4d0, 0x1d4ea),
  },
  {
    id: 'double-struck',
    name: 'Double Struck (Blackboard)',
    category: 'Classic & Gothic',
    samplePreview: '𝔻𝕠𝕦𝕓𝕝𝕖 𝕊𝕥𝕣𝕦𝕔𝕜',
    transform: (t) => mapAlphabet(t, 0x1d538, 0x1d552, 0x1d7d8, DOUBLE_STRUCK_EXCEPTIONS),
  },
  {
    id: 'fraktur-gothic',
    name: 'Fraktur (Gothic)',
    category: 'Classic & Gothic',
    samplePreview: '𝔉𝔯𝔞𝔨𝔱𝔲𝔯 𝔊𝔬𝔱𝔥𝔦𝔠',
    transform: (t) => mapAlphabet(t, 0x1d504, 0x1d51e, undefined, FRAKTUR_EXCEPTIONS),
  },
  {
    id: 'bold-fraktur',
    name: 'Bold Fraktur',
    category: 'Classic & Gothic',
    samplePreview: '𝕭𝖔𝖑𝖉 𝕲𝖔𝖙𝖍𝖎𝖈',
    transform: (t) => mapAlphabet(t, 0x1d56c, 0x1d586),
  },

  // 12-14: Monospace & Wide Text
  {
    id: 'monospace',
    name: 'Monospace / Code',
    category: 'Modern & Clean',
    samplePreview: '𝙼𝚘𝚗𝚘𝚜𝚙𝚊𝚌𝚎',
    transform: (t) => mapAlphabet(t, 0x1d670, 0x1d68a, 0x1d7f6),
  },
  {
    id: 'fullwidth',
    name: 'Fullwidth (Vaporwave / Wide)',
    category: 'Modern & Clean',
    samplePreview: 'Ｆｕｌｌｗｉｄｔｈ',
    transform: (t) => mapAlphabet(t, 0xff21, 0xff41, 0xff10),
  },
  {
    id: 'small-caps',
    name: 'Small Caps',
    category: 'Modern & Clean',
    samplePreview: 'sᴍᴀʟʟ ᴄᴀᴘs',
    transform: (t) => mapDictionary(t, SMALL_CAPS_MAP),
  },

  // 15-19: Enclosed & Bubbles
  {
    id: 'circled-bubble',
    name: 'Circled (Bubble Text)',
    category: 'Enclosed & Bubble',
    samplePreview: 'Ⓒⓘⓡⓒⓛⓔⓓ',
    transform: (t) => mapAlphabet(t, 0x24b6, 0x24d0, 0x2460),
  },
  {
    id: 'negative-circled',
    name: 'Dark Inverted Bubble',
    category: 'Enclosed & Bubble',
    samplePreview: '🅓🅐🅡🅚 🅑🅤🅑🅑🅛🅔',
    transform: (t) => mapAlphabet(t, 0x1f150, 0x1f150),
  },
  {
    id: 'squared',
    name: 'Squared (Boxed)',
    category: 'Enclosed & Bubble',
    samplePreview: '🅂🅀🅄🄰🅁🄴🄳',
    transform: (t) => mapAlphabet(t, 0x1f130, 0x1f130),
  },
  {
    id: 'negative-squared',
    name: 'Dark Squared (Filled Box)',
    category: 'Enclosed & Bubble',
    samplePreview: '🅱🅾🆇🅴🅳',
    transform: (t) => mapAlphabet(t, 0x1f170, 0x1f170),
  },
  {
    id: 'parenthesized',
    name: 'Parenthesized',
    category: 'Enclosed & Bubble',
    samplePreview: '⒫⒜⒭⒠⒩',
    transform: (t) => mapAlphabet(t, 0x249c, 0x249c, 0x2474),
  },

  // 20-21: Subscript & Superscript
  {
    id: 'superscript',
    name: 'Superscript (Tiny Above)',
    category: 'Sub & Super',
    samplePreview: 'ᵗⁱⁿʸ ᵘᵖ',
    transform: (t) => mapDictionary(t, SUPERSCRIPT_MAP),
  },
  {
    id: 'subscript',
    name: 'Subscript (Tiny Below)',
    category: 'Sub & Super',
    samplePreview: 'ₜᵢₙᵧ 𝒹ₒ𝓌ₙ',
    transform: (t) => mapDictionary(t, SUBSCRIPT_MAP),
  },

  // 22-23: Orientation & Direction
  {
    id: 'upside-down',
    name: 'Upside Down (Flipped)',
    category: 'Decorative & Effects',
    samplePreview: 'uʍop ǝpᴉsd∩',
    transform: (t) => mapDictionary(t, UPSIDE_DOWN_MAP, true),
  },
  {
    id: 'reversed-backwards',
    name: 'Reversed (Backwards)',
    category: 'Decorative & Effects',
    samplePreview: 'sdrawkcaB',
    transform: (t) => ({ output: Array.from(t).reverse().join(''), unsupportedChars: [] }),
  },

  // 24-30: Combining Line Styles
  {
    id: 'strikethrough',
    name: 'Strikethrough',
    category: 'Decorative & Effects',
    samplePreview: 's̶t̶r̶i̶k̶e̶',
    transform: (t) => mapCombiningMark(t, '\u0336'),
  },
  {
    id: 'double-strikethrough',
    name: 'Double Strikethrough',
    category: 'Decorative & Effects',
    samplePreview: 'd̳s̳t̳r̳i̳k̳e̳',
    transform: (t) => mapCombiningMark(t, '\u033F'),
  },
  {
    id: 'underline',
    name: 'Underline',
    category: 'Decorative & Effects',
    samplePreview: 'u̲n̲d̲e̲r̲l̲i̲n̲e̲',
    transform: (t) => mapCombiningMark(t, '\u0332'),
  },
  {
    id: 'double-underline',
    name: 'Double Underline',
    category: 'Decorative & Effects',
    samplePreview: 'd͟o͟u͟b͟l͟e͟',
    transform: (t) => mapCombiningMark(t, '\u0333'),
  },
  {
    id: 'slash-through',
    name: 'Slash / Diagonal Strike',
    category: 'Decorative & Effects',
    samplePreview: 's̷l̷a̷s̷h̷',
    transform: (t) => mapCombiningMark(t, '\u0337'),
  },
  {
    id: 'wavy-strike',
    name: 'Wavy Tilde Strike',
    category: 'Decorative & Effects',
    samplePreview: 'w̴a̴v̴y̴',
    transform: (t) => mapCombiningMark(t, '\u0334'),
  },
  {
    id: 'dotted-underline',
    name: 'Dotted Below',
    category: 'Decorative & Effects',
    samplePreview: 'ḍọṭṭẹḍ',
    transform: (t) => mapCombiningMark(t, '\u0323'),
  },

  // 31-35: Decorative Wrappers & Accents
  {
    id: 'sparkle-stars',
    name: 'Sparkle Stars',
    category: 'Decorative & Effects',
    samplePreview: '✨ 𝓢𝓹𝓪𝓻𝓴𝓵𝓮 ✨',
    transform: (t) => {
      const scriptRes = mapAlphabet(t, 0x1d4d0, 0x1d4ea)
      return { output: `✨ ${scriptRes.output} ✨`, unsupportedChars: scriptRes.unsupportedChars }
    },
  },
  {
    id: 'wings-brackets',
    name: 'Wings & Accents',
    category: 'Decorative & Effects',
    samplePreview: '꧁ 𝒲𝒾𝓃ℊ𝓈 ꧂',
    transform: (t) => {
      const scriptRes = mapAlphabet(t, 0x1d49c, 0x1d4b6, undefined, SCRIPT_UPPER_EXCEPTIONS, SCRIPT_LOWER_EXCEPTIONS)
      return { output: `꧁ ${scriptRes.output} ꧂`, unsupportedChars: scriptRes.unsupportedChars }
    },
  },
  {
    id: 'asian-brackets',
    name: 'Japanese Corner Brackets',
    category: 'Decorative & Effects',
    samplePreview: '【 𝔹𝕣𝕒𝕔𝕜𝕖𝕥𝕤 】',
    transform: (t) => {
      const dsRes = mapAlphabet(t, 0x1d538, 0x1d552, 0x1d7d8, DOUBLE_STRUCK_EXCEPTIONS)
      return { output: `【 ${dsRes.output} 】`, unsupportedChars: dsRes.unsupportedChars }
    },
  },
  {
    id: 'heart-surround',
    name: 'Sweet Hearts',
    category: 'Decorative & Effects',
    samplePreview: '♥ 𝑩𝒆𝒂𝒖𝒕𝒊𝒇𝒖𝒍 ♥',
    transform: (t) => {
      const biRes = mapAlphabet(t, 0x1d468, 0x1d482)
      return { output: `♥ ${biRes.output} ♥`, unsupportedChars: biRes.unsupportedChars }
    },
  },
  {
    id: 'spaced-aesthetic',
    name: 'Spaced Aesthetic',
    category: 'Modern & Clean',
    samplePreview: 'A  E  S  T  H  E  T  I  C',
    transform: (t) => {
      const chars = Array.from(t)
      return { output: chars.join('  '), unsupportedChars: [] }
    },
  },
]

export const DEFAULT_SAMPLE_TEXT = 'QUBNEXA Fancy Fonts'

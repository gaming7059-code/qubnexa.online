import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { TextInverter } from '../../tools/TextInverter/TextInverter'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const TextInverterPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'text-inverter') || {
    id: 'text-inverter',
    name: 'Text Inverter',
    slug: 'text-inverter',
    path: '/tools/text-inverter',
    description:
      'Flip text upside down, reverse it backwards, or reverse individual words and word order instantly with Unicode safety.',
    categoryId: 'text-writing',
    categoryIds: ['text-writing', 'utilities'],
    categoryName: 'Text & Writing',
    icon: 'FlipVertical2',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: [
      'text inverter',
      'flip text',
      'upside down text',
      'reverse text',
      'backwards text',
      'reverse words',
    ],
  }

  const howToUseSteps = [
    'Enter your message: Type, paste text from your clipboard, or upload a plain-text (.txt) file up to 2 MB into the Input Text workspace.',
    'Select your inversion mode: Choose between Upside Down (180° Unicode flip), Backwards (full character reversal), Reverse Each Word (flips letters per word), or Reverse Word Order (reverses word positions per line).',
    'Review unsupported-character notice: In Upside Down mode, unmapped multilingual scripts (Hindi, Bengali) or emojis are safely preserved in place without deletion or corruption.',
    'Verify text metrics: Review real-time character count (grapheme clusters), UTF-16 code units, word count, lines, and UTF-8 byte size.',
    'Inspect real-time preview: View your inverted text rendered instantaneously in the responsive output workspace below.',
    'Use result as input (optional): Click "Use Result as Input" to load your inverted output back into the input panel for chained multi-stage transformations.',
    'Copy, download, or share: Click "Copy Result" for complete clipboard copying, "Download .txt" to save your result, "Select All" to highlight, or "Share on WhatsApp".',
  ]

  const formulas = [
    {
      title: '180° Upside-Down Unicode Substitution Algorithm',
      formula: 'Flipped Line = Map(segmentGraphemes(line).reverse(), ch => UPSIDE_DOWN_MAP[ch] || ch).join("")',
      explanation:
        'Reverses grapheme cluster order within each line while substituting Latin alphanumeric characters, brackets, and punctuation with 180-degree upside-down Unicode symbols. Unmapped characters and neutral symbols pass through intact.',
    },
    {
      title: 'Intl.Segmenter Grapheme Cluster Reversal',
      formula: 'Backwards Output = segmentGraphemes(normalizedText).reverse().join("")',
      explanation:
        'Splits text using ECMAScript Intl.Segmenter at grapheme boundary granularity. Multi-codepoint emojis (such as flags and ZWJ family sequences) and Indic conjuncts remain atomically intact without splitting surrogate halves.',
    },
    {
      title: 'Intra-Word Reversal with Whitespace Preservation',
      formula: 'Output = text.split(/(\\s+/).map(token => /^\\s+$/.test(token) ? token : segmentGraphemes(token).reverse().join("")).join("")',
      explanation:
        'Segments text using capturing whitespace groups. Reverses grapheme clusters inside each individual word token while preserving all leading, trailing, and multi-space whitespace and line breaks character-for-character.',
    },
    {
      title: 'Line-Bounded Word Sequence Inversion',
      formula: 'Line Output = line.trim().split(/\\s+/).reverse().join(" ")',
      explanation:
        'Reverses word token order per line while leaving individual word spellings intact. Non-empty lines are trimmed of outer whitespace and multiple inter-word spaces normalize to single spaces, while blank lines and paragraph breaks are preserved.',
    },
    {
      title: 'Text Metrics & UTF-8 Byte Density',
      formula: 'Characters = segmentGraphemes(text).length | Bytes = TextEncoder.encode(text).length',
      explanation:
        'Measures user-perceived grapheme clusters alongside JavaScript UTF-16 code units (text.length) and real UTF-8 bytes to ensure accurate capacity tracking across Latin, Cyrillic, and Asian alphabets.',
    },
    {
      title: 'Neutral Glyph Preservation & Fallback Guardrail',
      formula: 'Passthrough = NEUTRAL_PASS_THROUGH ∪ Unsupported Set',
      explanation:
        'Symmetrical characters (-, –, —, =, +, *, :, |, ~) pass through without warnings. Unmapped foreign scripts (Devanagari, Bengali, Tamil) pass through safely without deletion or visual corruption.',
    },
  ]

  const examples = [
    {
      title: 'Upside-Down 180° Flip (English Alphanumeric & Punctuation)',
      description:
        'Converting letters, numbers, and punctuation for 180-degree flipped display on social profiles and messages.',
      input:
        'Text: "QUBNEXA 2026!" • Mode: Upside Down',
      output:
        '13 Characters (UTF-16 code units) • 21 Bytes (UTF-8) • Output: "¡9ᄅ0ᄅ ∀XƎNᗺ∩Ό"',
    },
    {
      title: 'Backwards Character Reversal (Multi-Codepoint Emojis)',
      description:
        'Reversing entire sentences while preserving surrogate-pair rocket and flag emojis without glyph corruption.',
      input:
        'Text: "Hello 🚀 World!" • Mode: Backwards',
      output:
        '14 Characters (UTF-16 code units) • 16 Bytes (UTF-8) • Rocket emoji intact • Output: "!dlroW 🚀 olleH"',
    },
    {
      title: 'Reverse Each Word (Preserving Sentence Word Order)',
      description:
        'Flipping the internal spelling of every word while keeping spacing and sentence reading order unchanged.',
      input:
        'Text: "Explore Create Simplify" • Mode: Reverse Each Word',
      output:
        '23 Characters (UTF-16 code units) • 23 Bytes (UTF-8) • Output: "erolpxE etaerC yfilpmiS"',
    },
    {
      title: 'Reverse Word Order (Preserving Word Spelling Across Lines)',
      description:
        'Inverting the sequence of words from last to first while keeping every individual word spelled normally.',
      input:
        'Text: "The quick brown fox jumps" • Mode: Reverse Word Order',
      output:
        '25 Characters (UTF-16 code units) • 25 Bytes (UTF-8) • 5 Words • Output: "jumps fox brown quick The"',
    },
  ]

  const faqs = [
    {
      question: 'What is an online text inverter and what does it do?',
      answer:
        'A text inverter is a typography utility that modifies the order, orientation, or spelling of text. QUBNEXA Text Inverter provides four distinct modes: Upside Down (180° flip using Unicode characters), Backwards (reversing all characters in the text), Reverse Each Word (flipping spelling inside each word while keeping sentence order), and Reverse Word Order (reversing word positions while keeping word spelling intact).',
    },
    {
      question: 'How does Upside Down mode work, and why does it use special Unicode characters?',
      answer:
        'Standard fonts cannot render text upside down in plain text. Upside Down mode substitutes standard ASCII letters, digits, and punctuation with visually inverted Unicode characters from the International Phonetic Alphabet (IPA), mathematical symbols, and archaic scripts (e.g., "e" becomes "ǝ", "A" becomes "∀", "!" becomes "¡"). The algorithm also reverses character order within each line so the flipped text can be read naturally when rotated 180 degrees.',
    },
    {
      question: 'What happens to Bengali, Hindi, or non-Latin alphabets in Upside Down mode?',
      answer:
        'Scripts and emojis without standardized upside-down Unicode equivalents are never deleted, dropped, or corrupted. They are safely preserved in their original form and order, and QUBNEXA displays a helpful notification banner indicating which characters were kept unchanged.',
    },
    {
      question: 'How does Text Inverter prevent emojis and compound characters from breaking?',
      answer:
        'Standard JavaScript string reversal (.split("").reverse().join("")) breaks surrogate pairs and multi-codepoint emojis (such as 🚀, 👨‍👩‍👧‍👦, or 🇮🇳), producing broken replacement glyphs (such as question marks or diamond  symbols). QUBNEXA utilizes modern ECMAScript Intl.Segmenter with grapheme granularity, ensuring multi-byte Unicode characters, emojis, and Indic vowel marks remain atomic units during reversal.',
    },
    {
      question: 'What is the difference between "Reverse Each Word" and "Reverse Word Order"?',
      answer:
        '"Reverse Each Word" flips the internal letter sequence inside every word while preserving the order of words in the sentence (e.g., "Hello World" becomes "olleH dlroW"). "Reverse Word Order" reverses the placement of words from last to first while preserving the internal spelling of each word (e.g., "Hello World" becomes "World Hello"). In Reverse Word Order, leading/trailing whitespace on lines is trimmed and inter-word spaces normalize to single spaces, whereas Reverse Each Word preserves all spacing exactly as entered.',
    },
    {
      question: 'How does punctuation behave in Reverse Each Word mode?',
      answer:
        'In Reverse Each Word mode, words are identified by whitespace delimiters. Punctuation attached directly to a word (such as a comma or exclamation mark) is treated as part of that word token and reversed accordingly (e.g., "Hello, World!" becomes ",olleH !dlroW"). If you separate punctuation with a space, it remains in its own position.',
    },
    {
      question: 'Can I invert text back to its original state (is the process reversible)?',
      answer:
        'Yes! Backwards, Reverse Each Word, and Reverse Word Order modes are perfectly symmetrical: running them a second time on their output completely restores the original text. You can test this instantly using the "Use Result as Input" button. Upside Down mode is also largely reversible for standard English alphanumeric characters with mapped equivalents.',
    },
    {
      question: 'Is my text private, secure, and processed entirely client-side?',
      answer:
        'Yes, 100%. All character mappings, grapheme segmentation, reversals, and file downloads execute exclusively within your local browser memory via JavaScript. Zero text, notes, or uploaded files are ever sent across the network or stored in any remote database.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Text Inverter Online — Flip Upside Down & Reverse Text | QUBNEXA"
      seoDescription="Flip text upside down, reverse character strings backwards, reverse each word, or invert word order online with QUBNEXA. Free, Unicode-safe, and 100% private."
      keywords="text inverter, flip text online, upside down text generator, reverse text generator, backwards text generator, reverse words online, flip words, upside down letters, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['text-repeater', 'fancy-font-generator', 'word-counter', 'unit-converter', 'qr-code-generator', 'password-generator']}
    >
      <TextInverter />
    </ToolPageLayout>
  )
}

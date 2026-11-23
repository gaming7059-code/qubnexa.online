import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { TextRepeater } from '../../tools/TextRepeater/TextRepeater'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const TextRepeaterPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'text-repeater') || {
    id: 'text-repeater',
    name: 'Text Repeater',
    slug: 'text-repeater',
    path: '/tools/text-repeater',
    description:
      'Repeat any text, word, sentence or message with custom separators, styles, and browser-safe export up to 2M characters.',
    categoryId: 'text-writing',
    categoryIds: ['text-writing', 'utilities'],
    categoryName: 'Text & Writing',
    icon: 'Repeat',
    isPopular: true,
    isNew: true,
    isFunctional: true,
    keywords: [
      'text repeater',
      'repeat text online',
      'duplicate text',
      'copy text multiple times',
      'text multiplier',
      'whatsapp repeater',
    ],
  }

  const howToUseSteps = [
    'Enter your message: Type, paste text from your clipboard, or upload a plain-text (.txt) file up to 2 MB into the Input Text area.',
    'Set your repeat count: Use the -/+ stepper buttons, type any integer up to 1,000,000, or choose quick presets (100, 500, 1,000, or 100,000 times).',
    'Choose your delimiter: Select New Line (each repeat on a new line), Space, Nothing (concatenated), or Custom (such as commas, bullets, or dashes).',
    'Select a style transform (optional): Transform your repeated message into Bold Unicode, Upside Down, Backwards, or Glitch Zalgo typography.',
    'Verify estimated output size: Review the pre-computed character count and UTF-8 byte estimate to guarantee browser stability.',
    'Inspect live output preview: View your repeated text instantaneously in the responsive output workspace (preview capped at 120,000 chars to prevent browser lag).',
    'Export or share: Click "Copy Result" for complete clipboard copying, "Download .txt" to save locally, "Use Result as Input" for iterative piping, or "Share on WhatsApp".',
  ]

  const formulas = [
    {
      title: 'Single-Buffer Repetition Math',
      formula: 'Output = Count === 1 ? Unit : Separator === "" ? Unit.repeat(Count) : (Unit + Separator).repeat(Count - 1) + Unit',
      explanation:
        'Uses contiguous native string repetition instead of naive array concatenation. Exactly N - 1 delimiters are placed between N repetitions, completely eliminating awkward trailing separators.',
    },
    {
      title: 'Pre-Allocated Character Estimation Formula',
      formula: 'Estimated Chars = (Unit Length × Count) + (Separator Length × (Count - 1))',
      explanation:
        'Calculates the exact total character count prior to memory allocation. This allows QUBNEXA to enforce browser safety thresholds before creating large string buffers.',
    },
    {
      title: 'UTF-8 Byte Allocation Formula',
      formula: 'Estimated Bytes = (Unit Bytes × Count) + (Separator Bytes × (Count - 1))',
      explanation:
        'Measures memory consumption in real UTF-8 bytes using TextEncoder logic, properly accounting for multi-byte Unicode scripts (Hindi, Bengali) and 4-byte surrogate emojis.',
    },
    {
      title: 'Mathematical Bold Unicode Mapping',
      formula: 'BoldChar = String.fromCodePoint(0x1D400 + (code - 65)) [A-Z] | 0x1D41A + (code - 97) [a-z] | 0x1D7CE + (code - 48) [0-9]',
      explanation:
        'Transforms standard ASCII letters and numbers into Mathematical Bold alphanumeric Unicode glyphs, retaining full cross-platform compatibility on social media and chat apps.',
    },
    {
      title: 'Upside-Down Inversion & Grapheme Reversal',
      formula: 'Inverted = segmentGraphemes(Text).map(glyph => FlipMap[glyph] || glyph).reverse().join("")',
      explanation:
        'Applies deterministic Unicode character substitution paired with grapheme cluster reversal, ensuring inverted phrases flip visually without corrupting surrogate pairs.',
    },
    {
      title: 'Safety Thresholds & Bounded DOM Rendering',
      formula: 'Max Count: 1,000,000 | Max Chars: 2,000,000 | Max Bytes: 4 MB | Live DOM Cap: 120,000 chars',
      explanation:
        'Strict guardrails protect user browser sessions: memory allocation pauses if output exceeds 2 million characters or 4 MB, while live DOM rendering caps preview to 120,000 characters without clipping clipboard or download data.',
    },
  ]

  const examples = [
    {
      title: 'New Line Repetition with Emojis (Social Media & Reminders)',
      description:
        'Repeating an announcement or reminder 5 times with each iteration formatted cleanly on a fresh line.',
      input:
        'Text: "QUBNEXA 🚀" • Repeat Count: 5 • Separator: New Line (\\n) • Transform: Normal',
      output:
        '54 Characters (UTF-16 code units) • 64 Bytes (UTF-8) • 5 Lines • Output: "QUBNEXA 🚀\\nQUBNEXA 🚀\\nQUBNEXA 🚀\\nQUBNEXA 🚀\\nQUBNEXA 🚀"',
    },
    {
      title: 'Mathematical Bold Tags with Custom Bullet Separator',
      description:
        'Creating styled social media keyword tags or decorative header badges with custom delimiters.',
      input:
        'Text: "Verified" • Repeat Count: 4 • Separator: Custom (" • ") • Transform: Bold',
      output:
        '73 Characters (UTF-16 code units) • 143 Bytes (UTF-8) • 4 units (16 code units / 32 bytes each) + 3 separators (3 code units / 5 bytes each) • Output: "𝐕𝐞𝐫𝐢𝐟𝐢𝐞𝐝 • 𝐕𝐞𝐫𝐢𝐟𝐢𝐞𝐝 • 𝐕𝐞𝐫𝐢𝐟𝐢𝐞𝐝 • 𝐕𝐞𝐫𝐢𝐟𝐢𝐞𝐝"',
    },
    {
      title: 'Upside-Down Typography with Space Delimiter',
      description:
        'Generating stylized flipped text sequences for creative social profiles and playful messaging.',
      input:
        'Text: "hello world" • Repeat Count: 3 • Separator: Space (" ") • Transform: Upside Down',
      output:
        '35 Characters (UTF-16 code units) • 47 Bytes (UTF-8) • 3 units (11 code units / 15 bytes each) + 2 spaces • Output: "plɹoʍ ollǝɥ plɹoʍ ollǝɥ plɹoʍ ollǝɥ"',
    },
    {
      title: 'High-Volume Comma-Separated Mock Data (10,000 Repeats)',
      description:
        'Stress-testing software data pipelines and generating synthetic delimiter-separated testing strings.',
      input:
        'Text: "A1" • Repeat Count: 10,000 • Separator: Custom (",") • Transform: Normal',
      output:
        '29,999 Characters • 29,999 Bytes (~29.3 KB) • 10,000 repetitions with 9,999 commas • Instant single-buffer allocation in <5ms',
    },
  ]

  const faqs = [
    {
      question: 'What is an online text repeater and what are its common use cases?',
      answer:
        'A text repeater is a digital utility that duplicates any word, phrase, sentence, or emoji string multiple times automatically. Popular use cases include stress-testing software forms and database limits, generating dummy mock data, creating repetitive test payloads for QA, creating emphasized social media captions, sending fun repeated messages on WhatsApp, and formatting custom-delimited tags or lists.',
    },
    {
      question: 'Can I safely repeat text 100,000 times without freezing my browser?',
      answer:
        'Yes, provided the total generated output stays within the 2,000,000-character and 4 MB safety thresholds. QUBNEXA utilizes a high-efficiency single-buffer repetition algorithm ((Unit + Separator).repeat(Count - 1) + Unit) rather than heavy array allocations. Furthermore, QUBNEXA caps the live visual textarea preview to 120,000 characters, preventing DOM lag. The entire output remains completely available in memory for instantaneous "Copy Result" and "Download .txt" actions.',
    },
    {
      question: 'What are the maximum repeat count and output size limits on QUBNEXA?',
      answer:
        'You can enter a repeat count up to 1,000,000 times. However, repeat capacity is bounded by a strict browser safety ceiling of 2,000,000 characters (2 MB ASCII) or 4,000,000 UTF-8 bytes (4 MB). Short inputs (e.g. 1–2 characters) can reach hundreds of thousands of repeats, while longer paragraphs reach the 2M-character safety ceiling at lower counts. If your requested combination exceeds these thresholds, QUBNEXA alerts you immediately before allocating memory.',
    },
    {
      question: 'How does the separator setting work, and why is there no trailing delimiter?',
      answer:
        'QUBNEXA supports four separator modes: New Line (\\n), Space, Nothing (direct continuous concatenation), and Custom (any string up to 50 characters, such as commas, pipes, or bullets). Our algorithm places exactly N - 1 separators between N repeat units, ensuring your repeated output is clean and contains zero trailing separators at the end.',
    },
    {
      question: 'What text style transforms are available in the Text Repeater?',
      answer:
        'Alongside standard repetition, QUBNEXA offers four instant typographical transformations: Bold (Mathematical alphanumeric symbols), Upside Down (flipped Unicode letters), Backwards (grapheme-safe reversed character strings), and Glitch (bounded Zalgo combining diacritics). Style transformations are applied directly before repetition.',
    },
    {
      question: 'Does the text repeater preserve emojis, Hindi, Bengali, and complex Unicode characters?',
      answer:
        'Yes. The engine uses modern ECMAScript Unicode grapheme segmentation and TextEncoder byte calculations. Complex multilingual scripts (such as Hindi, Bengali, Tamil, Telugu, and Arabic) and surrogate-pair emojis (such as 🚀, 🔥, and ❤️) are replicated flawlessly without glyph corruption or broken surrogate pairs.',
    },
    {
      question: 'How does the WhatsApp direct share button work?',
      answer:
        'The WhatsApp button encodes your repeated text into a valid WhatsApp web/mobile URL (https://wa.me/?text=...). To prevent browser URI character limits from breaking the link, the shared message is safely capped at 1,800 characters using grapheme-cluster slicing, with an ellipsis indicating truncation if applicable.',
    },
    {
      question: 'Is my repeated text private, secure, and processed client-side?',
      answer:
        'Absolutely. All string transformations, memory estimations, repetitions, and file downloads execute 100% locally in your client web browser via JavaScript. Zero characters, words, or files are ever sent to remote web servers, external APIs, or cloud databases.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Text Repeater Online — Repeat Text, Words & Emojis | QUBNEXA"
      seoDescription="Repeat text, words, and emojis online with QUBNEXA. Free text multiplier with custom separators, bold styles, and browser-safe repetition up to 1,000,000 times."
      keywords="text repeater, repeat text online, duplicate text, copy text multiple times, text multiplier, repeat words online, whatsapp text repeater, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['text-inverter', 'fancy-font-generator', 'word-counter', 'unit-converter', 'qr-code-generator', 'password-generator']}
    >
      <TextRepeater />
    </ToolPageLayout>
  )
}

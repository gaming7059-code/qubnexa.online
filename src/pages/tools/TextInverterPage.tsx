import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { TextInverter } from '../../tools/TextInverter/TextInverter'
import { ALL_TOOLS } from '../../data/toolsData'

export const TextInverterPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.slug === 'text-inverter')!

  const howToUseSteps = [
    'Enter, paste from clipboard, or upload a .txt file into the Input Text editor.',
    'Select an inversion mode: Upside Down, Backwards, Reverse Each Word, or Reverse Word Order.',
    'Check the live Inverted Output box below along with character and word counts.',
    'Review any unsupported-character notice if flipping Bengali, Hindi, or emoji characters upside down.',
    'Copy the result, download it as a .txt file, select all, reuse it as input, or share directly on WhatsApp.',
  ]

  const formulas = [
    {
      title: 'Grapheme-Safe Unicode Inversion',
      formula: 'Clusters = Intl.Segmenter(text, "grapheme") -> Reverse(Clusters)',
      explanation: 'Segments multi-codepoint emojis and Indic vowel signs cleanly before reversing order so characters stay readable.',
    },
    {
      title: 'Per-Word vs. Word-Order Transformation',
      formula: 'Each Word: map(reverseGraphemes) | Word Order: words.reverse().join(" ")',
      explanation: 'Keeps spacing structure intact when reversing individual words and preserves word spelling when reversing word order.',
    },
  ]

  const examples = [
    {
      title: 'Upside Down Flip',
      description: 'Converting English letters, numbers, and punctuation for 180-degree display.',
      input: 'Hello World!',
      output: '¡plɹoM ollǝH',
    },
    {
      title: 'Reverse Each Word',
      description: 'Flipping letters inside every word while preserving sentence order.',
      input: 'Explore Create Simplify',
      output: 'erolpxE etaerC yfilpmiS',
    },
    {
      title: 'Reverse Word Order (Multilingual)',
      description: 'Reversing word sequence safely across English and Bengali.',
      input: 'স্বাগতম QUBNEXA তে',
      output: 'তে QUBNEXA স্বাগতম',
    },
  ]

  const faqs = [
    {
      question: 'What happens to Bengali, Hindi, or emojis in Upside Down mode?',
      answer: 'Scripts and emojis without upside-down Unicode glyphs are never deleted or corrupted—they remain intact in place, and a clear notice informs you which characters were kept unchanged.',
    },
    {
      question: 'What is the difference between Reverse Each Word and Reverse Word Order?',
      answer: 'Reverse Each Word flips letters inside every word (e.g., "Hello World" becomes "olleH dlroW"), while Reverse Word Order flips word positions without changing spelling ("World Hello").',
    },
    {
      question: 'Are line breaks and emojis preserved when reversing text?',
      answer: 'Yes. Line breaks are normalized cleanly and grapheme segmentation keeps emojis (including family and flag emojis) and combining characters intact.',
    },
    {
      question: 'Does Text Inverter upload my text anywhere?',
      answer: 'Never. All text flipping and file exports run 100% client-side in your browser.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Text Inverter — Flip Text Upside Down & Reverse Words Free | QUBNEXA"
      seoDescription="Flip text upside down, reverse characters backwards, reverse each word, or reverse word order online. Unicode-safe for English, Bengali, Hindi, and emojis."
      keywords="text inverter, upside down text, flip text, reverse text, backwards text, reverse words, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['text-repeater', 'word-counter', 'qr-code-generator', 'password-generator']}
    >
      <TextInverter />
    </ToolPageLayout>
  )
}

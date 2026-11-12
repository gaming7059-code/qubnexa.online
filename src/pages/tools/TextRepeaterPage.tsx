import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { TextRepeater } from '../../tools/TextRepeater/TextRepeater'
import { ALL_TOOLS } from '../../data/toolsData'

export const TextRepeaterPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.slug === 'text-repeater')!

  const howToUseSteps = [
    'Type, paste from clipboard, or upload a .txt file into the Input Text area.',
    'Choose how many times to repeat using the -/+ buttons, numeric field, or quick presets (100 to 100,000 times).',
    'Pick a separator (New Line, Space, Nothing, or Custom) and an optional style transform (Normal, Upside Down, Backwards, Bold, or Glitch).',
    'Inspect the estimated output size and live output preview underneath.',
    'Click Copy Result, Download .txt, Select All, Use Result as Input, or share directly on WhatsApp.',
  ]

  const formulas = [
    {
      title: 'Output Character Estimation Formula',
      formula: 'Estimated Chars = (TransformedLen × Count) + (SeparatorLen × (Count - 1))',
      explanation: 'Pre-computes exact output size before allocating memory so large repeat counts stay safe and responsive.',
    },
    {
      title: 'Single-Buffer Repetition',
      formula: 'Output = (Unit + Separator).repeat(Count - 1) + Unit',
      explanation: 'Uses native contiguous string repetition instead of intermediate arrays to avoid memory spikes up to 100,000+ repeats.',
    },
  ]

  const examples = [
    {
      title: 'New-Line Message List',
      description: 'Repeating a reminder or test line 100 times with each repeat on its own line.',
      input: 'QUBNEXA Launch Day! (Count: 100, Separator: New Line)',
      output: '100 numbered-ready lines generated instantly (~2.1 KB)',
    },
    {
      title: 'Bold Custom-Delimited Tags',
      description: 'Formatting bold keyword tags separated by a vertical bar.',
      input: 'Create (Count: 3, Separator: " | ", Transform: Bold)',
      output: '𝐂𝐫𝐞𝐚𝐭𝐞 | 𝐂𝐫𝐞𝐚𝐭𝐞 | 𝐂𝐫𝐞𝐚𝐭𝐞',
    },
    {
      title: 'Multilingual & Emoji Repetition',
      description: 'Preserving Bengali, Hindi, and emoji clusters accurately across repeats.',
      input: 'বাংলা টেক্সট 🚀 (Count: 5, Separator: Space)',
      output: 'বাংলা টেক্সট 🚀 repeated 5 times safely with full UTF-8 support',
    },
  ]

  const faqs = [
    {
      question: 'Can I safely repeat text 100,000 times without freezing my browser?',
      answer: 'Yes. Text Repeater estimates output character count and byte size before allocation and keeps live DOM previews capped to 120,000 characters while preserving complete output for Copy Result and Download .txt up to the safe browser limit.',
    },
    {
      question: 'What happens if the repeated text exceeds the safety limit?',
      answer: 'If estimated output exceeds 2,000,000 characters or 4 MB, generation pauses automatically and shows an upfront size warning so your tab never crashes.',
    },
    {
      question: 'Is my repeated text sent to any server?',
      answer: 'No. Everything happens locally inside your browser memory with zero network uploads or tracking.',
    },
    {
      question: 'Does it preserve Bengali, Hindi, and emojis?',
      answer: 'Yes. All UTF-8 scripts, combining vowel signs, and emojis work reliably across repetition, separators, and exports.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Text Repeater — Repeat Text 100x to 100,000x Online Free | QUBNEXA"
      seoDescription="Repeat any text, word, emoji, or message up to 100,000+ times instantly. Supports custom separators, bold/upside-down/glitch styles, .txt download, and WhatsApp sharing."
      keywords="text repeater, repeat text online, duplicate text, copy text multiple times, text multiplier, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['text-inverter', 'word-counter', 'qr-code-generator', 'password-generator']}
    >
      <TextRepeater />
    </ToolPageLayout>
  )
}

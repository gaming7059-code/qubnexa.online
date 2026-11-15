import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { FancyFontGenerator } from '../../tools/FancyFontGenerator/FancyFontGenerator'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const FancyFontGeneratorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'fancy-font-generator') || {
    id: 'fancy-font-generator',
    name: 'Fancy Font Generator',
    slug: 'fancy-font-generator',
    route: '/tools/fancy-font-generator',
    path: '/tools/fancy-font-generator',
    description:
      'Generate 35+ aesthetic, stylish, and cool Unicode fancy fonts for Instagram bio, TikTok, Twitter/X, Discord, and WhatsApp with instant 1-click copy.',
    primaryCategory: 'text-writing',
    secondaryCategories: ['utilities'],
    categoryId: 'text-writing',
    categoryIds: ['text-writing', 'utilities'],
    categoryName: 'Text & Writing Tools',
    icon: 'Sparkles',
    status: 'live',
    releaseOrder: 31,
    createdAt: '2026-11-13',
    isPopular: true,
    isNew: true,
    badge: '35+ Styles',
    tags: [
      'fancy font generator',
      'fancy text generator',
      'cool fonts',
      'aesthetic fonts',
      'copy paste fonts',
      'instagram font generator',
      'discord font generator',
      'cursive text generator',
      'gothic font generator',
    ],
    keywords: [
      'fancy font generator',
      'fancy text generator',
      'cool fonts',
      'aesthetic fonts',
      'copy paste fonts',
      'instagram font generator',
      'discord font generator',
      'cursive text generator',
      'gothic font generator',
    ],
  }

  const howToUseSteps = [
    'Type or paste your text into the input box above, or click "Try Sample" for pre-filled creative text.',
    'Browse 35+ live converted Unicode typography styles organized across Modern, Gothic, Bubble, Effects, and Decorative categories.',
    'Use the search box or category filter pills (e.g. Modern & Clean, Classic & Gothic, Enclosed & Bubble) to pinpoint your preferred aesthetic.',
    'Click "Copy" on any specific style card to copy that exact Unicode text to your clipboard, or click "Copy All 35+ Styles" to copy every variation at once.',
    'Paste your stylized text directly into your Instagram bio, TikTok profile, Discord username/server, Twitter/X tweets, or WhatsApp messages.',
  ]

  const formulas = [
    {
      title: 'Unicode Mathematical Alphanumerics Mapping',
      formula: 'Codepoint Target = Base Offset + (Char Code - ASCII Base)',
      explanation:
        'Converts Latin alphanumeric characters to legitimate Unicode symbols in the Plane 1 Supplementary Multilingual Plane (SMP, U+1D400–1D7FF).',
    },
    {
      title: 'Exception Handling for Historic Symbol Codepoints',
      formula: 'Script / Double Struck Exceptions ↦ {ℬ: U+212C, ℰ: U+2130, ℂ: U+2102, ℕ: U+2115, ℤ: U+2124}',
      explanation:
        'Resolves pre-existing Letterlike Symbols (U+2100–214F) to ensure valid, displayable Unicode glyphs without square box glyph fallbacks.',
    },
    {
      title: 'Combining Diacritical Character Layers',
      formula: 'Grapheme Stack = Character + Combining Mark (e.g. U+0336 Strikethrough, U+0332 Underline)',
      explanation:
        'Appends non-spacing combining accents directly to each glyph, creating authentic strikethrough, underline, and decorative line styles.',
    },
    {
      title: 'Surrogate Pair & Emoji Preservation',
      formula: 'Array.from(text) ∨ Intl.Segmenter Grapheme Clustering',
      explanation:
        'Avoids breaking 32-bit surrogate pairs (e.g. emoji like ✨, 🚀, 🔥) and Indic non-Latin scripts during transformations.',
    },
  ]

  const examples = [
    {
      title: 'Instagram Profile Aesthetic Bio',
      description: 'Styling a creator profile name in clean Bold Serif or Script.',
      input: 'Alex Rivera',
      output: '𝐀𝐥𝐞𝐱 𝐑𝐢𝐯𝐞𝐫𝐚 (Bold) or 𝒜𝓁ℯ𝓍 ℛ𝒾𝓋ℯ𝓇𝒶 (Cursive)',
    },
    {
      title: 'Discord Bold Gothic Announcement',
      description: 'Giving high-impact Gothic or Double Struck treatment to a gaming clan or server tag.',
      input: 'LEGENDARY',
      output: '𝕷𝕰𝕲𝕰𝕹𝕯𝕬𝕽𝖄 (Bold Fraktur) or 𝕃𝔼𝔾𝔼ℕ𝔻𝔸ℝ𝕐 (Double Struck)',
    },
    {
      title: 'Aesthetic Bubble & Sparkle Caption',
      description: 'Adding cute bubbles and sparkle wings to video titles or story captions.',
      input: 'Summer Vibes',
      output: 'Ⓢⓤⓜⓜⓔⓡ Ⓥⓘⓑⓔⓢ or ✨ 𝓢𝓾𝓶𝓶𝓮𝓻 𝓥𝓲𝓫𝓮𝓼 ✨',
    },
  ]

  const faqs = [
    {
      question: 'How do fancy fonts work if no new font is installed?',
      answer:
        'Fancy fonts do not require any font files or software installations! They work by substituting standard keyboard letters with specialized Unicode symbols (from the Mathematical Alphanumeric Symbols block, Letterlike Symbols, and Enclosed Alphanumerics) that look like styled typefaces. Because they are authentic Unicode characters, they can be copied and pasted everywhere.',
    },
    {
      question: 'Why do some characters lack fancy font equivalents?',
      answer:
        'The Unicode Consortium has only standardized full character sets for certain mathematical and symbolic alphabets. Certain historical or phonetic alphabets (such as Small Caps or Subscript) lack direct mappings for letters like "q" or "x". QUBNEXA preserves original characters and provides a clear diagnostic note whenever a letter lacks an authentic Unicode equivalent.',
    },
    {
      question: 'Can I use these fancy fonts on Instagram, TikTok, and Twitter?',
      answer:
        'Yes! Because our generator outputs standard Unicode characters rather than proprietary CSS formatting, your copied text will display seamlessly in Instagram bios, TikTok captions, Twitter/X posts, YouTube comments, and WhatsApp chats.',
    },
    {
      question: 'Will everyone be able to see my fancy text?',
      answer:
        'Yes, on virtually all modern smartphones (iOS and Android), tablets, Macs, and Windows PCs with Unicode support. Very old feature phones or legacy systems with outdated font rendering engines might display some high-plane symbols as small fallback boxes (tofu).',
    },
    {
      question: 'Is it safe to copy and paste fancy fonts into usernames?',
      answer:
        'Most social platforms support Unicode characters in profile bios and display names. However, some authentication systems or gaming services strictly require standard ASCII letters for core account usernames or passwords. We recommend using fancy fonts for display names, bios, and captions.',
    },
    {
      question: 'Does this tool store or track what I type?',
      answer:
        'No. QUBNEXA executes 100% locally in your web browser. No text is ever uploaded to any server, database, or analytics platform.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Fancy Font Generator — 35+ Cool & Aesthetic Unicode Copy-Paste Fonts | QUBNEXA"
      seoDescription="Convert text into 35+ stylish Unicode fonts like Cursive, Gothic, Double Struck, and Bubble. Copy and paste stylish fonts directly to Instagram, Discord & X."
      keywords="fancy font generator, aesthetic text generator, cool fonts copy paste, instagram fonts, cursive font generator, small caps generator, bubble text, fraktur font, discord text styles"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['word-counter', 'text-repeater', 'text-inverter', 'qr-code-generator']}
    >
      <FancyFontGenerator />
    </ToolPageLayout>
  )
}

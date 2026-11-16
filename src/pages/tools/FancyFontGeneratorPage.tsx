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
    'Input or Paste Text: Type or paste your text into the input field above, or click "Try Sample" to load creative example text with character and word counters.',
    'Filter by Style or Search: Browse 35+ live Unicode typography cards across 5 categories (Modern & Clean, Classic & Gothic, Enclosed & Bubble, Sub & Super, and Decorative & Effects), or use the instant search box.',
    'Check Character Support: Review real-time diagnostic notes to ensure all your characters, spaces, and numbers have valid Unicode equivalents in the selected style.',
    'Copy Single Style or All: Click "Copy" on any card to copy that specific styled text to your clipboard, or click "Copy All 35+ Styles" to copy every font variation at once.',
    'Paste to Social Platforms: Paste your copied Unicode text directly into your Instagram bio, TikTok profile, Discord username/channel, Twitter/X post, or WhatsApp chat.',
  ]

  const formulas = [
    {
      title: 'Unicode Mathematical Alphanumerics Mapping',
      formula: 'Codepoint Target = Base Offset + (Char Code - ASCII Base)',
      explanation:
        'Converts Latin alphanumeric characters into standardized Unicode symbols residing in Plane 1 Supplementary Multilingual Plane (SMP, U+1D400–1D7FF).',
    },
    {
      title: 'Letterlike Symbol Exception Resolution',
      formula: 'Historic Symbol Exceptions ↦ {ℬ: U+212C, ℰ: U+2130, ℂ: U+2102, ℕ: U+2115, ℤ: U+2124}',
      explanation:
        'Automatically resolves pre-SMP Letterlike Symbols (U+2100–214F) to guarantee valid, displayable Unicode glyphs without fallback boxes or question marks.',
    },
    {
      title: 'Combining Diacritical Character Layers',
      formula: 'Grapheme Stack = Character + Combining Mark (e.g. U+0336 Strikethrough, U+0332 Underline)',
      explanation:
        'Appends non-spacing combining diacritics directly to individual glyphs, rendering authentic strikethrough, underline, and decorative line styles.',
    },
    {
      title: 'Surrogate Pair & Emoji Protection',
      formula: 'Array.from(text) → Preserved 32-bit Surrogates (✨, 🚀, 🔥)',
      explanation:
        'Iterates over text using full code-point boundaries to prevent splitting 32-bit surrogate pairs, keeping emojis, punctuation, and non-Latin symbols intact.',
    },
  ]

  const examples = [
    {
      title: 'Instagram Profile Bio Styling',
      description: 'Styling a creator profile name and bio headline in clean Bold Serif or Cursive Script.',
      input: 'Alex Rivera • Digital Creator',
      output: '𝐀𝐥𝐞𝐱 𝐑𝐢𝐯𝐞𝐫𝐚 • 𝐃𝐢𝐠𝐢𝐭𝐚𝐥 𝐂𝐫𝐞𝐚𝐭𝐨𝐫 or 𝒜𝓁ℯ𝓍 ℛ𝒾𝓋ℯ𝓇𝒶 • 𝒟𝒾ℊ𝒾𝓉𝒶𝓁 𝒞𝓇ℯ𝒶𝓉ℴ𝓇',
    },
    {
      title: 'Discord Server Tag & Clan Announcement',
      description: 'Giving high-impact Gothic Fraktur or Double Struck treatment to a gaming clan, server role, or event channel.',
      input: 'LEGENDARY CHAMPIONS',
      output: '𝕷𝕰𝕲𝕰𝕹𝕯𝕬𝕽𝖄 𝕮𝕳𝕬𝕸𝕻𝕴𝕺𝕹𝕾 or 𝕃𝔼𝔾𝔼ℕ𝔻𝔸ℝ𝕐 ℂℍ𝔸𝕄ℙ𝕀𝕆ℕ𝕊',
    },
    {
      title: 'TikTok & WhatsApp Aesthetic Caption',
      description: 'Adding bubble letters, sparkles, and sweet decorative frames to video captions and status updates.',
      input: 'Weekend Vibes',
      output: 'Ⓦⓔⓔⓚⓔⓝⓓ Ⓥⓘⓑⓔⓢ or ꧁ Weekend Vibes ꧂',
    },
  ]

  const faqs = [
    {
      question: 'How do fancy fonts work if no new font is installed?',
      answer:
        'Fancy fonts do not require downloading or installing any font files (.ttf, .otf) or software. They work by substituting standard keyboard letters with specialized characters from the universal Unicode standard (such as Mathematical Alphanumeric Symbols, Letterlike Symbols, and Enclosed Alphanumerics). Because these are standard Unicode characters recognized by operating systems, they can be copied and pasted across apps without losing their appearance.',
    },
    {
      question: 'Are these fancy fonts compatible with Instagram, TikTok, and Twitter/X?',
      answer:
        'Yes. Virtually all modern social platforms—including Instagram (bios, captions, reels), TikTok (profiles, comments), Twitter/X (tweets, display names), Discord (chat, channel names, nicknames), and WhatsApp (messages, status updates)—support Unicode characters. However, display names and bios offer full support, while account login handles (@username) often require standard alphanumeric characters.',
    },
    {
      question: 'What are the 5 style categories available in this generator?',
      answer:
        'The tool organizes 35 distinct Unicode styles into five categories: "Modern & Clean" (Bold, Italic, Monospace, Small Caps, Fullwidth), "Classic & Gothic" (Cursive, Bold Script, Fraktur, Double Struck), "Enclosed & Bubble" (Circled, Dark Inverted Bubble, Squared, Parenthesized), "Sub & Super" (Superscript, Subscript, Upside Down, Reversed), and "Decorative & Effects" (Strikethrough, Underline, Slash, Wavy Tilde, Sparkle Stars, Wings, Hearts, Spaced).',
    },
    {
      question: 'Why do some styles leave certain letters or numbers unchanged?',
      answer:
        'The Unicode Consortium has standardized complete mathematical alphabets for styles like Bold, Script, and Fraktur, but certain historical or linguistic subsets (such as Small Caps or Subscript) lack direct Unicode symbols for specific letters (like "q" or "x"). When an authentic Unicode character does not exist, the generator preserves the original character rather than introducing broken characters or unsupported placeholders.',
    },
    {
      question: 'How does the tool handle emojis, symbols, and non-English characters?',
      answer:
        'The engine uses code-point iteration (via Array.from) to respect 32-bit surrogate pairs. This ensures that emojis (such as ✨, 🚀, 🔥), punctuation, and non-Latin alphabets pass through safely without being corrupted or broken into surrogate halves.',
    },
    {
      question: 'Can I copy all 35+ generated font variations at once?',
      answer:
        'Yes. Each individual font card features a 1-click "Copy" button for copying a specific style, and the tool also includes a "Copy All 35+ Styles" button that formats and copies every converted variation to your clipboard in a single click.',
    },
    {
      question: 'Is it safe to use fancy Unicode fonts in account usernames and passwords?',
      answer:
        'We recommend using fancy fonts for display names, profile bios, video captions, and chat messages, but not for core login usernames or passwords. Many authentication databases enforce strict ASCII-only rules for usernames, email addresses, and passwords, which can reject or misinterpret high-plane Unicode symbols.',
    },
    {
      question: 'Why do some devices or older phones display boxes or question marks?',
      answer:
        'Over 99% of modern smartphones (iOS, Android), tablets, and computers include broad Unicode font support. However, very old devices or outdated operating systems that lack updated font glyph packages may show fallback replacement symbols (often called "tofu", rectangular boxes, or question marks) for certain high-plane Plane 1 characters.',
    },
    {
      question: 'Does typing text into this tool transmit data to any server?',
      answer:
        'Text transformations are performed locally in your browser. The generator does not need to send your entered text to a backend service to produce the Unicode styles.',
    },
    {
      question: 'How do diacritical effects like strikethrough and underline work in Unicode?',
      answer:
        'Instead of altering the letter glyph itself, effects like strikethrough (U+0336), double strikethrough (U+033F), and underline (U+0332) use combining diacritical marks. The browser graphics renderer places these non-spacing marks directly over or under the preceding character, producing a continuous line across words when copied and pasted anywhere.',
    },
  ]

  const relatedSlugs = [
    'word-counter',
    'text-repeater',
    'text-inverter',
    'image-resizer',
    'qr-code-generator',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Fancy Font Generator — 35+ Cool Aesthetic Fonts | QUBNEXA"
      seoDescription="Generate 35+ aesthetic Unicode fancy fonts for Instagram, TikTok, Discord, and WhatsApp. Copy and paste stylish cursive, gothic, and bubble text on QUBNEXA."
      keywords="fancy font generator, aesthetic text generator, cool fonts copy paste, instagram fonts, cursive font generator, small caps generator, bubble text, fraktur font, discord text styles"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <FancyFontGenerator />
    </ToolPageLayout>
  )
}

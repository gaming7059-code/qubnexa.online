import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { WordCounter } from '../../tools/WordCounter/WordCounter'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const WordCounterPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'word-counter') || {
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    path: '/tools/word-counter',
    description:
      'Count words, characters with and without spaces, sentences, paragraphs, and estimated reading speed live.',
    categoryId: 'text-writing',
    categoryIds: ['text-writing', 'utilities'],
    categoryName: 'Text & Writing',
    icon: 'FileCode',
    isPopular: true,
    isNew: false,
    isFunctional: true,
    keywords: [
      'word counter',
      'character counter',
      'word count tool',
      'reading time',
      'text analyzer',
      'essay length',
    ],
  }

  const howToUseSteps = [
    'Paste or type your article, essay, social media caption, or script directly into the large workspace textarea.',
    'Watch your metrics update in real time with zero lag: total words, characters with spaces, and characters without spaces.',
    'Inspect sentence count and average words per sentence to evaluate readability and pace (aiming for 15–20 words per sentence for general readers).',
    'Monitor structural paragraphs and visual line counts separated by double line breaks or single returns.',
    'Review the estimated reading time badge (calibrated at standard adult silent reading speed of 200 words per minute).',
    'Use "Copy" to instantly grab your verified text to your clipboard, or click "Clear" to reset the workspace.',
    'Click "Load Sample" to explore how multi-paragraph formatting, unicode characters, and statistics render live.',
  ]

  const formulas = [
    {
      title: 'Word Tokenization Algorithm',
      formula: 'Word Count = Text.trim().split(/\\s+/).filter(token => token.length > 0).length',
      explanation:
        'Splits input text across all whitespace clusters (spaces, tabs, and line breaks). Hyphenated compounds without inner spaces are counted as single word tokens, while empty tokens are safely discarded.',
    },
    {
      title: 'Character Metrics (UTF-16 & Whitespace Stripping)',
      formula: 'Total Chars = Text.length | Chars (No Spaces) = Text.replace(/\\s+/g, "").length',
      explanation:
        'Total characters evaluates JavaScript text.length based on UTF-16 code units (where astral plane symbols or complex emojis count as 2 code units rather than a single user-perceived visual character). Characters without spaces strips all whitespace characters to measure pure typographic glyph density.',
    },
    {
      title: 'Multilingual Sentence Segmentation Rule',
      formula: 'Sentence Count = Text.split(/[.!?।]+/).filter(s => s.trim().length > 0).length || (Words > 0 ? 1 : 0)',
      explanation:
        'Detects sentence boundaries terminated by Western punctuation (., !, ?) as well as Indian Devanagari purna viram (।). If non-empty text has no closing punctuation, it cleanly defaults to 1 sentence.',
    },
    {
      title: 'Reading Time Estimation (200 WPM Standard)',
      formula: 'Reading Minutes = Math.max(1, Math.ceil(Word Count / 200))',
      explanation:
        'Calibrated against standard publishing benchmarks where average adult silent reading speed is 200 words per minute. Displays "0 min" when empty and rounds up to whole integer minutes for active prose.',
    },
    {
      title: 'Paragraph & Line Detection Math',
      formula: 'Paragraphs = Text.split(/\\n\\s*\\n/).filter(p => p.trim().length > 0).length || 1 | Lines = Text.split("\\n").length',
      explanation:
        'Detects distinct thematic paragraphs divided by double line breaks (\\n\\s*\\n). Single carriage returns advance the line count without prematurely fragmenting coherent paragraphs.',
    },
    {
      title: 'Sentence Pacing & Density Formula',
      formula: 'Avg Words/Sentence = Round((Word Count / Sentence Count), 1)',
      explanation:
        'Measures syntactic readability by dividing total words by identified sentences. Professional publishing standards recommend 15 to 20 words per sentence for optimal comprehension.',
    },
  ]

  const examples = [
    {
      title: 'Social Media Post & Microblogging (X / Twitter Limit)',
      description:
        'Verifying character constraints and word density for a high-impact product announcement tweet.',
      input:
        'Text: "Boost your daily productivity with QUBNEXA! Explore 25+ free online calculators, converters, and developer tools with zero ads and zero data tracking. Fast, private, and 100% client-side."',
      output:
        '27 Words • 187 Characters (161 without spaces) • 3 Sentences (Avg 9.0 words/sentence) • 1 Paragraph • 1 min read',
    },
    {
      title: 'Two-Paragraph Blog Introduction & SEO Snippet',
      description:
        'Evaluating paragraph structure, sentence pacing, and character density for an editorial article opening.',
      input:
        'Text: "Understanding word count and character limits is vital for content creators, copywriters, and students alike. Precise character counting prevents social media truncation.\\n\\nWhether preparing an academic thesis abstract or refining SEO meta descriptions, tracking exact text metrics ensures clear messaging and optimal readability across all platforms."',
      output:
        '46 Words • 350 Characters (304 without spaces) • 3 Sentences (Avg 15.3 words/sentence) • 2 Paragraphs • 3 Lines • 1 min read',
    },
    {
      title: 'Multilingual & Unicode Text with Devanagari Danda (Hindi)',
      description:
        'Accurately tokenizing non-Latin scripts and native punctuation marks including Indian purna viram (।).',
      input:
        'Text: "क्विकनेक्सा एक निःशुल्क ऑनलाइन टूल प्लेटफॉर्म है। यहाँ आप शब्दों और अक्षरों की सटीक गणना कर सकते हैं! क्या आप अपनी उत्पादकता बढ़ाना चाहते हैं?"',
      output:
        '25 Words • 142 Characters (118 without spaces) • 3 Sentences (Avg 8.3 words/sentence) • 1 Paragraph • 1 min read',
    },
    {
      title: 'Academic Paper Abstract & Editorial Manuscript (Multi-Minute Read)',
      description:
        'Monitoring strict academic abstract limits, multi-paragraph pacing, and multi-minute reading duration.',
      input:
        'Text: 205-word academic research abstract covering cognitive linguistics, reading retention, and client-side privacy across 4 paragraphs (10 sentences).',
      output:
        '205 Words • 1,692 Characters (1,485 without spaces) • 10 Sentences (Avg 20.5 words/sentence) • 4 Paragraphs • 7 Lines • 2 mins read',
    },
  ]

  const faqs = [
    {
      question: 'How does the QUBNEXA Word Counter calculate word count?',
      answer:
        'The counter splits trimmed text across all contiguous whitespace characters (spaces, tabs, and newline line breaks) using the regex /\\s+/. It counts each non-empty string token as a single word. Punctuation adjacent to letters (such as commas or periods) is retained within the token, while hyphenated compounds without spaces (e.g., "state-of-the-art") are counted as a single word token according to standard editorial conventions.',
    },
    {
      question: 'What is the difference between "Characters" and "Characters Without Spaces", and how does UTF-16 affect character counting?',
      answer:
        'Total "Characters" measures JavaScript string length (text.length) based on UTF-16 code units. This means standard Latin letters, numbers, and common punctuation count as 1 code unit, while supplementary Unicode symbols (such as certain emojis, mathematical alphanumeric symbols, or complex script graphemes) comprise surrogate pairs that count as 2 UTF-16 code units rather than one user-perceived visual character. "Characters Without Spaces" removes all whitespace characters (/\\s+/g) before counting. The no-spaces metric is critical for character-based translation billing, SMS segment calculations, and strict editorial submission guidelines.',
    },
    {
      question: 'How is the estimated reading time calculated?',
      answer:
        'Estimated reading duration is calculated based on an average adult silent reading speed of 200 words per minute (WPM), supported by cognitive reading research. The formula calculates Math.ceil(Word Count / 200) with a minimum of 1 minute for any non-empty text, ensuring authors know realistically how long an audience will take to read their article or essay.',
    },
    {
      question: 'How does sentence detection work, and does it support Indian regional scripts?',
      answer:
        'Sentences are segmented using the delimiter expression /[.!?।]+/, which detects periods, exclamation marks, question marks, and the Devanagari purna viram (।) used extensively in Hindi, Sanskrit, Marathi, and Nepali. If text contains words without any terminating punctuation, the counter safely defaults to 1 sentence rather than zero.',
    },
    {
      question: 'How are paragraphs and line counts detected?',
      answer:
        'Paragraphs are identified by splitting text at double line breaks (/\\n\\s*\\n/). This distinguishes true thematic paragraphs from single line wraps. Line count, on the other hand, counts every carriage return (\\n), reflecting the raw visual line count of poems, code blocks, or structured outlines.',
    },
    {
      question: 'Are hyphenated words, URLs, and contractions counted as one word?',
      answer:
        'Yes. Because tokenization splits on whitespace, words connected with hyphens (e.g., "cost-effective"), contractions (e.g., "don\'t", "it\'s"), and web URLs (e.g., "https://qubnexa.online") remain intact as single word units unless you introduce a space between them.',
    },
    {
      question: 'Is my text stored on any remote server, tracked, or saved to a database?',
      answer:
        'Never. QUBNEXA performs 100% client-side text processing. Your text is analyzed purely within your local browser memory using JavaScript. Zero characters, words, or documents are transmitted over the internet, uploaded to third-party cloud APIs, or recorded in any database. Your draft remains entirely confidential and private on your machine.',
    },
    {
      question: 'What are common character and word limits for social media, SEO, and academic writing?',
      answer:
        'Key industry limits include: X (Twitter) posts (280 characters), SEO Meta Titles (55–65 characters), SEO Meta Descriptions (150–160 characters), LinkedIn post previews (~140 characters before "see more"), Instagram captions (2,200 characters), college admission essays (typically 500–650 words), and scientific journal abstracts (typically 150–250 words). QUBNEXA enables real-time tracking against all these benchmarks.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Word Counter Online — Character, Word & Text Analyzer | QUBNEXA"
      seoDescription="Count words, characters with and without spaces, sentences, and paragraphs in real time with QUBNEXA. Free text analyzer with reading time and speaking speed."
      keywords="word counter online, character counter, word count tool, character count online, sentence counter, paragraph counter, reading time calculator, text analyzer, essay word counter, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['text-repeater', 'text-inverter', 'percentage-calculator', 'discount-calculator', 'unit-converter', 'date-time-calculator']}
    >
      <WordCounter />
    </ToolPageLayout>
  )
}

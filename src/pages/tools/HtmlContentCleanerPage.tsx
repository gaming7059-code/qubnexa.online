import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import HtmlContentCleaner from '../../tools/HtmlContentCleaner/HtmlContentCleaner'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const HtmlContentCleanerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'html-content-cleaner') || {
    id: 'html-content-cleaner',
    name: 'Semantic HTML & Rich Text Cleaner',
    slug: 'html-content-cleaner',
    path: '/tools/html-content-cleaner',
    description:
      'Strip bloated Word and Google Docs inline CSS styles, redundant wrapper divs, tracking scripts, and empty tags. Convert rich text into clean semantic CMS HTML or Markdown.',
    categoryId: 'text-writing',
    categoryIds: ['text-writing', 'utilities'],
    categoryName: 'Developer Tools',
    icon: 'Code2',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'html content cleaner',
      'clean word html',
      'strip inline styles html',
      'html to clean markdown',
      'remove classes from html',
      'wordpress html cleaner',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Paste Messy HTML or Rich Text: Paste HTML exported from Microsoft Word, Google Docs, email newsletters, or web scrapers into the input editor.',
    'Configure Sanitization Rules: Toggle checkboxes to strip inline style="..." tags, purge class/id attributes, remove &lt;script&gt; and &lt;style&gt; blocks, unwrap non-semantic &lt;div&gt; containers, and normalize tags (&lt;b&gt; to &lt;strong&gt;).',
    'Inspect Real-Time Savings: Watch the live byte size and payload reduction percentage update instantly as unwanted bloat is eliminated.',
    'Select Preferred Output View: Choose "Clean HTML" (optimized for WordPress, Webflow, Ghost, or Substack), "Markdown (.md)" (ideal for documentation and GitHub), or "Visual Preview".',
    'Copy or Download: One-click copy the sanitized code or download a clean .html or .md file.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'HTML Bloat Reduction Percentage',
      formula: 'Reduction % = [(Original Bytes - Cleaned Bytes) / Original Bytes] × 100',
      explanation:
        'Quantifies DOM payload and bandwidth savings achieved by purging inline fonts, redundant classes, and empty tag wrappers.',
    },
    {
      title: 'Semantic Normalization Standard',
      formula: '<b> → <strong> | <i> → <em> | <div class="p"> → <p>',
      explanation:
        'Translates legacy visual styling tags into semantic HTML5 elements prioritized by search engine web crawlers and screen readers.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Pasting Microsoft Word Article into WordPress',
      description: 'A blog editor pastes an article drafted in Word, which generated 500 lines of proprietary MsoNormal inline CSS styles.',
      input: 'Cluttered 18KB Word HTML snippet with mso-font and inline font-family styles.',
      output: 'Produces a pristine 3KB semantic HTML document with clean headings, paragraphs, and bullet points ready to publish.',
    },
    {
      title: 'Converting Web Article to Markdown for Documentation',
      description: 'A developer scrapes a tutorial to store in an internal Obsidian knowledge base.',
      input: 'Messy HTML page containing tracking scripts and ads.',
      output: 'Instantly exports clean Markdown with formatted links, code blocks, and lists.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Why does copying text from Word or Google Docs bloat HTML?',
      answer:
        'Desktop word processors embed hundreds of proprietary styling rules (e.g., MsoNormal, line heights, font faces, and span tags) into the clipboard HTML to preserve visual formatting across print layouts, which ruins web design system typography.',
    },
    {
      question: 'Does this tool remove tracking scripts and malicious event handlers?',
      answer:
        'Yes. With script and tracking removal enabled, all &lt;script&gt;, &lt;iframe&gt;, onclick, and data-* attributes are completely eradicated.',
    },
    {
      question: 'Is my text or private article uploaded to external servers?',
      answer:
        'No. 100% of HTML cleaning, regex processing, and markdown conversion runs locally in your browser. No content is stored or transmitted.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Semantic HTML & Rich Text Cleaner | QUBNEXA"
      seoDescription="Free online HTML content cleaner. Strip bloated inline styles, classes, tracking scripts, and empty tags. Convert Word and Google Docs HTML to clean Markdown."
      keywords="html content cleaner, clean word html, strip inline styles html, html to clean markdown, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['subtitle-cleaner', 'ai-prompt-injection-scanner', 'webhook-to-sheets-planner', 'bulk-utm-builder']}
    >
      <HtmlContentCleaner />
    </ToolPageLayout>
  )
}

export default HtmlContentCleanerPage

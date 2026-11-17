import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { PdfTextCleaner } from '../../tools/PdfTextCleaner/PdfTextCleaner'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PdfTextCleanerPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'pdf-text-cleaner') || {
    id: 'pdf-text-cleaner',
    name: 'PDF Text Cleaner',
    slug: 'pdf-text-cleaner',
    route: '/tools/pdf-text-cleaner',
    path: '/tools/pdf-text-cleaner',
    description:
      'Extract readable text from PDF files and clean up unwanted spaces, broken line wraps, hyphenated words, page numbers, and smart quotes. 100% private in browser.',
    primaryCategory: 'pdf-documents',
    secondaryCategories: ['text-writing'],
    categoryId: 'pdf-documents',
    categoryIds: ['pdf-documents', 'text-writing'],
    categoryName: 'PDF & Document Tools',
    icon: 'FileText',
    status: 'live',
    releaseOrder: 34,
    createdAt: '2026-11-13',
    isPopular: true,
    isNew: true,
    badge: 'Text Extractor',
    tags: [
      'pdf text cleaner',
      'extract text from pdf',
      'pdf to text',
      'clean pdf text',
      'remove extra spaces pdf',
      'unbreak lines pdf',
      'pdf text formatting',
      'normalize pdf text',
    ],
    keywords: [
      'pdf text cleaner',
      'extract text from pdf',
      'pdf to text',
      'clean pdf text',
      'remove extra spaces pdf',
      'unbreak lines pdf',
      'pdf text formatting',
      'normalize pdf text',
    ],
  }

  const howToUseSteps = [
    'Open or Paste Document: Drag and drop a digital PDF (up to 50 MB) into the dropzone, click "Choose PDF File" to browse your device, paste raw text directly into the left editor, or click "Load Sample Text" for instant evaluation.',
    'Client-Side Text Extraction: The browser parses document font glyphs and operator streams page-by-page using a local PDF.js Web Worker. If a scanned or image-only document is detected, an informative notice clarifies that OCR is required.',
    'Select Cleaning Preset or Custom Mode: Choose "Basic Cleanup" for rapid whitespace trimming, "Advanced Cleanup" for full paragraph unbreaking and hyphen repair, or "Custom Configuration" to tailor individual filters.',
    'Configure Transformation Filters: Toggle 8 dedicated cleaning rules including space normalization, blank line removal, hyphenated word joining, paragraph unbreaking, smart quote/dash conversion, page number stripping, control character removal, and line edge trimming.',
    'Inspect Metrics & Reductions: Compare the side-by-side editors and review the real-time scorecard displaying character reduction percentage, line cleanliness, cohesive paragraph counts, and preserved word metrics.',
    'Export Clean Text: Click "Copy" to instantly copy the cleaned text to your system clipboard, or click "Save .TXT" to download a clean plain text file directly to your device.',
  ]

  const formulas = [
    {
      title: 'Font Glyph Operator Stream Extraction',
      formula: 'PDFDocumentProxy → getPage(n) → getTextContent() → items.map(item => item.str)',
      explanation:
        'Uses browser-native Web Workers via pdfjs-dist to parse character positioning, TrueType, OpenType, and Type 1 font mappings directly from PDF stream buffers without rasterizing pixels.',
    },
    {
      title: 'Hyphenated Word Rejoining Regex Engine',
      formula: '([A-Za-z]+)[-—–]\\s*\\r?\\n\\s*([A-Za-z]+) → $1$2',
      explanation:
        'Detects words artificially split across column boundaries and line margins by hyphens, em dashes, or en dashes, and merges them back into single contiguous vocabulary tokens.',
    },
    {
      title: 'Soft-Wrap Paragraph Reflow Heuristic',
      formula: 'Paragraphs = Text.split(/\\n\\s*\\n/) → Paragraph.lines.map(trim).join(" ")',
      explanation:
        'Distinguishes between intentional double-newline paragraph demarcations and arbitrary single-newline printer column wraps, joining fragmented lines while preserving structural paragraph breaks.',
    },
    {
      title: 'Smart Typography & Control Character Normalization',
      formula: 'Unicode(Smart Quotes \\u201C..\\u201F, Dashes \\u2013..\\u2015, Controls \\x00..\\x1F) → ASCII(", \', -, \\n, \\t)',
      explanation:
        'Standardizes curly quotation marks, en/em dashes, and horizontal bars into standard ASCII equivalents, and purges unprintable binary control bytes (ASCII 0–8, 11–12, 14–31, 127).',
    },
    {
      title: 'Standalone Page Marker Filter',
      formula: 'Filter: /(^page\\s+\\d+(\\s+of\\s+\\d+)?$|^[-—–\\s]*\\d+[-—–\\s]*$|^[([]\\s*\\d+\\s*[)\\]]$|^\\d{1,4}$)/i',
      explanation:
        'Detects and filters out isolated header and footer page numbering artifacts (such as "Page 1 of 5", "- 2 -", "[3]", or standalone numbers) before paragraph reconstruction.',
    },
    {
      title: 'In-Memory Client-Side Sandbox Guarantee',
      formula: 'Local ArrayBuffer → Web Worker Memory Pipeline → 0 Document Data Uploads',
      explanation:
        'While standard static application assets (HTML/CSS/JS chunks) and the PDF.js Web Worker script are loaded from the hosting server, all PDF parsing, text extraction, cleaning transformations, and .txt file generation occur strictly in local client memory. Document contents and extracted text are never sent to external servers.',
    },
  ]

  const examples = [
    {
      title: 'Academic Journal & Research Paper Extraction',
      description:
        'Cleans double-column PDF copy-paste text plagued by hyphenated word breaks, page numbering, and line wraps.',
      input:
        'The convo-\nlutional neural net-\nwork achieved 98.4% accu-\nracy across benchmarks.\n\nPage 14 of 48',
      output: 'The convolutional neural network achieved 98.4% accuracy across benchmarks.',
    },
    {
      title: 'Legal Contract & Agreement Clause Formatting',
      description:
        'Unbreaks jagged sentence fragments into smooth, readable contractual clauses while preserving paragraph demarcation.',
      input:
        'Whereas the Licensee\nhereby agrees to terms\nset forth in Section 4.\n\nFurthermore, ‘Licensor’ reserves\nall proprietary rights.',
      output:
        'Whereas the Licensee hereby agrees to terms set forth in Section 4.\n\nFurthermore, \'Licensor\' reserves all proprietary rights.',
    },
    {
      title: 'Corporate Financial Report & Spreadsheet Normalization',
      description:
        'Normalizes erratic spacing, removes trailing whitespace, and converts decorative typography into clean plain text for data pipelines.',
      input:
        'QUBNEXA’s   FY2026   gross   revenue   increased   by   24.5%—beating market guidance.',
      output:
        'QUBNEXA\'s FY2026 gross revenue increased by 24.5%-beating market guidance.',
    },
    {
      title: 'E-Book & Manuscript Preparation for Text-to-Speech',
      description:
        'Strips standalone page numbers and unprintable control characters to prepare digital text for speech synthesis or AI ingestion.',
      input:
        '- 14 -\n\nThe journey continued through\nthe ancient forest.\x00\x07',
      output: 'The journey continued through the ancient forest.',
    },
  ]

  const faqs = [
    {
      question: 'Does this tool support scanned or image-only PDF documents?',
      answer:
        'No. PDF Text Cleaner is engineered specifically for digital text-based PDFs (documents generated from Word, Google Docs, LaTeX, code editors, or digital PDF exports). Scanned documents or smartphone photos contain raster pixel images rather than selectable font glyphs; extracting text from them requires an Optical Character Recognition (OCR) engine.',
    },
    {
      question: 'Are my documents or extracted text uploaded to any server?',
      answer:
        'No. All extraction, parsing, cleaning, and export happen locally on your computer or mobile device using browser JavaScript and a local Web Worker. While standard static application assets and the PDF.js worker script are loaded from the hosting server, your PDF file, extracted text, and document contents are never transmitted to any backend service or stored on servers.',
    },
    {
      question: 'What is the difference between Basic, Advanced, and Custom cleanup?',
      answer:
        'Basic Cleanup is non-destructive: it normalizes multiple spaces, trims line ends, and removes excessive blank lines. Advanced Cleanup adds intelligent structural repairs: it unbreaks line wraps into continuous paragraphs, rejoins hyphenated split words, removes standalone page numbers, normalizes smart quotes and dashes, and strips unprintable control characters. Custom mode lets you toggle any of the 8 individual cleaning options independently.',
    },
    {
      question: 'How does the tool distinguish between line wraps and new paragraphs?',
      answer:
        'Standard PDFs insert a hard line break at the end of every visual line on the page. The cleaner analyzes newline sequences: single line breaks are identified as soft wraps within a sentence and joined with a single space, while double line breaks (separated by blank lines) are recognized as intentional paragraph boundaries and preserved.',
    },
    {
      question: 'What PDF file formats and sizes are supported?',
      answer:
        'The tool accepts standard digital PDF documents (.pdf, application/pdf) up to 50 MB in size. You can also paste raw text copied from any source directly into the editor for instant sanitization.',
    },
    {
      question: 'Can I clean password-protected or encrypted PDFs?',
      answer:
        'If a PDF is encrypted or protected with an open password, the browser cannot read its text stream directly. You must first unlock or decrypt the document (for example, using QUBNEXA\'s PDF Editor if you have the password) before importing it into the Text Cleaner.',
    },
    {
      question: 'Does cleaning the text modify my original PDF file?',
      answer:
        'No. Your original PDF file remains completely untouched in your local file system. The tool reads your file in read-only mode, extracts the text into the editor workbench, and lets you export the sanitized output as a new .txt file or copy it to your clipboard.',
    },
    {
      question: 'Can I paste text directly without uploading a PDF file?',
      answer:
        'Yes. You do not need a PDF file to use the cleaner. You can paste any messy text (such as text copied from websites, e-books, email clients, or spreadsheets) directly into the left "Raw Extracted Text" editor, and the cleaner will instantly process it in real time.',
    },
    {
      question: 'Will cleaning affect code snippets or bulleted lists in my text?',
      answer:
        'If your document contains formatted code, tables, or ASCII art where specific indentation and single line breaks are essential, use "Basic Cleanup" or "Custom Configuration" with "Unbreak Paragraphs" turned off. This preserves the original line-by-line structure while still trimming trailing spaces and eliminating unwanted control characters.',
    },
  ]

  const relatedSlugs = [
    'pdf-editor',
    'jpg-to-pdf',
    'word-counter',
    'text-to-speech',
    'text-repeater',
    'fancy-font-generator',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="PDF Text Cleaner — Extract & Clean PDF Text Online | QUBNEXA"
      seoDescription="Extract, clean, and format text from PDF files online. Remove broken line wraps, rejoin hyphenated words, strip page numbers, and fix spaces. 100% private."
      keywords="pdf text cleaner, extract text from pdf, pdf to text, clean pdf text, remove extra spaces pdf, unbreak lines pdf, pdf text formatting, normalize pdf text"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <PdfTextCleaner />
    </ToolPageLayout>
  )
}

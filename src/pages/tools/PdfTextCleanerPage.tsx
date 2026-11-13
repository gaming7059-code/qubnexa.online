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
    'Upload your digital text-based PDF via drag-and-drop or the file picker, or click "Load Sample Text" to test the cleaner immediately.',
    'The browser automatically parses each PDF page locally using Web Workers and displays the raw extracted text in the left editor.',
    'Select your desired cleaning mode: Basic Cleanup, Advanced Cleanup, or customize individual transformations.',
    'Inspect the cleaned text in real time on the right editor alongside the Character Reduction and Word Count scorecard.',
    'Click "Copy" to copy the clean text to your clipboard, or click "Save .TXT" to download a clean text file.',
  ]

  const formulas = [
    {
      title: 'Digital PDF Operator Stream Parsing',
      formula: 'Document -> Pages[1..N] -> Page.getTextContent() -> Text Items',
      explanation:
        'Uses browser-native Web Workers to decode Adobe Type 1, TrueType, and OpenType font mappings directly from PDF stream buffers without rendering raster pixels.',
    },
    {
      title: 'Hyphenated Line Join Heuristic',
      formula: 'RegExp: ([A-Za-z]+)[-—–]\\s*\\r?\\n\\s*([A-Za-z]+) -> $1$2',
      explanation:
        'Detects words artificially split across column boundaries and line margins and merges them back into single contiguous vocabulary tokens.',
    },
    {
      title: 'Soft-Wrap Paragraph Reconstruction',
      formula: 'Paragraphs = Text.split(\\n\\n), Paragraph.lines.join(" ")',
      explanation:
        'Distinguishes between intentional double-newline paragraph demarcations and arbitrary single-newline printer wrapping, eliminating jagged line breaks.',
    },
    {
      title: 'In-Memory Zero-Upload Sandbox',
      formula: 'Browser RAM (Blob/ArrayBuffer) -> Text Stream (0 HTTP Calls)',
      explanation:
        'Your documents never leave your device. All text parsing, line manipulation, and file downloads are executed 100% locally in your client environment.',
    },
  ]

  const examples = [
    {
      title: 'Academic Journal & Research Paper',
      description: 'Cleans double-column PDF copy-paste text with hyphenated line splits.',
      input: 'The deep learn-\ning model dem-\nonstrated high accuracy.\n\nPage 14 of 48',
      output: 'The deep learning model demonstrated high accuracy.',
    },
    {
      title: 'Corporate Financial Report Normalization',
      description: 'Removes erratic spacing and normalizes smart typography characters.',
      input: '“QUBNEXA”    quarterly   revenue   increased   by   18%—exceeding targets.',
      output: '"QUBNEXA" quarterly revenue increased by 18%-exceeding targets.',
    },
    {
      title: 'Legal Brief Line Break Repair',
      description: 'Rejoins jagged hard-wrapped sentences into smooth cohesive paragraphs.',
      input: 'Whereas the parties\nhereto have entered\ninto this contract.',
      output: 'Whereas the parties hereto have entered into this contract.',
    },
  ]

  const faqs = [
    {
      question: 'Does this tool support scanned or image-only PDF documents?',
      answer:
        'No. PDF Text Cleaner is designed for digital text-based PDFs (documents created from Word, Google Docs, LaTeX, or digital export). Scanned documents or photographed book pages contain raster image pixels rather than selectable font glyphs and require an Optical Character Recognition (OCR) engine.',
    },
    {
      question: 'Is my confidential or proprietary PDF uploaded to any server?',
      answer:
        'No. Processing happens entirely within your web browser using client-side JavaScript. Your PDF file is read as an in-memory ArrayBuffer on your machine and is never transmitted over the internet or logged.',
    },
    {
      question: 'What is the difference between Basic and Advanced cleanup?',
      answer:
        'Basic Cleanup trims edge whitespace, normalizes multiple spaces, and removes redundant blank lines. Advanced Cleanup adds line unbreaking (reflowing wrapped sentences into paragraphs), joins hyphenated split words, removes page numbers, and normalizes smart quotes and dashes.',
    },
    {
      question: 'How does the tool distinguish between a soft line break and a new paragraph?',
      answer:
        'The cleaner treats consecutive lines separated by a single newline as a continuous paragraph and joins them with a space. True paragraph breaks (separated by two or more newlines) are strictly preserved.',
    },
    {
      question: 'What is the maximum PDF file size supported?',
      answer:
        'You can upload text-based PDFs up to 50 MB. Because PDF text streams are lightweight, documents with hundreds of pages process in just a few seconds.',
    },
    {
      question: 'Does cleaning the text alter or damage my original PDF file?',
      answer:
        'No. Your original PDF document remains completely untouched on your device. The cleaner extracts the raw text in read-only mode and outputs clean plain text for you to copy or save as a separate .txt file.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="PDF Text Cleaner — Extract, Clean & Normalize PDF Text Online | QUBNEXA"
      seoDescription="Extract readable text from PDF files and clean up unwanted spaces, broken line wraps, hyphenated words, page numbers, and smart quotes. 100% private in browser."
      keywords="pdf text cleaner, extract text from pdf, pdf to text, clean pdf text, remove extra spaces pdf, unbreak lines pdf, pdf text formatting, normalize pdf text"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['pdf-editor', 'jpg-to-pdf', 'word-counter', 'text-repeater']}
    >
      <PdfTextCleaner />
    </ToolPageLayout>
  )
}

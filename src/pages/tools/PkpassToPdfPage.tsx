import React from 'react'
import { ToolPageLayout, type FAQItem, type FormulaItem, type ExampleItem } from '../../components/layout/ToolPageLayout'
import PkpassToPdf from '../../tools/PkpassToPdf/PkpassToPdf'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PkpassToPdfPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'pkpass-to-pdf') || {
    id: 'pkpass-to-pdf',
    name: 'Apple Wallet .PKPASS to PDF & Printable Converter',
    slug: 'pkpass-to-pdf',
    path: '/tools/pkpass-to-pdf',
    description:
      'Open and view Apple Wallet .pkpass files on Windows, Android, and PC. Extract boarding passes, event tickets, barcodes, and generate clean printable PDF documents.',
    categoryId: 'pdf-documents',
    categoryIds: ['pdf-documents', 'utilities'],
    categoryName: 'General Utilities',
    icon: 'Ticket',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    isFunctional: true,
    keywords: [
      'pkpass to pdf',
      'open pkpass on windows',
      'pkpass viewer online',
      'apple wallet to pdf converter',
      'print pkpass boarding pass',
      'pkpass barcode extractor',
      'qubnexa',
    ],
  }

  const howToUseSteps = [
    'Upload .pkpass File: Drag & drop any Apple Wallet .pkpass archive directly into the browser, or test immediately using our preloaded Flight, Concert, or VIP Coupon presets.',
    'Inspect Extracted Pass Details: The tool unpacks the internal pass.json metadata, presenting flight gates, seat assignments, passenger names, serial numbers, and colors in an Apple Wallet style card preview.',
    'View Decoded Barcode: The embedded barcode payload is converted into a high-contrast scannable QR code ready for gate agent check-ins.',
    'Print Physical Paper Pass: Click "Print Paper Pass" to output a clean physical copy formatted for standard desktop printers.',
    'Download Standalone PDF: Click "Download PDF" to generate a vector PDF document using client-side PDF generation, saved directly to your device.',
  ]

  const formulas: FormulaItem[] = [
    {
      title: 'Apple PassKit Archive Architecture',
      formula: '.pkpass = ZIP Archive [pass.json + icon.png + logo.png + manifest.json + signature]',
      explanation:
        'Standard iOS wallet package format. Encapsulates structured JSON metadata specifying layout fields (boardingPass, eventTicket, coupon) alongside cryptographic certificates.',
    },
    {
      title: 'W3C Client-Side Decompression Protocol',
      formula: 'DecompressionStream("deflate-raw") → Response.text() → JSON.parse()',
      explanation:
        'Leverages standard browser streams to decompress zip stream chunks in memory without transmitting files over external networks.',
    },
  ]

  const examples: ExampleItem[] = [
    {
      title: 'Airline Boarding Pass on Windows Laptop',
      description: 'A traveler receives a flight check-in email containing an airline .pkpass attachment on their Windows PC.',
      input: 'Airline .pkpass file uploaded.',
      output: 'Instantly renders Flight SK 408 (JFK → LHR, Gate B24, Seat 14A), with a scannable QR code and downloadable A4 PDF for airport customs.',
    },
    {
      title: 'Live Arena Concert Ticket for Android User',
      description: 'An Android user purchases concert tickets sent in Apple Wallet format.',
      input: 'Concert .pkpass pass.',
      output: 'Extracts Entry Gate, Section A2, Row 12, Seat 08, and displays high-resolution barcode ready for mobile entry scanning.',
    },
  ]

  const faqs: FAQItem[] = [
    {
      question: 'Why can’t Windows or Android open .pkpass files natively?',
      answer:
        'PKPASS is a proprietary Apple Wallet package format designed for iOS and watchOS. Windows and Android lack built-in PassKit renderers, which is why this tool extracts and translates the underlying data into universal PDFs and web views.',
    },
    {
      question: 'Will airport scanners accept a printed PKPASS PDF?',
      answer:
        'Yes! The PDF recreates the exact barcode data (QR, Aztec, or PDF417) embedded by the airline or event organizer. Standard laser and optical gate scanners read the printed barcode identically to mobile screen displays.',
    },
    {
      question: 'Is my personal ticket or passport information uploaded anywhere?',
      answer:
        'No. 100% of zip extraction, JSON parsing, barcode generation, and PDF assembly runs inside your local browser. Zero flight details or personal data are ever sent to remote servers.',
    },
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Apple Wallet .PKPASS to PDF & Printable Converter | QUBNEXA"
      seoDescription="Free online PKPASS to PDF converter and Apple Wallet pass viewer. Open .pkpass files on Windows and PC, extract barcodes, and download printable PDFs."
      keywords="pkpass to pdf, open pkpass on windows, pkpass viewer, apple wallet to pdf, print boarding pass pkpass, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={['google-review-link-generator', 'image-background-extender', 'html-content-cleaner', 'bulk-utm-builder']}
    >
      <PkpassToPdf />
    </ToolPageLayout>
  )
}

export default PkpassToPdfPage

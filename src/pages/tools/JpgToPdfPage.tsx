import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { JpgToPdf } from '../../tools/JpgToPdf/JpgToPdf'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const JpgToPdfPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'jpg-to-pdf') || {
    id: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    slug: 'jpg-to-pdf',
    route: '/tools/jpg-to-pdf',
    path: '/tools/jpg-to-pdf',
    description:
      'Convert multiple JPG, JPEG, PNG, and WebP images into a clean, professional PDF document with custom page sizes, orientations, and margins.',
    primaryCategory: 'pdf-documents',
    secondaryCategories: ['image-tools', 'utilities'],
    categoryId: 'pdf-documents',
    categoryIds: ['pdf-documents', 'pdf-tools'],
    categoryName: 'PDF & Documents',
    icon: 'FileImage',
    status: 'live',
    releaseOrder: 15,
    createdAt: '2026-02-15',
    isPopular: true,
    isFunctional: true,
    badge: 'Converter',
    tags: ['jpg to pdf', 'images to pdf', 'convert jpg to pdf', 'png to pdf', 'jpeg to pdf', 'combine photos into pdf', 'pdf converter online'],
    keywords: ['jpg to pdf', 'images to pdf', 'convert jpg to pdf', 'png to pdf', 'jpeg to pdf', 'combine photos into pdf', 'pdf converter online'],
  }

  const howToUseSteps = [
    'Upload your images: Drag and drop your JPG, JPEG, PNG, or WebP files directly into the upload area, or click "Select Images" to open your device file picker and choose one or multiple photos simultaneously.',
    'Inspect preview thumbnails: Review the loaded image gallery to check thumbnails, file names, file sizes in KB or MB, and original pixel resolutions (width × height).',
    'Rearrange page order: Drag and drop cards into your preferred sequence, or click the Up (↑) and Down (↓) arrow buttons on each card to move an image earlier or later in the PDF sequence.',
    'Select standard page format: Choose your preferred PDF page size from international paper standards: A4 (210 × 297 mm), A3 (297 × 420 mm), US Letter (8.5 × 11 in), or "Fit Image (Original Size)" to match exact photo dimensions.',
    'Configure orientation & margins: Select "Auto" orientation to dynamically match each image’s landscape/portrait aspect ratio, or lock all pages to Portrait or Landscape. Select margin padding: None (0 pt full bleed), Small (20 pt), Medium (36 pt / 0.5 in default), or Large (54 pt / 0.75 in).',
    'Compile PDF document: Click "Convert to PDF" to initiate rapid client-side compilation via pdf-lib. The real-time progress bar monitors per-image rendering and stream generation.',
    'Download finished PDF: Verify the calculated output document size and click "Download PDF" to save your compiled document immediately with zero server transmission.',
  ]

  const formulas = [
    {
      title: 'Proportional Aspect Ratio Scaling',
      formula: 'Scale = min(PrintableWidth / ImageWidth, PrintableHeight / ImageHeight)',
      explanation:
        'Calculates the maximum uniform scale factor to fit the image entirely within the printable page area while strictly preserving original aspect ratio without distortion, stretching, or cropping.',
    },
    {
      title: 'Centering Offset Coordinate Geometry',
      formula: 'X = Margin + (PrintableWidth − RenderedWidth) / 2, Y = Margin + (PrintableHeight − RenderedHeight) / 2',
      explanation:
        'Calculates exact PostScript coordinate offsets from the page origin (bottom-left in PDF specifications) to mathematically center the photograph within printable margins.',
    },
    {
      title: 'ISO 216 & ANSI Page Dimensions (72 points = 1 inch)',
      formula: 'A4 = 595.28 × 841.89 pt, A3 = 841.89 × 1190.55 pt, US Letter = 612 × 792 pt',
      explanation:
        'Converts physical paper millimeter specifications into native PDF vector points for crisp, high-resolution printing and standard document compliance worldwide.',
    },
    {
      title: 'Dynamic Per-Page Auto-Orientation Heuristic',
      formula: 'Orientation = ImageWidth > ImageHeight ? Landscape : Portrait',
      explanation:
        'When Auto orientation is active, the engine checks each image independently: wide landscape photos receive landscape pages, while tall portrait documents receive portrait pages, eliminating unnecessary letterboxing.',
    },
    {
      title: 'Native JPEG Stream Embedding Architecture',
      formula: 'PDF Stream = pdfDoc.embedJpg(fileBytes) [Direct Binary Pass-Through]',
      explanation:
        'For JPG and JPEG files, the original compressed DCT byte stream is embedded directly into the PDF structure using embedJpg() without an additional lossy JPEG re-compression cycle. While direct embedding avoids secondary re-encoding loss, overall visual output still reflects the original file resolution and quality.',
    },
    {
      title: 'Zero-Server In-Memory Privacy Sandbox',
      formula: 'Network I/O: 0 Requests | Processing: Browser RAM via JavaScript & pdf-lib',
      explanation:
        'All image reading, canvas conversions, PDF compilation, and blob serialization happen 100% inside your local browser memory using JavaScript and pdf-lib. No photos are ever uploaded to any cloud server or third-party service.',
    },
  ]

  const examples = [
    {
      title: 'Government & Official Document Dossier (A4 Standard)',
      description:
        'Combine scanned identity documents (passport, ID card front/back, address proof) into a single standard A4 PDF for official online portal submission.',
      input:
        '3 JPEG files (id_front.jpg 1920×1080, id_back.jpg 1920×1080, address.jpg 1200×1600) with A4 Portrait and Medium margins (36 pt)',
      output:
        'A single 3-page A4 PDF document (~1.4 MB) with uniform margins, centered content, and standard paper dimensions ready for official portal upload.',
    },
    {
      title: 'Full-Bleed Photography Portfolio Lookbook (Fit Image)',
      description:
        'Bundle high-resolution photography showcase images into a borderless digital catalog without white margins or letterboxing.',
      input:
        '5 high-resolution photography files (JPEG, 3840×2160) with "Fit Image (Original Size)" and "None" margin',
      output:
        'High-definition borderless 5-page PDF preserving native 4K photo pixel dimensions without applying secondary JPEG re-compression.',
    },
    {
      title: 'Mixed Orientation Travel & Expense Report (Auto Orientation)',
      description:
        'Compile smartphone photos of hotel bills, taxi receipts, and flight boarding passes with mixed orientations into one organized PDF report.',
      input:
        '6 photos mixing portrait grocery receipts (1080×1920) and landscape boarding passes (1920×1080) with "US Letter" and "Auto" orientation',
      output:
        'A 6-page US Letter PDF where portrait receipts get portrait pages and boarding passes get landscape pages automatically.',
    },
    {
      title: 'Architectural Plan & Drawing Archival (A3 Poster)',
      description:
        'Consolidate large engineering blueprints and site sketches into a high-format document ready for blueprint plotters.',
      input:
        '2 oversized technical drawings (PNG, 4960×7016) with "A3" page size and "Medium" margin',
      output:
        'A 2-page A3 architectural PDF (841.89 × 1190.55 pt) scaled proportionally with clean framing margins for digital archiving.',
    },
  ]

  const faqs = [
    {
      question: 'Are my private photos uploaded to any external server?',
      answer:
        'No. QUBNEXA processes everything locally inside your web browser using client-side JavaScript and pdf-lib. Your photographs never leave your phone or computer, guaranteeing 100% confidentiality for sensitive legal, financial, or personal records.',
    },
    {
      question: 'Which image formats are supported by the converter?',
      answer:
        'The converter supports JPG, JPEG, PNG, and WebP image formats. You can upload and mix different formats within the same PDF compilation.',
    },
    {
      question: 'Will my images lose quality during conversion?',
      answer:
        'The converter embeds JPG and JPEG files directly into the PDF document stream using pdfDoc.embedJpg() without applying an additional lossy JPEG re-compression or downsampling step. This avoids generational quality loss from re-encoding, though output fidelity reflects your source image quality and chosen page dimensions.',
    },
    {
      question: 'Can I change the order of pages before downloading?',
      answer:
        'Yes! You can reorder pages by dragging and dropping the cards or clicking the Up (↑) and Down (↓) arrow buttons on each thumbnail card to reposition images earlier or later in the document.',
    },
    {
      question: 'What are the file size and page count limits?',
      answer:
        'There is no arbitrary software limit on file size or image count enforced by the tool. Practical processing capacity depends on your device hardware, operating system, and available browser memory (RAM). Uploading very large batches of ultra-high-resolution images may strain browser memory on lower-powered devices.',
    },
    {
      question: 'How does the "Auto" orientation setting work?',
      answer:
        'When "Auto" is selected, the converter evaluates each image’s native width and height individually. If an image is wider than it is tall, its corresponding PDF page is created in Landscape orientation; otherwise, it is created in Portrait orientation.',
    },
    {
      question: 'What is the difference between A4, A3, US Letter, and Fit Image page sizes?',
      answer:
        'A4 (210 × 297 mm) is the international standard used worldwide for official documents. A3 (297 × 420 mm) is twice the size of A4, ideal for drawings and posters. US Letter (8.5 × 11 in) is standard in North America. "Fit Image (Original Size)" sets each page’s dimensions to match the exact pixel dimensions of the image plus margins, creating custom-sized pages without white letterboxing.',
    },
    {
      question: 'Why is the resulting PDF file size similar to the total image size?',
      answer:
        'Because JPEG files are embedded directly without re-compression, the resulting PDF file size is typically close to the cumulative size of the input images plus PDF structural object overhead. Output sizes can vary if images require canvas rendering or format transcoding (such as WebP to PNG).',
    },
    {
      question: 'Can I convert a single image into a PDF?',
      answer:
        'Yes. The tool works seamlessly for single image conversions as well as multi-page compilations. Single image conversions automatically name the download file after the original image (e.g., invoice.pdf).',
    },
  ]

  const relatedSlugs = ['pdf-editor', 'image-resizer', 'pdf-text-cleaner', 'image-quality-increaser', 'word-counter', 'qr-code-generator']

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="JPG to PDF Converter — Convert Images to PDF Online | QUBNEXA"
      seoDescription="Convert JPG, JPEG, PNG, and WebP images to PDF online for free. Customise page size, orientation, and margins with 100% private, client-side PDF generation."
      keywords="jpg to pdf, convert jpg to pdf, free image to pdf converter, combine photos to pdf, png to pdf, jpeg to pdf online, webp to pdf, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <JpgToPdf />
    </ToolPageLayout>
  )
}

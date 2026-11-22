import React from 'react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { PDFEditor } from '../../tools/PDFEditor/PDFEditor'
import { ALL_TOOLS } from '../../data/toolsData'
import type { Tool } from '../../types/tools'

export const PDFEditorPage: React.FC = () => {
  const tool: Tool = ALL_TOOLS.find((t) => t.slug === 'pdf-editor') || {
    id: 'pdf-editor',
    name: 'Free Online PDF Editor',
    slug: 'pdf-editor',
    route: '/tools/pdf-editor',
    path: '/tools/pdf-editor',
    description:
      'Edit, annotate, draw, sign, highlight, and organize PDF documents privately in your browser without uploads.',
    primaryCategory: 'pdf-documents',
    secondaryCategories: ['utilities'],
    categoryId: 'pdf-documents',
    categoryIds: ['pdf-documents', 'pdf-tools'],
    categoryName: 'PDF & Documents',
    icon: 'FileEdit',
    status: 'live',
    releaseOrder: 14,
    createdAt: '2026-02-14',
    isFeatured: true,
    isPopular: true,
    isFunctional: true,
    badge: 'No Upload',
    tags: ['pdf editor', 'annotate pdf', 'edit pdf offline', 'sign pdf', 'private pdf tool'],
    keywords: ['pdf editor', 'free online pdf editor', 'annotate pdf', 'sign pdf online', 'draw on pdf', 'rotate pdf pages', 'private pdf editor browser', 'qubnexa'],
  }

  const howToUseSteps = [
    'Open your PDF document: Drag and drop your file into the editor workspace, click "Browse PDF File", or select "Try with Sample PDF" for instant testing. Password-protected files can be unlocked by entering your document password.',
    'Select an editing or annotation tool: Choose from vector text replacement, textboxes, freehand pen, highlighter, underline, strikethrough, geometric shapes (rectangles, circles, lines, arrows), sticky notes, image stamps, or digital signatures.',
    'Customize typography & colors: Adjust standard font families (Helvetica, Times Roman, Courier), font sizes, text alignments, line spacing, stroke thickness, fill colors, and opacity using the contextual styling toolbar.',
    'Add digital signatures & image stamps: Draw a handwritten signature on the digital canvas, type your name using stylized calligraphic scripts, or upload an image signature. Insert external JPG or PNG images with interactive cropping and rotation.',
    'Organize and manage pages: Use the sidebar thumbnail panel or Page Organizer to rotate pages by 90° increments, reorder pages via drag-and-drop, duplicate pages, delete unwanted pages, or insert clean blank pages.',
    'Find and replace text: Use the Find & Replace tool to search for specific words or phrases across all pages and replace them automatically with formatted vector text overlays.',
    'Configure security & download: Optionally protect your file with standard AES-256 (default) or RC4 encryption by setting a document open password or permissions password, then click "Download PDF" to export your edited document locally.',
  ]

  const formulas = [
    {
      title: 'Vector Text Concealment & Replacement Architecture',
      formula: 'Target_Text(X, Y, W, H) → Conceal_Rect(Color_Match) + Draw_Vector_Text(Font, Size, Align)',
      explanation:
        'Standard PDF files do not support word-processor-style paragraph reflow. The editor detects text bounding boxes via PDF.js, conceals the original text with a color-matched rectangle, and overlays new vector text using standard embedded fonts (Helvetica, Times Roman, Courier) with auto-fitting.',
    },
    {
      title: 'High-DPI Canvas Markup Overlay Pipeline',
      formula: 'Overlay_Stream = Canvas(Markup, DPR = 3.0) → pdfDoc.embedPng(DataURL)',
      explanation:
        'Freehand drawings, highlighters, and vector shapes are rendered onto a 3.0x high-DPI off-screen canvas (300 DPI print quality) and embedded as transparent PNG vector overlays without rasterizing or degrading the underlying PDF document text.',
    },
    {
      title: 'Page Transformation & Rotation Matrix',
      formula: 'New_Rotation = (Current_Rotation + 90° × N) mod 360°',
      explanation:
        'Page rotation modifies the canonical /Rotate entry in the PDF page dictionary directly via pdf-lib, rotating pages losslessly without re-compressing or rasterizing original vector artwork or text.',
    },
    {
      title: 'Client-Side PDF Encryption & Permission Bitmasking',
      formula: 'Permissions_Bitmask = Σ(Allow_Print + Allow_Copy + Allow_Modify + Allow_Annotate) → AES-256 / RC4',
      explanation:
        'Encrypts the PDF using @pdfsmaller/pdf-encrypt with standard AES-256 (default) or legacy RC4. The user password encrypts document streams for opening, while the owner password sets standard PDF permission flags (such as print, copy, modify). Permissions enforcement relies on PDF viewer compliance according to standard PDF specifications.',
    },
    {
      title: 'Coordinate Space Translation from Visual Viewport to PDF Points',
      formula: 'PDF_X = Screen_X × (Page_W / View_W), PDF_Y = Page_H − (Screen_Y × (Page_H / View_H))',
      explanation:
        'Maps user click and drag interactions from browser DOM coordinates (origin top-left) into native PDF PostScript Cartesian coordinates (origin bottom-left), accounting for page scale, rotation, and aspect ratio.',
    },
    {
      title: 'Local In-Memory Document Sandbox Guarantee',
      formula: 'Document Transmission: 0 KB | Processing: Local Browser RAM & Web Worker',
      explanation:
        'While your browser loads static application assets (HTML/JS/worker bundle) from QUBNEXA, all PDF document parsing, text extraction, annotation rendering, signature stamping, and binary PDF assembly occur strictly in your local device memory. Your documents, signatures, and passwords are never transmitted across the network.',
    },
  ]

  const examples = [
    {
      title: 'Contract Review & Digital Signature Execution',
      description:
        'Place a drawn or uploaded handwritten signature on an employment agreement, fill date fields, and highlight key non-disclosure clauses.',
      input:
        '4-page Vendor_Agreement.pdf with digital signature, date text box, and yellow highlight annotations',
      output:
        'Signed, legally formatted contract ready for distribution with vector signatures and searchable text preserved.',
    },
    {
      title: 'Scanned Document Cleanup & Page Reordering',
      description:
        'Rotate upside-down scanned pages upright, delete blank trailing pages, and reorder invoice pages chronologically.',
      input:
        '8-page Scanned_Invoices_Batch.pdf with 2 rotated pages and 1 blank page',
      output:
        'Clean 7-page organized PDF with uniform portrait orientation and zero quality loss.',
    },
    {
      title: 'Academic Grading & Assignment Feedback',
      description:
        'Review student homework submissions by adding sticky notes, freehand pen checkmarks, correction remarks, and explanatory arrows on charts.',
      input:
        'Physics_Lab_Report.pdf with pen markups, margin comments, and sticky note remarks',
      output:
        'Graded assignment document retaining original math diagrams with high-resolution feedback overlays.',
    },
    {
      title: 'Confidential Document Protection & Password Encryption',
      description:
        'Apply AES-256 document open encryption and set custom permission flags on a financial forecast.',
      input:
        'Financial_Forecast_Q4.pdf with AES-256 encryption enabled',
      output:
        'Encrypted PDF requiring a user password to open, with printing and content extraction flags restricted.',
    },
  ]

  const faqs = [
    {
      question: 'Are my PDF documents uploaded to any external server?',
      answer:
        'No. While your browser downloads standard static web code and the local PDF.js worker bundle to run the editor, all PDF document data processing happens 100% locally on your device. Your uploaded files, extracted text, custom annotations, drawn signatures, and passwords are never transmitted to our servers or any third party.',
    },
    {
      question: 'Can I edit existing text in a PDF document?',
      answer:
        'Yes, with an important technical distinction: PDFs are fixed-layout print formats rather than dynamic word processor documents, so full paragraph reflow is not supported. The editor lets you replace existing text by detecting the original text box, concealing it with a matching background rectangle, and placing new editable vector text over it with standard embedded fonts.',
    },
    {
      question: 'How do digital signatures work in this editor?',
      answer:
        'You can create signatures by drawing directly on a signature pad, typing your name with calligraphic script fonts, or uploading an image of your physical signature. Signatures are embedded as clean, scalable graphics directly into the PDF.',
    },
    {
      question: 'Can I rearrange, rotate, or delete pages?',
      answer:
        'Yes. The Page Organizer and thumbnail sidebar let you rotate pages by 90° increments, move pages up or down, duplicate pages, delete unwanted pages, insert blank pages, or merge pages from other PDF files.',
    },
    {
      question: 'Can I protect or unlock password-protected PDFs?',
      answer:
        'Yes. If you know the password of an encrypted PDF, you can unlock and edit it locally. You can also encrypt any PDF with AES-256 (default) or legacy RC4, configuring an open password and an owner permissions password for printing, editing, and copying. Note that open passwords encrypt document streams, whereas permission restrictions depend on standard PDF viewer compliance.',
    },
    {
      question: 'What are the file size and page count limits?',
      answer:
        'The application enforces no fixed software limit on file size or page count. However, because all parsing, rendering, and PDF compilation run entirely in client-side browser memory (RAM), very large documents (e.g. hundreds of scanned pages or multi-gigabyte files) may encounter browser memory limits or run slower on resource-constrained devices.',
    },
    {
      question: 'Will editing my PDF reduce the quality of existing images or text?',
      answer:
        'No. Original PDF vector streams, embedded fonts, and page elements are preserved intact via pdf-lib without global rasterization. New freehand annotations and highlighters are overlaid at 300 DPI high resolution.',
    },
    {
      question: 'Can I search and replace text across the entire PDF?',
      answer:
        'Yes. The Find & Replace tool scans all pages for specified keywords and lets you replace matching occurrences across the document with formatted vector text replacements.',
    },
    {
      question: 'Is any software installation or registration required?',
      answer:
        'No. The editor works entirely in your web browser with no plugins, extensions, account creation, or software installation required, and leaves no watermarks on exported files.',
    },
  ]

  const relatedSlugs = [
    'jpg-to-pdf',
    'pdf-text-cleaner',
    'pkpass-to-pdf',
    'word-counter',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="Free Online PDF Editor — Annotate, Sign & Edit PDFs | QUBNEXA"
      seoDescription="Edit, annotate, sign, highlight, rotate, and organize PDF files online for free. 100% private in-browser editing with zero server uploads and no watermarks."
      keywords="pdf editor, free online pdf editor, annotate pdf, sign pdf online, draw on pdf, rotate pdf pages, private pdf editor browser, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <PDFEditor />
    </ToolPageLayout>
  )
}

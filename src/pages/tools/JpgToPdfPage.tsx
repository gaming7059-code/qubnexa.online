import React from 'react'
import { Link } from 'react-router-dom'
import {
  FileText,
  Smartphone,
  AlertCircle,
  ArrowRight,
  Shield,
  FileImage,
  Sparkles,
  Info,
  Maximize2,
  Lock,
} from 'lucide-react'
import { ToolPageLayout } from '../../components/layout/ToolPageLayout'
import { JpgToPdf } from '../../tools/JpgToPdf/JpgToPdf'
import { ScrollReveal } from '../../components/common/ScrollReveal'
import { ALL_TOOLS } from '../../data/toolsData'

export const JpgToPdfPage: React.FC = () => {
  const tool = ALL_TOOLS.find((t) => t.slug === 'jpg-to-pdf')!

  const howToUseSteps = [
    'Upload your images: Drag and drop your JPG, JPEG, PNG, or WebP files into the upload box, or click "Select Images" to open your file manager and choose one or multiple photos simultaneously.',
    'Inspect preview thumbnails: Review the loaded image gallery to inspect thumbnail previews, file names, file sizes, and original pixel dimensions (width × height).',
    'Rearrange page order: Drag and drop cards into your preferred sequence, or click the Up (↑) and Down (↓) arrow buttons on each card to move an image earlier or later in the PDF sequence.',
    'Select standard page format: Choose your preferred PDF page size from international paper standards: A4 (210 × 297 mm), US Letter (8.5 × 11 in), A3 (297 × 420 mm), or "Fit Image (Original Size)" to match exact photo dimensions.',
    'Configure orientation & margins: Select "Auto" orientation to dynamically match each image’s landscape/portrait aspect ratio, or lock all pages to Portrait or Landscape. Select margin padding: None (0 pt full bleed), Small (20 pt), Medium (36 pt / 0.5 in default), or Large (54 pt / 0.75 in).',
    'Compile PDF document: Click "Convert to PDF" to initiate rapid client-side compilation via pdf-lib in your browser. The real-time progress bar monitors per-image rendering and stream generation.',
    'Download finished PDF: Verify the calculated output document size and click "Download PDF" to save your compiled document immediately with zero server transmission.',
  ]

  const formulas = [
    {
      title: 'Proportional Aspect Ratio Scaling & Zero Distortion',
      formula: 'Scale = min(PrintableWidth / ImageWidth, PrintableHeight / ImageHeight)',
      explanation:
        'Calculates the uniform scale factor required to fit the photo completely inside the printable page boundary without stretching, cropping, or altering the original image proportions.',
    },
    {
      title: 'Centering Coordinates & Margin Boundary Geometry',
      formula: 'X = Margin + (PrintableWidth − RenderedWidth) / 2, Y = Margin + (PrintableHeight − RenderedHeight) / 2',
      explanation:
        'Calculates exact PostScript vector coordinate offsets from the page origin (bottom-left corner in PDF standards) to center the image symmetrically within printable margins.',
    },
    {
      title: 'ISO 216 & ANSI Standard Vector Dimensions',
      formula: 'A4 = 595.28 × 841.89 pt (210×297 mm) | US Letter = 612 × 792 pt (8.5×11 in)',
      explanation:
        'Standardizes physical millimeters and inches into native PDF vector points (72 points per inch), ensuring consistent high-resolution output for home and commercial printing.',
    },
    {
      title: 'Dynamic Per-Page Auto-Orientation Detection',
      formula: 'PageOrientation = ImageWidth > ImageHeight ? Landscape : Portrait',
      explanation:
        'When Auto orientation is selected, the engine evaluates each uploaded image independently: landscape photos receive horizontal pages and portrait photos receive vertical pages, eliminating awkward white letterboxing.',
    },
    {
      title: 'Fit Image / Original Size Page Calculation',
      formula: 'PageWidth = ImageWidth + (Margin × 2), PageHeight = ImageHeight + (Margin × 2)',
      explanation:
        'When Fit Image is enabled, custom page dimensions are tailored directly to each image\'s native pixel resolution plus margin padding, ideal for borderless digital art and photo lookbooks.',
    },
    {
      title: 'Native JPEG Stream Embedding Architecture',
      formula: 'PDF Stream = pdfDoc.embedJpg(fileBytes) [Zero Re-Encoding Loss]',
      explanation:
        'For JPG and JPEG files, the compressed DCT byte stream is embedded directly into the PDF structure using embedJpg() without an additional lossy JPEG re-compression cycle, preserving source fidelity.',
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
      question: 'How do I combine multiple JPG images into one single PDF?',
      answer:
        'Click "Select Images" or drag and drop multiple JPG, PNG, or WebP files into the upload box simultaneously. You can preview all uploaded pages in the gallery grid, drag cards or use the arrow buttons to arrange their exact sequence, select your preferred page size (like A4 or US Letter), and click "Convert to PDF" to compile them into one organized document.',
    },
    {
      question: 'Can I change the order of pages before creating the PDF?',
      answer:
        'Yes. You can drag and drop any image card in the gallery grid to move it to a new position, or click the Up (↑) and Down (↓) arrow buttons on each card to shift pages forward or backward in the sequence.',
    },
    {
      question: 'Which image formats are supported by the converter?',
      answer:
        'The converter supports standard JPG, JPEG, PNG, and WebP image formats. You can upload and mix different formats within the same document compilation. WebP images are automatically converted to clean vector-ready image streams during PDF generation.',
    },
    {
      question: 'What is the difference between A4, US Letter, A3, and Fit Image?',
      answer:
        'A4 (210 × 297 mm) is the international standard used globally for legal, government, and corporate documents. US Letter (8.5 × 11 in) is the standard in North America. A3 (297 × 420 mm) is twice the size of A4, ideal for architectural drawings and posters. "Fit Image (Original Size)" creates custom-sized PDF pages tailored directly to each photo\'s native dimensions without white letterbox borders.',
    },
    {
      question: 'How do I convert photos to PDF on iPhone and Android?',
      answer:
        'On mobile devices, open QUBNEXA in your browser (Safari on iOS or Chrome on Android), tap "Select Images", and pick photos from your Photo Library, Gallery, or Files. Set your paper size and orientation, tap "Convert to PDF", and tap "Download PDF" to save the finished document directly to your device storage.',
    },
    {
      question: 'Are my photos uploaded to any server or stored online?',
      answer:
        'No. All image processing, canvas conversions, and PDF compilation execute locally inside your web browser memory using JavaScript and pdf-lib. Your photos never leave your device, ensuring complete privacy for sensitive government IDs, tax filings, and personal photographs.',
    },
    {
      question: 'How does the Auto page orientation setting work?',
      answer:
        'When "Auto" orientation is selected, the converter checks the native aspect ratio of each uploaded photo individually. Wide landscape images are placed on horizontal pages, while tall portrait images are placed on vertical pages, ensuring clean layout presentation without awkward blank spaces.',
    },
    {
      question: 'How do margins affect the image placement on the page?',
      answer:
        'Margins define the white padding border between your image and the paper edge. "None" creates full-bleed borderless pages; "Small" (20 pt / 0.28 in) adds a subtle frame; "Medium" (36 pt / 0.5 in) is standard for home and office printing; and "Large" (54 pt / 0.75 in) provides ample binding space for dossiers and booklets.',
    },
    {
      question: 'Will my photos lose quality during PDF conversion?',
      answer:
        'For JPG and JPEG files, the converter embeds the original DCT-compressed image stream directly into the PDF using pdfDoc.embedJpg() without secondary compression or downsampling. This avoids generational compression artifacts, so output clarity reflects your original image resolution.',
    },
    {
      question: 'What should I do if I need to edit, sign, or crop photos after conversion?',
      answer:
        'If you need to crop or resize images before conversion, use our free Image Resizer. If you need to add text, sign documents, or annotate your compiled PDF after conversion, open the generated file directly in our free PDF Editor.',
    },
  ]

  const relatedSlugs = [
    'pkpass-to-pdf',
    'pdf-editor',
    'pdf-text-cleaner',
    'image-resizer',
  ]

  return (
    <ToolPageLayout
      tool={tool}
      seoTitle="JPG to PDF Converter — Free Image to PDF Online | QUBNEXA"
      seoDescription="Convert JPG, PNG, and WebP images to clean PDF documents online for free. Merge photos into A4 or Letter PDFs with 100% private in-browser processing."
      keywords="jpg to pdf, convert jpg to pdf, free image to pdf converter, combine photos to pdf, png to pdf, jpeg to pdf online, webp to pdf, convert images to pdf, qubnexa"
      howToUseSteps={howToUseSteps}
      formulas={formulas}
      examples={examples}
      faqs={faqs}
      relatedSlugs={relatedSlugs}
    >
      <div className="space-y-10">
        {/* Above-the-fold Interactive Tool */}
        <JpgToPdf />

        {/* 1. Paper Size & Dimensions Comparison Guide */}
        <ScrollReveal>
          <section
            aria-labelledby="paper-sizes-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
              <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg">
                <FileText className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
                <h2 id="paper-sizes-heading">Paper Size &amp; Layout Comparison Guide</h2>
              </div>
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-[#00DFFF] border border-blue-200 dark:border-blue-900/60 self-start sm:self-auto">
                Standard Print Formats
              </span>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              Selecting the appropriate page size ensures your PDF document prints cleanly on physical paper and renders without distortion on digital screens. Compare the supported paper formats below:
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814]">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/80 text-slate-700 dark:text-slate-300 font-semibold">
                    <th className="py-3 px-4">Page Size</th>
                    <th className="py-3 px-4">Millimeters</th>
                    <th className="py-3 px-4">Inches</th>
                    <th className="py-3 px-4">PDF Points (72 DPI)</th>
                    <th className="py-3 px-4">Standard Region</th>
                    <th className="py-3 px-4">Recommended For</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-600 dark:text-slate-300">
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-[#00DFFF]" />
                      A4 Standard
                    </td>
                    <td className="py-3 px-4 font-mono">210 × 297 mm</td>
                    <td className="py-3 px-4 font-mono">8.27 × 11.69 in</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">595.28 × 841.89 pt</td>
                    <td className="py-3 px-4">International / Global</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Official government forms, passports, visa applications, and global printing.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">US Letter</td>
                    <td className="py-3 px-4 font-mono">215.9 × 279.4 mm</td>
                    <td className="py-3 px-4 font-mono">8.5 × 11.0 in</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">612 × 792 pt</td>
                    <td className="py-3 px-4">North America (US &amp; Canada)</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Corporate correspondence, business invoices, academic essays, and office filing.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100">A3 Poster</td>
                    <td className="py-3 px-4 font-mono">297 × 420 mm</td>
                    <td className="py-3 px-4 font-mono">11.69 × 16.54 in</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">841.89 × 1190.55 pt</td>
                    <td className="py-3 px-4">International Large Format</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Engineering schematics, architectural drawings, marketing posters, and blueprints.</td>
                  </tr>
                  <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30 transition-colors">
                    <td className="py-3 px-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                      <Maximize2 className="w-3.5 h-3.5 text-cyan-600 dark:text-[#00DFFF]" />
                      Fit Image (Original Size)
                    </td>
                    <td className="py-3 px-4 font-mono">Matches Photo Dimensions</td>
                    <td className="py-3 px-4 font-mono">Dynamic Aspect Ratio</td>
                    <td className="py-3 px-4 font-mono text-[11px] text-blue-700 dark:text-[#00DFFF]">Custom Per Image</td>
                    <td className="py-3 px-4">Universal Digital Display</td>
                    <td className="py-3 px-4 text-slate-500 dark:text-slate-400">Digital photography lookbooks, scan preservation, and borderless art portfolios.</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200/80 dark:border-slate-800/80 flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-600 dark:text-[#00DFFF] shrink-0 mt-0.5" />
              <div className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                <span className="font-semibold text-slate-900 dark:text-slate-200">Print Margin Recommendations: </span>
                Select <strong className="font-semibold text-slate-800 dark:text-slate-200">&quot;Medium&quot; (36 pt / 0.5 inch)</strong> for standard office printing to avoid printer clipping. Choose <strong className="font-semibold text-slate-800 dark:text-slate-200">&quot;Large&quot; (54 pt / 0.75 inch)</strong> if your documents will be punched and placed into binders. For borderless digital viewing, select <strong className="font-semibold text-slate-800 dark:text-slate-200">&quot;None&quot; (0 pt)</strong> margin.
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 2. Mobile Conversion Guide (Android & iPhone / iPad) */}
        <ScrollReveal delay={50}>
          <section
            aria-labelledby="mobile-guide-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-4">
              <Smartphone className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h2 id="mobile-guide-heading">Mobile Conversion Guide: Converting Photos on Android &amp; iPhone</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              QUBNEXA runs smoothly in mobile web browsers without installing apps, creating accounts, or transmitting photos to cloud servers. Follow these quick steps for your smartphone:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Android Guide Card */}
              <div className="xw-surface-muted p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <span className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Converting on Android (Chrome, Samsung Internet, Firefox)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Select Photos:</span> Tap the upload area or <strong className="font-semibold text-slate-800 dark:text-slate-200">Select Images</strong> to open your device Gallery, Google Photos, or file manager.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Reorder Pages:</span> Review your uploaded images. Use the Up/Down arrow buttons on each card to arrange your photos in sequential reading order.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Choose Layout:</span> Select your page size (such as A4 or US Letter) and tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Auto</strong> orientation to automatically format portrait and landscape receipts.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Download PDF:</span> Tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Convert to PDF</strong>. Once compilation completes, tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Download PDF</strong> to save the document directly to your device <strong className="font-semibold text-slate-800 dark:text-slate-200">Downloads</strong> folder.
                  </li>
                </ol>
              </div>

              {/* iPhone Guide Card */}
              <div className="xw-surface-muted p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800/80 space-y-3">
                <div className="flex items-center gap-2 text-sm font-bold text-slate-900 dark:text-slate-100">
                  <span className="w-6 h-6 rounded-lg bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-[#00DFFF] flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Converting on iPhone &amp; iPad (Safari, Chrome iOS)</span>
                </div>
                <ol className="list-decimal list-inside space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-1">
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Select Photos:</span> In Safari, tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Select Images</strong> and choose <strong className="font-semibold text-slate-800 dark:text-slate-200">Photo Library</strong> or <strong className="font-semibold text-slate-800 dark:text-slate-200">Choose Files</strong> to upload multiple images.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Adjust Order:</span> Drag cards or tap the arrow buttons to position cover photos, receipts, or forms in the desired sequence.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Configure Margins:</span> Set page size to A4 or US Letter, and select your preferred margin spacing.
                  </li>
                  <li>
                    <span className="font-semibold text-slate-800 dark:text-slate-200">Save to Files:</span> Tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Convert to PDF</strong>, then tap <strong className="font-semibold text-slate-800 dark:text-slate-200">Download PDF</strong>. Safari will save the compiled document to the native iOS <strong className="font-semibold text-slate-800 dark:text-slate-200">Files</strong> app or open it in Apple Books.
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 3. Privacy & Security Section */}
        <ScrollReveal delay={50}>
          <section
            aria-labelledby="privacy-security-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-4">
              <Shield className="h-5 w-5 text-blue-600 dark:text-[#00DFFF]" />
              <h2 id="privacy-security-heading">Privacy &amp; In-Browser Security Architecture</h2>
            </div>

            <div className="space-y-4 text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              <p>
                Unlike traditional online PDF converters that require uploading your personal documents to remote cloud processing servers, QUBNEXA operates entirely inside your local web browser:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    <Lock className="w-4 h-4 text-emerald-500" />
                    <span>Zero Server File Transmission</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Image parsing, coordinate alignment, and PDF stream generation run locally in JavaScript using <code className="font-mono text-slate-700 dark:text-slate-300">pdf-lib</code>. Your photographs, passport scans, and bank receipts are never sent across the internet to our backend or third-party cloud APIs.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 space-y-2">
                  <div className="flex items-center gap-2 font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm">
                    <AlertCircle className="w-4 h-4 text-amber-500" />
                    <span>Security Best Practices on Shared Devices</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    If you are converting sensitive financial records or identity documents on a public or shared computer (such as a school lab, office terminal, or library kiosk), make sure to close the browser tab after downloading and delete the generated PDF from the computer&apos;s Downloads folder.
                  </p>
                </div>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* 4. Connected Document Workflows (Contextual Internal Links) */}
        <ScrollReveal delay={50}>
          <section
            aria-labelledby="connected-workflows-heading"
            className="xw-panel p-6 sm:p-8 shadow-2xs space-y-6"
          >
            <div className="flex items-center gap-2.5 text-slate-900 dark:text-white font-bold text-lg border-b border-slate-200 dark:border-slate-800 pb-4">
              <FileImage className="h-5 w-5 text-cyan-600 dark:text-[#00DFFF]" />
              <h2 id="connected-workflows-heading">Complete Image &amp; PDF Creation Workflows</h2>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              QUBNEXA provides dedicated, free browser utilities to prepare images before compilation or manage documents after conversion:
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Image Resizer Link Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
                    <Maximize2 className="w-4 h-4 text-blue-600 dark:text-[#00DFFF]" />
                    <span>Crop or Resize Photos First</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Need to crop borders, adjust aspect ratios, or scale photos to specific pixel dimensions before building your PDF?
                  </p>
                </div>
                <Link
                  to="/tools/image-resizer"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline"
                >
                  <span>Open Image Resizer</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Image Quality Increaser Link Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-600 dark:text-[#00DFFF]" />
                    <span>Enhance Blurry Scans &amp; Receipts</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Working with low-resolution camera scans or compressed receipts? Upscale clarity and sharpen details before compiling.
                  </p>
                </div>
                <Link
                  to="/tools/image-quality-increaser"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline"
                >
                  <span>Open Image Quality Increaser</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* PDF Editor Link Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 flex flex-col justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs sm:text-sm flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                    <span>Annotate, Sign &amp; Edit PDF</span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                    Need to add signature lines, fill form fields, or highlight text in your compiled PDF document?
                  </p>
                </div>
                <Link
                  to="/tools/pdf-editor"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-[#00DFFF] hover:underline"
                >
                  <span>Open PDF Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>
      </div>
    </ToolPageLayout>
  )
}

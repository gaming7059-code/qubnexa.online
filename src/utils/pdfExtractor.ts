/**
 * QUBNEXA — Browser-Native PDF Text Extractor
 * Uses pdfjs-dist with Web Worker offloading for safe in-browser extraction.
 * Zero external network calls. All processing is 100% private.
 */

import * as pdfjsLib from 'pdfjs-dist'
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url'

if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
  pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl
}

export interface PdfExtractionResult {
  success: boolean
  text?: string
  pageCount?: number
  isScanned?: boolean
  error?: string
}

export const MAX_PDF_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

/**
 * Validates whether a file is a valid PDF within size limits.
 */
export function validatePdfFile(file: File): { valid: boolean; error?: string } {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  const isPdfMime = file.type === 'application/pdf'
  const isPdfExt = file.name.toLowerCase().endsWith('.pdf')

  if (!isPdfMime && !isPdfExt) {
    return { valid: false, error: 'Selected file is not a PDF document.' }
  }

  if (file.size > MAX_PDF_FILE_SIZE) {
    return { valid: false, error: 'PDF file exceeds maximum allowed size of 50 MB.' }
  }

  if (file.size === 0) {
    return { valid: false, error: 'PDF file is empty (0 bytes).' }
  }

  return { valid: true }
}

/**
 * Extracts plain text from all pages of an uploaded PDF file.
 */
export async function extractTextFromPdf(
  file: File,
  onProgress?: (current: number, total: number) => void
): Promise<PdfExtractionResult> {
  const validation = validatePdfFile(file)
  if (!validation.valid) {
    return { success: false, error: validation.error }
  }

  let pdfDoc: pdfjsLib.PDFDocumentProxy | null = null

  try {
    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    })

    pdfDoc = await loadingTask.promise
    const totalPages = pdfDoc.numPages

    if (totalPages === 0) {
      return {
        success: false,
        error: 'PDF document contains 0 pages.',
        pageCount: 0,
      }
    }

    const pageTexts: string[] = []

    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      if (onProgress) {
        onProgress(pageNum, totalPages)
      }

      const page = await pdfDoc.getPage(pageNum)
      const textContent = await page.getTextContent()

      // Assemble text items into coherent page string
      const items = textContent.items as Array<{ str?: string; hasEOL?: boolean }>
      let pageText = ''

      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (typeof item.str === 'string') {
          pageText += item.str
          if (item.hasEOL) {
            pageText += '\n'
          } else if (i < items.length - 1 && !item.str.endsWith(' ')) {
            pageText += ' '
          }
        }
      }

      pageTexts.push(pageText.trim())
      page.cleanup()
    }

    const fullText = pageTexts.join('\n\n')
    const isScanned = fullText.trim().length === 0

    return {
      success: true,
      text: fullText,
      pageCount: totalPages,
      isScanned,
    }
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err)

    if (
      errorMsg.toLowerCase().includes('password') ||
      errorMsg.toLowerCase().includes('encrypted')
    ) {
      return {
        success: false,
        error:
          'This PDF document is password-protected or encrypted. Please remove encryption before cleaning text.',
      }
    }

    if (
      errorMsg.toLowerCase().includes('corrupted') ||
      errorMsg.toLowerCase().includes('format error')
    ) {
      return {
        success: false,
        error: 'Unable to parse this PDF document. The file may be corrupted or damaged.',
      }
    }

    return {
      success: false,
      error: `Failed to extract text from PDF: ${errorMsg}`,
    }
  } finally {
    if (pdfDoc) {
      try {
        await pdfDoc.cleanup()
      } catch {
        // Ignore cleanup failure
      }
    }
  }
}

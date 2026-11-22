import React, { useState, useEffect } from 'react'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import QRCode from 'qrcode'
import {
  Ticket,
  Upload,
  Download,
  Printer,
  Plane,
  Music,
  Tag,
  Sparkles,
  AlertCircle,
} from 'lucide-react'

interface PassField {
  key: string
  label: string
  value: string
}

interface PassData {
  description: string
  formatVersion: number
  organizationName: string
  passTypeIdentifier: string
  serialNumber: string
  backgroundColor: string
  foregroundColor: string
  labelColor: string
  logoText: string
  barcode?: {
    format: string
    message: string
    messageEncoding: string
    altText?: string
  }
  type: 'boardingPass' | 'eventTicket' | 'coupon' | 'storeCard' | 'generic'
  headerFields?: PassField[]
  primaryFields?: PassField[]
  secondaryFields?: PassField[]
  auxiliaryFields?: PassField[]
  backFields?: PassField[]
}

const PRESET_PASSES: Record<string, PassData> = {
  boardingPass: {
    description: 'International Flight Boarding Pass',
    formatVersion: 1,
    organizationName: 'SkyLine Airways',
    passTypeIdentifier: 'pass.com.skyline.boarding',
    serialNumber: 'SK-948201',
    backgroundColor: '#0f172a',
    foregroundColor: '#ffffff',
    labelColor: '#94a3b8',
    logoText: 'SKYLINE AIR',
    type: 'boardingPass',
    headerFields: [{ key: 'gate', label: 'GATE', value: 'B24' }],
    primaryFields: [
      { key: 'origin', label: 'NEW YORK', value: 'JFK' },
      { key: 'dest', label: 'LONDON', value: 'LHR' },
    ],
    secondaryFields: [
      { key: 'passenger', label: 'PASSENGER', value: 'EMILY WATSON' },
      { key: 'flight', label: 'FLIGHT', value: 'SK 408' },
    ],
    auxiliaryFields: [
      { key: 'boarding', label: 'BOARDING', value: '18:45' },
      { key: 'seat', label: 'SEAT', value: '14A' },
      { key: 'group', label: 'ZONE', value: '1' },
    ],
    barcode: {
      format: 'PKBarcodeFormatQR',
      message: 'M1WATSON/EMILY EK123456 JFK-LHR SK0408 112Y014A0024',
      messageEncoding: 'iso-8859-1',
      altText: 'SK-408-14A-WATSON',
    },
  },
  eventTicket: {
    description: 'World Stadium Concert Pass',
    formatVersion: 1,
    organizationName: 'Global Live Events',
    passTypeIdentifier: 'pass.com.globallive.ticket',
    serialNumber: 'EV-88402',
    backgroundColor: '#3b0764',
    foregroundColor: '#ffffff',
    labelColor: '#d8b4fe',
    logoText: 'THE NEON TOUR',
    type: 'eventTicket',
    headerFields: [{ key: 'door', label: 'ENTRY GATE', value: 'GATE 4' }],
    primaryFields: [{ key: 'event', label: 'EVENT', value: 'Electric Symphony Live' }],
    secondaryFields: [
      { key: 'venue', label: 'VENUE', value: 'Metropolis Arena' },
      { key: 'date', label: 'DATE', value: 'NOV 28, 2026' },
    ],
    auxiliaryFields: [
      { key: 'section', label: 'SEC', value: 'A2' },
      { key: 'row', label: 'ROW', value: '12' },
      { key: 'seat', label: 'SEAT', value: '08' },
    ],
    barcode: {
      format: 'PKBarcodeFormatQR',
      message: 'TICKET-NEON-TOUR-SEC-A2-ROW12-SEAT08',
      messageEncoding: 'utf-8',
      altText: 'SEC A2 • ROW 12 • SEAT 08',
    },
  },
  coupon: {
    description: 'Retail VIP Promo Pass',
    formatVersion: 1,
    organizationName: 'Luxe Apparel Co.',
    passTypeIdentifier: 'pass.com.luxe.vip',
    serialNumber: 'LUXE-77192',
    backgroundColor: '#064e3b',
    foregroundColor: '#ffffff',
    labelColor: '#a7f3d0',
    logoText: 'LUXE VIP',
    type: 'coupon',
    headerFields: [{ key: 'expires', label: 'VALID UNTIL', value: 'DEC 31, 2026' }],
    primaryFields: [{ key: 'discount', label: 'EXCLUSIVE BENEFIT', value: '25% OFF STOREWIDE' }],
    secondaryFields: [
      { key: 'member', label: 'VIP MEMBER', value: 'Alex Morgan' },
      { key: 'tier', label: 'TIER', value: 'Gold Status' },
    ],
    auxiliaryFields: [
      { key: 'code', label: 'PROMO CODE', value: 'GOLD-2026' },
      { key: 'terms', label: 'MINIMUM SPEND', value: '$75.00' },
    ],
    barcode: {
      format: 'PKBarcodeFormatQR',
      message: 'PROMO-LUXE-GOLD-25PCT-77192',
      messageEncoding: 'utf-8',
      altText: 'SCAN AT CHECKOUT',
    },
  },
}

// Lightweight browser ZIP extractor for pass.json
async function extractPassJsonFromZip(file: File): Promise<PassData | null> {
  const buffer = await file.arrayBuffer()
  const bytes = new Uint8Array(buffer)

  // Search for "pass.json" filename in zip directory
  const passJsonBytes = new TextEncoder().encode('pass.json')
  let foundOffset = -1

  for (let i = 0; i < bytes.length - passJsonBytes.length; i++) {
    let match = true
    for (let j = 0; j < passJsonBytes.length; j++) {
      if (bytes[i + j] !== passJsonBytes[j]) {
        match = false
        break
      }
    }
    if (match) {
      foundOffset = i
      break
    }
  }

  if (foundOffset === -1) {
    throw new Error('Could not find pass.json inside the .pkpass archive.')
  }

  // Look backwards for local file header (0x50, 0x4B, 0x03, 0x04)
  let headerOffset = -1
  for (let i = Math.max(0, foundOffset - 40); i <= foundOffset; i++) {
    if (bytes[i] === 0x50 && bytes[i + 1] === 0x4b && bytes[i + 2] === 0x03 && bytes[i + 3] === 0x04) {
      headerOffset = i
      break
    }
  }

  if (headerOffset !== -1) {
    const view = new DataView(buffer, headerOffset)
    const compression = view.getUint16(8, true)
    const compressedSize = view.getUint32(18, true)
    const fileNameLen = view.getUint16(26, true)
    const extraFieldLen = view.getUint16(28, true)
    const dataStart = headerOffset + 30 + fileNameLen + extraFieldLen
    const compressedData = bytes.slice(dataStart, dataStart + compressedSize)

    if (compression === 0) {
      // Stored (no compression)
      const text = new TextDecoder('utf-8').decode(compressedData)
      return JSON.parse(text)
    } else if (compression === 8 && typeof DecompressionStream !== 'undefined') {
      // Deflated
      const ds = new DecompressionStream('deflate-raw')
      const writer = ds.writable.getWriter()
      writer.write(compressedData)
      writer.close()
      const resp = new Response(ds.readable)
      const text = await resp.text()
      return JSON.parse(text)
    }
  }

  // Fallback: search for opening { and closing } in proximity
  const decoder = new TextDecoder('utf-8', { fatal: false })
  const textDump = decoder.decode(bytes)
  const jsonStart = textDump.indexOf('{"description"') > -1 ? textDump.indexOf('{"description"') : textDump.indexOf('{"formatVersion"')
  if (jsonStart !== -1) {
    let braceCount = 0
    let jsonEnd = -1
    for (let i = jsonStart; i < textDump.length; i++) {
      if (textDump[i] === '{') braceCount++
      else if (textDump[i] === '}') {
        braceCount--
        if (braceCount === 0) {
          jsonEnd = i + 1
          break
        }
      }
    }
    if (jsonEnd !== -1) {
      return JSON.parse(textDump.slice(jsonStart, jsonEnd))
    }
  }

  throw new Error('Compressed pass format requires standard browser decompression.')
}

export const PkpassToPdf: React.FC = () => {
  const [passData, setPassData] = useState<PassData>(PRESET_PASSES.boardingPass)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)

  // Generate QR code whenever barcode message changes
  useEffect(() => {
    const msg = passData.barcode?.message || passData.serialNumber || 'PASS-12345'
    QRCode.toDataURL(msg, {
      width: 200,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    })
      .then((url) => setQrCodeUrl(url))
      .catch((err) => console.error(err))
  }, [passData])

  // Handle .pkpass upload
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 25 * 1024 * 1024) {
      setUploadError('File exceeds 25MB maximum limit. Please upload an authentic Apple Wallet .pkpass file.')
      return
    }

    setIsLoading(true)
    setUploadError(null)

    try {
      const parsed = await extractPassJsonFromZip(file)
      if (parsed) {
        // Normalize pass type fields
        let detectedType: PassData['type'] = 'generic'
        let primary = parsed.primaryFields
        let secondary = parsed.secondaryFields
        let auxiliary = parsed.auxiliaryFields
        let header = parsed.headerFields

        // Check dictionary inside pass.json (e.g. parsed.boardingPass or parsed.eventTicket)
        const typedObj = (parsed as any).boardingPass ||
          (parsed as any).eventTicket ||
          (parsed as any).coupon ||
          (parsed as any).storeCard ||
          (parsed as any).generic

        if (typedObj) {
          primary = primary || typedObj.primaryFields
          secondary = secondary || typedObj.secondaryFields
          auxiliary = auxiliary || typedObj.auxiliaryFields
          header = header || typedObj.headerFields
          if ((parsed as any).boardingPass) detectedType = 'boardingPass'
          else if ((parsed as any).eventTicket) detectedType = 'eventTicket'
          else if ((parsed as any).coupon) detectedType = 'coupon'
        }

        setPassData({
          ...parsed,
          type: detectedType,
          backgroundColor: parsed.backgroundColor || '#1e293b',
          foregroundColor: parsed.foregroundColor || '#ffffff',
          labelColor: parsed.labelColor || '#94a3b8',
          headerFields: header || [],
          primaryFields: primary || [],
          secondaryFields: secondary || [],
          auxiliaryFields: auxiliary || [],
        })
      }
    } catch (err: unknown) {
      setUploadError((err as Error).message || 'Failed to parse .pkpass archive.')
    } finally {
      setIsLoading(false)
    }
  }

  // Print pass directly
  const handlePrint = () => {
    window.print()
  }

  // Generate crisp standalone PDF using pdf-lib
  const handleDownloadPdf = async () => {
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // Standard A4 (pts)
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const fontBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Background Container
    const margin = 50
    const cardWidth = 595.28 - margin * 2
    const cardHeight = 360
    const cardTop = 841.89 - 100

    // Draw card box
    page.drawRectangle({
      x: margin,
      y: cardTop - cardHeight,
      width: cardWidth,
      height: cardHeight,
      color: rgb(0.08, 0.12, 0.2), // Dark Navy
    })

    // Header Title
    page.drawText(passData.logoText || passData.organizationName || 'PASS', {
      x: margin + 25,
      y: cardTop - 35,
      size: 16,
      font: fontBold,
      color: rgb(1, 1, 1),
    })

    if (passData.headerFields?.[0]) {
      const hf = passData.headerFields[0]
      page.drawText(hf.label.toUpperCase(), {
        x: margin + cardWidth - 100,
        y: cardTop - 25,
        size: 9,
        font,
        color: rgb(0.65, 0.72, 0.8),
      })
      page.drawText(hf.value, {
        x: margin + cardWidth - 100,
        y: cardTop - 40,
        size: 14,
        font: fontBold,
        color: rgb(1, 1, 1),
      })
    }

    // Primary Fields (e.g. JFK -> LHR)
    if (passData.primaryFields && passData.primaryFields.length > 0) {
      const p1 = passData.primaryFields[0]
      page.drawText(p1.label.toUpperCase(), {
        x: margin + 25,
        y: cardTop - 85,
        size: 10,
        font,
        color: rgb(0.65, 0.72, 0.8),
      })
      page.drawText(p1.value, {
        x: margin + 25,
        y: cardTop - 120,
        size: 28,
        font: fontBold,
        color: rgb(1, 1, 1),
      })

      if (passData.primaryFields.length > 1) {
        const p2 = passData.primaryFields[1]
        page.drawText(p2.label.toUpperCase(), {
          x: margin + 200,
          y: cardTop - 85,
          size: 10,
          font,
        color: rgb(0.65, 0.72, 0.8),
        })
        page.drawText(p2.value, {
          x: margin + 200,
          y: cardTop - 120,
          size: 28,
          font: fontBold,
          color: rgb(1, 1, 1),
        })
      }
    }

    // Secondary & Auxiliary Fields
    let yPos = cardTop - 170
    if (passData.secondaryFields) {
      let xPos = margin + 25
      passData.secondaryFields.forEach((sf) => {
        page.drawText(sf.label.toUpperCase(), { x: xPos, y: yPos, size: 9, font, color: rgb(0.65, 0.72, 0.8) })
        page.drawText(sf.value, { x: xPos, y: yPos - 16, size: 12, font: fontBold, color: rgb(1, 1, 1) })
        xPos += 140
      })
    }

    yPos -= 50
    if (passData.auxiliaryFields) {
      let xPos = margin + 25
      passData.auxiliaryFields.forEach((af) => {
        page.drawText(af.label.toUpperCase(), { x: xPos, y: yPos, size: 9, font, color: rgb(0.65, 0.72, 0.8) })
        page.drawText(af.value, { x: xPos, y: yPos - 16, size: 12, font: fontBold, color: rgb(1, 1, 1) })
        xPos += 110
      })
    }

    // Barcode Embed
    if (qrCodeUrl && qrCodeUrl.includes(',')) {
      const base64Data = qrCodeUrl.split(',')[1]
      const binaryString = atob(base64Data)
      const qrBytes = new Uint8Array(binaryString.length)
      for (let i = 0; i < binaryString.length; i++) {
        qrBytes[i] = binaryString.charCodeAt(i)
      }
      const qrImage = await pdfDoc.embedPng(qrBytes)
      page.drawImage(qrImage, {
        x: margin + cardWidth / 2 - 45,
        y: cardTop - cardHeight + 25,
        width: 90,
        height: 90,
      })
    }

    // Printable Cut Border Notice
    page.drawText('Printable Physical Pass • Generated with QUBNEXA PKPASS Converter', {
      x: margin,
      y: cardTop - cardHeight - 30,
      size: 9,
      font,
      color: rgb(0.4, 0.4, 0.4),
    })

    const pdfBytes = await pdfDoc.save()
    const blob = new Blob([new Uint8Array(pdfBytes).buffer as ArrayBuffer], { type: 'application/pdf' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `${passData.serialNumber || 'pass'}.pdf`
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
            <Ticket className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Apple Wallet .PKPASS to PDF & Printable Pass Converter
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Open Apple Wallet passes on Windows and Android. Extract barcodes, inspect flight details, and generate printable PDFs.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1.5 transition-all"
          >
            <Printer className="h-3.5 w-3.5" />
            Print Paper Pass
          </button>
          <button
            type="button"
            onClick={handleDownloadPdf}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all"
          >
            <Download className="h-3.5 w-3.5" />
            Download PDF
          </button>
        </div>
      </div>

      {/* 2. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Inputs & File Upload (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* File Upload Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-500" />
              Upload .pkpass Archive
            </h3>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-900/30">
              <Ticket className="h-8 w-8 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                {isLoading ? 'Extracting Pass...' : 'Choose or drop Apple Wallet .pkpass file'}
              </span>
              <span className="text-[11px] text-slate-400 mt-1">Runs 100% locally in your browser</span>
              <input
                type="file"
                accept=".pkpass,application/vnd.apple.pkpass,application/zip"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900 text-xs text-rose-600 dark:text-rose-400 flex items-start gap-2">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{uploadError}</span>
              </div>
            )}
          </div>

          {/* Preset Sample Passes */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-500" />
              Or Test with Preloaded Apple Wallet Pass Presets:
            </h3>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => setPassData(PRESET_PASSES.boardingPass)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                  passData.type === 'boardingPass'
                    ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 font-semibold text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Plane className="h-4 w-4 text-blue-500" />
                  <div>
                    <div>Flight Boarding Pass</div>
                    <div className="text-[10px] text-slate-400 font-normal">JFK → LHR (Seat 14A)</div>
                  </div>
                </div>
                <span className="font-mono text-[10px]">SkyLine Air</span>
              </button>

              <button
                type="button"
                onClick={() => setPassData(PRESET_PASSES.eventTicket)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                  passData.type === 'eventTicket'
                    ? 'border-purple-600 bg-purple-50/50 dark:bg-purple-950/20 font-semibold text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Music className="h-4 w-4 text-purple-500" />
                  <div>
                    <div>Concert & Event Ticket</div>
                    <div className="text-[10px] text-slate-400 font-normal">The Neon Tour (Gate 4)</div>
                  </div>
                </div>
                <span className="font-mono text-[10px]">Live Events</span>
              </button>

              <button
                type="button"
                onClick={() => setPassData(PRESET_PASSES.coupon)}
                className={`p-3 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                  passData.type === 'coupon'
                    ? 'border-emerald-600 bg-emerald-50/50 dark:bg-emerald-950/20 font-semibold text-slate-900 dark:text-white'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Tag className="h-4 w-4 text-emerald-500" />
                  <div>
                    <div>VIP Retail Coupon</div>
                    <div className="text-[10px] text-slate-400 font-normal">25% Off Storewide</div>
                  </div>
                </div>
                <span className="font-mono text-[10px]">Luxe VIP</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Pass Visualizer Mockup (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-6 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Apple Wallet Pass Preview
                </h3>
                <p className="text-xs text-slate-400">
                  Exact visual rendering from pass.json specifications.
                </p>
              </div>

              <span className="text-[11px] font-mono uppercase px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400">
                SN: {passData.serialNumber}
              </span>
            </div>

            {/* Apple Wallet Card Mockup */}
            <div
              className="p-6 rounded-3xl shadow-xl transition-all max-w-md mx-auto space-y-6"
              style={{
                backgroundColor: passData.backgroundColor || '#0f172a',
                color: passData.foregroundColor || '#ffffff',
              }}
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="font-bold text-base tracking-wider uppercase">
                  {passData.logoText || passData.organizationName}
                </div>
                {passData.headerFields?.[0] && (
                  <div className="text-right">
                    <div
                      className="text-[10px] font-bold tracking-wider"
                      style={{ color: passData.labelColor || '#94a3b8' }}
                    >
                      {passData.headerFields[0].label}
                    </div>
                    <div className="font-bold text-sm">{passData.headerFields[0].value}</div>
                  </div>
                )}
              </div>

              {/* Primary Fields */}
              {passData.primaryFields && passData.primaryFields.length > 0 && (
                <div className="flex items-center justify-between py-2 border-y border-white/10">
                  {passData.primaryFields.map((field) => (
                    <div key={field.key}>
                      <div
                        className="text-[10px] font-bold tracking-wider uppercase"
                        style={{ color: passData.labelColor || '#94a3b8' }}
                      >
                        {field.label}
                      </div>
                      <div className="text-2xl sm:text-3xl font-black tracking-tight">{field.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Secondary Fields */}
              {passData.secondaryFields && passData.secondaryFields.length > 0 && (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {passData.secondaryFields.map((field) => (
                    <div key={field.key}>
                      <div
                        className="text-[10px] font-bold uppercase"
                        style={{ color: passData.labelColor || '#94a3b8' }}
                      >
                        {field.label}
                      </div>
                      <div className="font-semibold text-sm">{field.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Auxiliary Fields */}
              {passData.auxiliaryFields && passData.auxiliaryFields.length > 0 && (
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {passData.auxiliaryFields.map((field) => (
                    <div key={field.key}>
                      <div
                        className="text-[9px] font-bold uppercase"
                        style={{ color: passData.labelColor || '#94a3b8' }}
                      >
                        {field.label}
                      </div>
                      <div className="font-bold text-xs">{field.value}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* QR Code / Barcode Display */}
              <div className="p-4 bg-white rounded-2xl flex flex-col items-center justify-center space-y-1.5 shadow-md">
                {qrCodeUrl ? (
                  <img src={qrCodeUrl} alt="Pass Barcode" className="w-36 h-36 object-contain" />
                ) : (
                  <div className="w-36 h-36 flex items-center justify-center text-slate-400 text-xs">
                    Generating Code...
                  </div>
                )}
                {passData.barcode?.altText && (
                  <span className="font-mono text-[10px] text-slate-700 tracking-wider font-semibold">
                    {passData.barcode.altText}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PkpassToPdf

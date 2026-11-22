import React, { useState, useRef, useEffect } from 'react'
import {
  Maximize2,
  Upload,
  Download,
  Palette,
  Image as ImageIcon,
} from 'lucide-react'

interface AspectPreset {
  name: string
  ratio: number // width / height
  width: number
  height: number
  description: string
}

const ASPECT_PRESETS: AspectPreset[] = [
  { name: '16:9 Landscape', ratio: 16 / 9, width: 1920, height: 1080, description: 'YouTube Video & Desktop Banners' },
  { name: '9:16 Vertical', ratio: 9 / 16, width: 1080, height: 1920, description: 'Instagram Reels, TikTok & Shorts' },
  { name: '1:1 Square', ratio: 1, width: 1080, height: 1080, description: 'Instagram Feed & Product Catalogs' },
  { name: '4:5 Portrait', ratio: 4 / 5, width: 1080, height: 1350, description: 'Instagram Post Optimum Feed Size' },
  { name: '2:1 Twitter/X', ratio: 2, width: 1200, height: 600, description: 'X / Twitter Link Preview Header' },
]

export const ImageBackgroundExtender: React.FC = () => {
  const [imageElement, setImageElement] = useState<HTMLImageElement | null>(() => {
    if (typeof document === 'undefined') return null
    const canvas = document.createElement('canvas')
    canvas.width = 600
    canvas.height = 600
    const ctx = canvas.getContext('2d')
    if (ctx) {
      const grad = ctx.createLinearGradient(0, 0, 600, 600)
      grad.addColorStop(0, '#3b82f6')
      grad.addColorStop(1, '#8b5cf6')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 600, 600)

      ctx.fillStyle = '#ffffff'
      ctx.beginPath()
      ctx.arc(300, 300, 120, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#1e1b4b'
      ctx.font = 'bold 36px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.fillText('PRODUCT', 300, 300)

      const img = new Image()
      img.src = canvas.toDataURL('image/png')
      return img
    }
    return null
  })

  // Target canvas preset
  const [selectedPreset, setSelectedPreset] = useState<AspectPreset>(ASPECT_PRESETS[0])

  // Extension Style: 'blur_backdrop' | 'gradient' | 'solid' | 'edge_mirror'
  const [fillMode, setFillMode] = useState<'blur_backdrop' | 'gradient' | 'solid' | 'edge_mirror'>('blur_backdrop')

  // Controls
  const [solidColor, setSolidColor] = useState('#0f172a')
  const [blurAmount, setBlurAmount] = useState(25)
  const [subjectScale, setSubjectScale] = useState(85) // percentage
  const [addShadow, setAddShadow] = useState(true)
  const [borderRadius, setBorderRadius] = useState(12)

  // Output Canvas
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Handle User File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      const img = new Image()
      img.src = result
      img.onload = () => setImageElement(img)
    }
    reader.readAsDataURL(file)
  }

  // Draw extended canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !imageElement) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const targetW = selectedPreset.width
    const targetH = selectedPreset.height

    canvas.width = targetW
    canvas.height = targetH

    ctx.clearRect(0, 0, targetW, targetH)

    // 1. Render Background Extension Fill
    if (fillMode === 'solid') {
      ctx.fillStyle = solidColor
      ctx.fillRect(0, 0, targetW, targetH)
    } else if (fillMode === 'gradient') {
      const grad = ctx.createLinearGradient(0, 0, targetW, targetH)
      grad.addColorStop(0, '#1e293b')
      grad.addColorStop(0.5, '#0f172a')
      grad.addColorStop(1, '#020617')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, targetW, targetH)
    } else if (fillMode === 'blur_backdrop' || fillMode === 'edge_mirror') {
      // Scale up original image to fill canvas, then blur
      ctx.save()
      ctx.filter = `blur(${blurAmount}px) brightness(0.85)`

      // Cover scaling calculation
      const scaleX = targetW / imageElement.naturalWidth
      const scaleY = targetH / imageElement.naturalHeight
      const coverScale = Math.max(scaleX, scaleY) * 1.2

      const bgW = imageElement.naturalWidth * coverScale
      const bgH = imageElement.naturalHeight * coverScale
      const bgX = (targetW - bgW) / 2
      const bgY = (targetH - bgH) / 2

      ctx.drawImage(imageElement, bgX, bgY, bgW, bgH)
      ctx.restore()
    }

    // 2. Render Foreground Subject (Calculated Position & Scale)
    const scaleFactor = (subjectScale / 100)
    const originalRatio = imageElement.naturalWidth / imageElement.naturalHeight
    const targetRatio = targetW / targetH

    let fgW = 0
    let fgH = 0

    if (originalRatio > targetRatio) {
      fgW = targetW * scaleFactor
      fgH = fgW / originalRatio
    } else {
      fgH = targetH * scaleFactor
      fgW = fgH * originalRatio
    }

    const fgX = (targetW - fgW) / 2
    const fgY = (targetH - fgH) / 2

    ctx.save()

    // Shadow
    if (addShadow) {
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)'
      ctx.shadowBlur = 40
      ctx.shadowOffsetX = 0
      ctx.shadowOffsetY = 15
    }

    // Rounded clipping
    if (borderRadius > 0) {
      ctx.beginPath()
      const radius = (borderRadius / 100) * Math.min(fgW, fgH) * 0.2
      ctx.roundRect(fgX, fgY, fgW, fgH, radius)
      ctx.clip()
    }

    ctx.drawImage(imageElement, fgX, fgY, fgW, fgH)
    ctx.restore()
  }, [
    imageElement,
    selectedPreset,
    fillMode,
    solidColor,
    blurAmount,
    subjectScale,
    addShadow,
    borderRadius,
  ])

  // Download Output PNG
  const handleDownload = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.download = `extended-${selectedPreset.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.png`
    link.href = canvas.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="space-y-8">
      {/* 1. Header Toolbar */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-500">
            <Maximize2 className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              Canvas Image Background Extender & Aspect Ratio Expander
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Expand images into 16:9, 9:16 vertical, or custom aspect ratios with ambient blurred backdrops and gradient fills (100% in-browser canvas padding, zero cloud upload).
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleDownload}
          className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-all self-start md:self-auto"
        >
          <Download className="h-4 w-4" />
          Download Extended Image (PNG)
        </button>
      </div>

      {/* 2. Main Builder Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Config Panel (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Upload Box */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Upload className="h-4 w-4 text-blue-500" />
              Upload Source Image
            </h3>

            <label className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-blue-500 transition-all bg-slate-50/50 dark:bg-slate-900/30">
              <ImageIcon className="h-8 w-8 text-slate-400 mb-2" />
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                Click to browse or drag & drop image
              </span>
              <span className="text-[11px] text-slate-400 mt-1">Supports PNG, JPG, WebP</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Aspect Ratio Presets */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Maximize2 className="h-4 w-4 text-purple-500" />
              Target Output Format
            </h3>

            <div className="grid grid-cols-1 gap-2">
              {ASPECT_PRESETS.map((preset) => {
                const isSelected = selectedPreset.name === preset.name
                return (
                  <button
                    key={preset.name}
                    type="button"
                    onClick={() => setSelectedPreset(preset)}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between text-xs transition-all ${
                      isSelected
                        ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/20 text-slate-900 dark:text-white font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div>
                      <div>{preset.name}</div>
                      <div className="text-[10px] text-slate-400 font-normal">{preset.description}</div>
                    </div>
                    <span className="font-mono text-[10px] text-slate-500">
                      {preset.width}x{preset.height}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Extension Fill Style */}
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
              <Palette className="h-4 w-4 text-emerald-500" />
              Background Fill Technique
            </h3>

            <div className="grid grid-cols-3 gap-2 text-xs font-medium">
              <button
                type="button"
                onClick={() => setFillMode('blur_backdrop')}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  fillMode === 'blur_backdrop'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Ambient Blur
              </button>
              <button
                type="button"
                onClick={() => setFillMode('gradient')}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  fillMode === 'gradient'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Dark Gradient
              </button>
              <button
                type="button"
                onClick={() => setFillMode('solid')}
                className={`py-2 px-2 rounded-xl border text-center transition-all ${
                  fillMode === 'solid'
                    ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400 font-bold'
                    : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Solid Tone
              </button>
            </div>

            {fillMode === 'solid' && (
              <div className="pt-2">
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  Solid Color Tone
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="h-8 w-10 p-0 rounded border cursor-pointer bg-transparent"
                  />
                  <input
                    type="text"
                    value={solidColor}
                    onChange={(e) => setSolidColor(e.target.value)}
                    className="w-full px-2 py-1 text-xs font-mono rounded border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            )}

            {/* Scale & Subject Controls */}
            <div className="space-y-3 pt-2 border-t border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-slate-600 dark:text-slate-400">Foreground Subject Scale</span>
                  <span className="font-bold text-blue-600">{subjectScale}%</span>
                </div>
                <input
                  type="range"
                  min="40"
                  max="100"
                  value={subjectScale}
                  onChange={(e) => setSubjectScale(parseInt(e.target.value))}
                  className="w-full accent-blue-600"
                />
              </div>

              {fillMode === 'blur_backdrop' && (
                <div>
                  <div className="flex justify-between items-center text-xs mb-1">
                    <span className="text-slate-600 dark:text-slate-400">Background Blur Intensity</span>
                    <span className="font-bold text-purple-600">{blurAmount}px</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={blurAmount}
                    onChange={(e) => setBlurAmount(parseInt(e.target.value))}
                    className="w-full accent-purple-600"
                  />
                </div>
              )}

              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={addShadow}
                    onChange={(e) => setAddShadow(e.target.checked)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Add Depth Drop Shadow
                </label>

                <label className="flex items-center gap-2 cursor-pointer text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={borderRadius > 0}
                    onChange={(e) => setBorderRadius(e.target.checked ? 12 : 0)}
                    className="rounded text-blue-600 focus:ring-blue-500"
                  />
                  Rounded Corners
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Right Canvas Preview (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-[#0c1222] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Live Extended Canvas Preview
                </h3>
                <p className="text-xs text-slate-400">
                  Full {selectedPreset.width} x {selectedPreset.height} resolution rendering.
                </p>
              </div>

              <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300">
                {selectedPreset.name}
              </span>
            </div>

            {/* Canvas Container with aspect preservation */}
            <div className="p-4 rounded-xl bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex items-center justify-center min-h-[460px] overflow-hidden">
              <canvas
                ref={canvasRef}
                className="max-h-[520px] max-w-full rounded-lg shadow-lg object-contain"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImageBackgroundExtender

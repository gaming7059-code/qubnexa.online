import React, { useState, useRef, useEffect, useCallback, useId } from 'react'
import {
  Upload,
  Image as ImageIcon,
  Download,
  RotateCcw,
  Sliders,
  Maximize2,
  Lock,
  Unlock,
  AlertCircle,
  RefreshCw,
  Sparkles,
  Layers,
  X,
  FileImage,
} from 'lucide-react'
import {
  RESIZE_PRESETS,
  MIN_DIMENSION,
  MAX_DIMENSION,
  type SupportedMimeType,
  validateImageFile,
  clampDimension,
  calculateHeightFromWidth,
  calculateWidthFromHeight,
  formatBytes,
  generateResizedFilename,
  calculateSizeDelta,
  type ResizePreset,
} from '../../utils/imageResizer'

export const ImageResizer: React.FC = () => {
  const fileInputId = useId()
  const widthInputId = useId()
  const heightInputId = useId()
  const qualityInputId = useId()

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [, setOriginalUrl] = useState<string | null>(null)
  const [originalWidth, setOriginalWidth] = useState<number>(0)
  const [originalHeight, setOriginalHeight] = useState<number>(0)
  const [originalSize, setOriginalSize] = useState<number>(0)

  // Target Settings
  const [targetWidth, setTargetWidth] = useState<number>(0)
  const [targetHeight, setTargetHeight] = useState<number>(0)
  const [maintainAspectRatio, setMaintainAspectRatio] = useState<boolean>(true)
  const [outputFormat, setOutputFormat] = useState<SupportedMimeType>('image/jpeg')
  const [quality, setQuality] = useState<number>(90)
  const [activePresetId, setActivePresetId] = useState<string | null>(null)

  // Resized Output State
  const [resizedUrl, setResizedUrl] = useState<string | null>(null)
  const [resizedSize, setResizedSize] = useState<number>(0)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)

  const fileInputRef = useRef<HTMLInputElement>(null)
  const loadedImageRef = useRef<HTMLImageElement | null>(null)
  const originalUrlRef = useRef<string | null>(null)
  const resizedUrlRef = useRef<string | null>(null)
  const renderTimeoutRef = useRef<number | null>(null)

  // Cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
      if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current)
      if (renderTimeoutRef.current) clearTimeout(renderTimeoutRef.current)
    }
  }, [])

  // Execute Canvas Resize
  const renderResizedImage = useCallback(
    (width: number, height: number, format: SupportedMimeType, qual: number) => {
      if (!loadedImageRef.current || width <= 0 || height <= 0) return

      setIsProcessing(true)

      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current)
      }

      renderTimeoutRef.current = window.setTimeout(() => {
        try {
          const img = loadedImageRef.current
          if (!img) return

          const canvas = document.createElement('canvas')
          canvas.width = width
          canvas.height = height

          const ctx = canvas.getContext('2d')
          if (!ctx) {
            setErrorMessage('Unable to initialize canvas context for resizing.')
            setIsProcessing(false)
            return
          }

          ctx.imageSmoothingEnabled = true
          ctx.imageSmoothingQuality = 'high'
          ctx.drawImage(img, 0, 0, width, height)

          const exportQuality = format === 'image/png' ? undefined : qual / 100

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                setErrorMessage('Failed to generate resized image blob.')
                setIsProcessing(false)
                return
              }

              if (resizedUrlRef.current) {
                URL.revokeObjectURL(resizedUrlRef.current)
              }

              const newBlobUrl = URL.createObjectURL(blob)
              resizedUrlRef.current = newBlobUrl
              setResizedUrl(newBlobUrl)
              setResizedSize(blob.size)
              setIsProcessing(false)
            },
            format,
            exportQuality,
          )
        } catch {
          setErrorMessage('An error occurred during canvas processing.')
          setIsProcessing(false)
        }
      }, 120)
    },
    [],
  )

  // Load a file into memory
  const processFile = useCallback(
    (file: File) => {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setErrorMessage(validation.error)
        return
      }

      setErrorMessage(null)

      if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
      if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current)

      const url = URL.createObjectURL(file)
      originalUrlRef.current = url
      setOriginalUrl(url)
      setImageFile(file)
      setOriginalSize(file.size)

      const img = new Image()
      img.onload = () => {
        loadedImageRef.current = img
        const w = img.naturalWidth
        const h = img.naturalHeight

        setOriginalWidth(w)
        setOriginalHeight(h)
        setTargetWidth(w)
        setTargetHeight(h)
        setActivePresetId(null)
        setMaintainAspectRatio(true)

        // Initial format defaults to original MIME if supported
        const defaultFmt: SupportedMimeType =
          file.type === 'image/png' || file.type === 'image/webp' ? (file.type as SupportedMimeType) : 'image/jpeg'
        setOutputFormat(defaultFmt)

        renderResizedImage(w, h, defaultFmt, quality)
      }

      img.onerror = () => {
        setErrorMessage('Failed to decode image file. The file may be corrupted.')
      }

      img.src = url
    },
    [quality, renderResizedImage],
  )

  const handleWidthChange = (valStr: string) => {
    const val = parseInt(valStr, 10)
    if (isNaN(val)) {
      setTargetWidth(0)
      return
    }

    const clampedW = clampDimension(val)
    setTargetWidth(clampedW)
    setActivePresetId(null)

    if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const newH = calculateHeightFromWidth(clampedW, originalWidth, originalHeight)
      setTargetHeight(newH)
      renderResizedImage(clampedW, newH, outputFormat, quality)
    } else {
      renderResizedImage(clampedW, targetHeight, outputFormat, quality)
    }
  }

  const handleHeightChange = (valStr: string) => {
    const val = parseInt(valStr, 10)
    if (isNaN(val)) {
      setTargetHeight(0)
      return
    }

    const clampedH = clampDimension(val)
    setTargetHeight(clampedH)
    setActivePresetId(null)

    if (maintainAspectRatio && originalWidth > 0 && originalHeight > 0) {
      const newW = calculateWidthFromHeight(clampedH, originalWidth, originalHeight)
      setTargetWidth(newW)
      renderResizedImage(newW, clampedH, outputFormat, quality)
    } else {
      renderResizedImage(targetWidth, clampedH, outputFormat, quality)
    }
  }

  const handleApplyPreset = (preset: ResizePreset) => {
    setActivePresetId(preset.id)
    setTargetWidth(preset.width)
    setTargetHeight(preset.height)
    setMaintainAspectRatio(false) // Presets set explicit target dimensions
    renderResizedImage(preset.width, preset.height, outputFormat, quality)
  }

  const handleFormatChange = (newFormat: SupportedMimeType) => {
    setOutputFormat(newFormat)
    renderResizedImage(targetWidth, targetHeight, newFormat, quality)
  }

  const handleQualityChange = (newQuality: number) => {
    setQuality(newQuality)
    renderResizedImage(targetWidth, targetHeight, outputFormat, newQuality)
  }

  const handleReset = () => {
    if (!originalWidth || !originalHeight) return
    setTargetWidth(originalWidth)
    setTargetHeight(originalHeight)
    setMaintainAspectRatio(true)
    setActivePresetId(null)
    setQuality(90)
    renderResizedImage(originalWidth, originalHeight, outputFormat, 90)
  }

  const handleClear = () => {
    if (originalUrlRef.current) URL.revokeObjectURL(originalUrlRef.current)
    if (resizedUrlRef.current) URL.revokeObjectURL(resizedUrlRef.current)
    originalUrlRef.current = null
    resizedUrlRef.current = null
    loadedImageRef.current = null
    setImageFile(null)
    setOriginalUrl(null)
    setResizedUrl(null)
    setOriginalWidth(0)
    setOriginalHeight(0)
    setOriginalSize(0)
    setTargetWidth(0)
    setTargetHeight(0)
    setResizedSize(0)
    setActivePresetId(null)
    setErrorMessage(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleDownload = () => {
    if (!resizedUrl || !imageFile) return
    const filename = generateResizedFilename(imageFile.name, targetWidth, targetHeight, outputFormat)
    const link = document.createElement('a')
    link.href = resizedUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSample = () => {
    // Generate a high-resolution 1920x1080 synthetic test photo canvas
    const sampleCanvas = document.createElement('canvas')
    sampleCanvas.width = 1920
    sampleCanvas.height = 1080
    const ctx = sampleCanvas.getContext('2d')
    if (ctx) {
      // Atmospheric gradient background
      const grad = ctx.createLinearGradient(0, 0, 1920, 1080)
      grad.addColorStop(0, '#0F172A')
      grad.addColorStop(0.5, '#1E293B')
      grad.addColorStop(1, '#0284C7')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, 1920, 1080)

      // Geometry details
      ctx.fillStyle = '#00DFFF22'
      ctx.beginPath()
      ctx.arc(960, 540, 300, 0, Math.PI * 2)
      ctx.fill()

      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 64px sans-serif'
      ctx.textAlign = 'center'
      ctx.fillText('QUBNEXA SAMPLE PHOTO', 960, 520)

      ctx.font = '32px sans-serif'
      ctx.fillStyle = '#94A3B8'
      ctx.fillText('1920 × 1080 • Ultra HD Canvas Test', 960, 580)

      sampleCanvas.toBlob(
        (blob) => {
          if (blob) {
            const file = new File([blob], 'sample-landscape-1920x1080.jpg', { type: 'image/jpeg' })
            processFile(file)
          }
        },
        'image/jpeg',
        0.92,
      )
    }
  }

  const sizeDelta = calculateSizeDelta(originalSize, resizedSize)

  return (
    <div className="w-full space-y-8">
      {/* Upload Zone */}
      {!imageFile ? (
        <div
          onDragOver={(e) => {
            e.preventDefault()
            setIsDragOver(true)
          }}
          onDragLeave={() => setIsDragOver(false)}
          onDrop={(e) => {
            e.preventDefault()
            setIsDragOver(false)
            if (e.dataTransfer.files && e.dataTransfer.files[0]) {
              processFile(e.dataTransfer.files[0])
            }
          }}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all ${
            isDragOver
              ? 'border-cyan-500 bg-cyan-50/50 dark:bg-cyan-950/20'
              : 'border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0B0F19] hover:border-slate-400 dark:hover:border-slate-700'
          }`}
        >
          <input
            id={fileInputId}
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                processFile(e.target.files[0])
              }
            }}
          />

          <div className="flex flex-col items-center justify-center space-y-4 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-cyan-50 dark:bg-[#11182D] border border-cyan-100 dark:border-[#00DFFF]/20 flex items-center justify-center text-cyan-600 dark:text-[#00DFFF] shadow-xs">
              <Upload className="w-8 h-8" />
            </div>

            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Drag and drop your image here
              </h2>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Supports JPG, JPEG, PNG, and WebP up to 50 MB. 100% client-side privacy.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
              >
                Browse Image
              </button>

              <button
                type="button"
                onClick={handleSample}
                className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Try Sample Image</span>
              </button>
            </div>
          </div>

          {errorMessage && (
            <div className="mt-6 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-center justify-center gap-2 text-rose-700 dark:text-rose-300 text-sm max-w-lg mx-auto">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{errorMessage}</span>
            </div>
          )}
        </div>
      ) : (
        /* Workspace when image is loaded */
        <div className="space-y-8">
          {/* Top Bar with File Details and Reset/Clear buttons */}
          <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-10 h-10 rounded-xl bg-slate-100 dark:bg-[#11182D] flex items-center justify-center text-cyan-600 dark:text-[#00DFFF] shrink-0">
                <FileImage className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate max-w-xs sm:max-w-md">
                  {imageFile.name}
                </div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  <span className="font-mono">
                    {originalWidth} × {originalHeight} px
                  </span>
                  <span>•</span>
                  <span>{formatBytes(originalSize)}</span>
                  <span>•</span>
                  <span className="uppercase font-medium text-slate-600 dark:text-slate-300">
                    {imageFile.type.replace('image/', '')}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium transition-colors cursor-pointer"
                title="Reset dimensions to original size"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>

              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-rose-50 dark:hover:bg-rose-950/40 text-slate-700 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-medium transition-colors cursor-pointer"
                title="Clear and upload a new image"
              >
                <X className="w-3.5 h-3.5" />
                <span>Upload New</span>
              </button>
            </div>
          </div>

          {/* Main Controls & Live Preview Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Controls (5 cols) */}
            <div className="lg:col-span-5 space-y-6">
              {/* Dimensions Panel */}
              <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                    <Maximize2 className="w-4 h-4 text-cyan-600 dark:text-[#00DFFF]" />
                    Target Dimensions
                  </h3>
                  <button
                    type="button"
                    onClick={() => setMaintainAspectRatio(!maintainAspectRatio)}
                    className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      maintainAspectRatio
                        ? 'bg-cyan-50 dark:bg-[#11182D] text-cyan-700 dark:text-[#00DFFF] border-cyan-200 dark:border-[#00DFFF]/30'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    {maintainAspectRatio ? (
                      <>
                        <Lock className="w-3 h-3 text-cyan-600 dark:text-[#00DFFF]" />
                        <span>Aspect Locked</span>
                      </>
                    ) : (
                      <>
                        <Unlock className="w-3 h-3 text-slate-400" />
                        <span>Unlocked</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor={widthInputId}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
                    >
                      Width (px)
                    </label>
                    <input
                      id={widthInputId}
                      type="number"
                      min={MIN_DIMENSION}
                      max={MAX_DIMENSION}
                      value={targetWidth || ''}
                      onChange={(e) => handleWidthChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#11182D] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-[#00DFFF]"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor={heightInputId}
                      className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1.5"
                    >
                      Height (px)
                    </label>
                    <input
                      id={heightInputId}
                      type="number"
                      min={MIN_DIMENSION}
                      max={MAX_DIMENSION}
                      value={targetHeight || ''}
                      onChange={(e) => handleHeightChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 dark:bg-[#11182D] border border-slate-300 dark:border-slate-700 rounded-xl text-slate-900 dark:text-slate-100 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-[#00DFFF]"
                    />
                  </div>
                </div>

                {/* Preset Sizes */}
                <div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2.5 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-slate-400" />
                    <span>Popular Social & Video Presets</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {RESIZE_PRESETS.map((preset) => {
                      const isActive = activePresetId === preset.id
                      return (
                        <button
                          key={preset.id}
                          type="button"
                          onClick={() => handleApplyPreset(preset)}
                          className={`p-2.5 text-left rounded-xl border text-xs transition-all cursor-pointer ${
                            isActive
                              ? 'border-cyan-500 bg-cyan-50 dark:bg-[#11182D] text-cyan-900 dark:text-[#00DFFF] font-semibold'
                              : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div className="truncate font-medium">{preset.name}</div>
                          <div className="font-mono text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                            {preset.width} × {preset.height} ({preset.aspectRatioLabel})
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Output Format & Quality */}
              <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
                <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-cyan-600 dark:text-[#00DFFF]" />
                  Output Format & Quality
                </h3>

                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-2">
                    Format
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {(['image/jpeg', 'image/png', 'image/webp'] as SupportedMimeType[]).map((fmt) => {
                      const label = fmt === 'image/jpeg' ? 'JPG' : fmt === 'image/png' ? 'PNG' : 'WebP'
                      const isSelected = outputFormat === fmt
                      return (
                        <button
                          key={fmt}
                          type="button"
                          onClick={() => handleFormatChange(fmt)}
                          className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                              : 'bg-slate-50 dark:bg-[#11182D] text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                          }`}
                        >
                          {label}
                        </button>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label
                      htmlFor={qualityInputId}
                      className="text-xs font-medium text-slate-600 dark:text-slate-400"
                    >
                      Compression Quality
                    </label>
                    <span className="font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {outputFormat === 'image/png' ? 'Lossless (PNG)' : `${quality}%`}
                    </span>
                  </div>

                  <input
                    id={qualityInputId}
                    type="range"
                    min="10"
                    max="100"
                    step="5"
                    disabled={outputFormat === 'image/png'}
                    value={quality}
                    onChange={(e) => handleQualityChange(parseInt(e.target.value, 10))}
                    className="w-full accent-cyan-600 dark:accent-[#00DFFF] cursor-pointer disabled:opacity-40"
                  />
                  <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                    <span>Smaller Size (10%)</span>
                    <span>Best Quality (100%)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Preview & Output Metrics (7 cols) */}
            <div className="lg:col-span-7 space-y-6">
              <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-5 space-y-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                      <ImageIcon className="w-4 h-4 text-cyan-600 dark:text-[#00DFFF]" />
                      Resized Preview & Comparison
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      Live client-side rendering with bilinear canvas smoothing.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleDownload}
                    disabled={isProcessing || !resizedUrl}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-semibold text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download Image</span>
                  </button>
                </div>

                {/* Metrics Pill Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Target Size</div>
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {targetWidth} × {targetHeight} px
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Output File Size</div>
                    <div className="font-mono text-xs font-bold text-slate-900 dark:text-slate-100 mt-1">
                      {formatBytes(resizedSize)}
                    </div>
                  </div>

                  <div className="col-span-2 sm:col-span-1 p-3 rounded-xl bg-slate-50 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800">
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">Size Difference</div>
                    <div
                      className={`text-xs font-bold mt-1 ${
                        sizeDelta.isReduction
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : 'text-amber-600 dark:text-amber-400'
                      }`}
                    >
                      {sizeDelta.label}
                    </div>
                  </div>
                </div>

                {/* Preview Viewport */}
                <div className="relative bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center min-h-[320px] max-h-[460px]">
                  {resizedUrl ? (
                    <img
                      src={resizedUrl}
                      alt="Resized output preview"
                      className="max-w-full max-h-[460px] object-contain transition-all"
                    />
                  ) : (
                    <div className="text-slate-500 text-xs flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Generating preview...</span>
                    </div>
                  )}

                  {isProcessing && (
                    <div className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center text-xs font-semibold text-white gap-2">
                      <RefreshCw className="w-4 h-4 animate-spin text-cyan-400" />
                      <span>Resizing image...</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

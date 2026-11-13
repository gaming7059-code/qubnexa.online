import React, { useState, useCallback, useId } from 'react'
import {
  Download,
  ClipboardPaste,
  X,
  ExternalLink,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Image as ImageIcon,
  Loader2,
  Film,
  Monitor,
  Info,
} from 'lucide-react'
import {
  validateYouTubeInput,
  getThumbnailResolutions,
  probeThumbnailAvailability,
  downloadThumbnailFile,
  type ThumbnailResolution,
  type ResolutionId,
} from '../../utils/youtubeThumbnail'

const SAMPLE_VIDEO_URL = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ'

export const YouTubeThumbnailDownloader: React.FC = () => {
  const inputId = useId()
  const [inputValue, setInputValue] = useState<string>('')
  const [activeVideoId, setActiveVideoId] = useState<string | null>(null)
  const [resolutions, setResolutions] = useState<ThumbnailResolution[]>([])
  const [availabilityMap, setAvailabilityMap] = useState<Record<ResolutionId, boolean>>({
    maxres: false,
    sd: false,
    hq: true,
    mq: true,
    default: true,
  })
  const [isProbing, setIsProbing] = useState<boolean>(false)
  const [downloadingId, setDownloadingId] = useState<string | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [detectedType, setDetectedType] = useState<string | null>(null)

  // Probe availability whenever activeVideoId changes
  const checkResolutions = useCallback(async (videoId: string) => {
    setIsProbing(true)
    const list = getThumbnailResolutions(videoId)
    setResolutions(list)

    // Baseline: HQ, MQ, and default are always guaranteed by YouTube
    const newAvail: Record<ResolutionId, boolean> = {
      maxres: false,
      sd: false,
      hq: true,
      mq: true,
      default: true,
    }

    try {
      const maxresItem = list.find((r) => r.id === 'maxres')
      const sdItem = list.find((r) => r.id === 'sd')

      const [maxresAvailable, sdAvailable] = await Promise.all([
        maxresItem ? probeThumbnailAvailability(maxresItem.url) : Promise.resolve(false),
        sdItem ? probeThumbnailAvailability(sdItem.url) : Promise.resolve(false),
      ])

      newAvail.maxres = maxresAvailable
      newAvail.sd = sdAvailable
    } catch {
      // In case of network errors, leave guaranteed ones true
    } finally {
      setAvailabilityMap(newAvail)
      setIsProbing(false)
    }
  }, [])

  const handleExtract = useCallback(() => {
    const trimmed = inputValue.trim()
    if (!trimmed) {
      setValidationError('Please enter a YouTube video URL or 11-character video ID.')
      setActiveVideoId(null)
      setResolutions([])
      return
    }

    const validation = validateYouTubeInput(trimmed)
    if (!validation.valid || !validation.videoId) {
      setValidationError(validation.error || 'Invalid YouTube video URL.')
      setActiveVideoId(null)
      setResolutions([])
      return
    }

    setValidationError(null)
    setDetectedType(validation.detectedType)
    setActiveVideoId(validation.videoId)
    checkResolutions(validation.videoId)
  }, [inputValue, checkResolutions])

  const handlePaste = async () => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        const text = await navigator.clipboard.readText()
        if (text) {
          setInputValue(text.trim())
          const validation = validateYouTubeInput(text.trim())
          if (validation.valid && validation.videoId) {
            setValidationError(null)
            setDetectedType(validation.detectedType)
            setActiveVideoId(validation.videoId)
            checkResolutions(validation.videoId)
          }
        }
      }
    } catch {
      // Clipboard permissions denied; user can paste manually
    }
  }

  const handleSample = () => {
    setInputValue(SAMPLE_VIDEO_URL)
    setValidationError(null)
    const validation = validateYouTubeInput(SAMPLE_VIDEO_URL)
    if (validation.valid && validation.videoId) {
      setDetectedType(validation.detectedType)
      setActiveVideoId(validation.videoId)
      checkResolutions(validation.videoId)
    }
  }

  const handleClear = () => {
    setInputValue('')
    setActiveVideoId(null)
    setResolutions([])
    setValidationError(null)
    setDetectedType(null)
  }

  const handleCopy = async (text: string, key: string) => {
    try {
      if (typeof navigator !== 'undefined' && navigator.clipboard) {
        await navigator.clipboard.writeText(text)
        setCopiedKey(key)
        setTimeout(() => setCopiedKey(null), 2000)
      }
    } catch {
      // Fallback
    }
  }

  const handleDownload = async (item: ThumbnailResolution) => {
    setDownloadingId(item.id)
    try {
      await downloadThumbnailFile(item.url, item.filename)
    } finally {
      setDownloadingId(null)
    }
  }

  return (
    <div className="w-full space-y-8">
      {/* Search / Input Box */}
      <div className="bg-white dark:bg-[#0B0F19] rounded-2xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
        <label htmlFor={inputId} className="block text-sm font-semibold text-slate-800 dark:text-slate-200 mb-2">
          YouTube Video URL or Video ID
        </label>
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              id={inputId}
              type="text"
              value={inputValue}
              onChange={(e) => {
                setInputValue(e.target.value)
                if (validationError) setValidationError(null)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  handleExtract()
                }
              }}
              placeholder="e.g. https://www.youtube.com/watch?v=dQw4w9WgXcQ or youtu.be/..."
              className="w-full px-4 py-3 bg-slate-50 dark:bg-[#11182D] border border-slate-300 dark:border-slate-700/80 rounded-xl text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-500 dark:focus:ring-[#00DFFF] text-sm pr-10 transition-colors"
            />
            {inputValue && (
              <button
                type="button"
                onClick={handleClear}
                aria-label="Clear input"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              title="Paste from clipboard"
            >
              <ClipboardPaste className="w-4 h-4 text-cyan-600 dark:text-[#00DFFF]" />
              <span className="hidden sm:inline">Paste</span>
            </button>

            <button
              type="button"
              onClick={handleSample}
              className="inline-flex items-center gap-1.5 px-3.5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-[#11182D] hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-sm font-medium transition-colors cursor-pointer"
              title="Try sample video"
            >
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="hidden sm:inline">Sample</span>
            </button>

            <button
              type="button"
              onClick={handleExtract}
              disabled={isProbing}
              className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-sm transition-all cursor-pointer disabled:opacity-50"
            >
              {isProbing ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Checking...</span>
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  <span>Get Thumbnails</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Validation Error Message */}
        {validationError && (
          <div className="mt-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-sm">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-500 mt-0.5" />
            <span>{validationError}</span>
          </div>
        )}

        {/* Active Detection Banner */}
        {activeVideoId && !validationError && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">Detected Video:</span>
              <span className="font-mono px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-medium">
                {activeVideoId}
              </span>
              {detectedType && (
                <span className="capitalize px-2 py-0.5 rounded bg-cyan-50 dark:bg-[#11182D] text-cyan-700 dark:text-[#00DFFF] border border-cyan-200 dark:border-[#00DFFF]/30">
                  {detectedType}
                </span>
              )}
              <button
                type="button"
                onClick={() => handleCopy(activeVideoId, 'video-id')}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-cyan-600 dark:hover:text-[#00DFFF] transition-colors"
                title="Copy Video ID"
              >
                {copiedKey === 'video-id' ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span className="text-emerald-500 font-medium">Copied ID</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>

            <div className="flex items-center gap-3">
              <a
                href={`https://www.youtube.com/watch?v=${activeVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-slate-600 dark:text-slate-400 hover:text-cyan-600 dark:hover:text-[#00DFFF] transition-colors"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Watch on YouTube</span>
              </a>
              <button
                type="button"
                onClick={handleClear}
                className="inline-flex items-center gap-1 text-slate-500 hover:text-rose-500 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Resolutions Grid */}
      {activeVideoId && resolutions.length > 0 && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-cyan-600 dark:text-[#00DFFF]" />
                Available Thumbnail Resolutions
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Preview and save official YouTube thumbnail formats in original dimensions with zero compression.
              </p>
            </div>
            {isProbing && (
              <div className="inline-flex items-center gap-2 text-xs text-cyan-600 dark:text-[#00DFFF]">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>Verifying HD availability...</span>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resolutions.map((item) => {
              const isAvailable = availabilityMap[item.id]
              const isDownloading = downloadingId === item.id
              const isCopied = copiedKey === item.id

              return (
                <div
                  key={item.id}
                  className={`flex flex-col rounded-2xl border transition-all overflow-hidden ${
                    isAvailable
                      ? 'bg-white dark:bg-[#0B0F19] border-slate-200 dark:border-slate-800 hover:border-cyan-500/50 dark:hover:border-[#00DFFF]/40 shadow-sm'
                      : 'bg-slate-50/50 dark:bg-slate-900/30 border-slate-200/60 dark:border-slate-800/50 opacity-75'
                  }`}
                >
                  {/* Card Header */}
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm truncate">
                        {item.label}
                      </h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                          {item.resolution}
                        </span>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400">
                          {item.aspectRatio} Aspect Ratio
                        </span>
                      </div>
                    </div>

                    <div>
                      {isAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/80">
                          <CheckCircle2 className="w-3 h-3" />
                          Available
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/80">
                          <AlertCircle className="w-3 h-3" />
                          Not in 720p+
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Thumbnail Preview */}
                  <div className="relative bg-slate-950 flex items-center justify-center overflow-hidden aspect-video group">
                    <img
                      src={item.url}
                      alt={`YouTube thumbnail ${item.label} for ${activeVideoId}`}
                      loading="lazy"
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none'
                      }}
                    />
                    {!isAvailable && (
                      <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center">
                        <AlertCircle className="w-8 h-8 text-amber-400 mb-2" />
                        <p className="text-xs font-semibold text-slate-200">
                          {item.id === 'maxres' ? '1280×720 MaxRes Unavailable' : 'Resolution Unavailable'}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-1 max-w-xs">
                          YouTube generates this resolution only when the original video was uploaded at 720p or higher.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Card Actions */}
                  <div className="p-4 mt-auto bg-slate-50/50 dark:bg-[#11182D]/50 border-t border-slate-100 dark:border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleCopy(item.url, item.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#00DFFF] hover:border-cyan-500/50 transition-colors cursor-pointer"
                        title="Copy direct image link"
                      >
                        {isCopied ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span className="text-emerald-500">Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>Copy Link</span>
                          </>
                        )}
                      </button>

                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-[#0B0F19] text-xs font-medium text-slate-700 dark:text-slate-300 hover:text-cyan-600 dark:hover:text-[#00DFFF] hover:border-cyan-500/50 transition-colors"
                        title="Open image in new browser tab"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                        <span>Open</span>
                      </a>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleDownload(item)}
                      disabled={isDownloading || !isAvailable}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 dark:bg-[#00DFFF] dark:hover:bg-cyan-400 text-white dark:text-slate-950 text-xs font-semibold shadow-xs transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                      title={isAvailable ? 'Download image' : 'Resolution not available on YouTube CDN'}
                    >
                      {isDownloading ? (
                        <>
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                          <span>Saving...</span>
                        </>
                      ) : (
                        <>
                          <Download className="w-3.5 h-3.5" />
                          <span>Download JPG</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Feature Highlights & Guidance */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D]/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-cyan-600 dark:text-[#00DFFF] font-semibold text-sm mb-1.5">
            <Monitor className="w-4 h-4" />
            <span>Full Resolution</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Directly extracts 1280×720 (HD/4K), 640×480 (SD), and 480×360 (HQ) thumbnails directly from Google CDN servers without recompression.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D]/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-semibold text-sm mb-1.5">
            <Film className="w-4 h-4" />
            <span>Universal URL Support</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            Works with standard watch links, youtu.be shortlinks, YouTube Shorts, embed players, live streams, and direct video IDs.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-50 dark:bg-[#11182D]/70 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-semibold text-sm mb-1.5">
            <Info className="w-4 h-4" />
            <span>100% Client-Side Privacy</span>
          </div>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            All URL parsing and downloads occur in your browser. No video IDs or browsing data are ever transmitted to third-party tracking servers.
          </p>
        </div>
      </div>
    </div>
  )
}

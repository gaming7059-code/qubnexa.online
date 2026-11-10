import React, { useState, useMemo, useRef, useEffect } from 'react'
import {
  Download,
  ClipboardPaste,
  X,
  Search,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  ExternalLink,
  ShieldCheck,
  Film,
  Clock,
  HardDrive,
  Monitor,
  Loader2,
  Ban,
  Info,
  Globe,
  FileVideo,
} from 'lucide-react'
import type { CapabilityStatus, DownloadProgressState, VideoAnalysisResult } from './types'
import { analyzeVideoUrl, downloadDirectVideo } from './videoAnalyzer'
import { formatBytes, formatDuration, getLiveDetectionPreview, sanitizeDownloadFilename } from './videoUtils'

function getCapabilityBadgeClasses(capability: CapabilityStatus): string {
  switch (capability) {
    case 'supported-direct':
      return 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
    case 'cors-restricted':
    case 'official-only':
      return 'bg-cyan-50 dark:bg-[#11182D] text-cyan-800 dark:text-[#00DFFF] border-cyan-200 dark:border-[#00DFFF]/30'
    case 'restricted':
      return 'bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
    case 'unsupported':
    case 'invalid':
    case 'network-error':
      return 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
  }
}

function getPreviewToneClasses(tone: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate'): string {
  switch (tone) {
    case 'emerald':
      return 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/80'
    case 'cyan':
      return 'bg-cyan-50 dark:bg-[#11182D] text-cyan-800 dark:text-[#00DFFF] border-cyan-200 dark:border-[#00DFFF]/30'
    case 'amber':
      return 'bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border-amber-200 dark:border-amber-800/80'
    case 'rose':
      return 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/80'
    default:
      return 'bg-slate-100 dark:bg-[#11182D] text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800'
  }
}

export const VideoDownloader: React.FC = () => {
  const [urlInput, setUrlInput] = useState('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysis, setAnalysis] = useState<VideoAnalysisResult | null>(null)
  const [selectedQualityId, setSelectedQualityId] = useState<string>('direct-source')
  const [customFilename, setCustomFilename] = useState<string>('')
  const [thumbFailed, setThumbFailed] = useState(false)
  const [clipboardError, setClipboardError] = useState<string | null>(null)
  const [downloadState, setDownloadState] = useState<DownloadProgressState>({
    status: 'idle',
    loadedBytes: 0,
    totalBytes: null,
    percent: null,
    message: '',
  })

  const abortControllerRef = useRef<AbortController | null>(null)

  useEffect(() => {
    return () => {
      abortControllerRef.current?.abort()
    }
  }, [])

  const livePreview = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : undefined
    return getLiveDetectionPreview(urlInput, origin)
  }, [urlInput])

  const resetProgress = () => {
    setDownloadState({
      status: 'idle',
      loadedBytes: 0,
      totalBytes: null,
      percent: null,
      message: '',
    })
  }

  const handleAnalyze = async (overrideUrl?: string) => {
    const targetUrl = overrideUrl !== undefined ? overrideUrl : urlInput
    setClipboardError(null)
    abortControllerRef.current?.abort()
    resetProgress()
    setThumbFailed(false)
    setIsAnalyzing(true)

    try {
      const result = await analyzeVideoUrl(targetUrl)
      setAnalysis(result)
      setCustomFilename(result.filename)
      setSelectedQualityId(result.qualityOptions[0]?.id || 'direct-source')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    void handleAnalyze()
  }

  const handlePaste = async () => {
    setClipboardError(null)
    try {
      if (!navigator.clipboard || typeof navigator.clipboard.readText !== 'function') {
        setClipboardError('Clipboard read is unavailable in this browser. Paste manually with Ctrl+V.')
        return
      }
      const text = await navigator.clipboard.readText()
      if (!text.trim()) {
        setClipboardError('Clipboard is empty. Copy a video URL first or type it below.')
        return
      }
      setUrlInput(text.trim())
    } catch {
      setClipboardError('Clipboard permission denied. Use Ctrl+V or long-press inside the URL field.')
    }
  }

  const handleClear = () => {
    abortControllerRef.current?.abort()
    setUrlInput('')
    setAnalysis(null)
    setCustomFilename('')
    setThumbFailed(false)
    setClipboardError(null)
    resetProgress()
  }

  const handleDownloadDirect = async () => {
    if (!analysis || analysis.capability !== 'supported-direct') return

    abortControllerRef.current?.abort()
    const controller = new AbortController()
    abortControllerRef.current = controller

    const ext: 'mp4' | 'webm' = analysis.mimeType?.includes('webm') ? 'webm' : 'mp4'
    const finalName = sanitizeDownloadFilename(customFilename || analysis.filename, ext)

    try {
      await downloadDirectVideo(
        analysis.normalizedUrl,
        finalName,
        analysis.mimeType,
        (progress) => setDownloadState(progress),
        controller.signal
      )
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === 'AbortError') {
        setDownloadState({
          status: 'cancelled',
          loadedBytes: 0,
          totalBytes: null,
          percent: null,
          message: 'Download cancelled by user.',
        })
        return
      }
      setDownloadState({
        status: 'error',
        loadedBytes: 0,
        totalBytes: null,
        percent: null,
        message:
          err instanceof Error
            ? err.message
            : 'Download failed due to CORS or network interruption.',
      })
    }
  }

  const handleCancelDownload = () => {
    abortControllerRef.current?.abort()
  }

  return (
    <div className="space-y-6">
      {/* Main Workspace Card */}
      <div className="xw-panel space-y-6">
        {/* Headline & Assurance Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Download Your Videos, Simply.
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
              Save videos you own or are authorized to download from supported sources.
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 self-start sm:self-center rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/80 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 shrink-0">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>100% Free • No Login • No API Keys</span>
          </div>
        </div>

        {/* URL Input + Action Buttons */}
        <form onSubmit={handleFormSubmit} className="space-y-3">
          <label
            htmlFor="video-url-input"
            className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
          >
            Video Media URL
          </label>

          <div className="flex flex-col md:flex-row gap-2.5">
            <div className="relative flex-1">
              <Globe className="h-4.5 w-4.5 text-slate-400 dark:text-[#00DFFF]/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                id="video-url-input"
                type="text"
                inputMode="url"
                autoComplete="off"
                spellCheck={false}
                value={urlInput}
                onChange={(e) => {
                  setUrlInput(e.target.value)
                  if (clipboardError) setClipboardError(null)
                }}
                placeholder="https://example.com/video.mp4 or YouTube / Instagram / TikTok link..."
                aria-label="Video URL"
                className="xw-input min-h-[48px] pl-10 pr-10 text-sm sm:text-base"
              />
              {urlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  aria-label="Clear URL input"
                  title="Clear URL"
                  className="absolute right-2 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 dark:hover:bg-[#11182D] hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <div className="flex flex-wrap sm:flex-nowrap gap-2 shrink-0">
              <button
                type="button"
                onClick={handlePaste}
                className="xw-btn-secondary flex-1 sm:flex-none min-h-[48px] px-4 py-2.5 cursor-pointer"
              >
                <ClipboardPaste className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
                <span>Paste</span>
              </button>

              {urlInput && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="xw-btn-secondary flex-1 sm:flex-none min-h-[48px] px-4 py-2.5 cursor-pointer"
                >
                  <X className="h-4 w-4" />
                  <span>Clear</span>
                </button>
              )}

              <button
                type="submit"
                disabled={isAnalyzing || !urlInput.trim()}
                className="xw-btn-primary w-full sm:w-auto min-h-[48px] px-6 py-2.5 cursor-pointer"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4" />
                    <span>Analyze</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {clipboardError && (
            <p className="text-xs font-medium text-amber-700 dark:text-amber-300 flex items-center gap-1.5">
              <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
              <span>{clipboardError}</span>
            </p>
          )}

          {/* Live Platform Detection Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex flex-wrap items-center gap-2">
              <span
                data-testid="live-platform-badge"
                className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${getPreviewToneClasses(livePreview.tone)}`}
              >
                <FileVideo className="h-3.5 w-3.5" />
                <span>{livePreview.badgeLabel}</span>
              </span>
              <span className="text-xs text-slate-600 dark:text-slate-400">
                {livePreview.hint}
              </span>
            </div>
          </div>
        </form>

        {/* Supported Formats & Transparency Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div className="xw-surface-muted p-3.5 flex items-start gap-2.5">
            <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-slate-900 dark:text-white">Direct MP4 &amp; WebM</div>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                Public media URLs with CORS headers stream with live download progress.
              </p>
            </div>
          </div>

          <div className="xw-surface-muted p-3.5 flex items-start gap-2.5">
            <Info className="h-4 w-4 text-blue-600 dark:text-[#00DFFF] shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-slate-900 dark:text-white">Social Platforms Detected</div>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                YouTube, Instagram, Facebook, X &amp; TikTok link to official viewing/creator export routes.
              </p>
            </div>
          </div>

          <div className="xw-surface-muted p-3.5 flex items-start gap-2.5">
            <ShieldCheck className="h-4 w-4 text-purple-600 dark:text-[#8B5CF6] shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-slate-900 dark:text-white">No Server Proxy or DRM Bypass</div>
              <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                URLs stay private in your browser with zero storage and strict scheme validation.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ANALYSIS RESULT PANEL */}
      {analysis && (
        <section
          aria-live="polite"
          data-testid="analysis-result-card"
          className="xw-panel space-y-6 animate-result-in"
        >
          {/* Capability Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100 dark:border-slate-800/80">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  data-testid="capability-status-badge"
                  className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-bold ${getCapabilityBadgeClasses(analysis.capability)}`}
                >
                  {analysis.capability === 'supported-direct' ? (
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  ) : analysis.capability === 'cors-restricted' || analysis.capability === 'official-only' ? (
                    <Info className="h-3.5 w-3.5" />
                  ) : analysis.capability === 'restricted' ? (
                    <AlertTriangle className="h-3.5 w-3.5" />
                  ) : (
                    <AlertCircle className="h-3.5 w-3.5" />
                  )}
                  <span>{analysis.statusLabel}</span>
                </span>
                <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-[#11182D] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300">
                  {analysis.platformName}
                </span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white break-words">
                {analysis.title}
              </h3>
            </div>
          </div>

          {/* Honest Explanation Callout */}
          <div className="xw-result-hero space-y-1.5 p-4 sm:p-5">
            <p className="text-sm font-bold text-slate-900 dark:text-white">
              {analysis.statusSummary}
            </p>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {analysis.explanation}
            </p>
          </div>

          {/* Preview & Controls Grid */}
          {(analysis.previewVideoUrl ||
            analysis.thumbnailUrl ||
            analysis.qualityOptions.length > 0 ||
            analysis.officialLinks.length > 0) && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Video / Thumbnail Preview (5 cols) */}
              <div className="lg:col-span-5 space-y-3">
                <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-[#050814] overflow-hidden aspect-video flex items-center justify-center relative">
                  {analysis.previewVideoUrl ? (
                    <video
                      src={analysis.previewVideoUrl}
                      poster={!thumbFailed ? analysis.thumbnailUrl : undefined}
                      controls
                      preload="metadata"
                      playsInline
                      className="w-full h-full object-contain bg-black"
                    >
                      Your browser does not support embedded video playback.
                    </video>
                  ) : analysis.thumbnailUrl && !thumbFailed ? (
                    <img
                      src={analysis.thumbnailUrl}
                      alt={`${analysis.title} thumbnail`}
                      onError={() => setThumbFailed(true)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center p-6 text-center text-slate-400 space-y-2">
                      <Film className="h-10 w-10 text-[#00DFFF]/70" />
                      <span className="text-xs font-medium">
                        {analysis.platformName} Preview Unavailable Without Proxy
                      </span>
                    </div>
                  )}
                </div>

                {/* Metadata Badges */}
                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div className="xw-surface-muted p-2.5">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                      <Clock className="h-3 w-3" />
                      <span>Duration</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {formatDuration(analysis.durationSeconds)}
                    </div>
                  </div>
                  <div className="xw-surface-muted p-2.5">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                      <Monitor className="h-3 w-3" />
                      <span>Resolution</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {analysis.width && analysis.height
                        ? `${analysis.width}×${analysis.height}`
                        : 'Platform / N/A'}
                    </div>
                  </div>
                  <div className="xw-surface-muted p-2.5">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400 text-[11px]">
                      <HardDrive className="h-3 w-3" />
                      <span>Size</span>
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5 truncate">
                      {formatBytes(analysis.fileSizeBytes)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Quality Options, Filename, Download & Progress (7 cols) */}
              <div className="lg:col-span-7 space-y-5">
                {analysis.qualityOptions.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Available Quality &amp; Format Options
                    </h4>
                    <div className="space-y-2">
                      {analysis.qualityOptions.map((opt) => {
                        const isSelected = selectedQualityId === opt.id
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedQualityId(opt.id)}
                            className={`w-full min-h-[56px] cursor-pointer flex items-center justify-between gap-3 rounded-xl border p-3.5 text-left transition-all ${
                              isSelected
                                ? 'border-blue-600 dark:border-[#00DFFF] bg-blue-50/70 dark:bg-[#11182D] ring-2 ring-blue-500/15 dark:ring-[#00DFFF]/20'
                                : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-[#050814]'
                            }`}
                          >
                            <div>
                              <div className="text-sm font-bold text-slate-900 dark:text-white">
                                {opt.label}
                              </div>
                              {opt.note && (
                                <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                                  {opt.note}
                                </p>
                              )}
                            </div>
                            <span className="shrink-0 rounded-full bg-slate-100 dark:bg-[#0B1020] border border-slate-200 dark:border-slate-700 px-2.5 py-1 text-[11px] font-bold text-slate-700 dark:text-[#00DFFF]">
                              {opt.format}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {/* Large File Warning */}
                {analysis.isLargeFile && (
                  <div className="rounded-xl border border-amber-200 dark:border-amber-800/80 bg-amber-50 dark:bg-amber-950/40 p-3.5 flex items-start gap-2.5 text-xs text-amber-800 dark:text-amber-200">
                    <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600 dark:text-amber-400" />
                    <div>
                      <span className="font-bold">Large Video Detected ({formatBytes(analysis.fileSizeBytes)}):</span>{' '}
                      In-browser Blob downloads buffer bytes in RAM (capped safely at 512 MB). If your device runs low on memory, open the direct link in a new tab to stream natively to disk.
                    </div>
                  </div>
                )}

                {/* Direct Download Controls */}
                {analysis.capability === 'supported-direct' && (
                  <div className="xw-surface-muted p-4 space-y-4">
                    <div>
                      <label
                        htmlFor="download-filename-input"
                        className="block text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1.5"
                      >
                        Output Filename {analysis.hasContentDispositionName ? '(From Content-Disposition Header)' : ''}
                      </label>
                      <input
                        id="download-filename-input"
                        type="text"
                        value={customFilename}
                        onChange={(e) => setCustomFilename(e.target.value)}
                        className="xw-input min-h-[42px] text-sm font-mono"
                      />
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={handleDownloadDirect}
                        disabled={downloadState.status === 'downloading'}
                        className="xw-btn-primary flex-1 sm:flex-none min-h-[46px] px-6 py-2.5 cursor-pointer"
                      >
                        {downloadState.status === 'downloading' ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            <span>Downloading...</span>
                          </>
                        ) : (
                          <>
                            <Download className="h-4 w-4" />
                            <span>Download Video</span>
                          </>
                        )}
                      </button>

                      {downloadState.status === 'downloading' && (
                        <button
                          type="button"
                          onClick={handleCancelDownload}
                          className="xw-btn-secondary min-h-[46px] px-4 py-2.5 cursor-pointer text-rose-600 dark:text-rose-400"
                        >
                          <Ban className="h-4 w-4" />
                          <span>Cancel</span>
                        </button>
                      )}

                      <a
                        href={analysis.normalizedUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="xw-btn-secondary min-h-[46px] px-4 py-2.5"
                      >
                        <ExternalLink className="h-4 w-4" />
                        <span>Open Direct URL</span>
                      </a>
                    </div>

                    {/* Progress Display */}
                    {downloadState.status !== 'idle' && (
                      <div
                        data-testid="download-progress-box"
                        className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0B1020] p-3.5 space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs font-semibold">
                          <span
                            className={
                              downloadState.status === 'error'
                                ? 'text-rose-600 dark:text-rose-400'
                                : downloadState.status === 'completed'
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : 'text-slate-700 dark:text-slate-200'
                            }
                          >
                            {downloadState.message}
                          </span>
                          <span className="font-mono text-slate-600 dark:text-[#00DFFF]">
                            {downloadState.totalBytes
                              ? `${formatBytes(downloadState.loadedBytes)} / ${formatBytes(downloadState.totalBytes)}`
                              : downloadState.loadedBytes > 0
                              ? formatBytes(downloadState.loadedBytes)
                              : ''}
                          </span>
                        </div>

                        {(downloadState.status === 'downloading' || downloadState.status === 'completed') && (
                          <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-[#11182D] overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-200 ${
                                downloadState.status === 'completed'
                                  ? 'bg-emerald-500'
                                  : 'bg-gradient-to-r from-[#00DFFF] to-blue-600'
                              }`}
                              style={{
                                width: `${downloadState.percent !== null ? downloadState.percent : 100}%`,
                              }}
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Official / Direct Browser Fallback Links */}
                {analysis.officialLinks.length > 0 && (
                  <div className="space-y-2.5">
                    <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                      Official Viewing &amp; Authorized Download Routes
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {analysis.officialLinks.map((link) => (
                        <a
                          key={link.label}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="card-lift flex flex-col justify-between rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-[#11182D] p-3.5 hover:border-blue-500/70 dark:hover:border-[#00DFFF]/60 transition-colors"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-xs sm:text-sm font-bold text-blue-600 dark:text-[#00DFFF]">
                              {link.label}
                            </span>
                            <ExternalLink className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                          </div>
                          <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
                            {link.description}
                          </p>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  )
}

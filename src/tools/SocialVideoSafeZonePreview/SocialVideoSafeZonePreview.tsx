import React, { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import {
  Upload,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Download,
  Sparkles,
  Smartphone,
  AlertCircle,
  Info,
  ShieldCheck,
  FileVideo,
  X,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music,
  MoreVertical,
  ThumbsUp,
  ThumbsDown,
  Repeat,
  Compass,
  Search,
  Cast,
  Scissors,
  Grid,
  Crosshair,
  SlidersHorizontal,
  Layers,
  Maximize2,
  Minimize2,
  Plus,
  Trash2,
  RefreshCw,
  Eye,
  EyeOff,
} from 'lucide-react'
import type {
  SocialPlatformId,
  PlatformCategory,
  OverlayMode,
  VideoFitMode,
  ObstructionZone,
  ObstructionAnchor,
  GuideToggles,
  ZoneSeverity,
} from './types'
import { PLATFORMS_DATA, PLATFORM_CATEGORIES } from './platformsData'
import { downloadUniversalSafeZonePNG } from './safeZoneCanvas'

export const SocialVideoSafeZonePreview: React.FC = () => {
  // Navigation & Hierarchy State
  const [activeCategory, setActiveCategory] = useState<PlatformCategory>('all')
  const [selectedPlatformId, setSelectedPlatformId] = useState<SocialPlatformId>('tiktok')
  const [selectedFormatId, setSelectedFormatId] = useState<string>('tiktok-video')

  // Platform & Format configs
  const currentPlatform = PLATFORMS_DATA[selectedPlatformId] || PLATFORMS_DATA.tiktok
  const currentFormat = useMemo(() => {
    return (
      currentPlatform.formats.find((f) => f.id === selectedFormatId) ||
      currentPlatform.formats[0]
    )
  }, [currentPlatform, selectedFormatId])

  // Custom Dimensions & Custom Platform state
  const [customWidth, setCustomWidth] = useState<number>(1080)
  const [customHeight, setCustomHeight] = useState<number>(1920)
  const [customPlatformName, setCustomPlatformName] = useState<string>('Custom Project')

  // Live Editable Safe Margins (initialized from default preset)
  const [safeMargins, setSafeMargins] = useState(() => ({ ...PLATFORMS_DATA.tiktok.formats[0].safeArea }))
  const [cautionBuffer, setCautionBuffer] = useState<number>(PLATFORMS_DATA.tiktok.formats[0].cautionBufferPercent)

  // Live Editable Obstruction Zones
  const [zones, setZones] = useState<ObstructionZone[]>(() =>
    PLATFORMS_DATA.tiktok.formats[0].obstructionZones.map((z) => ({ ...z }))
  )

  // View & Mode Settings
  const [overlayMode, setOverlayMode] = useState<OverlayMode>('both')
  const [fitMode, setFitMode] = useState<VideoFitMode>('cover')
  const [overlayOpacity, setOverlayOpacity] = useState<number>(85)
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false)
  const [guides, setGuides] = useState<GuideToggles>({
    ruleOfThirds: false,
    centerCrosshair: true,
    marginLines: true,
    labels: true,
  })

  // Download settings
  const [downloadTransparent, setDownloadTransparent] = useState<boolean>(true)

  // Video State
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [videoUrl, setVideoUrl] = useState<string | null>(null)
  const [isPlaying, setIsPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)
  const [duration, setDuration] = useState<number>(0)
  const [isMuted, setIsMuted] = useState<boolean>(true)
  const [volume, setVolume] = useState<number>(0.8)
  const [isLooping, setIsLooping] = useState<boolean>(true)
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null)
  const [isDragOver, setIsDragOver] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'editor' | 'media' | 'export' | 'tips'>('editor')

  // New Custom Zone Form State
  const [newZoneLabel, setNewZoneLabel] = useState<string>('Custom Banner')
  const [newZoneAnchor, setNewZoneAnchor] = useState<ObstructionAnchor>('full-width')
  const [newZoneX, setNewZoneX] = useState<number>(0)
  const [newZoneY, setNewZoneY] = useState<number>(50)
  const [newZoneW, setNewZoneW] = useState<number>(100)
  const [newZoneH, setNewZoneH] = useState<number>(15)
  const [newZoneSeverity, setNewZoneSeverity] = useState<ZoneSeverity>('danger')
  const [isAddingZone, setIsAddingZone] = useState<boolean>(false)

  const handleAnchorChange = (anchor: ObstructionAnchor) => {
    setNewZoneAnchor(anchor)
    switch (anchor) {
      case 'full-width':
        setNewZoneX(0)
        setNewZoneW(100)
        setNewZoneY(45)
        setNewZoneH(15)
        break
      case 'top-left':
        setNewZoneX(4)
        setNewZoneY(4)
        setNewZoneW(24)
        setNewZoneH(12)
        break
      case 'top-right':
        setNewZoneX(72)
        setNewZoneY(4)
        setNewZoneW(24)
        setNewZoneH(12)
        break
      case 'bottom-left':
        setNewZoneX(4)
        setNewZoneY(82)
        setNewZoneW(26)
        setNewZoneH(14)
        break
      case 'bottom-right':
        setNewZoneX(70)
        setNewZoneY(80)
        setNewZoneW(26)
        setNewZoneH(16)
        break
      case 'center':
        setNewZoneX(25)
        setNewZoneY(40)
        setNewZoneW(50)
        setNewZoneH(20)
        break
      default:
        break
    }
  }

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const stageRef = useRef<HTMLDivElement | null>(null)

  // Clamped & validated working resolution
  const effectiveResolution = useMemo(() => {
    const w = Math.min(3840, Math.max(320, Math.round(Number(customWidth) || 1080)))
    const h = Math.min(3840, Math.max(320, Math.round(Number(customHeight) || 1920)))
    return { width: w, height: h }
  }, [customWidth, customHeight])

  // Calculated Aspect Ratio Display
  const calculatedAspectRatio = useMemo(() => {
    const { width, height } = effectiveResolution
    const gcd = (a: number, b: number): number => (b === 0 ? a : gcd(b, a % b))
    const divisor = gcd(width, height)
    const ratioW = Math.round(width / divisor)
    const ratioH = Math.round(height / divisor)
    if (ratioW <= 32 && ratioH <= 32) {
      return `${ratioW}:${ratioH}`
    }
    return `${(width / height).toFixed(2)}:1`
  }, [effectiveResolution])

  // Filtered platforms list by active category
  const filteredPlatforms = useMemo(() => {
    const list = Object.values(PLATFORMS_DATA)
    if (activeCategory === 'all') return list
    return list.filter((p) => p.category === activeCategory)
  }, [activeCategory])

  // Handle Video Upload with Resource & Type Protection
  const handleFileSelect = useCallback((file: File) => {
    // 1. File size safety ceiling: 200 MB (prevents browser process OOM crashes)
    const MAX_SIZE_MB = 200
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      setErrorMessage(`File exceeds the ${MAX_SIZE_MB} MB in-browser memory safety limit. Please choose a clip under 200 MB.`)
      return
    }

    // 2. MIME & Extension validation
    const validMimes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/ogg', 'video/x-m4v']
    const ext = file.name.split('.').pop()?.toLowerCase() || ''
    const validExts = ['mp4', 'webm', 'mov', 'm4v', 'ogv', 'ogg']
    const isMimeValid =
      validMimes.some((m) => file.type.toLowerCase().includes(m)) ||
      file.type.startsWith('video/') ||
      validExts.includes(ext)

    if (!isMimeValid) {
      setErrorMessage('Please select a valid playable video format (MP4, WebM, or MOV).')
      return
    }

    setErrorMessage(null)

    // Revoke previous URL to prevent memory leaks
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }

    const newUrl = URL.createObjectURL(file)
    setVideoFile(file)
    setVideoUrl(newUrl)
    setIsPlaying(false)
    setCurrentTime(0)
  }, [videoUrl])

  // Cleanup Object URL on unmount
  useEffect(() => {
    return () => {
      if (videoUrl) {
        URL.revokeObjectURL(videoUrl)
      }
    }
  }, [videoUrl])

  const handleClearVideo = useCallback(() => {
    if (videoUrl) {
      URL.revokeObjectURL(videoUrl)
    }
    setVideoFile(null)
    setVideoUrl(null)
    setVideoDimensions(null)
    setIsPlaying(false)
    setCurrentTime(0)
    setDuration(0)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }, [videoUrl])

  const handleLoadedMetadata = () => {
    if (videoRef.current) {
      const v = videoRef.current
      setDuration(v.duration || 0)
      setVideoDimensions({
        width: v.videoWidth,
        height: v.videoHeight,
      })
    }
  }

  // Playback Controls
  const togglePlay = () => {
    if (!videoRef.current) return
    if (isPlaying) {
      videoRef.current.pause()
      setIsPlaying(false)
    } else {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false))
    }
  }

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime)
    }
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = parseFloat(e.target.value)
    setCurrentTime(time)
    if (videoRef.current) {
      videoRef.current.currentTime = time
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const next = !isMuted
    videoRef.current.muted = next
    setIsMuted(next)
  }

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setVolume(val)
    if (videoRef.current) {
      videoRef.current.volume = val
      if (val === 0) {
        videoRef.current.muted = true
        setIsMuted(true)
      } else if (isMuted) {
        videoRef.current.muted = false
        setIsMuted(false)
      }
    }
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`
  }

  // Apply preset format geometry to live state
  const applyPresetFormat = useCallback((fmt: typeof currentPlatform.formats[0], isCustom = false) => {
    setSafeMargins({ ...fmt.safeArea })
    setCautionBuffer(fmt.cautionBufferPercent)
    setZones(fmt.obstructionZones.map((z) => ({ ...z })))
    if (!isCustom) {
      setCustomWidth(fmt.defaultWidth)
      setCustomHeight(fmt.defaultHeight)
    }
  }, [])

  // Platform selection handler
  const handlePlatformChange = (pId: SocialPlatformId) => {
    setSelectedPlatformId(pId)
    const p = PLATFORMS_DATA[pId]
    if (p && p.formats.length > 0) {
      const fmt = p.formats[0]
      setSelectedFormatId(fmt.id)
      applyPresetFormat(fmt, pId === 'custom')
    }
  }

  // Format selection handler
  const handleFormatChange = (fId: string) => {
    setSelectedFormatId(fId)
    const fmt = currentPlatform.formats.find((f) => f.id === fId)
    if (fmt) {
      applyPresetFormat(fmt, selectedPlatformId === 'custom')
    }
  }

  // Reset current safe margins & zones to default preset
  const handleResetToPreset = () => {
    if (currentFormat) {
      applyPresetFormat(currentFormat, selectedPlatformId === 'custom')
    }
  }

  // Add custom obstruction zone
  const handleAddCustomZone = (e: React.FormEvent) => {
    e.preventDefault()
    const sanitizedLabel = newZoneLabel.trim().slice(0, 40) || 'Custom Zone'
    const x = Math.max(0, Math.min(95, Number(newZoneX) || 0))
    const y = Math.max(0, Math.min(95, Number(newZoneY) || 0))
    const w = Math.max(2, Math.min(100 - x, Number(newZoneW) || 20))
    const h = Math.max(2, Math.min(100 - y, Number(newZoneH) || 15))

    const newZone: ObstructionZone = {
      id: `custom-zone-${Date.now()}`,
      label: sanitizedLabel,
      xPercent: x,
      yPercent: y,
      widthPercent: w,
      heightPercent: h,
      severity: newZoneSeverity,
      enabled: true,
      isCustom: true,
      anchor: newZoneAnchor,
    }
    setZones((prev) => [...prev, newZone])
    setIsAddingZone(false)
    setNewZoneLabel('Custom Banner')
  }

  const handleToggleZone = (id: string) => {
    setZones((prev) =>
      prev.map((z) => (z.id === id ? { ...z, enabled: !z.enabled } : z))
    )
  }

  const handleDeleteZone = (id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id))
  }

  // Template PNG Download
  const handleDownloadTemplate = () => {
    downloadUniversalSafeZonePNG({
      platformName: selectedPlatformId === 'custom' ? customPlatformName : currentPlatform.name,
      format: currentFormat,
      width: effectiveResolution.width,
      height: effectiveResolution.height,
      safeArea: safeMargins,
      obstructionZones: zones,
      cautionBufferPercent: cautionBuffer,
      guides,
      transparentBackground: downloadTransparent,
    })
  }

  // Determine aspect ratio for stage container
  const stageAspectRatioStyle = useMemo(() => {
    const { width, height } = effectiveResolution
    return {
      aspectRatio: `${width} / ${height}`,
      maxHeight: isFullscreen ? '85vh' : '620px',
      maxWidth: '100%',
    }
  }, [effectiveResolution, isFullscreen])

  return (
    <div className={`space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-[#050814] overflow-y-auto p-4 sm:p-8' : ''}`}>
      {/* 1. HIERARCHICAL PLATFORM & FORMAT SELECTOR */}
      <div className="xw-panel space-y-5">
        {/* Top Header with Category Filter */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-[#00DFFF]">
                Universal Safe Zone Studio
              </span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-cyan-50 dark:bg-[#11182D] text-cyan-700 dark:text-[#00DFFF] border border-cyan-200 dark:border-cyan-500/30">
                15+ Platforms
              </span>
              {currentFormat.specificationType === 'official' ? (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800"
                  title={currentFormat.specSource}
                >
                  Official Spec
                </span>
              ) : (
                <span
                  className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 border border-amber-300 dark:border-amber-800"
                  title={currentFormat.specSource}
                >
                  Approximate Guide
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mt-1">
              {currentPlatform.name} — {currentFormat.name}
            </h2>
            {currentFormat.specSource && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                {currentFormat.specSource}
              </p>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {PLATFORM_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 dark:bg-[#11182D] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Platform Carousel / Grid */}
        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
            Select Social Media Platform
          </label>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {filteredPlatforms.map((p) => {
              const isSelected = p.id === selectedPlatformId
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => handlePlatformChange(p.id)}
                  className={`inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border ${
                    isSelected
                      ? 'bg-blue-50 dark:bg-[#11182D] text-blue-700 dark:text-[#00DFFF] border-blue-300 dark:border-[#00DFFF]/50 shadow-xs ring-1 ring-blue-500/20'
                      : 'bg-white dark:bg-[#050814] text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <span
                    className="h-2.5 w-2.5 rounded-full shrink-0"
                    style={{ backgroundColor: p.brandColor }}
                  />
                  <span>{p.name}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Content Format & Aspect Ratio Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs pt-1">
          {/* Format Selector */}
          <div className="space-y-1.5">
            <label htmlFor="format-select" className="font-semibold text-slate-700 dark:text-slate-300">
              Content Format / Preset
            </label>
            <select
              id="format-select"
              value={selectedFormatId}
              onChange={(e) => handleFormatChange(e.target.value)}
              className="xw-input py-2 text-xs font-medium"
              aria-label="Content Format Preset"
            >
              {currentPlatform.formats.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name} ({f.aspectRatio})
                </option>
              ))}
            </select>
          </div>

          {/* Overlay Mode */}
          <div className="space-y-1.5">
            <label htmlFor="overlay-mode-select" className="font-semibold text-slate-700 dark:text-slate-300">
              Overlay View Mode
            </label>
            <select
              id="overlay-mode-select"
              value={overlayMode}
              onChange={(e) => setOverlayMode(e.target.value as OverlayMode)}
              className="xw-input py-2 text-xs font-medium"
              aria-label="Overlay View Mode"
            >
              <option value="both">Both (Safe Zones + UI)</option>
              <option value="safe-zone">Safe Zone Boundaries Only</option>
              <option value="ui-only">Platform UI Simulation Only</option>
              <option value="text-placement">Text Placement Guides</option>
              <option value="clean">Clean Video (No Overlays)</option>
            </select>
          </div>

          {/* Video Fit */}
          <div className="space-y-1.5">
            <label htmlFor="video-fit-select" className="font-semibold text-slate-700 dark:text-slate-300">
              Video Fit Mode
            </label>
            <select
              id="video-fit-select"
              value={fitMode}
              onChange={(e) => setFitMode(e.target.value as VideoFitMode)}
              className="xw-input py-2 text-xs font-medium"
              aria-label="Video Fit Mode"
            >
              <option value="cover">Cover (Realistic Feed Crop)</option>
              <option value="contain">Contain (Full Aspect Letterbox)</option>
            </select>
          </div>

          {/* Overlay Opacity Slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="opacity-slider" className="font-semibold text-slate-700 dark:text-slate-300">
                Overlay Opacity
              </label>
              <span className="font-mono text-cyan-600 dark:text-[#00DFFF] font-bold">
                {overlayOpacity}%
              </span>
            </div>
            <input
              id="opacity-slider"
              type="range"
              min="10"
              max="100"
              value={overlayOpacity}
              onChange={(e) => setOverlayOpacity(parseInt(e.target.value, 10))}
              className="w-full accent-blue-600 dark:accent-[#00DFFF] cursor-pointer mt-1"
              aria-label="Overlay Opacity Percentage"
            />
          </div>
        </div>

        {/* Guides Toolbar & Custom Resolution Inputs */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Guide Toggles */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-slate-500 font-medium mr-1">Guides:</span>
            <button
              type="button"
              onClick={() => setGuides((g) => ({ ...g, ruleOfThirds: !g.ruleOfThirds }))}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                guides.ruleOfThirds
                  ? 'bg-cyan-50 dark:bg-cyan-950/60 text-cyan-700 dark:text-cyan-300 border-cyan-300 dark:border-cyan-800'
                  : 'bg-white dark:bg-[#050814] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Grid className="h-3 w-3" />
              <span>Thirds Grid</span>
            </button>

            <button
              type="button"
              onClick={() => setGuides((g) => ({ ...g, centerCrosshair: !g.centerCrosshair }))}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                guides.centerCrosshair
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
                  : 'bg-white dark:bg-[#050814] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <Crosshair className="h-3 w-3" />
              <span>Center Cross</span>
            </button>

            <button
              type="button"
              onClick={() => setGuides((g) => ({ ...g, labels: !g.labels }))}
              className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                guides.labels
                  ? 'bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                  : 'bg-white dark:bg-[#050814] text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-800'
              }`}
            >
              <span>Labels</span>
            </button>
          </div>

          {/* Canvas Dimensions Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            {selectedPlatformId === 'custom' && (
              <div className="flex items-center gap-1.5 mr-1">
                <span className="text-slate-500 font-medium">Project:</span>
                <input
                  type="text"
                  value={customPlatformName}
                  onChange={(e) => setCustomPlatformName(e.target.value)}
                  className="w-28 xw-input py-1 text-xs"
                  placeholder="Project name"
                  aria-label="Custom Project Name"
                />
              </div>
            )}
            <span className="text-slate-500 font-medium">Canvas:</span>
            <input
              type="number"
              min="320"
              max="3840"
              value={customWidth}
              onChange={(e) => setCustomWidth(Math.max(320, Math.min(3840, parseInt(e.target.value, 10) || 1080)))}
              className="w-20 xw-input py-1 text-xs font-mono text-center"
              aria-label="Canvas Width in pixels"
            />
            <span className="text-slate-400">×</span>
            <input
              type="number"
              min="320"
              max="3840"
              value={customHeight}
              onChange={(e) => setCustomHeight(Math.max(320, Math.min(3840, parseInt(e.target.value, 10) || 1920)))}
              className="w-20 xw-input py-1 text-xs font-mono text-center"
              aria-label="Canvas Height in pixels"
            />
            <span className="font-mono text-slate-500 font-bold px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800">
              {calculatedAspectRatio}
            </span>

            <button
              type="button"
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-1"
              title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Stage'}
              aria-label={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen Stage'}
            >
              {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* 2. DYNAMIC PREVIEW CANVAS & STUDIO WORKBENCH */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: UNIVERSAL PREVIEW STAGE */}
        <div className="lg:col-span-7 flex flex-col items-center">
          <div
            ref={stageRef}
            className="w-full flex justify-center items-center rounded-3xl overflow-hidden border-2 border-slate-800 dark:border-cyan-500/30 bg-[#050814] shadow-2xl relative select-none"
          >
            {/* Aspect Ratio Bounded Stage Container */}
            <div
              style={stageAspectRatioStyle}
              className="relative w-full bg-[#050814] flex items-center justify-center overflow-hidden cursor-pointer"
              onClick={togglePlay}
            >
              {videoUrl ? (
                <video
                  ref={videoRef}
                  src={videoUrl}
                  playsInline
                  loop={isLooping}
                  muted={isMuted}
                  onLoadedMetadata={handleLoadedMetadata}
                  onTimeUpdate={handleTimeUpdate}
                  onEnded={() => setIsPlaying(false)}
                  onError={() => {
                    setErrorMessage('Unable to decode video. The container or video codec (such as Apple ProRes or uncompressed MOV) is not supported natively by this browser. Please test using an H.264 / H.265 MP4 or WebM video.')
                    setIsPlaying(false)
                  }}
                  className={`w-full h-full ${fitMode === 'cover' ? 'object-cover' : 'object-contain'}`}
                />
              ) : (
                /* Interactive Sample Stage (Zero Upload Friction) */
                <div className="w-full h-full flex flex-col justify-between p-6 bg-gradient-to-br from-[#0B1020] via-[#0E1528] to-[#17122A] text-center text-slate-300 relative">
                  <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293d_1px,transparent_1px),linear-gradient(to_bottom,#1f293d_1px,transparent_1px)] bg-[size:32px_32px] opacity-20 pointer-events-none" />

                  <div className="relative z-10 pt-4">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-500/30 text-cyan-400 text-xs font-semibold mb-2">
                      <Sparkles className="h-3.5 w-3.5" />
                      <span>{currentPlatform.name} Studio Preview</span>
                    </div>
                    <h3 className="text-lg font-bold text-white tracking-tight">
                      Drop Video or Preview Guide
                    </h3>
                  </div>

                  <div className="relative z-10 my-auto py-4">
                    <div className="w-16 h-16 mx-auto rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_24px_rgba(0,223,255,0.15)]">
                      <Smartphone className="h-8 w-8" />
                    </div>
                    <span className="block text-[11px] text-slate-400 mt-2 font-mono">
                      {effectiveResolution.width} × {effectiveResolution.height} ({calculatedAspectRatio})
                    </span>
                  </div>

                  <div className="relative z-10 pb-4">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        fileInputRef.current?.click()
                      }}
                      className="xw-btn-primary px-4 py-2 text-xs rounded-xl"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      <span>Upload Video File</span>
                    </button>
                  </div>
                </div>
              )}

              {/* OVERLAY: SAFE ZONE BOUNDARIES & OBSTRUCTIONS */}
              {(overlayMode === 'both' || overlayMode === 'safe-zone' || overlayMode === 'text-placement') && (
                <div
                  className="absolute inset-0 pointer-events-none transition-opacity duration-200"
                  style={{ opacity: overlayOpacity / 100 }}
                >
                  {/* Caution Buffer Zone (Amber) */}
                  {cautionBuffer > 0 && (
                    <div
                      className="absolute bg-amber-500/10 border border-dashed border-amber-500/40 pointer-events-none"
                      style={{
                        top: `${Math.max(0, safeMargins.topPercent - cautionBuffer)}%`,
                        bottom: `${Math.max(0, safeMargins.bottomPercent - cautionBuffer)}%`,
                        left: `${Math.max(0, safeMargins.leftPercent - cautionBuffer)}%`,
                        right: `${Math.max(0, safeMargins.rightPercent - cautionBuffer)}%`,
                      }}
                    />
                  )}

                  {/* Obstruction Zones (Red / Danger) */}
                  {zones
                    .filter((z) => z.enabled)
                    .map((zone) => {
                      const bgClass =
                        zone.severity === 'danger'
                          ? 'bg-red-600/25 border-red-500/80 text-red-200'
                          : zone.severity === 'caution'
                          ? 'bg-amber-600/20 border-amber-500/80 text-amber-200'
                          : 'bg-blue-600/20 border-blue-500/80 text-blue-200'

                      return (
                        <div
                          key={zone.id}
                          className={`absolute border flex items-center justify-center p-1 text-[9px] font-bold text-center overflow-hidden transition-all ${bgClass}`}
                          style={{
                            left: `${zone.xPercent}%`,
                            top: `${zone.yPercent}%`,
                            width: `${zone.widthPercent}%`,
                            height: `${zone.heightPercent}%`,
                          }}
                        >
                          {guides.labels && (overlayMode === 'safe-zone' || zone.isCustom) && (
                            <span className="drop-shadow truncate px-1">
                              ⚠️ {zone.label}
                            </span>
                          )}
                        </div>
                      )
                    })}

                  {/* Recommended Safe Content Zone (Emerald Green Box) */}
                  <div
                    className="absolute border-2 border-dashed border-emerald-400 bg-emerald-500/10 shadow-[0_0_12px_rgba(16,185,129,0.15)] flex flex-col items-center justify-center"
                    style={{
                      top: `${safeMargins.topPercent}%`,
                      bottom: `${safeMargins.bottomPercent}%`,
                      left: `${safeMargins.leftPercent}%`,
                      right: `${safeMargins.rightPercent}%`,
                    }}
                  >
                    {/* Text Placement Guide Line */}
                    {overlayMode === 'text-placement' && (
                      <div className="absolute bottom-6 inset-x-4 border-b-2 border-dashed border-cyan-400 text-cyan-300 text-[10px] font-mono text-center pb-1">
                        Recommended Subtitle Baseline
                      </div>
                    )}
                  </div>

                  {/* Rule of Thirds Grid (Togglable) */}
                  {guides.ruleOfThirds && (
                    <div className="absolute inset-0 pointer-events-none">
                      <div className="absolute left-1/3 top-0 bottom-0 border-r border-dashed border-cyan-400/30" />
                      <div className="absolute left-2/3 top-0 bottom-0 border-r border-dashed border-cyan-400/30" />
                      <div className="absolute top-1/3 left-0 right-0 border-b border-dashed border-cyan-400/30" />
                      <div className="absolute top-2/3 left-0 right-0 border-b border-dashed border-cyan-400/30" />
                    </div>
                  )}

                  {/* Center Crosshair (Togglable) */}
                  {guides.centerCrosshair && (
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 pointer-events-none opacity-50">
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-emerald-400 -translate-y-1/2" />
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-emerald-400 -translate-x-1/2" />
                    </div>
                  )}
                </div>
              )}

              {/* OVERLAY: SIMULATED PLATFORM UI (Active on vertical platforms) */}
              {(overlayMode === 'both' || overlayMode === 'ui-only') && (
                <div
                  className="absolute inset-0 pointer-events-none flex flex-col justify-between p-3.5 transition-opacity duration-200 text-white"
                  style={{ opacity: overlayOpacity / 100 }}
                >
                  {/* TikTok Vertical UI Simulation */}
                  {selectedPlatformId === 'tiktok' && currentFormat.aspectRatio === '9:16' && (
                    <>
                      <div className="flex items-center justify-between text-xs font-semibold px-2 pt-1 text-white/90 drop-shadow">
                        <Search className="h-4 w-4" />
                        <div className="flex items-center gap-3">
                          <span className="text-white/60">Following</span>
                          <span className="font-bold border-b-2 border-white pb-0.5">For You</span>
                        </div>
                        <Compass className="h-4 w-4" />
                      </div>

                      <div className="absolute right-2.5 top-[38%] flex flex-col items-center gap-3 text-center">
                        <div className="relative mb-1">
                          <div className="w-9 h-9 rounded-full bg-slate-700 border-2 border-white flex items-center justify-center font-bold text-xs text-white">
                            QX
                          </div>
                          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-rose-500 text-white flex items-center justify-center text-[9px] font-bold">
                            +
                          </div>
                        </div>
                        <div className="flex flex-col items-center">
                          <Heart className="h-5 w-5 fill-white" />
                          <span className="text-[9px] font-semibold mt-0.5">842K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MessageCircle className="h-5 w-5 fill-white" />
                          <span className="text-[9px] font-semibold mt-0.5">12K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Bookmark className="h-5 w-5 fill-white" />
                          <span className="text-[9px] font-semibold mt-0.5">94K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Share2 className="h-5 w-5 fill-white" />
                          <span className="text-[9px] font-semibold mt-0.5">28K</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pb-1 pr-14 pl-1">
                        <p className="text-xs font-bold drop-shadow">@creator_handle</p>
                        <p className="text-[11px] text-white/90 drop-shadow line-clamp-2 leading-snug">
                          Keep your video hooks inside the safe zone! 🎯 #creator #safezone
                        </p>
                        <div className="flex items-center gap-1.5 text-[10px] text-white/80">
                          <Music className="h-3 w-3" />
                          <span>♫ Original Sound - Viral Studio Beat</span>
                        </div>
                        <div className="pt-1.5 border-t border-white/20 flex items-center justify-between text-[9px] text-white/70 px-2">
                          <span className="font-bold text-white">Home</span>
                          <span>Friends</span>
                          <span className="w-5 h-3.5 rounded bg-white text-black font-extrabold flex items-center justify-center text-[10px]">
                            +
                          </span>
                          <span>Inbox</span>
                          <span>Profile</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Instagram Reels UI Simulation */}
                  {selectedPlatformId === 'instagram' && currentFormat.id === 'ig-reels' && (
                    <>
                      <div className="flex items-center justify-between text-xs font-bold px-2 pt-1 drop-shadow">
                        <span>Reels</span>
                        <div className="flex items-center gap-2">
                          <Scissors className="h-3.5 w-3.5" />
                          <MoreVertical className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      <div className="absolute right-2.5 top-[48%] flex flex-col items-center gap-3.5 text-center">
                        <div className="flex flex-col items-center">
                          <Heart className="h-5 w-5" />
                          <span className="text-[9px] font-semibold mt-0.5">142K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MessageCircle className="h-5 w-5" />
                          <span className="text-[9px] font-semibold mt-0.5">3,820</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Share2 className="h-5 w-5" />
                          <span className="text-[9px] font-semibold mt-0.5">21K</span>
                        </div>
                        <MoreVertical className="h-4 w-4" />
                      </div>

                      <div className="space-y-1.5 pb-1 pr-14 pl-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-amber-500 to-fuchsia-600 p-0.5">
                            <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-[9px] font-bold">
                              IG
                            </div>
                          </div>
                          <span className="text-xs font-bold drop-shadow">creator_pro</span>
                          <span className="px-2 py-0.5 rounded border border-white/60 text-[9px] font-semibold">
                            Follow
                          </span>
                        </div>
                        <p className="text-[11px] text-white/90 drop-shadow line-clamp-2 leading-snug">
                          Ensure text stays inside Reels safe zone so Instagram UI never blocks captions! #reels
                        </p>
                        <div className="pt-1.5 border-t border-white/20 flex items-center justify-around text-[9px] text-white/70">
                          <span>Home</span>
                          <span>Search</span>
                          <span>+</span>
                          <span className="font-bold text-white">Reels</span>
                          <span>Profile</span>
                        </div>
                      </div>
                    </>
                  )}

                  {/* YouTube Shorts UI Simulation */}
                  {selectedPlatformId === 'youtube' && currentFormat.id === 'yt-shorts' && (
                    <>
                      <div className="flex items-center justify-between text-xs px-2 pt-1 drop-shadow">
                        <span className="font-extrabold text-xs tracking-tight text-white flex items-center gap-1">
                          <span className="text-red-500">▶</span> Shorts
                        </span>
                        <div className="flex items-center gap-2.5">
                          <Search className="h-3.5 w-3.5" />
                          <Cast className="h-3.5 w-3.5" />
                          <MoreVertical className="h-3.5 w-3.5" />
                        </div>
                      </div>

                      <div className="absolute right-2.5 top-[44%] flex flex-col items-center gap-3 text-center">
                        <div className="flex flex-col items-center">
                          <ThumbsUp className="h-5 w-5 fill-white" />
                          <span className="text-[9px] font-semibold mt-0.5">95K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <ThumbsDown className="h-5 w-5" />
                          <span className="text-[8px] text-white/80">Dislike</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <MessageCircle className="h-5 w-5 fill-white" />
                          <span className="text-[9px] font-semibold mt-0.5">1.2K</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Share2 className="h-5 w-5" />
                          <span className="text-[8px] text-white/80">Share</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <Repeat className="h-5 w-5" />
                          <span className="text-[8px] text-white/80">Remix</span>
                        </div>
                      </div>

                      <div className="space-y-1.5 pb-1 pr-14 pl-1">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-red-700 flex items-center justify-center text-[9px] font-bold">
                            YT
                          </div>
                          <span className="text-xs font-bold drop-shadow">@QubnexaMedia</span>
                          <span className="px-2 py-0.5 rounded-full bg-white text-black text-[9px] font-bold">
                            Subscribe
                          </span>
                        </div>
                        <p className="text-[11px] text-white/95 drop-shadow line-clamp-2 leading-snug">
                          YouTube Shorts safe content area guide for video creators #shorts
                        </p>
                        <div className="pt-1.5 border-t border-white/20 flex items-center justify-around text-[9px] text-white/70">
                          <span>Home</span>
                          <span className="font-bold text-white">Shorts</span>
                          <span>+</span>
                          <span>Subscriptions</span>
                          <span>You</span>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* VIDEO TIMELINE & AUDIO CONTROLS BAR */}
          <div className="w-full max-w-[540px] bg-[#0B1020] border border-slate-800 rounded-2xl p-3 mt-3 space-y-2 text-xs text-slate-300">
            {/* Scrub Slider */}
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-400 min-w-[32px]">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min="0"
                max={duration || 100}
                step="0.1"
                value={currentTime}
                onChange={handleSeek}
                disabled={!videoUrl}
                className="w-full accent-cyan-400 cursor-pointer disabled:opacity-30"
              />
              <span className="font-mono text-[10px] text-slate-400 min-w-[32px]">
                {formatTime(duration)}
              </span>
            </div>

            {/* Action Buttons Bar */}
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={togglePlay}
                  disabled={!videoUrl}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors"
                  title={isPlaying ? 'Pause Video' : 'Play Video'}
                >
                  {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                </button>

                <button
                  type="button"
                  onClick={toggleMute}
                  disabled={!videoUrl}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-40 transition-colors"
                  title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
                >
                  {isMuted ? <VolumeX className="h-4 w-4 text-rose-400" /> : <Volume2 className="h-4 w-4 text-emerald-400" />}
                </button>

                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={volume}
                  onChange={handleVolumeChange}
                  disabled={!videoUrl}
                  className="w-16 accent-cyan-400 cursor-pointer hidden sm:block"
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsLooping(!isLooping)}
                  className={`px-2 py-1 rounded text-[11px] font-medium transition-colors ${
                    isLooping
                      ? 'bg-cyan-950 text-cyan-300 border border-cyan-800'
                      : 'bg-slate-800 text-slate-400'
                  }`}
                >
                  Loop: {isLooping ? 'On' : 'Off'}
                </button>

                {videoUrl && (
                  <button
                    type="button"
                    onClick={handleClearVideo}
                    className="p-1.5 rounded-lg bg-rose-950/60 hover:bg-rose-900/60 text-rose-300 border border-rose-800 transition-colors"
                    title="Remove Video"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: WORKBENCH TABS */}
        <div className="lg:col-span-5 space-y-4">
          {/* Studio Tab Buttons */}
          <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-slate-100 dark:bg-[#11182D] border border-slate-200/80 dark:border-slate-800 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'editor'
                  ? 'bg-white dark:bg-[#050814] text-slate-900 dark:text-[#00DFFF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Safe Zones
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('media')}
              className={`py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'media'
                  ? 'bg-white dark:bg-[#050814] text-slate-900 dark:text-[#00DFFF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Media
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('export')}
              className={`py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'export'
                  ? 'bg-white dark:bg-[#050814] text-slate-900 dark:text-[#00DFFF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Export
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('tips')}
              className={`py-1.5 rounded-lg font-semibold transition-all ${
                activeTab === 'tips'
                  ? 'bg-white dark:bg-[#050814] text-slate-900 dark:text-[#00DFFF] shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Guidelines
            </button>
          </div>

          {/* TAB 1: SAFE ZONE EDITOR */}
          {activeTab === 'editor' && (
            <div className="xw-panel space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                    <SlidersHorizontal className="h-4 w-4 text-cyan-600 dark:text-[#00DFFF]" />
                    <span>Safe Zone Margin Sliders</span>
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Adjust safe content clearance percentages live
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleResetToPreset}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 hover:text-blue-600 dark:hover:text-[#00DFFF] transition-colors"
                >
                  <RefreshCw className="h-3 w-3" />
                  <span>Reset</span>
                </button>
              </div>

              {/* Sliders Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                {/* Top Margin */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Top Margin</span>
                    <span className="font-mono text-cyan-600 dark:text-[#00DFFF]">{safeMargins.topPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="40"
                    step="0.5"
                    value={safeMargins.topPercent}
                    onChange={(e) =>
                      setSafeMargins((prev) => ({ ...prev, topPercent: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* Bottom Margin */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Bottom Margin</span>
                    <span className="font-mono text-cyan-600 dark:text-[#00DFFF]">{safeMargins.bottomPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="45"
                    step="0.5"
                    value={safeMargins.bottomPercent}
                    onChange={(e) =>
                      setSafeMargins((prev) => ({ ...prev, bottomPercent: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* Left Margin */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Left Margin</span>
                    <span className="font-mono text-cyan-600 dark:text-[#00DFFF]">{safeMargins.leftPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="30"
                    step="0.5"
                    value={safeMargins.leftPercent}
                    onChange={(e) =>
                      setSafeMargins((prev) => ({ ...prev, leftPercent: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>

                {/* Right Margin */}
                <div className="p-2.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200/80 dark:border-slate-800 space-y-1">
                  <div className="flex justify-between font-semibold">
                    <span>Right Margin</span>
                    <span className="font-mono text-cyan-600 dark:text-[#00DFFF]">{safeMargins.rightPercent}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="35"
                    step="0.5"
                    value={safeMargins.rightPercent}
                    onChange={(e) =>
                      setSafeMargins((prev) => ({ ...prev, rightPercent: parseFloat(e.target.value) || 0 }))
                    }
                    className="w-full accent-cyan-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* Obstruction Zones Management */}
              <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <Layers className="h-3.5 w-3.5" />
                    <span>Obstruction Zones ({zones.length})</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsAddingZone(!isAddingZone)}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-[#00DFFF]"
                  >
                    <Plus className="h-3 w-3" />
                    <span>Add Custom Zone</span>
                  </button>
                </div>

                {/* Add Custom Zone Inline Form */}
                {isAddingZone && (
                  <form
                    onSubmit={handleAddCustomZone}
                    className="p-3 rounded-xl bg-blue-50/50 dark:bg-[#050814] border border-blue-200 dark:border-cyan-500/30 text-xs space-y-2.5"
                  >
                    <div className="font-bold text-slate-800 dark:text-slate-200">New Obstruction Block</div>
                    
                    {/* Anchor Preset Selector */}
                    <div>
                      <label className="text-[10px] text-slate-500">Anchor Preset</label>
                      <select
                        value={newZoneAnchor}
                        onChange={(e) => handleAnchorChange(e.target.value as ObstructionAnchor)}
                        className="xw-input py-1 text-xs w-full"
                        aria-label="Obstruction Anchor Preset"
                      >
                        <option value="full-width">Full Width Banner</option>
                        <option value="top-left">Top-Left Logo / Bug</option>
                        <option value="top-right">Top-Right Badge / Watermark</option>
                        <option value="bottom-left">Bottom-Left Lower Third</option>
                        <option value="bottom-right">Bottom-Right Corner</option>
                        <option value="center">Center Box / Disclaimer</option>
                        <option value="custom">Custom Coordinates</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] text-slate-500">Label</label>
                        <input
                          type="text"
                          value={newZoneLabel}
                          onChange={(e) => setNewZoneLabel(e.target.value)}
                          className="xw-input py-1 text-xs"
                          placeholder="e.g. Logo Box"
                          aria-label="Obstruction Zone Label"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Severity</label>
                        <select
                          value={newZoneSeverity}
                          onChange={(e) => setNewZoneSeverity(e.target.value as ZoneSeverity)}
                          className="xw-input py-1 text-xs"
                          aria-label="Obstruction Zone Severity"
                        >
                          <option value="danger">Danger (Red)</option>
                          <option value="caution">Caution (Amber)</option>
                          <option value="info">Info (Blue)</option>
                        </select>
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Left Position (X %)</label>
                        <input
                          type="number"
                          min="0"
                          max="95"
                          value={newZoneX}
                          onChange={(e) => {
                            setNewZoneAnchor('custom')
                            setNewZoneX(parseInt(e.target.value, 10) || 0)
                          }}
                          className="xw-input py-1 text-xs"
                          aria-label="Left Position percentage"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Top Position (Y %)</label>
                        <input
                          type="number"
                          min="0"
                          max="95"
                          value={newZoneY}
                          onChange={(e) => {
                            setNewZoneAnchor('custom')
                            setNewZoneY(parseInt(e.target.value, 10) || 0)
                          }}
                          className="xw-input py-1 text-xs"
                          aria-label="Top Position percentage"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Width (%)</label>
                        <input
                          type="number"
                          min="2"
                          max="100"
                          value={newZoneW}
                          onChange={(e) => {
                            setNewZoneAnchor('custom')
                            setNewZoneW(parseInt(e.target.value, 10) || 10)
                          }}
                          className="xw-input py-1 text-xs"
                          aria-label="Width percentage"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-500">Height (%)</label>
                        <input
                          type="number"
                          min="2"
                          max="100"
                          value={newZoneH}
                          onChange={(e) => {
                            setNewZoneAnchor('custom')
                            setNewZoneH(parseInt(e.target.value, 10) || 10)
                          }}
                          className="xw-input py-1 text-xs"
                          aria-label="Height percentage"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingZone(false)}
                        className="px-2.5 py-1 rounded-lg text-slate-500 text-[11px]"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="xw-btn-primary px-3 py-1 text-[11px] rounded-lg"
                      >
                        Save Zone
                      </button>
                    </div>
                  </form>
                )}

                {/* Zones List */}
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {zones.map((z) => (
                    <div
                      key={z.id}
                      className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200/60 dark:border-slate-800 text-xs"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className={`w-2.5 h-2.5 rounded-full shrink-0 ${
                            z.severity === 'danger'
                              ? 'bg-rose-500'
                              : z.severity === 'caution'
                              ? 'bg-amber-500'
                              : 'bg-blue-500'
                          }`}
                        />
                        <span className={`truncate font-medium ${z.enabled ? 'text-slate-800 dark:text-slate-200' : 'text-slate-400 line-through'}`}>
                          {z.label}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleToggleZone(z.id)}
                          className={`p-1 rounded transition-colors ${
                            z.enabled
                              ? 'text-cyan-600 dark:text-[#00DFFF] hover:bg-slate-200 dark:hover:bg-slate-800'
                              : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                          }`}
                          title={z.enabled ? 'Hide Zone' : 'Show Zone'}
                        >
                          {z.enabled ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
                        </button>
                        {z.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteZone(z.id)}
                            className="p-1 rounded text-rose-400 hover:text-rose-600 transition-colors"
                            title="Delete Custom Zone"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MEDIA & UPLOAD */}
          {activeTab === 'media' && (
            <div className="xw-panel space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileVideo className="h-4 w-4 text-blue-600 dark:text-[#00DFFF]" />
                  <span>Upload Local Video File</span>
                </h3>
                <span className="text-[11px] font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>100% In-Browser</span>
                </span>
              </div>

              {/* Drag & Drop Zone */}
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
                    handleFileSelect(e.dataTransfer.files[0])
                  }
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
                  isDragOver
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/30 dark:border-[#00DFFF]'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/60 dark:bg-[#11182D]/60'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="video/mp4,video/webm,video/quicktime,video/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFileSelect(e.target.files[0])
                    }
                  }}
                  className="hidden"
                />

                <div className="w-12 h-12 mx-auto rounded-xl bg-blue-50 dark:bg-[#050814] border border-blue-200 dark:border-cyan-500/30 flex items-center justify-center text-blue-600 dark:text-[#00DFFF] mb-3">
                  <Upload className="h-6 w-6" />
                </div>

                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                  Click to browse or drag &amp; drop video
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  MP4, WebM, or MOV • Max 500 MB safe limit
                </p>
              </div>

              {/* Error Message */}
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800/80 text-xs text-rose-700 dark:text-rose-300 flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {/* Uploaded Video Metadata Card */}
              {videoFile && (
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#050814] border border-slate-200/80 dark:border-slate-800 text-xs space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[220px]">
                      {videoFile.name}
                    </span>
                    <button
                      type="button"
                      onClick={handleClearVideo}
                      className="text-slate-400 hover:text-rose-500 transition-colors text-[11px] font-semibold"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200/60 dark:border-slate-800">
                    <div>Size: {(videoFile.size / (1024 * 1024)).toFixed(2)} MB</div>
                    <div>Duration: {formatTime(duration)}</div>
                    {videoDimensions && (
                      <>
                        <div>Native: {videoDimensions.width} × {videoDimensions.height}</div>
                        <div>
                          Ratio: {(videoDimensions.width / videoDimensions.height).toFixed(2)}:1
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: EXPORT STUDIO */}
          {activeTab === 'export' && (
            <div className="xw-panel space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Export Safe Zone Template</span>
                </h3>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                  {effectiveResolution.width} × {effectiveResolution.height}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Export a full-definition PNG safe-zone template for {currentPlatform.name} ({currentFormat.name}). Drop it into CapCut, Premiere Pro, Final Cut Pro, DaVinci Resolve, or Canva as a guide layer while editing.
              </p>

              <div className="space-y-2 pt-1">
                <div className="flex items-center gap-2 text-xs text-slate-700 dark:text-slate-300">
                  <input
                    id="transparent-chk"
                    type="checkbox"
                    checked={downloadTransparent}
                    onChange={(e) => setDownloadTransparent(e.target.checked)}
                    className="rounded border-slate-300 dark:border-slate-700 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label htmlFor="transparent-chk" className="cursor-pointer font-medium">
                    Transparent PNG overlay (recommended for video editors)
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={handleDownloadTemplate}
                className="w-full xw-btn-primary py-2.5 text-xs font-semibold rounded-xl flex items-center justify-center gap-2"
              >
                <Download className="h-4 w-4" />
                <span>
                  Download {currentPlatform.name} Template ({effectiveResolution.width}×{effectiveResolution.height})
                </span>
              </button>
            </div>
          )}

          {/* TAB 4: PLATFORM GUIDELINES & TIPS */}
          {activeTab === 'tips' && (
            <div className="xw-panel space-y-3.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">
                  {currentPlatform.name} Safe Margins
                </h4>
                <span className="text-[11px] font-semibold text-cyan-600 dark:text-[#00DFFF]">
                  {currentFormat.aspectRatio}
                </span>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {currentFormat.description}
              </p>

              {/* Color Legend */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-[11px]">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Safe Zone</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-amber-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">Caution Buffer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-rose-500 shrink-0" />
                  <span className="text-slate-600 dark:text-slate-300 font-medium">UI Covered</span>
                </div>
              </div>

              {/* Tips List */}
              <ul className="space-y-1.5 pt-1 text-xs text-slate-600 dark:text-slate-300 list-disc list-inside">
                {currentFormat.tips.map((tip, idx) => (
                  <li key={idx} className="leading-relaxed">
                    {tip}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* DISCLAIMER BOX */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-[#11182D]/70 border border-slate-200/80 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-start gap-2.5 leading-relaxed">
            <Info className="h-4 w-4 text-cyan-500 shrink-0 mt-0.5" />
            <span>
              <strong>Planning Disclaimer:</strong> Social platform interface layouts change regularly across operating systems (iOS vs Android), phone screen ratios (16:9 to 20:9), and device hardware notches. These simulations provide conservative planning guidelines rather than permanent official pixel guarantees.
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

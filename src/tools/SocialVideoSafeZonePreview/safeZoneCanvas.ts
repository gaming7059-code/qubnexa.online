import type { ContentFormatPreset, ObstructionZone, GuideToggles } from './types'

export interface RenderCanvasOptions {
  platformName: string
  format: ContentFormatPreset
  width: number
  height: number
  safeArea: {
    topPercent: number
    bottomPercent: number
    leftPercent: number
    rightPercent: number
  }
  obstructionZones: ObstructionZone[]
  cautionBufferPercent: number
  guides: GuideToggles
  transparentBackground?: boolean
}

/**
 * Sanitizes a string for safe usage in download filenames.
 */
export function sanitizeFilename(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

/**
 * Renders the Universal Safe Zone guide template onto an HTML5 Canvas.
 */
export function renderUniversalSafeZoneCanvas(
  canvas: HTMLCanvasElement,
  options: RenderCanvasOptions
): void {
  const {
    platformName,
    format,
    width: rawWidth,
    height: rawHeight,
    safeArea,
    obstructionZones,
    cautionBufferPercent,
    guides,
    transparentBackground = true,
  } = options

  // Enforce safe memory allocation bounds: minimum 320px, maximum 3840px
  const width = Math.min(3840, Math.max(320, Math.round(Number(rawWidth) || 1080)))
  const height = Math.min(3840, Math.max(320, Math.round(Number(rawHeight) || 1920)))

  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  if (!ctx) return

  // 1. Canvas Background
  ctx.clearRect(0, 0, width, height)
  if (!transparentBackground) {
    ctx.fillStyle = '#0B1020'
    ctx.fillRect(0, 0, width, height)
  }

  // Adaptive scale relative to both width and height (prevents oversized text on thin banners)
  const scale = Math.min(Math.max(0.35, width / 1080), Math.max(0.35, height / 700))

  // Sanitize and Clamp Safe Area Coordinates against NaN, negative, or excessive values
  const topP = Math.min(100, Math.max(0, Number(safeArea?.topPercent) || 0))
  const botP = Math.min(100, Math.max(0, Number(safeArea?.bottomPercent) || 0))
  const leftP = Math.min(100, Math.max(0, Number(safeArea?.leftPercent) || 0))
  const rightP = Math.min(100, Math.max(0, Number(safeArea?.rightPercent) || 0))
  const cBufP = Math.min(50, Math.max(0, Number(cautionBufferPercent) || 0))

  const safeTop = (topP / 100) * height
  const safeBottom = Math.max(safeTop, height - (botP / 100) * height)
  const safeLeft = (leftP / 100) * width
  const safeRight = Math.max(safeLeft, width - (rightP / 100) * width)
  const safeW = Math.max(0, safeRight - safeLeft)
  const safeH = Math.max(0, safeBottom - safeTop)

  // 2. Caution Buffer Zone (Amber)
  if (cBufP > 0) {
    const cautionTop = Math.max(0, safeTop - (cBufP / 100) * height)
    const cautionBot = Math.min(height, safeBottom + (cBufP / 100) * height)
    const cautionL = Math.max(0, safeLeft - (cBufP / 100) * width)
    const cautionR = Math.min(width, safeRight + (cBufP / 100) * width)

    ctx.fillStyle = 'rgba(245, 158, 11, 0.12)'
    ctx.fillRect(cautionL, cautionTop, cautionR - cautionL, cautionBot - cautionTop)
  }

  // 3. Obstruction Zones (Red / Caution)
  for (const zone of obstructionZones) {
    if (!zone.enabled) continue

    const zX = Math.max(0, Math.min(100, Number(zone.xPercent) || 0) / 100) * width
    const zY = Math.max(0, Math.min(100, Number(zone.yPercent) || 0) / 100) * height
    const zW = Math.max(0, Math.min(100, Number(zone.widthPercent) || 0) / 100) * width
    const zH = Math.max(0, Math.min(100, Number(zone.heightPercent) || 0) / 100) * height

    if (zone.severity === 'danger') {
      ctx.fillStyle = 'rgba(239, 68, 68, 0.28)'
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)'
    } else if (zone.severity === 'caution') {
      ctx.fillStyle = 'rgba(245, 158, 11, 0.22)'
      ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)'
    } else {
      ctx.fillStyle = 'rgba(59, 130, 246, 0.20)'
      ctx.strokeStyle = 'rgba(59, 130, 246, 0.75)'
    }

    ctx.lineWidth = Math.max(1.5, 2 * scale)
    ctx.fillRect(zX, zY, zW, zH)
    ctx.strokeRect(zX, zY, zW, zH)

    // Zone Label
    if (guides.labels && zW > 40 && zH > 24) {
      ctx.save()
      ctx.font = `bold ${Math.max(10, Math.round(13 * scale))}px system-ui, sans-serif`
      ctx.fillStyle = '#FFFFFF'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
      ctx.shadowBlur = 4 * scale
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      const labelText = zone.label.length > 32 ? `${zone.label.substring(0, 30)}...` : zone.label
      ctx.fillText(labelText, zX + zW / 2, zY + zH / 2)
      ctx.restore()
    }
  }

  // 4. Rule of Thirds Grid
  if (guides.ruleOfThirds) {
    ctx.strokeStyle = 'rgba(0, 223, 255, 0.25)'
    ctx.lineWidth = Math.max(1, 1.5 * scale)
    ctx.setLineDash([6 * scale, 6 * scale])

    const thirdW = width / 3
    const thirdH = height / 3

    ctx.beginPath()
    // Vertical Thirds
    ctx.moveTo(thirdW, 0)
    ctx.lineTo(thirdW, height)
    ctx.moveTo(thirdW * 2, 0)
    ctx.lineTo(thirdW * 2, height)
    // Horizontal Thirds
    ctx.moveTo(0, thirdH)
    ctx.lineTo(width, thirdH)
    ctx.moveTo(0, thirdH * 2)
    ctx.lineTo(width, thirdH * 2)
    ctx.stroke()
    ctx.setLineDash([])
  }

  // 5. Center Crosshairs
  if (guides.centerCrosshair) {
    const centerX = width / 2
    const centerY = height / 2
    const crosshairLen = 24 * scale

    ctx.strokeStyle = '#10B981'
    ctx.lineWidth = Math.max(1.5, 2 * scale)
    ctx.beginPath()
    ctx.moveTo(centerX - crosshairLen, centerY)
    ctx.lineTo(centerX + crosshairLen, centerY)
    ctx.moveTo(centerX, centerY - crosshairLen)
    ctx.lineTo(centerX, centerY + crosshairLen)
    ctx.stroke()
  }

  // 6. Recommended Safe Content Zone (Emerald Green)
  ctx.fillStyle = 'rgba(16, 185, 129, 0.12)'
  ctx.fillRect(safeLeft, safeTop, safeW, safeH)

  ctx.strokeStyle = '#10B981'
  ctx.lineWidth = Math.max(2.5, 3.5 * scale)
  ctx.setLineDash([12 * scale, 8 * scale])
  ctx.strokeRect(safeLeft, safeTop, safeW, safeH)
  ctx.setLineDash([])

  // 7. Text & Specifications Badge
  if (guides.labels) {
    ctx.save()
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)'
    ctx.shadowBlur = 6 * scale

    const centerX = width / 2
    const centerY = height / 2

    // Main Safe Zone Badge & Specifications
    if (height < 300) {
      // Compact banner layout (prevents label overlap on thin horizontal banners)
      ctx.font = `bold ${Math.max(11, Math.round(15 * scale))}px system-ui, sans-serif`
      ctx.fillStyle = '#10B981'
      ctx.fillText(`✅ SAFE ZONE: ${platformName} • ${format.name}`, centerX, centerY - 10 * scale)

      ctx.font = `500 ${Math.max(10, Math.round(12 * scale))}px system-ui, sans-serif`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillText(
        `Canvas: ${width}×${height} | Safe: ${Math.round(safeW)}×${Math.round(safeH)} px`,
        centerX,
        centerY + 10 * scale
      )
    } else {
      // Standard full-height layout
      ctx.font = `bold ${Math.max(14, Math.round(24 * scale))}px system-ui, sans-serif`
      ctx.fillStyle = '#10B981'
      ctx.fillText('✅ RECOMMENDED SAFE CONTENT ZONE', centerX, centerY - 24 * scale)

      ctx.font = `600 ${Math.max(12, Math.round(18 * scale))}px system-ui, sans-serif`
      ctx.fillStyle = '#FFFFFF'
      ctx.fillText(`${platformName} • ${format.name}`, centerX, centerY + 10 * scale)

      ctx.font = `500 ${Math.max(11, Math.round(14 * scale))}px system-ui, sans-serif`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)'
      ctx.fillText(
        `Canvas: ${width} × ${height} (${format.aspectRatio}) | Safe Area: ${Math.round(safeW)} × ${Math.round(safeH)} px`,
        centerX,
        centerY + 34 * scale
      )

      ctx.font = `500 ${Math.max(10, Math.round(13 * scale))}px system-ui, sans-serif`
      ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'
      ctx.fillText(
        'QUBNEXA Safe Zone Studio • qubnexa.online/tools/social-video-safe-zone-preview',
        centerX,
        Math.max(safeTop + 20 * scale, safeBottom - 20 * scale)
      )
    }

    ctx.restore()
  }
}

/**
 * Triggers a client-side download of the rendered template PNG.
 */
export function downloadUniversalSafeZonePNG(options: RenderCanvasOptions): void {
  const canvas = document.createElement('canvas')
  renderUniversalSafeZoneCanvas(canvas, options)

  canvas.toBlob((blob) => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    const safePlatform = sanitizeFilename(options.platformName)
    const safeFormat = sanitizeFilename(options.format.name)
    const bgTag = options.transparentBackground ? 'overlay' : 'preview'
    link.download = `qubnexa-${safePlatform}-${safeFormat}-${canvas.width}x${canvas.height}-${bgTag}.png`
    link.href = url
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    setTimeout(() => URL.revokeObjectURL(url), 2000)
  }, 'image/png')
}

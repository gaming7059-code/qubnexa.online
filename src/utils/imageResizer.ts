/**
 * QUBNEXA — Image Resizer Calculation & Validation Utilities
 * Pure client-side calculations, presets, and validation.
 */

export interface ResizePreset {
  id: string
  name: string
  width: number
  height: number
  aspectRatioLabel: string
  description: string
}

export const RESIZE_PRESETS: ResizePreset[] = [
  {
    id: 'instagram-square',
    name: 'Instagram Square',
    width: 1080,
    height: 1080,
    aspectRatioLabel: '1:1',
    description: 'Square feed posts & profile pictures',
  },
  {
    id: 'instagram-portrait',
    name: 'Instagram Portrait',
    width: 1080,
    height: 1350,
    aspectRatioLabel: '4:5',
    description: 'High-engagement vertical feed posts',
  },
  {
    id: 'youtube-thumbnail',
    name: 'YouTube Thumbnail',
    width: 1280,
    height: 720,
    aspectRatioLabel: '16:9',
    description: 'Standard 720p HD video cover image',
  },
  {
    id: 'full-hd',
    name: 'Full HD (1080p)',
    width: 1920,
    height: 1080,
    aspectRatioLabel: '16:9',
    description: 'Standard desktop wallpaper & displays',
  },
  {
    id: 'facebook-post',
    name: 'Facebook Post',
    width: 1200,
    height: 630,
    aspectRatioLabel: '1.91:1',
    description: 'Recommended feed & link share cards',
  },
  {
    id: 'twitter-header',
    name: 'X / Twitter Banner',
    width: 1500,
    height: 500,
    aspectRatioLabel: '3:1',
    description: 'Widescreen header cover banner',
  },
]

export const MIN_DIMENSION = 1
export const MAX_DIMENSION = 8192
export const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024 // 50 MB

export const SUPPORTED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const
export type SupportedMimeType = typeof SUPPORTED_MIME_TYPES[number]

export interface FileValidationResult {
  valid: boolean
  error: string | null
}

/**
 * Validates file MIME type and maximum allowable size.
 */
export function validateImageFile(file: File): FileValidationResult {
  if (!file) {
    return { valid: false, error: 'No file provided.' }
  }

  // Check MIME type
  const isSupportedType = SUPPORTED_MIME_TYPES.includes(file.type as SupportedMimeType)
  const hasSupportedExt = /\.(jpe?g|png|webp)$/i.test(file.name)

  if (!isSupportedType && !hasSupportedExt) {
    return {
      valid: false,
      error: 'Unsupported image format. Please select a JPG, JPEG, PNG, or WebP image.',
    }
  }

  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `File exceeds maximum allowable size of 50 MB (File size: ${(file.size / (1024 * 1024)).toFixed(1)} MB).`,
    }
  }

  return { valid: true, error: null }
}

/**
 * Clamps dimensions to safe ranges [1, 8192].
 */
export function clampDimension(value: number, min = MIN_DIMENSION, max = MAX_DIMENSION): number {
  if (isNaN(value) || value < min) return min
  if (value > max) return max
  return Math.round(value)
}

/**
 * Calculates height from width preserving aspect ratio.
 */
export function calculateHeightFromWidth(width: number, originalWidth: number, originalHeight: number): number {
  if (originalWidth <= 0 || originalHeight <= 0) return width
  const ratio = originalHeight / originalWidth
  return clampDimension(Math.round(width * ratio))
}

/**
 * Calculates width from height preserving aspect ratio.
 */
export function calculateWidthFromHeight(height: number, originalWidth: number, originalHeight: number): number {
  if (originalWidth <= 0 || originalHeight <= 0) return height
  const ratio = originalWidth / originalHeight
  return clampDimension(Math.round(height * ratio))
}

/**
 * Formats byte count to human-readable string.
 */
export function formatBytes(bytes: number): string {
  if (bytes <= 0 || isNaN(bytes)) return '0 B'
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(2)} MB`
}

/**
 * Maps MIME type to safe output file extension.
 */
export function getExtensionForMimeType(mimeType: string): string {
  switch (mimeType) {
    case 'image/png':
      return 'png'
    case 'image/webp':
      return 'webp'
    case 'image/jpeg':
    default:
      return 'jpg'
  }
}

/**
 * Generates an output filename with width, height, and new extension.
 */
export function generateResizedFilename(
  originalFilename: string,
  width: number,
  height: number,
  mimeType: string,
): string {
  const base = originalFilename.replace(/\.[^/.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_')
  const ext = getExtensionForMimeType(mimeType)
  return `${base}-${width}x${height}.${ext}`
}

/**
 * Calculates percent change between original and resized file sizes.
 */
export function calculateSizeDelta(originalBytes: number, newBytes: number): {
  percent: number
  isReduction: boolean
  label: string
} {
  if (originalBytes <= 0 || newBytes <= 0) {
    return { percent: 0, isReduction: false, label: '0%' }
  }

  const diff = newBytes - originalBytes
  const percent = Math.round(Math.abs(diff / originalBytes) * 100)

  if (diff < 0) {
    return { percent, isReduction: true, label: `-${percent}% smaller` }
  } else if (diff > 0) {
    return { percent, isReduction: false, label: `+${percent}% larger` }
  } else {
    return { percent: 0, isReduction: false, label: 'Same size' }
  }
}

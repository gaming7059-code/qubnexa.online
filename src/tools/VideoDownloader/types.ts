export type PlatformId =
  | 'direct-mp4'
  | 'direct-webm'
  | 'direct-media'
  | 'youtube'
  | 'instagram'
  | 'facebook'
  | 'twitter'
  | 'tiktok'
  | 'other'

export type CapabilityStatus =
  | 'supported-direct'
  | 'cors-restricted'
  | 'official-only'
  | 'restricted'
  | 'unsupported'
  | 'invalid'
  | 'network-error'

export interface QualityOption {
  id: string
  label: string
  format: 'MP4' | 'WebM' | 'Platform Stream'
  resolution: string
  fileSizeBytes: number | null
  downloadableDirect: boolean
  note?: string
}

export interface OfficialLink {
  label: string
  url: string
  description: string
}

export interface VideoAnalysisResult {
  normalizedUrl: string
  platformId: PlatformId
  platformName: string
  capability: CapabilityStatus
  statusLabel: string
  statusSummary: string
  explanation: string
  title: string
  filename: string
  thumbnailUrl?: string
  previewVideoUrl?: string
  durationSeconds: number | null
  width: number | null
  height: number | null
  mimeType: string | null
  fileSizeBytes: number | null
  isLargeFile: boolean
  hasContentDispositionName: boolean
  qualityOptions: QualityOption[]
  officialLinks: OfficialLink[]
}

export interface LiveDetectionPreview {
  isValidSyntax: boolean
  platformId: PlatformId | null
  platformName: string
  badgeLabel: string
  tone: 'emerald' | 'cyan' | 'amber' | 'rose' | 'slate'
  hint: string
}

export interface DownloadProgressState {
  status: 'idle' | 'downloading' | 'completed' | 'cancelled' | 'error'
  loadedBytes: number
  totalBytes: number | null
  percent: number | null
  message: string
}

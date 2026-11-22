export type SocialPlatformId =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'facebook'
  | 'snapchat'
  | 'twitter'
  | 'linkedin'
  | 'pinterest'
  | 'threads'
  | 'whatsapp'
  | 'telegram'
  | 'reddit'
  | 'twitch'
  | 'discord'
  | 'kick'
  | 'custom'

export type PlatformCategory =
  | 'all'
  | 'short-form'
  | 'social-feeds'
  | 'streaming'
  | 'community'
  | 'custom'

export type AspectRatioType = '9:16' | '16:9' | '4:5' | '1:1' | '3:4' | '2:3' | '3:1' | '4:1' | 'banner' | 'custom'

export type OverlayMode = 'both' | 'safe-zone' | 'ui-only' | 'text-placement' | 'clean'

export type VideoFitMode = 'cover' | 'contain'

export type ZoneSeverity = 'danger' | 'caution' | 'info'

export type ObstructionAnchor =
  | 'full-width'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'center'
  | 'custom'

export interface ObstructionZone {
  id: string
  label: string
  xPercent: number // 0 to 100
  yPercent: number // 0 to 100
  widthPercent: number // 0 to 100
  heightPercent: number // 0 to 100
  color?: string
  severity: ZoneSeverity
  enabled: boolean
  isCustom?: boolean
  anchor?: ObstructionAnchor
}

export type SafeZoneSpecType = 'official' | 'approximate'

export interface ContentFormatPreset {
  id: string
  name: string
  aspectRatio: AspectRatioType
  defaultWidth: number
  defaultHeight: number
  safeArea: {
    topPercent: number
    bottomPercent: number
    leftPercent: number
    rightPercent: number
  }
  obstructionZones: ObstructionZone[]
  cautionBufferPercent: number
  description: string
  tips: string[]
  specificationType: SafeZoneSpecType
  specSource?: string
}

export interface PlatformConfig {
  id: SocialPlatformId
  name: string
  category: PlatformCategory
  brandColor: string
  tagline: string
  formats: ContentFormatPreset[]
}

export interface CustomPlatformSettings {
  name: string
  width: number
  height: number
  topMarginPercent: number
  bottomMarginPercent: number
  leftMarginPercent: number
  rightMarginPercent: number
  cautionBufferPercent: number
  customZones: ObstructionZone[]
}

export interface GuideToggles {
  ruleOfThirds: boolean
  centerCrosshair: boolean
  marginLines: boolean
  labels: boolean
}

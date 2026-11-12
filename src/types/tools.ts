export type PrimaryCategoryId =
  | 'ai-tools'
  | 'image-tools'
  | 'video-tools'
  | 'audio-tools'
  | 'pdf-documents'
  | 'text-writing'
  | 'calculators'
  | 'date-time'
  | 'utilities'
  | 'games'

export type LegacyCategoryId =
  | 'daily-utilities'
  | 'daily-utility'
  | 'image-media'
  | 'voice-audio'
  | 'ai-creator'
  | 'creator-tools'
  | 'text-developer'
  | 'seo-tools'
  | 'pdf-tools'

export type CategoryId = 'all' | PrimaryCategoryId | LegacyCategoryId

export type ToolStatus = 'live' | 'beta' | 'coming-soon'

export interface Category {
  id: CategoryId
  name: string
  slug: string
  tagline: string
  description: string
  icon: string
  path: string
  accentColor: string
  keywords?: string[]
  /** Optional unit label override (e.g., "Tools" vs "Games") */
  unitLabel?: string
  /** Legacy compatibility field derived dynamically when needed */
  toolCount?: number
  itemLabel?: string
}

export interface Tool {
  id: string
  name: string
  slug: string
  description: string
  icon: string
  /** Standardized primary category ID */
  primaryCategory?: PrimaryCategoryId
  /** Optional secondary categories for cross-domain discoverability */
  secondaryCategories?: PrimaryCategoryId[]
  /** Standardized route path */
  route?: string
  /** Standardized searchable tags */
  tags?: string[]
  /** Availability status */
  status?: ToolStatus
  /** Chronological release rank (higher = more recently added) */
  releaseOrder?: number
  /** Release date metadata (YYYY-MM-DD) */
  createdAt?: string
  /** Highlight flags */
  isPopular?: boolean
  isNew?: boolean
  isFeatured?: boolean
  isFunctional?: boolean
  badge?: string

  /** Legacy/compatibility aliases kept in sync with primary fields */
  path: string
  categoryId: CategoryId
  categoryIds?: CategoryId[]
  categoryName: string
  keywords: string[]
}

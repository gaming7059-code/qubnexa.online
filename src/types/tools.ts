export type PrimaryCategoryId =
  | 'calculators'
  | 'daily-utilities'
  | 'pdf-documents'
  | 'image-media'
  | 'text-developer'
  | 'voice-audio'
  | 'ai-creator'
  | 'games'

export type CategoryId =
  | 'all'
  | PrimaryCategoryId
  // Aliases and legacy category IDs preserved for backward compatibility
  | 'daily-utility'
  | 'finance'
  | 'math'
  | 'converters'
  | 'date-time'
  | 'education'
  | 'creator-tools'
  | 'seo-tools'
  | 'pdf-tools'

export interface Category {
  id: CategoryId
  name: string
  emoji: string
  tagline: string
  description: string
  icon: string
  toolCount: number
  path?: string
  itemLabel?: string
  accentGradient?: string
  badgeColor?: string
}

export interface Tool {
  id: string
  name: string
  slug: string
  path: string
  description: string
  categoryId: CategoryId
  categoryIds?: CategoryId[]
  categoryName: string
  icon: string
  isPopular?: boolean
  isNew?: boolean
  isFunctional?: boolean
  badge?: string
  keywords: string[]
}

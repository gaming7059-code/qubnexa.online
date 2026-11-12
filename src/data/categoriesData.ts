import type { Category, CategoryId, PrimaryCategoryId, Tool } from '../types/tools'

export const PRIMARY_CATEGORIES: Category[] = [
  {
    id: 'calculators',
    name: 'Calculators & Finance',
    slug: 'calculators',
    tagline: 'Finance, EMI, GST, Salary & Math',
    description: 'Calculate EMI schedules, GST invoices, take-home salary, retail discounts, profit margins, and percentages.',
    icon: 'Calculator',
    path: '/categories/calculators',
    accentColor: '#2563eb',
    unitLabel: 'Tools',
    keywords: ['calculators', 'finance calculator', 'emi', 'gst', 'salary', 'discount', 'percentage', 'profit loss'],
  },
  {
    id: 'utilities',
    name: 'Converters & Utilities',
    slug: 'utilities',
    tagline: 'QR Codes, Passwords & Unit Converters',
    description: 'Essential daily productivity tools including QR code generation, password security, and multi-unit conversion.',
    icon: 'Wrench',
    path: '/categories/utilities',
    accentColor: '#0284c7',
    unitLabel: 'Tools',
    keywords: ['utilities', 'converters', 'qr code', 'password generator', 'unit converter', 'daily tools'],
  },
  {
    id: 'pdf-documents',
    name: 'PDF & Document Tools',
    slug: 'pdf-documents',
    tagline: 'Edit, Annotate & Convert PDFs',
    description: 'Private client-side PDF annotation, text insertion, drawing, signing, and multi-image JPG-to-PDF conversion.',
    icon: 'FileText',
    path: '/categories/pdf-documents',
    accentColor: '#dc2626',
    unitLabel: 'Tools',
    keywords: ['pdf editor', 'jpg to pdf', 'document tools', 'private pdf', 'annotate pdf'],
  },
  {
    id: 'audio-tools',
    name: 'Audio & Music Tools',
    slug: 'audio-tools',
    tagline: 'Neural TTS, Audio Cleaner & Dictation',
    description: 'Generate natural offline speech, clean background hum and room noise, apply EQ, and transcribe voice into text.',
    icon: 'Mic',
    path: '/categories/audio-tools',
    accentColor: '#4f46e5',
    unitLabel: 'Tools',
    keywords: ['text to speech', 'audio studio', 'audio cleaner', 'voice transcriber', 'speech to text'],
  },
  {
    id: 'video-tools',
    name: 'Video Tools',
    slug: 'video-tools',
    tagline: 'Video Downloads & Media Workflows',
    description: 'Analyze video URLs, extract authorized direct MP4/WebM media streams, and inspect playback links privately.',
    icon: 'Video',
    path: '/categories/video-tools',
    accentColor: '#ea580c',
    unitLabel: 'Tools',
    keywords: ['video downloader', 'mp4 downloader', 'webm', 'media saver', 'video tools'],
  },
  {
    id: 'image-tools',
    name: 'Image Tools',
    slug: 'image-tools',
    tagline: 'Enhance & Upscale Images Locally',
    description: 'Upscale resolution, sharpen edges, remove noise, and improve clarity in PNG, JPG, and WebP photos cleanly.',
    icon: 'Image',
    path: '/categories/image-tools',
    accentColor: '#7c3aed',
    unitLabel: 'Tools',
    keywords: ['image quality increaser', 'image upscaler', 'photo enhancer', 'image sharpener'],
  },
  {
    id: 'ai-tools',
    name: 'AI Tools',
    slug: 'ai-tools',
    tagline: 'Prompt Engineering & Neural Utilities',
    description: 'Craft structured cinematic prompts for AI video models alongside neural speech synthesis and browser AI workflows.',
    icon: 'Sparkles',
    path: '/categories/ai-tools',
    accentColor: '#a855f7',
    unitLabel: 'Tools',
    keywords: ['ai tools', 'ai video prompt generator', 'prompt builder', 'neural voice', 'ai creator'],
  },
  {
    id: 'date-time',
    name: 'Date & Time Tools',
    slug: 'date-time',
    tagline: 'Age, Intervals & Day Arithmetic',
    description: 'Compute exact chronological age, day differences between dates, business days, and future milestone dates.',
    icon: 'CalendarDays',
    path: '/categories/date-time',
    accentColor: '#0d9488',
    unitLabel: 'Tools',
    keywords: ['age calculator', 'date calculator', 'date difference', 'days calculator', 'countdown'],
  },
  {
    id: 'text-writing',
    name: 'Text & Writing Tools',
    slug: 'text-writing',
    tagline: 'Word Count, Reading Time & Text Analysis',
    description: 'Measure word count, character limits, sentence cadence, paragraph structure, and reading duration in real time.',
    icon: 'FileCode',
    path: '/categories/text-writing',
    accentColor: '#059669',
    unitLabel: 'Tools',
    keywords: ['word counter', 'character counter', 'writing tools', 'reading time', 'text analyzer'],
  },
  {
    id: 'games',
    name: 'Games & Entertainment',
    slug: 'games',
    tagline: 'Instant Zero-Install Arcade',
    description: 'Play responsive HTML5 sci-fi arcade shooters and timeless mini-games with synthesized sound and touch controls.',
    icon: 'Gamepad2',
    path: '/categories/games',
    accentColor: '#9333ea',
    unitLabel: 'Games',
    keywords: ['free browser games', 'hex drift', 'tic tac toe', 'snake', 'memory card match', 'arcade'],
  },
]

export const ALL_TOOLS_CATEGORY: Category = {
  id: 'all',
  name: 'All Tools',
  slug: 'all',
  tagline: 'Complete Xenova-World Directory',
  description: 'Explore every calculator, converter, PDF editor, multimedia studio, AI utility, and arcade game.',
  icon: 'Layers',
  path: '/tools',
  accentColor: '#0f172a',
  unitLabel: 'Items',
}

export const CATEGORIES: Category[] = [ALL_TOOLS_CATEGORY, ...PRIMARY_CATEGORIES]

export const CATEGORY_MAP: Record<CategoryId, Category> = CATEGORIES.reduce(
  (acc, category) => {
    acc[category.id] = category
    return acc
  },
  {} as Record<CategoryId, Category>,
)

const LEGACY_CATEGORY_ALIASES: Record<string, 'all' | PrimaryCategoryId> = {
  all: 'all',
  'all-tools': 'all',
  calculators: 'calculators',
  calculator: 'calculators',
  finance: 'calculators',
  'calculators-finance': 'calculators',
  math: 'calculators',
  education: 'calculators',
  utilities: 'utilities',
  utility: 'utilities',
  'daily-utilities': 'utilities',
  'daily-utility': 'utilities',
  converters: 'utilities',
  'converters-utilities': 'utilities',
  'pdf-documents': 'pdf-documents',
  'pdf-tools': 'pdf-documents',
  pdf: 'pdf-documents',
  'audio-tools': 'audio-tools',
  'voice-audio': 'audio-tools',
  audio: 'audio-tools',
  voice: 'audio-tools',
  'video-tools': 'video-tools',
  video: 'video-tools',
  'image-tools': 'image-tools',
  'image-media': 'image-tools',
  image: 'image-tools',
  'ai-tools': 'ai-tools',
  'ai-creator': 'ai-tools',
  'creator-tools': 'ai-tools',
  ai: 'ai-tools',
  'date-time': 'date-time',
  'date-tools': 'date-time',
  date: 'date-time',
  'text-writing': 'text-writing',
  'text-developer': 'text-writing',
  'seo-tools': 'text-writing',
  'developer-tools': 'text-writing',
  text: 'text-writing',
  games: 'games',
  entertainment: 'games',
}

export function normalizeCategoryId(rawCategory: string | null | undefined): 'all' | PrimaryCategoryId {
  if (!rawCategory) return 'all'
  const normalized = rawCategory.trim().toLowerCase()
  return LEGACY_CATEGORY_ALIASES[normalized] || 'all'
}

export function isValidPrimaryCategorySlug(rawSlug: string | null | undefined): PrimaryCategoryId | null {
  if (!rawSlug) return null
  const normalized = normalizeCategoryId(rawSlug)
  if (normalized === 'all') return null
  return normalized
}

export function getCategoryById(id: string | null | undefined): Category {
  const normalized = normalizeCategoryId(id)
  return CATEGORY_MAP[normalized] || ALL_TOOLS_CATEGORY
}

export function isToolInCategory(
  tool: Tool,
  categoryId: CategoryId | string,
  includeSecondary = true,
): boolean {
  const normalized = normalizeCategoryId(categoryId)
  if (normalized === 'all') return true
  if (tool.primaryCategory === normalized || tool.categoryId === normalized) return true
  if (!includeSecondary) return false
  if (tool.secondaryCategories?.includes(normalized as PrimaryCategoryId)) return true
  if (tool.categoryIds?.includes(normalized)) return true
  return false
}

export function getToolsByCategory(
  tools: Tool[],
  categoryId: CategoryId | string,
  includeSecondary = true,
): Tool[] {
  const normalized = normalizeCategoryId(categoryId)
  if (normalized === 'all') return tools
  return tools.filter((tool) => isToolInCategory(tool, normalized, includeSecondary))
}

export function getCategoryToolCount(
  tools: Tool[],
  categoryId: CategoryId | string,
  includeSecondary = false,
): number {
  return getToolsByCategory(tools, categoryId, includeSecondary).length
}

export function getCategoryCountLabel(tools: Tool[], category: Category): string {
  const count = getCategoryToolCount(tools, category.id, false)
  const unit = category.unitLabel || 'Tools'
  return `${count} ${count === 1 ? unit.replace(/s$/, '') : unit}`
}

const RELATED_CATEGORY_GRAPH: Record<PrimaryCategoryId, PrimaryCategoryId[]> = {
  calculators: ['date-time', 'utilities', 'text-writing'],
  utilities: ['calculators', 'text-writing', 'pdf-documents'],
  'pdf-documents': ['image-tools', 'utilities', 'text-writing'],
  'audio-tools': ['video-tools', 'ai-tools', 'utilities'],
  'video-tools': ['ai-tools', 'audio-tools', 'image-tools'],
  'image-tools': ['pdf-documents', 'video-tools', 'ai-tools'],
  'ai-tools': ['video-tools', 'audio-tools', 'image-tools'],
  'date-time': ['calculators', 'utilities', 'text-writing'],
  'text-writing': ['utilities', 'pdf-documents', 'ai-tools'],
  games: ['utilities', 'calculators', 'audio-tools'],
}

export function getRelatedCategories(categoryId: PrimaryCategoryId, limit = 3): Category[] {
  const relatedIds = RELATED_CATEGORY_GRAPH[categoryId] || []
  return relatedIds
    .slice(0, limit)
    .map((id) => CATEGORY_MAP[id])
    .filter((cat): cat is Category => Boolean(cat))
}

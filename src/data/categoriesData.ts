import type { Category, PrimaryCategoryId } from '../types/tools'

export const PRIMARY_CATEGORIES: Category[] = [
  {
    id: 'calculators',
    name: 'Calculators',
    emoji: '🧮',
    tagline: 'High-precision finance, math & date calculators.',
    description: 'Calculate loan EMI, GST slabs, salary in-hand, percentages, discounts, age, date differences, and units with instant precision.',
    icon: 'Calculator',
    toolCount: 9,
    itemLabel: '9 Calculators',
    path: '/tools?category=calculators',
    accentGradient: 'from-emerald-500 to-teal-600',
    badgeColor: 'emerald',
  },
  {
    id: 'daily-utilities',
    name: 'Daily Utilities',
    emoji: '⚡',
    tagline: 'QR codes, secure passwords & everyday digital helpers.',
    description: 'Generate custom URL, Wi-Fi, vCard and email QR codes, generate cryptographically secure passwords, and access quick browser tools with zero server storage.',
    icon: 'Zap',
    toolCount: 2,
    itemLabel: '2 Tools',
    path: '/tools?category=daily-utilities',
    accentGradient: 'from-amber-500 to-orange-600',
    badgeColor: 'amber',
  },
  {
    id: 'pdf-documents',
    name: 'PDF & Documents',
    emoji: '📄',
    tagline: 'Private, in-browser PDF editing & conversion.',
    description: 'Edit, annotate, draw, sign, rotate PDFs and convert JPG/PNG images into professional PDF files with zero server uploads.',
    icon: 'FileText',
    toolCount: 2,
    itemLabel: '2 Tools',
    path: '/tools?category=pdf-documents',
    accentGradient: 'from-rose-500 to-red-600',
    badgeColor: 'rose',
  },
  {
    id: 'image-media',
    name: 'Image & Media',
    emoji: '🖼️',
    tagline: 'Enhance, upscale & save authorized media locally.',
    description: 'Enhance photo clarity, edge sharpness, and resolution up to 4x, or analyze and save authorized direct MP4/WebM video links directly in your browser.',
    icon: 'Maximize2',
    toolCount: 2,
    itemLabel: '2 Tools',
    path: '/tools?category=image-media',
    accentGradient: 'from-cyan-500 to-blue-600',
    badgeColor: 'cyan',
  },
  {
    id: 'text-developer',
    name: 'Text & Developer',
    emoji: '📝',
    tagline: 'Text analytics, word counts & developer helpers.',
    description: 'Real-time word counts, character statistics, sentence breakdowns, reading time estimation, and text formatting tools.',
    icon: 'FileCode',
    toolCount: 1,
    itemLabel: '1 Tool',
    path: '/tools?category=text-developer',
    accentGradient: 'from-blue-500 to-indigo-600',
    badgeColor: 'blue',
  },
  {
    id: 'voice-audio',
    name: 'Voice & Audio',
    emoji: '🎙️',
    tagline: 'Neural & browser TTS, audio cleaner & transcriber.',
    description: 'Convert text to natural speech in multiple Indian languages, clean mic hum & boost gain in Audio Studio, and transcribe voice to text in real-time.',
    icon: 'Mic',
    toolCount: 3,
    itemLabel: '3 Audio Tools',
    path: '/tools?category=voice-audio',
    accentGradient: 'from-blue-600 to-indigo-600',
    badgeColor: 'blue',
  },
  {
    id: 'ai-creator',
    name: 'AI & Creator Tools',
    emoji: '✨',
    tagline: 'Cinematic prompts & generative creator utilities.',
    description: 'Craft director-level cinematic video prompts with camera angles, lighting, motion physics, and reverse engineering for Sora, Kling, and Runway.',
    icon: 'Sparkles',
    toolCount: 1,
    itemLabel: '1 AI Studio',
    path: '/tools?category=ai-creator',
    accentGradient: 'from-purple-500 to-fuchsia-600',
    badgeColor: 'purple',
  },
  {
    id: 'games',
    name: 'Games',
    emoji: '🎮',
    tagline: 'Free arcade, action & brain mini-games.',
    description: 'Play HEX DRIFT Neon Void Runner, Tic-Tac-Toe, Retro Snake, Memory Card Match, Rock Paper Scissors, and Number Guessing with zero downloads.',
    icon: 'Gamepad2',
    toolCount: 6,
    itemLabel: '6 Games',
    path: '/games',
    accentGradient: 'from-indigo-500 to-purple-600',
    badgeColor: 'indigo',
  },
]

export const CATEGORIES: Category[] = [
  {
    id: 'all',
    name: 'All Tools',
    emoji: '🛠️',
    tagline: 'Complete directory of all 26 online utilities & games.',
    description: 'Browse the entire collection of free calculators, daily utilities, PDF tools, image enhancers, audio studios, AI creators, and browser games.',
    icon: 'Layers',
    toolCount: 26,
    itemLabel: '26 Items',
    path: '/tools',
    accentGradient: 'from-blue-600 to-indigo-600',
    badgeColor: 'blue',
  },
  ...PRIMARY_CATEGORIES,
]

export const CATEGORY_MAP: Record<string, Category> = CATEGORIES.reduce((acc, cat) => {
  acc[cat.id] = cat
  return acc
}, {} as Record<string, Category>)

/**
 * Normalizes legacy category URLs and aliases to the canonical primary categories.
 */
export function normalizeCategoryId(id: string | null | undefined): PrimaryCategoryId | 'all' {
  if (!id || id === 'all') return 'all'
  switch (id) {
    case 'calculators':
    case 'finance':
    case 'math':
    case 'converters':
    case 'date-time':
    case 'education':
      return 'calculators'
    case 'daily-utilities':
    case 'daily-utility':
      return 'daily-utilities'
    case 'pdf-documents':
    case 'pdf-tools':
      return 'pdf-documents'
    case 'image-media':
      return 'image-media'
    case 'text-developer':
      return 'text-developer'
    case 'voice-audio':
      return 'voice-audio'
    case 'ai-creator':
    case 'creator-tools':
    case 'seo-tools':
      return 'ai-creator'
    case 'games':
      return 'games'
    default:
      return 'all'
  }
}

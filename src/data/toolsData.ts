import type { PrimaryCategoryId, Tool, ToolStatus } from '../types/tools'
import { CATEGORY_MAP, getToolsByCategory } from './categoriesData'

interface ToolDefinition {
  id: string
  name: string
  slug: string
  route: string
  description: string
  primaryCategory: PrimaryCategoryId
  secondaryCategories?: PrimaryCategoryId[]
  icon: string
  tags: string[]
  releaseOrder: number
  createdAt: string
  status?: ToolStatus
  isPopular?: boolean
  isNew?: boolean
  isFeatured?: boolean
  badge?: string
}

function createTool(def: ToolDefinition): Tool {
  const primary = CATEGORY_MAP[def.primaryCategory]
  const combinedCategories = [
    def.primaryCategory,
    ...(def.secondaryCategories || []),
  ]

  return {
    id: def.id,
    name: def.name,
    slug: def.slug,
    route: def.route,
    path: def.route,
    description: def.description,
    primaryCategory: def.primaryCategory,
    secondaryCategories: def.secondaryCategories,
    categoryId: def.primaryCategory,
    categoryIds: combinedCategories,
    categoryName: primary ? primary.name : def.primaryCategory,
    icon: def.icon,
    tags: def.tags,
    keywords: def.tags,
    status: def.status || 'live',
    releaseOrder: def.releaseOrder,
    createdAt: def.createdAt,
    isPopular: def.isPopular,
    isNew: def.isNew,
    isFeatured: def.isFeatured,
    isFunctional: (def.status || 'live') === 'live',
    badge: def.badge,
  }
}

export const ALL_TOOLS: Tool[] = [
  // =========================================================================
  // 1. CALCULATORS & FINANCE (6 primary tools)
  // =========================================================================
  createTool({
    id: 'emi-calculator',
    name: 'EMI Calculator',
    slug: 'emi-calculator',
    route: '/tools/emi-calculator',
    description: 'Plan home loans, car loans, or personal finance with exact monthly EMIs, interest breakdowns, and full schedule tables.',
    primaryCategory: 'calculators',
    icon: 'Landmark',
    releaseOrder: 2,
    createdAt: '2026-01-12',
    isPopular: true,
    isFeatured: true,
    tags: ['emi calculator', 'loan emi', 'home loan calculator', 'car loan', 'interest amortization', 'inr finance'],
  }),
  createTool({
    id: 'gst-calculator',
    name: 'GST Calculator',
    slug: 'gst-calculator',
    route: '/tools/gst-calculator',
    description: 'Add or remove GST tax seamlessly with automatic CGST + SGST / IGST breakdowns for standard Indian tax slabs.',
    primaryCategory: 'calculators',
    icon: 'Receipt',
    releaseOrder: 3,
    createdAt: '2026-01-15',
    isPopular: true,
    tags: ['gst calculator', 'cgst sgst', 'igst calculator', 'indian tax slabs', 'invoice gst'],
  }),
  createTool({
    id: 'salary-calculator',
    name: 'Salary Calculator',
    slug: 'salary-calculator',
    route: '/tools/salary-calculator',
    description: 'Convert CTC to exact monthly in-hand salary with transparent EPF, standard deduction, and New/Old tax breakdowns.',
    primaryCategory: 'calculators',
    icon: 'IndianRupee',
    releaseOrder: 4,
    createdAt: '2026-01-18',
    isPopular: true,
    tags: ['salary calculator', 'ctc to in hand', 'epf calculator', 'income tax india', 'take home pay'],
  }),
  createTool({
    id: 'discount-calculator',
    name: 'Discount Calculator',
    slug: 'discount-calculator',
    route: '/tools/discount-calculator',
    description: 'Calculate sale prices, stacked discount percentages, extra tax adjustments, and exact savings during shopping.',
    primaryCategory: 'calculators',
    icon: 'Tag',
    releaseOrder: 5,
    createdAt: '2026-01-20',
    tags: ['discount calculator', 'sale price', 'stacked percentage', 'shopping savings'],
  }),
  createTool({
    id: 'profit-loss-calculator',
    name: 'Profit & Loss Calculator',
    slug: 'profit-and-loss-calculator',
    route: '/tools/profit-loss-calculator',
    description: 'Analyze gross profit, net margin, markup ratio, and loss percentages instantly for business and e-commerce pricing.',
    primaryCategory: 'calculators',
    icon: 'TrendingUp',
    releaseOrder: 6,
    createdAt: '2026-01-22',
    tags: ['profit and loss calculator', 'profit margin', 'markup calculator', 'cost price selling price'],
  }),
  createTool({
    id: 'percentage-calculator',
    name: 'Percentage Calculator',
    slug: 'percentage-calculator',
    route: '/tools/percentage-calculator',
    description: 'Compute percentage of values, X-is-what-%-of-Y checks, and percentage increase or decrease cleanly.',
    primaryCategory: 'calculators',
    icon: 'Percent',
    releaseOrder: 1,
    createdAt: '2026-01-10',
    isPopular: true,
    tags: ['percentage calculator', 'percent increase', 'percent change', 'math tool'],
  }),

  // =========================================================================
  // 2. DATE & TIME TOOLS (2 primary tools)
  // =========================================================================
  createTool({
    id: 'age-calculator',
    name: 'Age Calculator',
    slug: 'age-calculator',
    route: '/tools/age-calculator',
    description: 'Calculate exact chronological age in years, months, days, hours, and view next birthday countdowns.',
    primaryCategory: 'date-time',
    secondaryCategories: ['calculators'],
    icon: 'Calendar',
    releaseOrder: 7,
    createdAt: '2026-01-24',
    isPopular: true,
    tags: ['age calculator', 'chronological age', 'birthday countdown', 'exact age'],
  }),
  createTool({
    id: 'date-time-calculator',
    name: 'Date & Time Calculator',
    slug: 'date-time-calculator',
    route: '/tools/date-time-calculator',
    description: 'Calculate age differences, exact day spans, business days between dates, or add and subtract days cleanly.',
    primaryCategory: 'date-time',
    secondaryCategories: ['calculators', 'utilities'],
    icon: 'CalendarDays',
    releaseOrder: 12,
    createdAt: '2026-02-05',
    badge: 'Pro',
    tags: ['date calculator', 'date difference calculator', 'business days', 'days between dates', 'add days'],
  }),

  // =========================================================================
  // 3. CONVERTERS & UTILITIES (3 primary tools)
  // =========================================================================
  createTool({
    id: 'unit-converter',
    name: 'Unit Converter',
    slug: 'unit-converter',
    route: '/tools/unit-converter',
    description: 'Convert Length, Weight, Temperature, Area, Volume, Speed, Time, and Digital Storage instantaneously.',
    primaryCategory: 'utilities',
    secondaryCategories: ['calculators'],
    icon: 'ArrowLeftRight',
    releaseOrder: 8,
    createdAt: '2026-01-26',
    isPopular: true,
    tags: ['unit converter', 'metric converter', 'km to miles', 'celsius fahrenheit', 'storage units'],
  }),
  createTool({
    id: 'qr-code-generator',
    name: 'QR Code Generator',
    slug: 'qr-code-generator',
    route: '/tools/qr-code-generator',
    description: 'Create custom QR codes for URLs, Wi-Fi networks, vCard contacts, email, and text with PNG and SVG export.',
    primaryCategory: 'utilities',
    secondaryCategories: ['text-writing'],
    icon: 'QrCode',
    releaseOrder: 13,
    createdAt: '2026-02-10',
    isPopular: true,
    isFeatured: true,
    badge: 'Utility',
    tags: ['qr code generator', 'wifi qr code', 'vcard qr', 'custom qr svg', 'download qr png'],
  }),
  createTool({
    id: 'password-generator',
    name: 'Password Generator',
    slug: 'password-generator',
    route: '/tools/password-generator',
    description: 'Generate cryptographically random passwords and Diceware passphrases privately in your browser using Web Crypto.',
    primaryCategory: 'utilities',
    secondaryCategories: ['text-writing'],
    icon: 'KeyRound',
    releaseOrder: 14,
    createdAt: '2026-02-12',
    badge: 'Security',
    tags: ['password generator', 'strong password', 'passphrase', 'web crypto entropy'],
  }),
  createTool({
    id: 'password-checker',
    name: 'Smart Password Checker',
    slug: 'password-checker',
    route: '/tools/password-checker',
    description: 'Check your password strength instantly and generate stronger password alternatives privately in your browser.',
    primaryCategory: 'utilities',
    secondaryCategories: ['utilities'],
    icon: 'ShieldCheck',
    releaseOrder: 28,
    createdAt: '2026-11-13',
    isNew: true,
    isPopular: true,
    badge: 'Security',
    tags: ['password checker', 'password strength', 'password security test', 'test password', 'smart password checker', 'strong password generator', 'privacy'],
  }),

  // =========================================================================
  // 4. PDF & DOCUMENT TOOLS (2 primary tools)
  // =========================================================================
  createTool({
    id: 'pdf-editor',
    name: 'PDF Editor',
    slug: 'pdf-editor',
    route: '/tools/pdf-editor',
    description: 'Annotate, add text, insert shapes, highlight pages, draw signatures, and export edited PDFs with zero server uploads.',
    primaryCategory: 'pdf-documents',
    icon: 'FileEdit',
    releaseOrder: 10,
    createdAt: '2026-01-30',
    isPopular: true,
    isFeatured: true,
    badge: 'No Upload',
    tags: ['pdf editor', 'annotate pdf', 'edit pdf offline', 'sign pdf', 'private pdf tool'],
  }),
  createTool({
    id: 'jpg-to-pdf',
    name: 'JPG to PDF Converter',
    slug: 'jpg-to-pdf',
    route: '/tools/jpg-to-pdf',
    description: 'Combine multiple JPG, PNG, and WebP photos into ordered A4 or Letter PDF documents locally with zero uploads.',
    primaryCategory: 'pdf-documents',
    secondaryCategories: ['image-tools', 'utilities'],
    icon: 'FileImage',
    releaseOrder: 15,
    createdAt: '2026-02-15',
    badge: 'Converter',
    tags: ['jpg to pdf', 'images to pdf', 'png to pdf', 'combine photos into pdf'],
  }),

  // =========================================================================
  // 5. IMAGE TOOLS (1 primary tool)
  // =========================================================================
  createTool({
    id: 'image-quality-increaser',
    name: 'Image Quality Increaser',
    slug: 'image-quality-increaser',
    route: '/tools/image-quality-increaser',
    description: 'Upscale resolution 2x-4x, sharpen fine textures, and boost image clarity completely locally inside your browser.',
    primaryCategory: 'image-tools',
    secondaryCategories: ['ai-tools'],
    icon: 'Maximize2',
    releaseOrder: 18,
    createdAt: '2026-03-04',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    badge: '4x Upscale',
    tags: ['image quality increaser', 'photo upscaler', 'image sharpener', 'enhance image resolution'],
  }),

  // =========================================================================
  // 6. VIDEO TOOLS (1 primary tool + AI Video Prompt secondary)
  // =========================================================================
  createTool({
    id: 'video-downloader',
    name: 'Universal Video Downloader',
    slug: 'video-downloader',
    route: '/tools/video-downloader',
    description: 'Inspect video links, detect authorized direct MP4/WebM streams, preview playback, and download files without logins.',
    primaryCategory: 'video-tools',
    secondaryCategories: ['utilities'],
    icon: 'Download',
    releaseOrder: 26,
    createdAt: '2026-10-15',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    badge: 'Free',
    tags: ['video downloader', 'mp4 downloader', 'webm downloader', 'video link inspector', 'direct video download'],
  }),

  // =========================================================================
  // 7. AUDIO & MUSIC TOOLS (3 primary tools)
  // =========================================================================
  createTool({
    id: 'text-to-speech',
    name: 'Text to Speech Converter',
    slug: 'text-to-speech',
    route: '/tools/text-to-speech',
    description: 'Convert English, Hindi, Hinglish, and regional scripts into natural voices with offline Kokoro neural TTS and WAV export.',
    primaryCategory: 'audio-tools',
    secondaryCategories: ['ai-tools'],
    icon: 'Volume2',
    releaseOrder: 11,
    createdAt: '2026-02-02',
    isPopular: true,
    isFeatured: true,
    badge: 'Neural AI',
    tags: ['text to speech', 'hindi tts', 'hinglish speech', 'neural voice', 'wav audio export'],
  }),
  createTool({
    id: 'audio-studio',
    name: 'Audio Studio & Effects Cleaner',
    slug: 'audio-studio',
    route: '/tools/audio-studio',
    description: 'Record or upload audio, remove background hum, boost vocal clarity, trim clips, apply EQ, and export clean WAV files.',
    primaryCategory: 'audio-tools',
    icon: 'SlidersHorizontal',
    releaseOrder: 19,
    createdAt: '2026-03-08',
    isNew: true,
    isFeatured: true,
    badge: 'Studio',
    tags: ['audio cleaner', 'remove background noise', 'audio studio', 'vocal enhancer', 'de-hum'],
  }),
  createTool({
    id: 'audio-transcriber',
    name: 'Audio & Speech Transcriber',
    slug: 'audio-transcriber',
    route: '/tools/audio-transcriber',
    description: 'Dictate live via microphone across 8+ languages or run offline Whisper AI speech-to-text transcription on audio files.',
    primaryCategory: 'audio-tools',
    secondaryCategories: ['ai-tools', 'text-writing'],
    icon: 'AudioLines',
    releaseOrder: 20,
    createdAt: '2026-03-12',
    isNew: true,
    badge: 'Whisper AI',
    tags: ['audio transcriber', 'speech to text', 'voice dictation', 'whisper transcription', 'txt export'],
  }),

  // =========================================================================
  // 8. TEXT & WRITING TOOLS (3 primary tools)
  // =========================================================================
  createTool({
    id: 'word-counter',
    name: 'Word Counter',
    slug: 'word-counter',
    route: '/tools/word-counter',
    description: 'Count words, characters with and without spaces, sentences, paragraphs, and estimated reading speed live.',
    primaryCategory: 'text-writing',
    secondaryCategories: ['utilities'],
    icon: 'FileCode',
    releaseOrder: 9,
    createdAt: '2026-01-28',
    tags: ['word counter', 'character counter', 'reading time', 'text analyzer', 'essay length'],
  }),
  createTool({
    id: 'text-repeater',
    name: 'Text Repeater',
    slug: 'text-repeater',
    route: '/tools/text-repeater',
    description: 'Repeat any text, word, sentence or message as many times as you want with custom separators, styles, and instant export.',
    primaryCategory: 'text-writing',
    secondaryCategories: ['utilities'],
    icon: 'Repeat',
    releaseOrder: 26,
    createdAt: '2026-11-12',
    isNew: true,
    isFeatured: true,
    tags: ['text repeater', 'repeat text', 'duplicate text', 'copy text multiple times', 'text multiplier', 'whatsapp repeater'],
  }),
  createTool({
    id: 'text-inverter',
    name: 'Text Inverter',
    slug: 'text-inverter',
    route: '/tools/text-inverter',
    description: 'Flip text upside down, reverse it backwards, or reverse individual words and word order instantly with Unicode safety.',
    primaryCategory: 'text-writing',
    secondaryCategories: ['utilities'],
    icon: 'FlipVertical2',
    releaseOrder: 27,
    createdAt: '2026-11-12',
    isNew: true,
    isFeatured: true,
    tags: ['text inverter', 'flip text', 'upside down text', 'reverse text', 'backwards text', 'reverse words'],
  }),

  // =========================================================================
  // 9. AI TOOLS (1 primary tool + AI-powered tools cross-tagged)
  // =========================================================================
  createTool({
    id: 'ai-video-prompt-generator',
    name: 'AI Video Prompt Generator',
    slug: 'video-prompt-generator',
    route: '/tools/video-prompt-generator',
    description: 'Build ultra-detailed cinematic AI video prompts for Veo, Sora, Runway, Kling, Pika, and Luma with camera presets.',
    primaryCategory: 'ai-tools',
    secondaryCategories: ['video-tools'],
    icon: 'Sparkles',
    releaseOrder: 21,
    createdAt: '2026-03-18',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    badge: 'Prompt Builder',
    tags: ['ai video prompt generator', 'sora prompt builder', 'runway gen-3 prompt', 'kling ai prompts', 'veo prompts'],
  }),

  // =========================================================================
  // 10. GAMES & ENTERTAINMENT (6 playable browser games)
  // =========================================================================
  createTool({
    id: 'game-hex-drift',
    name: 'HEX DRIFT: Neon Void Runner',
    slug: 'hex-drift',
    route: '/games/hex-drift',
    description: 'High-speed cyber-minimalist sci-fi arcade runner with weapon upgrades, wave bosses, shields, and WebAudio SFX.',
    primaryCategory: 'games',
    icon: 'Zap',
    releaseOrder: 25,
    createdAt: '2026-05-01',
    isPopular: true,
    isNew: true,
    isFeatured: true,
    badge: 'Arcade',
    tags: ['hex drift', 'neon shooter game', 'html5 canvas runner', 'space arcade game'],
  }),
  createTool({
    id: 'game-tic-tac-toe',
    name: 'Tic-Tac-Toe Game',
    slug: 'tic-tac-toe',
    route: '/games?play=tic-tac-toe',
    description: 'Challenge an unbeatable AI across 3 difficulty tiers or play local 2-player matches with crisp win tracking.',
    primaryCategory: 'games',
    icon: 'Flame',
    releaseOrder: 16,
    createdAt: '2026-02-20',
    badge: 'Strategy',
    tags: ['tic tac toe', 'noughts and crosses', 'ai board game', 'two player game'],
  }),
  createTool({
    id: 'game-snake',
    name: 'Retro Snake Game',
    slug: 'snake',
    route: '/games?play=snake',
    description: 'Classic arcade Snake powered by smooth HTML5 Canvas rendering, swipe support, keyboard controls, and saved high scores.',
    primaryCategory: 'games',
    icon: 'Gamepad2',
    releaseOrder: 17,
    createdAt: '2026-02-22',
    isPopular: true,
    badge: 'Arcade',
    tags: ['snake game', 'retro arcade', 'html5 canvas game', 'browser snake'],
  }),
  createTool({
    id: 'game-memory-match',
    name: 'Memory Card Match',
    slug: 'memory-match',
    route: '/games?play=memory-match',
    description: 'Flip pairs across 4x4 or 6x4 grids with smooth transitions, move counters, timer tracking, and best scores.',
    primaryCategory: 'games',
    icon: 'Layers',
    releaseOrder: 22,
    createdAt: '2026-03-22',
    badge: 'Puzzle',
    tags: ['memory match', 'brain puzzle game', 'card matching game', 'concentration'],
  }),
  createTool({
    id: 'game-rock-paper-scissors',
    name: 'Rock Paper Scissors',
    slug: 'rock-paper-scissors',
    route: '/games?play=rock-paper-scissors',
    description: 'Play fast First-to-5 rounds against the computer with streak counters and crisp visual feedback.',
    primaryCategory: 'games',
    icon: 'Sparkles',
    releaseOrder: 23,
    createdAt: '2026-03-25',
    badge: 'Quick',
    tags: ['rock paper scissors', 'casual game', 'quick browser game'],
  }),
  createTool({
    id: 'game-number-guess',
    name: 'Number Guessing Game',
    slug: 'number-guess',
    route: '/games?play=number-guess',
    description: 'Deduce the mystery secret number between 1 and 1000 using temperature clues across three challenge levels.',
    primaryCategory: 'games',
    icon: 'HelpCircle',
    releaseOrder: 24,
    createdAt: '2026-03-28',
    badge: 'Logic',
    tags: ['number guessing game', 'logic puzzle', 'brain teaser'],
  }),
]

export const POPULAR_TOOLS: Tool[] = ALL_TOOLS.filter((tool) => tool.isPopular)

export const RECENT_TOOLS: Tool[] = [...ALL_TOOLS].sort(
  (a, b) => (b.releaseOrder ?? 0) - (a.releaseOrder ?? 0),
)

export const FEATURED_TOOLS: Tool[] = ALL_TOOLS.filter((tool) => tool.isFeatured)

export const GAMES_TOOLS: Tool[] = getToolsByCategory(ALL_TOOLS, 'games', false)

export function getToolBySlug(slug: string): Tool | undefined {
  return ALL_TOOLS.find((tool) => tool.slug === slug || tool.id === slug)
}

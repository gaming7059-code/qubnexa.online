import React from 'react'
import type { CategoryId } from '../../types/tools'

export interface CategoryIconProps {
  categoryId: CategoryId | string
  className?: string
  size?: 'xs' | 'sm' | 'md' | 'lg'
}

const SIZE_MAP = {
  xs: 'w-3.5 h-3.5',
  sm: 'w-5 h-5',
  md: 'w-6 h-6',
  lg: 'w-8 h-8',
}

/**
 * 1. All Tools: Modular multi-tool grid / toolbox
 */
const AllToolsIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-all-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#3b82f6" />
        <stop offset="1" stopColor="#6366f1" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="9" height="9" rx="2.5" fill="url(#cat-all-g)" />
    <rect x="18" y="5" width="9" height="9" rx="2.5" fill="url(#cat-all-g)" opacity="0.8" />
    <rect x="5" y="18" width="9" height="9" rx="2.5" fill="url(#cat-all-g)" opacity="0.8" />
    <rect x="18" y="18" width="9" height="9" rx="2.5" fill="url(#cat-all-g)" />
    <circle cx="9.5" cy="9.5" r="1.5" fill="#ffffff" />
    <path d="M21 9.5H24" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M8 22.5H11" stroke="#ffffff" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="22.5" cy="22.5" r="1.5" fill="#ffffff" />
  </svg>
)

/**
 * 2. Calculators: Sleek modern calculator with keys
 */
const CalculatorsIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-calc-g" x1="6" y1="4" x2="26" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#10b981" />
        <stop offset="1" stopColor="#059669" />
      </linearGradient>
    </defs>
    <rect x="6" y="4" width="20" height="24" rx="4" fill="url(#cat-calc-g)" />
    <rect x="9" y="7" width="14" height="5" rx="1.5" fill="#064e3b" />
    <rect x="17" y="8.5" width="4" height="2" rx="0.5" fill="#6ee7b7" />
    <circle cx="11" cy="16" r="1.25" fill="#ffffff" />
    <circle cx="16" cy="16" r="1.25" fill="#ffffff" />
    <circle cx="21" cy="16" r="1.25" fill="#ffffff" />
    <circle cx="11" cy="20.5" r="1.25" fill="#ffffff" />
    <circle cx="16" cy="20.5" r="1.25" fill="#ffffff" />
    <circle cx="21" cy="20.5" r="1.25" fill="#ffffff" />
    <rect x="10" y="24" width="12" height="1.5" rx="0.75" fill="#a7f3d0" />
  </svg>
)

/**
 * 3. Daily Utilities: Lightning bolt with gear & key
 */
const DailyUtilitiesIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-util-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#cat-util-g)" />
    {/* Lightning Bolt */}
    <path
      d="M17 8L11 16H16L15 24L21 15H16L17 8Z"
      fill="#ffffff"
      stroke="#fef3c7"
      strokeWidth="1.2"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * 4. PDF & Documents: PDF document sheet with annotate pen
 */
const PDFDocumentsIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-pdf-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#ef4444" />
        <stop offset="1" stopColor="#b91c1c" />
      </linearGradient>
    </defs>
    <path
      d="M7 6C7 4.89543 7.89543 4 9 4H18L25 11V26C25 27.1046 24.1046 28 23 28H9C7.89543 28 7 27.1046 7 26V6Z"
      fill="url(#cat-pdf-g)"
    />
    <path d="M18 4V11H25" fill="#fca5a5" opacity="0.6" />
    <text
      x="16"
      y="21"
      textAnchor="middle"
      fontSize="7.5"
      fontWeight="900"
      fontFamily="system-ui, sans-serif"
      fill="#ffffff"
      letterSpacing="0.5"
    >
      PDF
    </text>
  </svg>
)

/**
 * 5. Image & Media: Camera lens, picture frame & upscale enhancer
 */
const ImageMediaIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-img-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#06b6d4" />
        <stop offset="1" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#cat-img-g)" />
    <circle cx="11" cy="11" r="2" fill="#ffffff" />
    <path
      d="M8 22L13 16L17 20L21 14L24 22H8Z"
      fill="#ffffff"
      opacity="0.95"
    />
    <path d="M7 9V7H9M23 7H25V9M25 23V25H23M9 25H7V23" stroke="#fef08a" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
)

/**
 * 6. Text & Developer: Code brackets, text lines, and cursor
 */
const TextDeveloperIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-text-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f59e0b" />
        <stop offset="1" stopColor="#d97706" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#cat-text-g)" />
    <path
      d="M11 12L7.5 16L11 20"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M21 12L24.5 16L21 20"
      stroke="#ffffff"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M17.5 10L14.5 22"
      stroke="#ffffff"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * 7. Voice & Audio: Studio microphone and frequency waveform
 */
const VoiceAudioIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-voice-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#2563eb" />
        <stop offset="1" stopColor="#4f46e5" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#cat-voice-g)" />
    <rect x="13" y="8" width="6" height="10" rx="3" fill="#ffffff" />
    <path
      d="M10 14C10 17.3137 12.6863 20 16 20C19.3137 20 22 17.3137 22 14"
      stroke="#ffffff"
      strokeWidth="1.75"
      strokeLinecap="round"
    />
    <path d="M16 20V24M12 24H20" stroke="#ffffff" strokeWidth="1.75" strokeLinecap="round" />
  </svg>
)

/**
 * 8. AI & Creator Tools: Generative sparkles and AI director wand
 */
const AICreatorIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-ai-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#a855f7" />
        <stop offset="1" stopColor="#ec4899" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#cat-ai-g)" />
    <path
      d="M15 8L16.5 12.5L21 14L16.5 15.5L15 20L13.5 15.5L9 14L13.5 12.5L15 8Z"
      fill="#ffffff"
    />
    <path
      d="M22 19L22.8 21.2L25 22L22.8 22.8L22 25L21.2 22.8L19 22L21.2 21.2L22 19Z"
      fill="#fef08a"
    />
  </svg>
)

/**
 * 9. Video Tools: Playable studio screen
 */
const VideoToolsIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-video-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#f97316" />
        <stop offset="1" stopColor="#ef4444" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#cat-video-g)" />
    <path d="M13 11.5L21 16L13 20.5V11.5Z" fill="#ffffff" />
  </svg>
)

/**
 * 10. Date & Time Tools: Precision calendar & clock
 */
const DateTimeIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-date-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#14b8a6" />
        <stop offset="1" stopColor="#0284c7" />
      </linearGradient>
    </defs>
    <rect x="5" y="6" width="22" height="21" rx="5" fill="url(#cat-date-g)" />
    <path d="M10 12.5H22" stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" />
    <circle cx="16" cy="18.5" r="3.5" stroke="#ffffff" strokeWidth="1.6" />
    <path d="M16 17V18.6L17.2 19.4" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
)

/**
 * 11. Games: Arcade controller
 */
const GamesCategoryIconSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 32 32" fill="none" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="cat-game-g" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366f1" />
        <stop offset="1" stopColor="#8b5cf6" />
      </linearGradient>
    </defs>
    <rect x="5" y="5" width="22" height="22" rx="5" fill="url(#cat-game-g)" />
    <path
      d="M9 14C9 12.5 10.5 11 12.5 11H19.5C21.5 11 23 12.5 23 14V17C23 19.5 21 21 19 20L17 18H15L13 20C11 21 9 19.5 9 17V14Z"
      fill="#ffffff"
    />
    <path d="M12 14.5V16.5M11 15.5H13" stroke="#6366f1" strokeWidth="1.2" strokeLinecap="round" />
    <circle cx="19" cy="14.5" r="0.8" fill="#ec4899" />
    <circle cx="20.5" cy="16" r="0.8" fill="#3b82f6" />
  </svg>
)

/**
 * Universal CategoryIcon Component
 */
export const CategoryIcon: React.FC<CategoryIconProps> = ({
  categoryId,
  className = '',
  size = 'md',
}) => {
  const sizeClass = SIZE_MAP[size] || SIZE_MAP.md
  const combinedClass = `${sizeClass} ${className}`.trim()

  switch (categoryId) {
    case 'all':
    case 'all-tools':
      return <AllToolsIconSvg className={combinedClass} />
    case 'calculators':
    case 'finance':
    case 'math':
    case 'education':
      return <CalculatorsIconSvg className={combinedClass} />
    case 'date-time':
    case 'date-tools':
      return <DateTimeIconSvg className={combinedClass} />
    case 'utilities':
    case 'converters':
    case 'daily-utilities':
    case 'daily-utility':
      return <DailyUtilitiesIconSvg className={combinedClass} />
    case 'pdf-documents':
    case 'pdf-tools':
      return <PDFDocumentsIconSvg className={combinedClass} />
    case 'image-tools':
    case 'image-media':
      return <ImageMediaIconSvg className={combinedClass} />
    case 'video-tools':
    case 'video':
      return <VideoToolsIconSvg className={combinedClass} />
    case 'text-writing':
    case 'text-developer':
    case 'seo-tools':
      return <TextDeveloperIconSvg className={combinedClass} />
    case 'audio-tools':
    case 'voice-audio':
      return <VoiceAudioIconSvg className={combinedClass} />
    case 'ai-tools':
    case 'ai-creator':
    case 'creator-tools':
      return <AICreatorIconSvg className={combinedClass} />
    case 'games':
      return <GamesCategoryIconSvg className={combinedClass} />
    default:
      return <AllToolsIconSvg className={combinedClass} />
  }
}

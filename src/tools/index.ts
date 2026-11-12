/**
 * Xenova-World — Implemented Tool Modules Index
 * Syncs with all 20 standalone utility tool modules and routes.
 */

export const REGISTERED_TOOL_MODULES = [
  'percentage-calculator',
  'age-calculator',
  'emi-calculator',
  'gst-calculator',
  'discount-calculator',
  'profit-and-loss-calculator',
  'salary-calculator',
  'date-time-calculator',
  'unit-converter',
  'word-counter',
  'pdf-editor',
  'jpg-to-pdf',
  'qr-code-generator',
  'password-generator',
  'image-quality-increaser',
  'video-downloader',
  'text-to-speech',
  'audio-studio',
  'audio-transcriber',
  'video-prompt-generator',
] as const

export type RegisteredToolId = typeof REGISTERED_TOOL_MODULES[number]

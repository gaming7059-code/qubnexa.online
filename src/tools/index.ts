/**
 * QUBNEXA — Implemented Tool Modules Index
 * Syncs with all standalone utility tool modules and routes.
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
  'text-repeater',
  'text-inverter',
  'pdf-editor',
  'jpg-to-pdf',
  'qr-code-generator',
  'password-generator',
  'password-checker',
  'image-quality-increaser',
  'video-downloader',
  'text-to-speech',
  'audio-studio',
  'audio-transcriber',
  'video-prompt-generator',
  'youtube-thumbnail-downloader',
  'image-resizer',
  'fancy-font-generator',
  'json-formatter',
  'sip-calculator',
  'pdf-text-cleaner',
] as const

export type RegisteredToolId = typeof REGISTERED_TOOL_MODULES[number]

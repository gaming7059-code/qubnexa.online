import type { Tool } from '../types/tools'

/**
 * Natural user-intent phrases mapped to existing QUBNEXA tool IDs.
 * Keeps search grounded exclusively in real registered tools without inventing entries.
 */
const TOOL_INTENT_PHRASES: Record<string, string[]> = {
  'emi-calculator': ['calculate loan', 'loan calculator', 'monthly installment', 'home loan', 'car loan', 'mortgage'],
  'gst-calculator': ['tax calculator', 'gst billing', 'cgst', 'sgst', 'igst', 'add tax', 'remove gst'],
  'salary-calculator': ['take home salary', 'ctc calculator', 'in hand salary', 'paycheck', 'income tax'],
  'discount-calculator': ['sale discount', 'price off', 'coupon savings', 'percent off'],
  'profit-loss-calculator': ['margin calculator', 'selling price', 'business profit', 'markup'],
  'percentage-calculator': ['percent of', 'percentage change', 'calculate percentage', 'marks percentage'],
  'age-calculator': ['how old am i', 'birth date age', 'birthday countdown', 'dob calculator'],
  'date-time-calculator': ['days between', 'count days', 'add days to date', 'date difference', 'working days'],
  'unit-converter': ['convert units', 'km to miles', 'kg to lbs', 'celsius to fahrenheit', 'length weight converter'],
  'qr-code-generator': ['create qr code', 'make qr', 'wifi qr', 'vcard qr', 'scan code generator'],
  'password-generator': ['strong password', 'random password', 'secure passphrase', 'create password'],
  'pdf-editor': ['edit pdf', 'annotate pdf', 'sign pdf', 'draw on pdf', 'highlight pdf', 'write on pdf'],
  'jpg-to-pdf': ['convert pdf', 'convert image to pdf', 'images to pdf', 'photo to pdf', 'merge photos pdf'],
  'image-quality-increaser': ['compress image', 'optimize image', 'enhance image', 'upscale image', 'improve photo quality', 'sharpen image', 'export jpeg'],
  'video-downloader': ['download video', 'save video', 'save mp4', 'download webm', 'video url downloader', 'social video'],
  'text-to-speech': ['read text aloud', 'voice generator', 'hindi voice', 'tts', 'audio from text', 'ai voice'],
  'audio-studio': ['clean audio', 'remove noise', 'remove background hum', 'edit audio', 'trim audio', 'voice eq'],
  'audio-transcriber': ['voice to text', 'speech to text', 'transcribe audio', 'dictate text', 'whisper'],
  'word-counter': ['count words', 'character count', 'reading time', 'essay word count'],
  'ai-video-prompt-generator': ['ai tool', 'video prompt', 'sora prompt', 'veo prompt', 'runway prompt', 'kling prompt', 'ai generator'],
  'game-hex-drift': ['play game', 'space shooter', 'arcade runner', 'neon game'],
  'game-tic-tac-toe': ['play tic tac toe', 'x and o', 'board game'],
  'game-snake': ['play snake', 'classic arcade'],
  'game-memory-match': ['memory game', 'card match', 'brain puzzle'],
  'game-rock-paper-scissors': ['rock paper scissors', 'hand game'],
  'game-number-guess': ['guess number', 'logic game'],
}

export interface SearchMatchPart {
  text: string
  match: boolean
}

export function normalizeQueryTokens(rawQuery: string): string[] {
  return rawQuery
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

function getToolSearchScore(tool: Tool, cleanQuery: string, tokens: string[]): number {
  const name = tool.name.toLowerCase()
  const desc = tool.description.toLowerCase()
  const cat = tool.categoryName.toLowerCase()
  const tags = (tool.tags || tool.keywords).map((t) => t.toLowerCase())
  const intents = TOOL_INTENT_PHRASES[tool.id] || []
  const intentBlob = intents.join(' ')
  const tagBlob = tags.join(' ')
  const combined = `${name} ${cat} ${tagBlob} ${intentBlob} ${desc}`

  // Every meaningful search token must match somewhere in the tool metadata/intents
  const allTokensMatch = tokens.every((tok) => combined.includes(tok))
  if (!allTokensMatch) return 0

  let score = 10

  // Exact or prefix phrase bonuses
  if (name === cleanQuery) score += 120
  else if (name.startsWith(cleanQuery)) score += 90
  else if (name.includes(cleanQuery)) score += 65

  if (intents.some((phrase) => phrase === cleanQuery || phrase.includes(cleanQuery) || cleanQuery.includes(phrase))) {
    score += 75
  }

  if (tags.some((tag) => tag.includes(cleanQuery))) score += 50
  if (cat.includes(cleanQuery)) score += 35

  // Individual token weights
  for (const tok of tokens) {
    if (name.includes(tok)) score += 25
    if (tagBlob.includes(tok) || intentBlob.includes(tok)) score += 15
    if (cat.includes(tok)) score += 10
  }

  if (tool.isPopular) score += 2
  return score
}

/**
 * Ranks and filters registered tools using smart phrase, intent, category, and token matching.
 */
export function searchTools(tools: Tool[], rawQuery: string): Tool[] {
  const cleanQuery = rawQuery.trim().toLowerCase()
  const tokens = normalizeQueryTokens(rawQuery)
  if (!cleanQuery || tokens.length === 0) return tools

  const scored: Array<{ tool: Tool; score: number }> = []
  for (const tool of tools) {
    const score = getToolSearchScore(tool, cleanQuery, tokens)
    if (score > 0) {
      scored.push({ tool, score })
    }
  }

  scored.sort((a, b) => b.score - a.score || (b.tool.releaseOrder ?? 0) - (a.tool.releaseOrder ?? 0))
  return scored.map((entry) => entry.tool)
}

/**
 * Splits text into plain and highlighted segments cleanly for safe JSX rendering.
 */
export function splitHighlightParts(text: string, rawQuery: string): SearchMatchPart[] {
  const tokens = [...new Set(normalizeQueryTokens(rawQuery))]
    .filter((t) => t.length >= 2)
    .sort((a, b) => b.length - a.length)

  if (!text || tokens.length === 0) {
    return [{ text, match: false }]
  }

  const escaped = tokens.map((tok) => tok.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
  const regex = new RegExp(`(${escaped.join('|')})`, 'gi')
  const segments = text.split(regex)

  return segments
    .filter((segment) => segment.length > 0)
    .map((segment) => ({
      text: segment,
      match: tokens.some((tok) => segment.toLowerCase() === tok),
    }))
}

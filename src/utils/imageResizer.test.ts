import test from 'node:test'
import assert from 'node:assert/strict'
import {
  RESIZE_PRESETS,
  validateImageFile,
  clampDimension,
  calculateHeightFromWidth,
  calculateWidthFromHeight,
  formatBytes,
  generateResizedFilename,
  calculateSizeDelta,
} from './imageResizer.ts'

test('RESIZE_PRESETS contains mandatory presets', () => {
  const ids = RESIZE_PRESETS.map((p) => p.id)
  assert.ok(ids.includes('instagram-square'))
  assert.ok(ids.includes('instagram-portrait'))
  assert.ok(ids.includes('youtube-thumbnail'))
  assert.ok(ids.includes('full-hd'))

  const instaSquare = RESIZE_PRESETS.find((p) => p.id === 'instagram-square')
  assert.strictEqual(instaSquare?.width, 1080)
  assert.strictEqual(instaSquare?.height, 1080)

  const instaPortrait = RESIZE_PRESETS.find((p) => p.id === 'instagram-portrait')
  assert.strictEqual(instaPortrait?.width, 1080)
  assert.strictEqual(instaPortrait?.height, 1350)

  const ytThumb = RESIZE_PRESETS.find((p) => p.id === 'youtube-thumbnail')
  assert.strictEqual(ytThumb?.width, 1280)
  assert.strictEqual(ytThumb?.height, 720)

  const fullHd = RESIZE_PRESETS.find((p) => p.id === 'full-hd')
  assert.strictEqual(fullHd?.width, 1920)
  assert.strictEqual(fullHd?.height, 1080)
})

test('validateImageFile validates formats and file size ceiling', () => {
  const validJpg = new File(['mock content'], 'photo.jpg', { type: 'image/jpeg' })
  assert.strictEqual(validateImageFile(validJpg).valid, true)

  const validPng = new File(['mock content'], 'graphic.png', { type: 'image/png' })
  assert.strictEqual(validateImageFile(validPng).valid, true)

  const validWebp = new File(['mock content'], 'asset.webp', { type: 'image/webp' })
  assert.strictEqual(validateImageFile(validWebp).valid, true)

  const invalidPdf = new File(['mock content'], 'doc.pdf', { type: 'application/pdf' })
  const pdfRes = validateImageFile(invalidPdf)
  assert.strictEqual(pdfRes.valid, false)
  assert.ok(pdfRes.error?.includes('Unsupported image format'))

  // Oversized mock file > 50 MB
  const oversizedFile = {
    name: 'giant.jpg',
    type: 'image/jpeg',
    size: 55 * 1024 * 1024,
  } as unknown as File

  const oversizedRes = validateImageFile(oversizedFile)
  assert.strictEqual(oversizedRes.valid, false)
  assert.ok(oversizedRes.error?.includes('exceeds maximum'))
})

test('clampDimension enforces bounds [1, 8192]', () => {
  assert.strictEqual(clampDimension(0), 1)
  assert.strictEqual(clampDimension(-100), 1)
  assert.strictEqual(clampDimension(10000), 8192)
  assert.strictEqual(clampDimension(1920), 1920)
  assert.strictEqual(clampDimension(NaN), 1)
})

test('aspect ratio calculations maintain correct proportions', () => {
  // Original 16:9 (1920x1080)
  assert.strictEqual(calculateHeightFromWidth(1280, 1920, 1080), 720)
  assert.strictEqual(calculateWidthFromHeight(720, 1920, 1080), 1280)

  // Original 1:1 (500x500)
  assert.strictEqual(calculateHeightFromWidth(1080, 500, 500), 1080)
  assert.strictEqual(calculateWidthFromHeight(1080, 500, 500), 1080)

  // Original 4:5 (800x1000)
  assert.strictEqual(calculateHeightFromWidth(1080, 800, 1000), 1350)
  assert.strictEqual(calculateWidthFromHeight(1350, 800, 1000), 1080)
})

test('formatBytes formats file sizes cleanly', () => {
  assert.strictEqual(formatBytes(0), '0 B')
  assert.strictEqual(formatBytes(512), '512 B')
  assert.strictEqual(formatBytes(2048), '2.0 KB')
  assert.strictEqual(formatBytes(2 * 1024 * 1024), '2.00 MB')
})

test('generateResizedFilename sanitizes and produces formatted filenames', () => {
  const result = generateResizedFilename('My Summer Vacation 2026.png', 1080, 1080, 'image/jpeg')
  assert.strictEqual(result, 'My_Summer_Vacation_2026-1080x1080.jpg')

  const webpResult = generateResizedFilename('logo.jpg', 640, 480, 'image/webp')
  assert.strictEqual(webpResult, 'logo-640x480.webp')

  const pngResult = generateResizedFilename('banner.webp', 1920, 1080, 'image/png')
  assert.strictEqual(pngResult, 'banner-1920x1080.png')
})

test('calculateSizeDelta compares original and target file sizes', () => {
  const reduction = calculateSizeDelta(1000000, 400000)
  assert.strictEqual(reduction.isReduction, true)
  assert.strictEqual(reduction.percent, 60)
  assert.strictEqual(reduction.label, '-60% smaller')

  const increase = calculateSizeDelta(500000, 750000)
  assert.strictEqual(increase.isReduction, false)
  assert.strictEqual(increase.percent, 50)
  assert.strictEqual(increase.label, '+50% larger')

  const same = calculateSizeDelta(500000, 500000)
  assert.strictEqual(same.label, 'Same size')
})

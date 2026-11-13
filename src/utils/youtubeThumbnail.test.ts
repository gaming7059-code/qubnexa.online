import test from 'node:test'
import assert from 'node:assert/strict'
import {
  extractYouTubeVideoId,
  validateYouTubeInput,
  getThumbnailResolutions,
  isAllowedYouTubeCdnUrl,
} from './youtubeThumbnail.ts'

test('extractYouTubeVideoId handles various valid YouTube formats', () => {
  const expectedId = 'dQw4w9WgXcQ'
  const validInputs = [
    'dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://youtube.com/watch?v=dQw4w9WgXcQ',
    'http://www.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://m.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://music.youtube.com/watch?v=dQw4w9WgXcQ',
    'https://www.youtube.com/watch?v=dQw4w9WgXcQ&t=42s&feature=share',
    'https://youtu.be/dQw4w9WgXcQ',
    'https://youtu.be/dQw4w9WgXcQ?t=15s',
    'https://www.youtube.com/shorts/dQw4w9WgXcQ',
    'https://youtube.com/shorts/dQw4w9WgXcQ?feature=share',
    'https://www.youtube.com/embed/dQw4w9WgXcQ',
    'https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ',
    'https://www.youtube.com/live/dQw4w9WgXcQ',
    'https://www.youtube.com/v/dQw4w9WgXcQ',
    'www.youtube.com/watch?v=dQw4w9WgXcQ',
    'youtu.be/dQw4w9WgXcQ',
    '  https://www.youtube.com/watch?v=dQw4w9WgXcQ  ',
  ]

  for (const input of validInputs) {
    assert.strictEqual(
      extractYouTubeVideoId(input),
      expectedId,
      `Failed to extract ID from input: ${input}`,
    )
  }
})

test('extractYouTubeVideoId returns null for invalid or non-video URLs', () => {
  const invalidInputs = [
    '',
    '   ',
    'not a url',
    'https://vimeo.com/123456789',
    'https://www.dailymotion.com/video/x7tgad0',
    'https://www.youtube.com/',
    'https://www.youtube.com/@mkbhd',
    'https://www.youtube.com/channel/UCBJycsmduvYEL83R_U4JriQ',
    'https://www.youtube.com/watch?v=short',
    'https://www.youtube.com/watch?v=toolongvideoid12345',
    'https://www.youtube.com/watch?v=invalid$id#1',
    'https://evil-youtube.com/watch?v=dQw4w9WgXcQ',
  ]

  for (const input of invalidInputs) {
    assert.strictEqual(
      extractYouTubeVideoId(input),
      null,
      `Expected null for invalid input: ${input}`,
    )
  }
})

test('validateYouTubeInput returns rich diagnostic feedback', () => {
  const emptyRes = validateYouTubeInput('  ')
  assert.strictEqual(emptyRes.valid, false)
  assert.ok(emptyRes.error?.includes('Please enter'))

  const channelRes = validateYouTubeInput('https://youtube.com/@veritasium')
  assert.strictEqual(channelRes.valid, false)
  assert.ok(channelRes.error?.includes('channel or profile'))

  const otherHostRes = validateYouTubeInput('https://vimeo.com/987654321')
  assert.strictEqual(otherHostRes.valid, false)
  assert.ok(otherHostRes.error?.includes('not from YouTube'))

  const validShortsRes = validateYouTubeInput('https://youtube.com/shorts/dQw4w9WgXcQ')
  assert.strictEqual(validShortsRes.valid, true)
  assert.strictEqual(validShortsRes.videoId, 'dQw4w9WgXcQ')
  assert.strictEqual(validShortsRes.detectedType, 'shorts')
  assert.strictEqual(validShortsRes.error, null)
})

test('getThumbnailResolutions produces all standard resolutions', () => {
  const videoId = 'dQw4w9WgXcQ'
  const resolutions = getThumbnailResolutions(videoId)

  assert.strictEqual(resolutions.length, 5)
  const ids = resolutions.map((r) => r.id)
  assert.deepStrictEqual(ids, ['maxres', 'sd', 'hq', 'mq', 'default'])

  const maxres = resolutions.find((r) => r.id === 'maxres')
  assert.ok(maxres)
  assert.strictEqual(maxres.width, 1280)
  assert.strictEqual(maxres.height, 720)
  assert.strictEqual(maxres.aspectRatio, '16:9')
  assert.strictEqual(maxres.url, `https://i.ytimg.com/vi/${videoId}/maxresdefault.jpg`)

  const hq = resolutions.find((r) => r.id === 'hq')
  assert.ok(hq)
  assert.strictEqual(hq.width, 480)
  assert.strictEqual(hq.height, 360)
  assert.strictEqual(hq.guaranteed, true)
})

test('isAllowedYouTubeCdnUrl prevents unsafe origins', () => {
  assert.strictEqual(isAllowedYouTubeCdnUrl('https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'), true)
  assert.strictEqual(isAllowedYouTubeCdnUrl('https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg'), true)
  assert.strictEqual(isAllowedYouTubeCdnUrl('https://malicious.com/vi/dQw4w9WgXcQ/hqdefault.jpg'), false)
  assert.strictEqual(isAllowedYouTubeCdnUrl('javascript:alert(1)'), false)
  assert.strictEqual(isAllowedYouTubeCdnUrl('file:///etc/passwd'), false)
})

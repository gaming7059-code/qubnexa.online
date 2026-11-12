import {
  classifyUrlPlatform,
  extractYouTubeVideoId,
  formatBytes,
  formatDuration,
  getLiveDetectionPreview,
  getResolutionLabel,
  parseContentDispositionFilename,
  sanitizeDownloadFilename,
  validateAndNormalizeUrl,
} from './videoUtils.ts'

function assert(condition: unknown, message: string): void {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`)
  }
}

export function runVideoUtilsTests(): number {
  let passed = 0

  // 1. Unsafe scheme rejections
  for (const unsafeUrl of [
    '',
    '   ',
    'not-a-url',
    'javascript:alert(1)',
    'JAVASCRIPT:alert(document.cookie)',
    'data:video/mp4;base64,AAAA',
    'vbscript:msgbox(1)',
    'file:///C:/Windows/win.ini',
    'ftp://example.com/video.mp4',
    'https://user:secret@example.com/video.mp4',
    'http://127.0.0.1/secret.mp4',
    'http://169.254.169.254/latest/meta-data/',
    'http://192.168.1.10/cam.mp4',
    'https://10.0.0.5/internal.webm',
  ]) {
    const res = validateAndNormalizeUrl(unsafeUrl, 'https://qubnexa.example')
    assert(!res.valid, `Expected unsafe/invalid URL to be rejected: ${unsafeUrl}`)
    passed++
  }

  // Same-origin dev/test fixture allowed
  const sameOrigin = validateAndNormalizeUrl(
    'http://127.0.0.1:5173/test-sample.mp4',
    'http://127.0.0.1:5173'
  )
  assert(sameOrigin.valid, 'Expected same-origin URL to be allowed for local/dev testing')
  passed++

  // 2. Domain spoofing & platform detection
  const spoofCheck = classifyUrlPlatform(new URL('https://youtube.com.attacker.test/watch?v=dQw4w9WgXcQ'))
  assert(spoofCheck.platformId === 'other', 'Domain spoofing must NOT match youtube.com')
  passed++

  const ytUrl = new URL('https://www.youtube.com/watch?v=dQw4w9WgXcQ')
  assert(classifyUrlPlatform(ytUrl).platformId === 'youtube', 'YouTube watch URL detected')
  assert(extractYouTubeVideoId(ytUrl) === 'dQw4w9WgXcQ', 'YouTube 11-char ID extracted')
  passed += 2

  assert(
    extractYouTubeVideoId(new URL('https://youtu.be/abcDEF_1234')) === 'abcDEF_1234',
    'youtu.be short ID extracted'
  )
  assert(
    classifyUrlPlatform(new URL('https://www.instagram.com/reel/C9xTest123/')).platformId === 'instagram',
    'Instagram reel detected'
  )
  assert(
    classifyUrlPlatform(new URL('https://www.instagram.com/stories/user/123')).isPrivatePathHint === true,
    'Instagram stories marked private/restricted'
  )
  assert(
    classifyUrlPlatform(new URL('https://www.facebook.com/watch/?v=123456')).platformId === 'facebook',
    'Facebook watch detected'
  )
  assert(
    classifyUrlPlatform(new URL('https://x.com/user/status/1234567890')).platformId === 'twitter',
    'X/Twitter status detected'
  )
  assert(
    classifyUrlPlatform(new URL('https://www.tiktok.com/@creator/video/123456')).platformId === 'tiktok',
    'TikTok video detected'
  )
  assert(
    classifyUrlPlatform(new URL('https://cdn.example.com/media/demo.webm')).platformId === 'direct-webm',
    'Direct WebM detected'
  )
  passed += 7

  // 3. Content-Disposition parsing & traversal sanitization
  assert(
    parseContentDispositionFilename('attachment; filename="demo clip.mp4"') === 'demo clip.mp4',
    'Standard quoted Content-Disposition parsed'
  )
  assert(
    parseContentDispositionFilename("attachment; filename*=UTF-8''my%20video%20hd.webm") === 'my video hd.webm',
    'RFC 5987 UTF-8 Content-Disposition parsed'
  )
  assert(
    sanitizeDownloadFilename('../../etc/passwd?bad=1', 'mp4') === 'passwdbad=1.mp4',
    'Path traversal and query chars sanitized cleanly'
  )
  assert(
    sanitizeDownloadFilename('sample<video>:"name|*.webm', 'webm') === 'samplevideoname.webm',
    'Control and reserved characters stripped cleanly'
  )
  passed += 4

  // 4. Formatting & Live Preview checks
  assert(formatBytes(1536) === '1.5 KB', 'formatBytes KB formatting')
  assert(formatDuration(125) === '2:05', 'formatDuration MM:SS')
  assert(formatDuration(3665) === '1:01:05', 'formatDuration HH:MM:SS')
  assert(getResolutionLabel(1920, 1080) === '1080p Full HD (1920×1080)', '1080p label')
  assert(
    getLiveDetectionPreview('https://cdn.example.com/clip.mp4').tone === 'emerald',
    'Live preview shows emerald for direct MP4'
  )
  assert(
    getLiveDetectionPreview('javascript:alert(1)').tone === 'rose',
    'Live preview rejects javascript: scheme'
  )
  passed += 6

  return passed
}

// Run automatically when executed directly under Node CLI
const nodeProcess = (globalThis as { process?: { argv?: string[] } }).process
if (nodeProcess && Array.isArray(nodeProcess.argv) && nodeProcess.argv[1]?.endsWith('videoUtils.test.ts')) {
  const count = runVideoUtilsTests()
  console.log(`videoUtils.test.ts: ${count} assertions passed`)
}

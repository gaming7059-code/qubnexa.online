import test from 'node:test'
import assert from 'node:assert'
import {
  maskApiKey,
  extractSitemapUrls,
  validateIndexNowPayload,
  buildIndexNowPayload,
  PRODUCTION_HOST,
} from './indexnow.ts'

test('IndexNow: maskApiKey masks key safely', () => {
  assert.strictEqual(maskApiKey('ed59d0a9eae8459587f0fb6490402769'), 'ed59...2769')
  assert.strictEqual(maskApiKey(''), '[REDACTED]')
  assert.strictEqual(maskApiKey(null), '[REDACTED]')
  assert.strictEqual(maskApiKey('short'), '[REDACTED]')
})

test('IndexNow: extractSitemapUrls extracts valid URLs from sitemap XML', () => {
  const sampleXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://qubnexa.online/</loc></url>
  <url><loc>https://qubnexa.online/tools</loc></url>
  <url><loc>https://qubnexa.online/tools/sip-calculator</loc></url>
  <url><loc>https://evil.com/phishing</loc></url>
  <url><loc>invalid-url</loc></url>
</urlset>`

  const urls = extractSitemapUrls(sampleXml, PRODUCTION_HOST)
  assert.strictEqual(urls.length, 3)
  assert.ok(urls.includes('https://qubnexa.online/'))
  assert.ok(urls.includes('https://qubnexa.online/tools'))
  assert.ok(urls.includes('https://qubnexa.online/tools/sip-calculator'))
  assert.ok(!urls.includes('https://evil.com/phishing'))
})

test('IndexNow: validateIndexNowPayload checks specifications', () => {
  const validPayload = {
    host: 'qubnexa.online',
    key: 'ed59d0a9eae8459587f0fb6490402769',
    keyLocation: 'https://qubnexa.online/ed59d0a9eae8459587f0fb6490402769.txt',
    urlList: ['https://qubnexa.online/', 'https://qubnexa.online/tools'],
  }

  assert.strictEqual(validateIndexNowPayload(validPayload).valid, true)

  // Empty host
  assert.strictEqual(validateIndexNowPayload({ ...validPayload, host: '' }).valid, false)

  // Invalid key (non-hex)
  assert.strictEqual(validateIndexNowPayload({ ...validPayload, key: 'not_a_hex_key!' }).valid, false)

  // Host mismatch in keyLocation
  assert.strictEqual(
    validateIndexNowPayload({
      ...validPayload,
      keyLocation: 'https://anotherhost.com/key.txt',
    }).valid,
    false
  )

  // Empty urlList
  assert.strictEqual(validateIndexNowPayload({ ...validPayload, urlList: [] }).valid, false)

  // Foreign URL in urlList
  assert.strictEqual(
    validateIndexNowPayload({
      ...validPayload,
      urlList: ['https://qubnexa.online/', 'https://otherdomain.com/page'],
    }).valid,
    false
  )
})

test('IndexNow: buildIndexNowPayload builds valid payload and deduplicates', () => {
  const key = 'ed59d0a9eae8459587f0fb6490402769'
  const urls = [
    'https://qubnexa.online/',
    'https://qubnexa.online/tools',
    'https://qubnexa.online/', // duplicate
    'https://qubnexa.online/categories',
  ]

  const payload = buildIndexNowPayload(key, urls)
  assert.strictEqual(payload.host, 'qubnexa.online')
  assert.strictEqual(payload.key, key)
  assert.strictEqual(payload.keyLocation, `https://qubnexa.online/${key}.txt`)
  assert.strictEqual(payload.urlList.length, 3)
})

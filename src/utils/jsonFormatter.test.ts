import { describe, it } from 'node:test'
import assert from 'node:assert'
import {
  validateJson,
  formatJson,
  minifyJson,
  sortObjectKeys,
  computeJsonStats,
  escapeJsonString,
  unescapeJsonString,
  SAMPLE_JSON,
} from './jsonFormatter.ts'

describe('JSON Formatter & Validator Engine', () => {
  it('should validate and pretty print standard JSON with 2-space indentation', () => {
    const raw = '{"name":"QUBNEXA","version":2}'
    const { formatted, validation } = formatJson(raw, { indent: 2 })

    assert.strictEqual(validation.isValid, true)
    assert.strictEqual(validation.isEmpty, false)
    assert.strictEqual(validation.error, null)
    assert.strictEqual(formatted, '{\n  "name": "QUBNEXA",\n  "version": 2\n}')
  })

  it('should support 4-space and tab indentation', () => {
    const raw = '{"a":1}'
    const res4 = formatJson(raw, { indent: 4 })
    assert.strictEqual(res4.formatted, '{\n    "a": 1\n}')

    const resTab = formatJson(raw, { indent: 'tab' })
    assert.strictEqual(resTab.formatted, '{\n\t"a": 1\n}')
  })

  it('should minify JSON stripping optional whitespace', () => {
    const raw = `
    {
      "title": "QUBNEXA",
      "items": [1, 2, 3],
      "active": true
    }`
    const { minified, validation } = minifyJson(raw)
    assert.strictEqual(validation.isValid, true)
    assert.strictEqual(minified, '{"title":"QUBNEXA","items":[1,2,3],"active":true}')
  })

  it('should detect invalid JSON and report line and column information', () => {
    // Missing comma after "b"
    const invalid = '{\n  "a": 1\n  "b": 2\n}'
    const validation = validateJson(invalid)

    assert.strictEqual(validation.isValid, false)
    assert.strictEqual(validation.isEmpty, false)
    assert.notStrictEqual(validation.error, null)
    assert.strictEqual(typeof validation.line, 'number')
    assert.strictEqual(typeof validation.column, 'number')
    assert.ok((validation.line as number) >= 1)
    assert.ok((validation.column as number) >= 1)
  })

  it('should report empty input cleanly', () => {
    const validation = validateJson('   \n  \t  ')
    assert.strictEqual(validation.isValid, false)
    assert.strictEqual(validation.isEmpty, true)
    assert.ok(validation.error?.includes('empty'))
  })

  it('should handle primitive JSON values: null, boolean, number, string', () => {
    assert.strictEqual(validateJson('null').isValid, true)
    assert.strictEqual(validateJson('true').isValid, true)
    assert.strictEqual(validateJson('false').isValid, true)
    assert.strictEqual(validateJson('42.5').isValid, true)
    assert.strictEqual(validateJson('"hello world"').isValid, true)
  })

  it('should sort object keys alphabetically without altering array order', () => {
    const raw = {
      zebra: 1,
      apple: 2,
      middle: {
        z: 10,
        a: 20,
      },
      list: ['orange', 'banana', 'apple'], // Array order must remain unchanged
    }

    const sorted = sortObjectKeys(raw)
    const keys = Object.keys(sorted)
    assert.deepStrictEqual(keys, ['apple', 'list', 'middle', 'zebra'])
    assert.deepStrictEqual(Object.keys(sorted.middle), ['a', 'z'])
    assert.deepStrictEqual(sorted.list, ['orange', 'banana', 'apple'])
  })

  it('should compute comprehensive JSON statistics', () => {
    const obj = {
      user: {
        id: 1,
        profile: {
          bio: 'Tester',
        },
      },
      tags: ['a', 'b', 'c'],
    }
    const raw = JSON.stringify(obj, null, 2)
    const stats = computeJsonStats(obj, raw)

    assert.strictEqual(stats.objects, 3) // root, user, profile
    assert.strictEqual(stats.arrays, 1) // tags
    assert.strictEqual(stats.keys, 5) // user, tags, id, profile, bio
    assert.strictEqual(stats.maxDepth, 3) // root(0) -> user(1) -> profile(2) -> bio(3)
    assert.ok(stats.characters > 0)
    assert.ok(stats.lines > 1)
    assert.ok(stats.sizeBytes > 0)
  })

  it('should preserve unicode, emoji, and special characters', () => {
    const raw = '{"msg":"QUBNEXA ✨ 🚀 नमस्ते","symbol":"©®™"}'
    const { formatted, validation } = formatJson(raw, { indent: 2 })
    assert.strictEqual(validation.isValid, true)
    assert.ok(formatted.includes('✨ 🚀 नमस्ते'))
    assert.ok(formatted.includes('©®™'))

    const { minified } = minifyJson(raw)
    assert.ok(minified.includes('✨ 🚀 नमस्ते'))
  })

  it('should escape and unescape strings properly', () => {
    const rawText = 'Line 1\nLine 2\t"quoted"'
    const escaped = escapeJsonString(rawText)
    assert.strictEqual(escaped, '"Line 1\\nLine 2\\t\\"quoted\\""')

    const unescaped = unescapeJsonString(escaped)
    assert.strictEqual(unescaped.result, rawText)
  })

  it('should parse SAMPLE_JSON without errors and compute rich stats', () => {
    const validation = validateJson(SAMPLE_JSON)
    assert.strictEqual(validation.isValid, true)

    const stats = computeJsonStats(validation.parsedValue, SAMPLE_JSON)
    assert.ok(stats.objects >= 5)
    assert.ok(stats.arrays >= 2)
    assert.ok(stats.keys >= 15)
    assert.ok(stats.maxDepth >= 3)
  })
})

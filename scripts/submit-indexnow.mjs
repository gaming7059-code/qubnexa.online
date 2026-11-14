#!/usr/bin/env node

/**
 * QUBNEXA — IndexNow Submission CLI
 *
 * Submits production URLs to the IndexNow gateway (api.indexnow.org),
 * automatically distributing discovery updates to Bing, Yandex, Seznam,
 * and participating search engines.
 *
 * Usage:
 *   node scripts/submit-indexnow.mjs
 *   node scripts/submit-indexnow.mjs --dry-run
 *   node scripts/submit-indexnow.mjs https://qubnexa.online/tools/my-new-tool
 */

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import {
  PRODUCTION_HOST,
  INDEXNOW_ENDPOINT,
  maskApiKey,
  extractSitemapUrls,
  buildIndexNowPayload,
  validateIndexNowPayload,
} from '../src/utils/indexnow.ts'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const projectRoot = path.resolve(__dirname, '..')
const publicDir = path.join(projectRoot, 'public')
const sitemapPath = path.join(publicDir, 'sitemap.xml')

// Parse CLI arguments
const rawArgs = process.argv.slice(2)
const isDryRun = rawArgs.includes('--dry-run')
const urlArgs = rawArgs.filter((arg) => !arg.startsWith('--') && arg.startsWith('http'))

/**
 * Discovers the official IndexNow API key from environment or public/<key>.txt
 */
function resolveApiKey() {
  if (process.env.INDEXNOW_KEY && process.env.INDEXNOW_KEY.trim().length > 0) {
    return process.env.INDEXNOW_KEY.trim()
  }

  if (fs.existsSync(publicDir)) {
    const files = fs.readdirSync(publicDir)
    for (const f of files) {
      if (/^[a-f0-9]{32}\.txt$/i.test(f)) {
        const keyFilePath = path.join(publicDir, f)
        const keyContent = fs.readFileSync(keyFilePath, 'utf8').trim()
        const baseName = f.replace(/\.txt$/i, '')
        if (keyContent.toLowerCase() === baseName.toLowerCase()) {
          return keyContent
        }
      }
    }
  }

  throw new Error(
    'IndexNow API key not found. Ensure public/<key>.txt exists or set INDEXNOW_KEY environment variable.'
  )
}

async function main() {
  console.log('====================================================')
  console.log('QUBNEXA — IndexNow Search Engine URL Submission')
  console.log('====================================================')

  const apiKey = resolveApiKey()
  console.log(`Host:            ${PRODUCTION_HOST}`)
  console.log(`API Key:         ${maskApiKey(apiKey)} (Secured & Masked)`)
  console.log(`Verification:    https://${PRODUCTION_HOST}/${apiKey}.txt`)
  console.log(`Gateway:         ${INDEXNOW_ENDPOINT}`)
  console.log(`Mode:            ${isDryRun ? 'DRY RUN (No network request)' : 'LIVE SUBMISSION'}`)

  let targetUrls = []

  if (urlArgs.length > 0) {
    console.log(`\nUsing ${urlArgs.length} target URL(s) from CLI arguments:`)
    targetUrls = urlArgs
  } else {
    if (!fs.existsSync(sitemapPath)) {
      throw new Error(`Sitemap file not found at ${sitemapPath}`)
    }
    const sitemapContent = fs.readFileSync(sitemapPath, 'utf8')
    targetUrls = extractSitemapUrls(sitemapContent, PRODUCTION_HOST)
    console.log(`\nExtracted ${targetUrls.length} canonical URLs from public/sitemap.xml`)
  }

  const payload = buildIndexNowPayload(apiKey, targetUrls, PRODUCTION_HOST)
  const validation = validateIndexNowPayload(payload)

  if (!validation.valid) {
    throw new Error(`Payload validation failed: ${validation.error}`)
  }

  console.log(`Payload valid. Submitting ${payload.urlList.length} URL(s)...`)

  if (isDryRun) {
    console.log('\n[DRY RUN] Payload sample:')
    console.log(
      JSON.stringify(
        {
          host: payload.host,
          key: maskApiKey(payload.key),
          keyLocation: payload.keyLocation,
          urlCount: payload.urlList.length,
          sampleUrls: payload.urlList.slice(0, 3),
        },
        null,
        2
      )
    )
    console.log('\nDry run completed successfully. Zero network requests sent.')
    return
  }

  try {
    const response = await fetch(INDEXNOW_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        Host: 'api.indexnow.org',
      },
      body: JSON.stringify(payload),
    })

    const status = response.status
    let responseText = ''
    try {
      responseText = await response.text()
    } catch {
      // Body may be empty
    }

    console.log(`\nIndexNow Gateway Response: HTTP ${status}`)

    if (status === 200) {
      console.log('✔ Success (HTTP 200): All URLs submitted and accepted by IndexNow.')
    } else if (status === 202) {
      console.log('✔ Accepted (HTTP 202): IndexNow received URLs; key verification in progress.')
    } else if (status === 400) {
      console.error(`✖ Error (HTTP 400): Bad Request. Detail: ${responseText}`)
      process.exitCode = 1
    } else if (status === 403) {
      console.error(
        `✖ Error (HTTP 403): Forbidden. IndexNow could not verify ${payload.keyLocation}. Detail: ${responseText}`
      )
      process.exitCode = 1
    } else if (status === 422) {
      console.error(`✖ Error (HTTP 422): Unprocessable Entity. Detail: ${responseText}`)
      process.exitCode = 1
    } else if (status === 429) {
      console.warn(`⚠ Warning (HTTP 429): Too Many Requests / Rate limited. Detail: ${responseText}`)
    } else {
      console.log(`Response detail: ${responseText || 'No additional message.'}`)
    }
  } catch (err) {
    console.error(`\n✖ Network error submitting to IndexNow: ${err.message}`)
    process.exitCode = 1
  }
}

main().catch((err) => {
  console.error(`\n✖ Execution failure: ${err.message}`)
  process.exit(1)
})

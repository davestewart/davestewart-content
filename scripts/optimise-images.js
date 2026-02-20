#!/usr/bin/env node

/**
 * Optimises images using the TinyPNG API, skipping files that have already
 * been optimised. Uses a per-folder cache file to track processed images
 * via a hash of the post-optimised file contents.
 *
 * Usage:
 *   node optimise-images.js [directory] [--setup]
 *
 * Flags:
 *   --setup   Build cache files without optimising. Run once on existing
 *             projects to avoid re-optimising already processed images.
 *
 * Requires:
 *   TINYPNG_API_KEY env var
 *   npm install tinify
 */

import { createHash } from 'crypto'
import { readdir, readFile, writeFile } from 'fs/promises'
import { join, extname, dirname } from 'path'
import { existsSync } from 'fs'
import tinify from 'tinify'

const CACHE_FILENAME = '.tinypng-cache.json'
const IMAGE_EXTS = new Set(['.png', '.jpg', '.jpeg', '.webp', '.avif'])

const c = {
  green:  (s) => `[32m${s}[0m`,
  yellow: (s) => `[33m${s}[0m`,
  grey:   (s) => `[90m${s}[0m`,
}

// ---------------------------------------------------------------------------
// Hashing
// ---------------------------------------------------------------------------

function hashBuffer(buffer) {
  return createHash('md5').update(buffer).digest('hex')
}

// ---------------------------------------------------------------------------
// Cache
// ---------------------------------------------------------------------------

async function readCache(folder) {
  const cachePath = join(folder, CACHE_FILENAME)
  try {
    const raw = await readFile(cachePath, 'utf8')
    return JSON.parse(raw)
  }
  catch {
    return {}
  }
}

async function writeCache(folder, cache) {
  const cachePath = join(folder, CACHE_FILENAME)
  await writeFile(cachePath, JSON.stringify(cache, null, 2), 'utf8')
}

// ---------------------------------------------------------------------------
// Image discovery
// ---------------------------------------------------------------------------

async function findImages(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  const results = []

  for (const entry of entries) {
    const fullPath = join(dir, entry.name)

    if (entry.isDirectory() && !entry.name.startsWith('.')) {
      const nested = await findImages(fullPath)
      results.push(...nested)
    }
    else if (entry.isFile() && IMAGE_EXTS.has(extname(entry.name).toLowerCase())) {
      results.push(fullPath)
    }
  }

  return results
}

// ---------------------------------------------------------------------------
// Formatting
// ---------------------------------------------------------------------------

// formats bytes as KB or MB
function formatSize(bytes) {
  if (bytes >= 1024 * 1024)
    return `${(bytes / 1024 / 1024).toFixed(1)} MB`
  return `${Math.round(bytes / 1024)} KB`
}

// ---------------------------------------------------------------------------
// Optimisation
// ---------------------------------------------------------------------------

/** Optimises a single image in place using the TinyPNG API */
async function optimiseImage(filePath) {
  const source = tinify.fromFile(filePath)
  await source.toFile(filePath)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function run() {
  const args = process.argv.slice(2)
  const setupMode = args.includes('--setup')
  const targetDir = args.find(a => !a.startsWith('--')) || '.'

  if (!existsSync(targetDir)) {
    console.error(`Error: directory not found — ${targetDir}`)
    process.exit(1)
  }

  if (setupMode) {
    console.log('Setup mode — building cache without optimising\n')
  }
  else {
    let apiKey = process.env.TINYPNG_API_KEY

    if (!apiKey) {
      try {
        const home = process.env.HOME || process.env.USERPROFILE
        apiKey = (await readFile(join(home, '.tinypng'), 'utf8')).trim()
      }
      catch {
        // no fallback found
      }
    }

    if (!apiKey) {
      console.error('Error: no API key found — set TINYPNG_API_KEY or add your key to ~/.tinypng')
      process.exit(1)
    }

    tinify.key = apiKey
  }

  console.log(`Scanning ${targetDir}...\n`)

  const images = await findImages(targetDir)

  if (!images.length) {
    console.log('No images found.')
    return
  }

  // group images by folder so we can read/write the cache per folder
  const byFolder = images.reduce((acc, filePath) => {
    const folder = dirname(filePath)
    if (!acc[folder]) {
      acc[folder] = []
    }
    acc[folder].push(filePath)
    return acc
  }, {})

  let processed = 0
  let skipped = 0
  let failed = 0

  for (const [folder, files] of Object.entries(byFolder)) {
    const cache = await readCache(folder)
    let cacheChanged = false

    for (const filePath of files) {
      const filename = filePath.split('/').pop()
      const buffer = await readFile(filePath)
      const currentHash = hashBuffer(buffer)
      const cachedHash = cache[filename]

      if (cachedHash && cachedHash === currentHash) {
        console.log(c.grey(`  skip     ${filename}`))
        skipped++
        continue
      }

      if (setupMode) {
        // just record the hash, no optimisation
        cache[filename] = currentHash
        cacheChanged = true
        console.log(c.green(`  cached   ${filename}`))
        processed++
        continue
      }

      const isNew = !cachedHash
      const label = isNew ? 'new' : 'updated'
      const colorLabel = isNew ? c.green(label.padEnd(9)) : c.yellow(label.padEnd(9))
      const sizeBefore = buffer.length
      process.stdout.write(`  ${colorLabel} ${filename} ... `)

      try {
        await optimiseImage(filePath)

        // hash the post-optimised file
        const optimisedBuffer = await readFile(filePath)
        cache[filename] = hashBuffer(optimisedBuffer)
        cacheChanged = true

        const sizeAfter = optimisedBuffer.length
        const saved = Math.round((1 - sizeAfter / sizeBefore) * 100)
        console.log(`${formatSize(sizeBefore)} → ${formatSize(sizeAfter)} (${saved}% saved)`)
        processed++
      }
      catch (err) {
        console.log(`failed — ${err.message}`)
        failed++
      }
    }

    if (cacheChanged) {
      await writeCache(folder, cache)
    }
  }

  const action = setupMode ? 'cached' : 'optimised'
  console.log(`\nDone — ${processed} ${action}, ${skipped} skipped, ${failed} failed`)

  if (!setupMode && tinify.compressionCount !== undefined) {
    console.log(`TinyPNG compressions used this month: ${tinify.compressionCount}`)
  }
}

void run()

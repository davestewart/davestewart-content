#!/usr/bin/env node

import fs from 'fs'
import yaml from 'js-yaml'
import { glob } from 'glob'

// Load tags.yaml
const tagsYaml = yaml.load(fs.readFileSync('./content/tags.yaml', 'utf8'))
const validTags = new Set()

// Collect all valid tags from categories
Object.values(tagsYaml).forEach(category => {
  if (Array.isArray(category)) {
    category.forEach(tag => validTags.add(tag))
  }
  else if (typeof category === 'object') {
    Object.values(category).forEach(tags => {
      if (Array.isArray(tags)) {
        tags.forEach(tag => validTags.add(tag))
      }
    })
  }
})

// Find all markdown files
const markdownFiles = glob.sync('./content/**/*.md')

// Extract tags from front matter
const allTags = new Set()
const filesByTag = new Map()
const frontMatterRegex = /^---\n([\s\S]*?)\n---/

markdownFiles.forEach(file => {
  const content = fs.readFileSync(file, 'utf8')
  const match = content.match(frontMatterRegex)

  if (match) {
    try {
      const frontMatter = yaml.load(match[1])
      if (frontMatter.tags) {
        const tags = Array.isArray(frontMatter.tags) ? frontMatter.tags : [frontMatter.tags]
        tags.forEach(tag => {
          allTags.add(tag)
          if (!filesByTag.has(tag)) {
            filesByTag.set(tag, [])
          }
          filesByTag.get(tag).push(file)
        })
      }
    }
    catch (e) {
      console.error(`Error parsing front matter in ${file}:`, e.message)
    }
  }
})

// Find tags not in categories
const uncategorizedTags = [...allTags].filter(tag => !validTags.has(tag)).sort()

console.log('Valid tags:', validTags.size)
console.log('Tags found in markdown files:', allTags.size)
console.log('\nUncategorized tags:')
if (uncategorizedTags.length === 0) {
  console.log('  (none)')
}
else {
  uncategorizedTags.forEach(tag => {
    console.log(`  - ${tag}`)
    filesByTag.get(tag).forEach(file => {
      console.log(`      ${file}`)
    })
  })
  process.exit(1)
}

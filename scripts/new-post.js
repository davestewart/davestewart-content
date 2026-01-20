#!/usr/bin/env node

import { select, input } from '@inquirer/prompts';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { slugify } from './utils/slugify.js';
import {
  getSubdirectories,
  ensureDirectory,
  getCurrentDate
} from './utils/file-utils.js';
import { selectTags } from './utils/tag-utils.js';
import { generateAllPlaceholders } from './utils/image-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const CONTENT_DIR = path.join(ROOT_DIR, 'content');
const TAGS_PATH = path.join(CONTENT_DIR, 'tags.yaml');

// Map display names to folder names
const POST_TYPES = {
  'blog': 'blog',
  'project': 'projects',
  'product': 'products',
  'work': 'work'
};

// Types that have categories/subfolders
const TYPES_WITH_CATEGORIES = ['blog', 'projects'];

/**
 * Main CLI function
 */
async function main() {
  console.log('📝 Post Generator\n');
  await createPost();
}

/**
 * Create a new post
 */
async function createPost() {
  // 1. Select post type
  const type = await select({
    message: 'What kind of post?',
    choices: Object.keys(POST_TYPES).map(t => ({ name: t, value: t }))
  });

  // Get the folder name for this type
  const typeFolder = POST_TYPES[type];

  // 2. Select category if applicable (blog or projects)
  let category = null;
  if (TYPES_WITH_CATEGORIES.includes(typeFolder)) {
    const categoryPath = path.join(CONTENT_DIR, typeFolder);
    const categories = getSubdirectories(categoryPath);

    if (categories.length > 0) {
      category = await select({
        message: 'Which category?',
        choices: categories.map(c => ({ name: c, value: c }))
      });
    }
  }

  // 3. Get title
  const title = await input({
    message: 'What\'s the title?',
    validate: value => value.trim() ? true : 'Title is required'
  });

  // 4. Get slug (with default from title)
  const defaultSlug = slugify(title);
  const slug = await input({
    message: 'What\'s the folder name?',
    default: defaultSlug,
    validate: value => value.trim() ? true : 'Folder name is required'
  });

  // 5. Get description
  const description = await input({
    message: 'What\'s the description?',
    validate: value => value.trim() ? true : 'Description is required'
  });

  // 6. Select tags
  const tags = await selectTags(TAGS_PATH);

  // 7. Get repo name if product or project
  let repo = null;
  if (type === 'product' || type === 'project') {
    const repoName = await input({
      message: 'What\'s the repo name?',
      default: slug,
      validate: value => value.trim() ? true : 'Repo name is required'
    });
    repo = `davestewart/${repoName}`;
  }

  // Build the post path
  let postPath = path.join(CONTENT_DIR, typeFolder);
  if (category) {
    postPath = path.join(postPath, category);
  }
  postPath = path.join(postPath, slug);

  // Check if post already exists
  if (fs.existsSync(postPath)) {
    console.error(`\n❌ Error: Post already exists at ${postPath}`);
    process.exit(1);
  }

  // Create directories
  ensureDirectory(postPath);
  const imagesPath = path.join(postPath, 'images');
  ensureDirectory(imagesPath);

  // Generate frontmatter
  const frontmatter = {
    description,
    date: getCurrentDate(),
    draft: true,
    tags,
  };

  // Add repo if applicable
  if (repo) {
    frontmatter.repo = repo;
  }

  // Add media
  frontmatter.media = {
    thumbnail: './images/thumbnail.png',
    featured: './images/featured.png',
    opengraph: './images/opengraph.png'
  };

  // Generate markdown content
  const yamlFrontmatter = yaml.dump(frontmatter, { lineWidth: -1, quotingType: '"', forceQuotes: false });
  const markdown = `---
${yamlFrontmatter}---

# ${title}

## Intro

Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.

Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
`;

  // Write index.md
  const indexPath = path.join(postPath, 'index.md');
  fs.writeFileSync(indexPath, markdown, 'utf8');

  // Generate placeholder images
  console.log('\n🎨 Generating placeholder images...');
  generateAllPlaceholders(imagesPath, title);

  console.log(`\n✅ Post created successfully at:\n  - ${postPath}`);
  console.log(`📄 Edit your post:\n  - ${indexPath}`);
}

// Run the CLI
main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});

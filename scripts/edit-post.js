#!/usr/bin/env node

import { search } from '@inquirer/prompts';
import Fs from 'fs';
import Path from 'path';
import Yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import { parseFrontmatter } from './utils/file-utils.js';
import { selectTags } from './utils/tag-utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = Path.dirname(__filename);
const ROOT_DIR = Path.resolve(__dirname, '..');
const CONTENT_DIR = Path.join(ROOT_DIR, 'content');
const TAGS_PATH = Path.join(CONTENT_DIR, 'tags.yaml');

/**
 * Get all posts from all types
 * @returns {Array<{path: string, title: string, type: string, fullPath: string}>}
 */
function getAllPosts() {
  const allPosts = [];

  // Find all index.md files in content folder, excluding the root index.md files
  const pattern = Path.join(CONTENT_DIR, '*/**/index.md');
  const files = glob.sync(pattern, { ignore: Path.join(CONTENT_DIR, '*/index.md') });

  for (const filePath of files) {
    // Read the file to get the title
    const content = Fs.readFileSync(filePath, 'utf8');
    const titleMatch = content.match(/^#\s+(.+)$/m);

    // Get relative path from content dir
    const relativePath = Path.relative(CONTENT_DIR, filePath);
    const pathParts = relativePath.split(Path.sep);
    const type = pathParts[0]; // e.g., 'blog', 'products', 'projects', 'work'
    const postPath = pathParts.slice(1, -1).join(Path.sep); // Remove type and 'index.md'

    const title = titleMatch ? titleMatch[1] : postPath;

    allPosts.push({
      title,
      type,
      path: postPath,
      fullPath: filePath
    });
  }

  return allPosts;
}

/**
 * Main CLI function
 */
async function main() {
  console.log('✏️  Post Editor\n');

  // Get all posts
  const allPosts = getAllPosts();

  if (allPosts.length === 0) {
    console.error('❌ No posts found');
    process.exit(1);
  }

  // Search for post
  const selectedPost = await search({
    message: 'Search for a post:',
    pageSize: 20,
    source: async (input) => {
      if (!input) {
        return allPosts.map(p => ({
          name: `[${p.type}] ${p.title}`,
          value: p,
          description: p.path
        }));
      }

      const searchTerm = input.toLowerCase();
      return allPosts
        .filter(p =>
          p.title.toLowerCase().includes(searchTerm) ||
          p.path.toLowerCase().includes(searchTerm) ||
          p.type.toLowerCase().includes(searchTerm)
        )
        .map(p => ({
          name: `[${p.type}] ${p.title}`,
          value: p,
          description: p.path
        }));
    }
  });

  // Read the post
  const content = Fs.readFileSync(selectedPost.fullPath, 'utf8');
  const { frontmatter, body } = parseFrontmatter(content);

  console.log(`\n📝 Editing: ${selectedPost.title}`);
  console.log(`📁 Path: ${selectedPost.path}\n`);

  // Edit tags
  const newTags = await selectTags(TAGS_PATH, frontmatter.tags || []);

  // Update frontmatter
  const updatedFrontmatter = {
    ...frontmatter,
    tags: newTags
  };

  // Write updated content
  const yamlFrontmatter = Yaml.dump(updatedFrontmatter, { lineWidth: -1, quotingType: '"', forceQuotes: false });
  const updatedContent = `---\n${yamlFrontmatter}---\n${body}`;
  Fs.writeFileSync(selectedPost.fullPath, updatedContent, 'utf8');

  console.log(`\n✅ Post updated successfully!`);
  console.log(`📄 ${Path.relative(ROOT_DIR, selectedPost.fullPath)}`);
}

// Run the CLI
main().catch(error => {
  console.error('\n❌ Error:', error.message);
  process.exit(1);
});

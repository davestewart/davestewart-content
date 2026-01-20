import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Read YAML file and parse it
 * @param {string} filePath - Path to the YAML file
 * @returns {object} Parsed YAML data
 */
export function readYaml(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  return yaml.load(content);
}

/**
 * Get subdirectories in a directory
 * @param {string} dirPath - Path to the directory
 * @returns {string[]} Array of subdirectory names
 */
export function getSubdirectories(dirPath) {
  if (!fs.existsSync(dirPath)) {
    return [];
  }
  return fs.readdirSync(dirPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && !dirent.name.startsWith('.'))
    .map(dirent => dirent.name)
    .sort();
}

/**
 * Get all posts of a specific type with optional category filter
 * @param {string} basePath - Base content path
 * @param {string} type - Post type (blog, product, project, work)
 * @param {string|null} category - Optional category to filter by
 * @returns {Array<{path: string, title: string, slug: string}>} Array of posts
 */
export function getPosts(basePath, type, category = null) {
  const posts = [];
  let searchPath = path.join(basePath, 'content', type);

  if (category) {
    searchPath = path.join(searchPath, category);
  }

  function scanDirectory(dirPath, relativePath = '') {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'images') {
        const itemPath = path.join(dirPath, item.name);
        const indexPath = path.join(itemPath, 'index.md');

        if (fs.existsSync(indexPath)) {
          const content = fs.readFileSync(indexPath, 'utf8');
          const titleMatch = content.match(/^#\s+(.+)$/m);
          const title = titleMatch ? titleMatch[1] : item.name;

          posts.push({
            path: path.join(relativePath, item.name),
            title,
            slug: item.name
          });

          // Don't recurse into this directory since we found a post
          continue;
        }

        // Recursively scan subdirectories only if no index.md was found
        scanDirectory(itemPath, path.join(relativePath, item.name));
      }
    }
  }

  if (fs.existsSync(searchPath)) {
    scanDirectory(searchPath);
  }

  return posts;
}

/**
 * Parse frontmatter from markdown content
 * @param {string} content - Markdown content with frontmatter
 * @returns {{frontmatter: object, body: string}} Parsed frontmatter and body
 */
export function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) {
    return { frontmatter: {}, body: content };
  }

  const frontmatter = yaml.load(match[1]) || {};
  const body = match[2];

  return { frontmatter, body };
}

/**
 * Create directory recursively if it doesn't exist
 * @param {string} dirPath - Directory path to create
 */
export function ensureDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

/**
 * Get current date in YYYY-MM-DD format
 * @returns {string} Current date
 */
export function getCurrentDate() {
  return new Date().toISOString().slice(0, 10)
}

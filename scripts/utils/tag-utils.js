import { checkbox } from '@inquirer/prompts';
import { readYaml } from './file-utils.js';

/**
 * Get tags from tags.yaml organized by category
 * @param {string} tagsPath - Path to tags.yaml
 * @returns {object} Tags organized by category
 */
export function getTags(tagsPath) {
  return readYaml(tagsPath);
}

/**
 * Flatten tags object into a single array with category prefixes
 * @param {object} tags - Tags organized by category
 * @returns {Array<{name: string, value: string, category: string}>} Flattened tags
 */
export function flattenTags(tags) {
  const flattened = [];

  for (const [category, tagList] of Object.entries(tags)) {
    for (const tag of tagList) {
      flattened.push({
        name: `[${category}] ${tag}`,
        value: tag,
        category
      });
    }
  }

  return flattened;
}

/**
 * Interactive tag selection interface
 * @param {string} tagsPath - Path to tags.yaml
 * @param {string[]} currentTags - Currently selected tags (for edit mode)
 * @returns {Promise<string[]>} Selected tags
 */
export async function selectTags(tagsPath, currentTags = []) {
  const tags = getTags(tagsPath);
  const flatTags = flattenTags(tags);

  // Mark current tags as checked
  const choices = flatTags.map(tag => ({
    ...tag,
    checked: currentTags.includes(tag.value)
  }));

  return await checkbox({
    message: 'Select tags (use space to select, enter to confirm):',
    choices: choices,
    pageSize: 15,
    loop: false
  });
}

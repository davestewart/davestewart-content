import fs from 'fs';
import path from 'path';
import { createCanvas } from 'canvas';

/**
 * Image dimension presets
 */
export const IMAGE_SIZES = {
  thumbnail: { width: 640, height: 360 },
  featured: { width: 1280, height: 640 },
  opengraph: { width: 1200, height: 630 }
};

/**
 * Generate a placeholder image with text
 * @param {string} outputPath - Path to save the image
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @param {string} text - Text to display on the image
 */
export function generatePlaceholderImage(outputPath, width, height, text) {
  const canvas = createCanvas(width, height);
  const ctx = canvas.getContext('2d');

  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);

  // Text
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Main title
  const fontSize = Math.min(width, height) / 10;
  ctx.font = `bold ${fontSize}px Arial`;
  ctx.fillText(text, width / 2, height / 2 - fontSize / 2);

  // Dimensions text
  const dimFontSize = fontSize / 3;
  ctx.font = `${dimFontSize}px Arial`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.fillText(`${width} × ${height}`, width / 2, height / 2 + fontSize);

  // Save to file
  const buffer = canvas.toBuffer('image/png');
  fs.writeFileSync(outputPath, buffer);
}

/**
 * Generate all placeholder images for a post
 * @param {string} imagesDir - Path to the images directory
 * @param {string} title - Post title to display on images
 */
export function generateAllPlaceholders(imagesDir, title) {
  // Ensure images directory exists
  if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
  }

  // Generate each image type
  for (const [name, { width, height }] of Object.entries(IMAGE_SIZES)) {
    const outputPath = path.join(imagesDir, `${name}.png`);
    generatePlaceholderImage(outputPath, width, height, title);
  }
}

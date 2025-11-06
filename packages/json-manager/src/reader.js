import fs from 'fs/promises';

/**
 * Read and parse a JSON file
 * @param {string} filePath - Path to the JSON file
 * @returns {Promise<Object>} Parsed JSON data
 * @throws {Error} If file doesn't exist or JSON is invalid
 */
export async function readJson(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');

    if (!content || content.trim() === '') {
      throw new Error('File is empty');
    }

    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      throw new Error(`File not found: ${filePath}`);
    }
    if (error instanceof SyntaxError) {
      throw new Error(`Invalid JSON in file: ${filePath}`);
    }
    throw error;
  }
}

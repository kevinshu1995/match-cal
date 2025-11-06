import { readJson } from './reader.js';
import { writeJson } from './writer.js';
import { mergeEvents } from './merger.js';

/**
 * JsonManager class for managing event JSON files
 * Provides read, write, and merge operations
 */
export class JsonManager {
  /**
   * Read a JSON file
   * @param {string} filePath - Path to the JSON file
   * @returns {Promise<Object>} Parsed JSON data
   */
  async read(filePath) {
    return await readJson(filePath);
  }

  /**
   * Write events to a JSON file with meta information
   * @param {string} filePath - Path to write the JSON file
   * @param {Array} events - Array of events to write
   * @param {Object} metaInfo - Meta information (category, source, sourceUrl)
   * @returns {Promise<void>}
   */
  async write(filePath, events, metaInfo) {
    await writeJson(filePath, events, metaInfo);
  }

  /**
   * Merge new events with existing JSON file
   * Preserves customFields from existing events
   * @param {string} filePath - Path to the JSON file
   * @param {Array} newEvents - New events to merge
   * @param {Object} metaInfo - Meta information (category, source, sourceUrl)
   * @returns {Promise<void>}
   */
  async merge(filePath, newEvents, metaInfo) {
    let existingEvents = [];

    // Try to read existing file
    try {
      const existingData = await readJson(filePath);
      existingEvents = existingData.events || [];
    } catch (error) {
      // File doesn't exist - that's ok, we'll create a new one
      existingEvents = [];
    }

    // Merge events
    const mergedEvents = mergeEvents(existingEvents, newEvents);

    // Write merged data
    await writeJson(filePath, mergedEvents, metaInfo);
  }
}

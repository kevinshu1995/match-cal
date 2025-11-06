import fs from 'fs/promises';
import path from 'path';

/**
 * Write events to a JSON file with meta information
 * @param {string} filePath - Path to write the JSON file
 * @param {Array} events - Array of events to write
 * @param {Object} metaInfo - Meta information (category, source, sourceUrl)
 * @returns {Promise<void>}
 */
export async function writeJson(filePath, events, metaInfo) {
  // Create parent directories if they don't exist
  const dirPath = path.dirname(filePath);
  await fs.mkdir(dirPath, { recursive: true });

  // Generate meta information
  const meta = {
    category: metaInfo.category,
    source: metaInfo.source,
    sourceUrl: metaInfo.sourceUrl || '',
    generatedAt: new Date().toISOString(),
    version: '1.0.0',
    eventCount: events.length,
  };

  // Create the JSON structure
  const data = {
    meta,
    events,
  };

  // Write to file with pretty formatting
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
}

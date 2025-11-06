import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { readJson } from '../src/reader.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.join(__dirname, 'fixtures-reader');
const testFile = path.join(testDir, 'test-data.json');

describe('readJson', () => {
  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // ignore if doesn't exist
    }
  });

  it('should read JSON file successfully', async () => {
    const testData = {
      meta: {
        category: 'badminton',
        source: 'bwf',
        generatedAt: '2025-11-06T00:00:00.000Z',
        eventCount: 2,
      },
      events: [
        {
          id: 'event-1',
          title: 'Test Event 1',
          startDate: '2025-01-15T09:00:00.000Z',
          endDate: '2025-01-15T18:00:00.000Z',
          timezone: 'Asia/Jakarta',
          location: 'Jakarta',
          category: 'badminton',
          level: 'international',
          source: 'bwf',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          scrapedAt: '2025-01-01T00:00:00.000Z',
        },
        {
          id: 'event-2',
          title: 'Test Event 2',
          startDate: '2025-01-20T09:00:00.000Z',
          endDate: '2025-01-20T18:00:00.000Z',
          timezone: 'Asia/Jakarta',
          location: 'Jakarta',
          category: 'badminton',
          level: 'international',
          source: 'bwf',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          scrapedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    };

    await fs.writeFile(testFile, JSON.stringify(testData, null, 2));

    const result = await readJson(testFile);

    expect(result).toEqual(testData);
    expect(result.meta.eventCount).toBe(2);
    expect(result.events).toHaveLength(2);
  });

  it('should throw error if file does not exist', async () => {
    const nonExistentFile = path.join(testDir, 'nonexistent.json');

    await expect(readJson(nonExistentFile)).rejects.toThrow();
  });

  it('should throw error for invalid JSON', async () => {
    await fs.writeFile(testFile, 'invalid json content');

    await expect(readJson(testFile)).rejects.toThrow();
  });

  it('should handle empty file', async () => {
    await fs.writeFile(testFile, '');

    await expect(readJson(testFile)).rejects.toThrow();
  });

  it('should parse nested JSON structures', async () => {
    const complexData = {
      meta: { version: '1.0.0' },
      events: [
        {
          id: 'complex-1',
          title: 'Complex Event',
          startDate: '2025-01-15T09:00:00.000Z',
          endDate: '2025-01-15T18:00:00.000Z',
          timezone: 'Asia/Jakarta',
          location: 'Jakarta',
          category: 'badminton',
          level: 'international',
          source: 'bwf',
          customFields: {
            note: 'test note',
            nested: {
              deep: 'value',
            },
          },
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          scrapedAt: '2025-01-01T00:00:00.000Z',
        },
      ],
    };

    await fs.writeFile(testFile, JSON.stringify(complexData));

    const result = await readJson(testFile);

    expect(result.events[0].customFields.nested.deep).toBe('value');
  });
});

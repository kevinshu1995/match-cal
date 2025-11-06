import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { writeJson } from '../src/writer.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.join(__dirname, 'fixtures-writer');
const testFile = path.join(testDir, 'output.json');

describe('writeJson', () => {
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

  it('should write JSON file with meta information', async () => {
    const events = [
      {
        id: 'event-1',
        title: 'Test Event',
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
    ];

    await writeJson(testFile, events, {
      category: 'badminton',
      source: 'bwf',
      sourceUrl: 'https://bwfbadminton.com',
    });

    const content = await fs.readFile(testFile, 'utf-8');
    const result = JSON.parse(content);

    expect(result.meta).toBeDefined();
    expect(result.meta.category).toBe('badminton');
    expect(result.meta.source).toBe('bwf');
    expect(result.meta.sourceUrl).toBe('https://bwfbadminton.com');
    expect(result.meta.eventCount).toBe(1);
    expect(result.meta.generatedAt).toBeDefined();
    expect(result.meta.version).toBe('1.0.0');
    expect(result.events).toHaveLength(1);
  });

  it('should create parent directories if they don\'t exist', async () => {
    const nestedFile = path.join(testDir, 'nested', 'deep', 'file.json');
    const events = [
      {
        id: 'event-1',
        title: 'Test',
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
    ];

    await writeJson(nestedFile, events, {
      category: 'badminton',
      source: 'bwf',
    });

    const exists = await fs.access(nestedFile).then(() => true).catch(() => false);
    expect(exists).toBe(true);
  });

  it('should handle empty events array', async () => {
    await writeJson(testFile, [], {
      category: 'badminton',
      source: 'bwf',
    });

    const content = await fs.readFile(testFile, 'utf-8');
    const result = JSON.parse(content);

    expect(result.meta.eventCount).toBe(0);
    expect(result.events).toHaveLength(0);
  });

  it('should format JSON with proper indentation', async () => {
    const events = [
      {
        id: 'event-1',
        title: 'Test',
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
    ];

    await writeJson(testFile, events, {
      category: 'badminton',
      source: 'bwf',
    });

    const content = await fs.readFile(testFile, 'utf-8');

    // Check that it's properly formatted (has newlines and indentation)
    expect(content).toContain('\n');
    expect(content).toContain('  ');
  });

  it('should overwrite existing file', async () => {
    // Write first file
    await writeJson(testFile, [
      {
        id: 'event-1',
        title: 'First',
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
    ], {
      category: 'badminton',
      source: 'bwf',
    });

    // Write second file (overwrite)
    await writeJson(testFile, [
      {
        id: 'event-2',
        title: 'Second',
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
    ], {
      category: 'badminton',
      source: 'bwf',
    });

    const content = await fs.readFile(testFile, 'utf-8');
    const result = JSON.parse(content);

    expect(result.events[0].title).toBe('Second');
    expect(result.events).toHaveLength(1);
  });
});

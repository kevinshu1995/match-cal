import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { JsonManager } from '../src/JsonManager.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.join(__dirname, 'fixtures-manager');
const testFile = path.join(testDir, 'manager-test.json');

describe('JsonManager', () => {
  let manager;

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    manager = new JsonManager();
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // ignore if doesn't exist
    }
  });

  describe('read', () => {
    it('should read JSON file', async () => {
      const testData = {
        meta: { category: 'badminton', source: 'bwf', eventCount: 1 },
        events: [
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
        ],
      };

      await fs.writeFile(testFile, JSON.stringify(testData));

      const result = await manager.read(testFile);

      expect(result).toEqual(testData);
    });
  });

  describe('write', () => {
    it('should write events with meta information', async () => {
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

      await manager.write(testFile, events, {
        category: 'badminton',
        source: 'bwf',
        sourceUrl: 'https://example.com',
      });

      const content = await fs.readFile(testFile, 'utf-8');
      const result = JSON.parse(content);

      expect(result.meta.category).toBe('badminton');
      expect(result.events).toHaveLength(1);
    });
  });

  describe('merge', () => {
    it('should merge new events with existing file', async () => {
      // Write initial data
      const initialData = {
        meta: { category: 'badminton', source: 'bwf', eventCount: 1 },
        events: [
          {
            id: 'event-1',
            title: 'Original Title',
            startDate: '2025-01-15T09:00:00.000Z',
            endDate: '2025-01-15T18:00:00.000Z',
            timezone: 'Asia/Jakarta',
            location: 'Jakarta',
            category: 'badminton',
            level: 'international',
            source: 'bwf',
            customFields: {
              note: 'Important event',
            },
            createdAt: '2025-01-01T00:00:00.000Z',
            updatedAt: '2025-01-01T00:00:00.000Z',
            scrapedAt: '2025-01-01T00:00:00.000Z',
          },
        ],
      };

      await fs.writeFile(testFile, JSON.stringify(initialData));

      // Merge with new data
      const newEvents = [
        {
          id: 'event-1',
          title: 'Updated Title',  // Changed
          startDate: '2025-01-15T10:00:00.000Z',  // Changed
          endDate: '2025-01-15T18:00:00.000Z',
          timezone: 'Asia/Jakarta',
          location: 'Jakarta',
          category: 'badminton',
          level: 'international',
          source: 'bwf',
          createdAt: '2025-01-02T00:00:00.000Z',
          updatedAt: '2025-01-02T00:00:00.000Z',
          scrapedAt: '2025-01-02T00:00:00.000Z',
        },
        {
          id: 'event-2',
          title: 'New Event',
          startDate: '2025-01-20T09:00:00.000Z',
          endDate: '2025-01-20T18:00:00.000Z',
          timezone: 'Asia/Jakarta',
          location: 'Jakarta',
          category: 'badminton',
          level: 'international',
          source: 'bwf',
          createdAt: '2025-01-10T00:00:00.000Z',
          updatedAt: '2025-01-10T00:00:00.000Z',
          scrapedAt: '2025-01-10T00:00:00.000Z',
        },
      ];

      await manager.merge(testFile, newEvents, {
        category: 'badminton',
        source: 'bwf',
      });

      const content = await fs.readFile(testFile, 'utf-8');
      const result = JSON.parse(content);

      expect(result.events).toHaveLength(2);
      expect(result.events[0].title).toBe('Updated Title');
      expect(result.events[0].customFields).toEqual({ note: 'Important event' });
      expect(result.events[0].createdAt).toBe('2025-01-01T00:00:00.000Z');
      expect(result.events[1].id).toBe('event-2');
    });

    it('should create new file if file does not exist during merge', async () => {
      const newEvents = [
        {
          id: 'event-1',
          title: 'First Event',
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

      await manager.merge(testFile, newEvents, {
        category: 'badminton',
        source: 'bwf',
      });

      const content = await fs.readFile(testFile, 'utf-8');
      const result = JSON.parse(content);

      expect(result.events).toHaveLength(1);
      expect(result.events[0].id).toBe('event-1');
    });
  });
});

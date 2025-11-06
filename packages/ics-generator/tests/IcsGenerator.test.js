import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { IcsGenerator } from '../src/IcsGenerator.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const testDir = path.join(__dirname, 'fixtures');
const testFile = path.join(testDir, 'test.ics');

describe('IcsGenerator', () => {
  let generator;

  beforeEach(async () => {
    await fs.mkdir(testDir, { recursive: true });
    generator = new IcsGenerator();
  });

  afterEach(async () => {
    try {
      await fs.rm(testDir, { recursive: true });
    } catch {
      // ignore if doesn't exist
    }
  });

  describe('generateString', () => {
    it('should generate ICS string from events', () => {
      const events = [
        {
          id: 'test-event-1',
          title: 'Test Event',
          startDate: '2025-01-15T09:00:00.000Z',
          endDate: '2025-01-15T18:00:00.000Z',
          timezone: 'Asia/Jakarta',
          location: 'Jakarta, Indonesia',
          category: 'badminton',
          level: 'international',
          source: 'bwf',
          description: 'Test tournament',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          scrapedAt: '2025-01-01T00:00:00.000Z',
        },
      ];

      const icsString = generator.generateString(events);

      expect(icsString).toContain('BEGIN:VCALENDAR');
      expect(icsString).toContain('END:VCALENDAR');
      expect(icsString).toContain('BEGIN:VEVENT');
      expect(icsString).toContain('END:VEVENT');
      expect(icsString).toContain('SUMMARY:Test Event');
      // Note: ICS escapes commas per RFC 5545
      expect(icsString).toContain('LOCATION:Jakarta\\, Indonesia');
    });

    it('should handle multiple events', () => {
      const events = [
        {
          id: 'event-1',
          title: 'Event 1',
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
          title: 'Event 2',
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
      ];

      const icsString = generator.generateString(events);

      expect(icsString).toContain('SUMMARY:Event 1');
      expect(icsString).toContain('SUMMARY:Event 2');
      // Count VEVENT occurrences
      const eventCount = (icsString.match(/BEGIN:VEVENT/g) || []).length;
      expect(eventCount).toBe(2);
    });

    it('should include event UID', () => {
      const events = [
        {
          id: 'badminton-bwf-2025-01-15-test-event',
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

      const icsString = generator.generateString(events);

      expect(icsString).toContain('UID:badminton-bwf-2025-01-15-test-event');
    });

    it('should handle empty events array', () => {
      const icsString = generator.generateString([]);

      expect(icsString).toContain('BEGIN:VCALENDAR');
      expect(icsString).toContain('END:VCALENDAR');
      expect(icsString).not.toContain('BEGIN:VEVENT');
    });

    it('should include optional fields when present', () => {
      const events = [
        {
          id: 'test-1',
          title: 'Test Event',
          startDate: '2025-01-15T09:00:00.000Z',
          endDate: '2025-01-15T18:00:00.000Z',
          timezone: 'Asia/Jakarta',
          location: 'Jakarta',
          category: 'badminton',
          level: 'international',
          source: 'bwf',
          description: 'This is a test event description',
          officialUrl: 'https://example.com/event',
          createdAt: '2025-01-01T00:00:00.000Z',
          updatedAt: '2025-01-01T00:00:00.000Z',
          scrapedAt: '2025-01-01T00:00:00.000Z',
        },
      ];

      const icsString = generator.generateString(events);

      expect(icsString).toContain('DESCRIPTION:');
      expect(icsString).toContain('URL:https://example.com/event');
    });
  });

  describe('generate', () => {
    it('should write ICS file to disk', async () => {
      const events = [
        {
          id: 'test-1',
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

      await generator.generate(testFile, events);

      const exists = await fs.access(testFile).then(() => true).catch(() => false);
      expect(exists).toBe(true);

      const content = await fs.readFile(testFile, 'utf-8');
      expect(content).toContain('BEGIN:VCALENDAR');
      expect(content).toContain('SUMMARY:Test Event');
    });

    it('should create parent directories if they don\'t exist', async () => {
      const nestedFile = path.join(testDir, 'nested', 'deep', 'calendar.ics');
      const events = [
        {
          id: 'test-1',
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

      await generator.generate(nestedFile, events);

      const exists = await fs.access(nestedFile).then(() => true).catch(() => false);
      expect(exists).toBe(true);
    });
  });
});

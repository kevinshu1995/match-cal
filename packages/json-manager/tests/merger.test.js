import { describe, it, expect } from 'vitest';
import { mergeEvents } from '../src/merger.js';

describe('mergeEvents', () => {
  it('should merge new event with existing event preserving customFields', () => {
    const existing = [
      {
        id: 'event-1',
        title: 'Old Title',
        startDate: '2025-01-15T09:00:00.000Z',
        endDate: '2025-01-15T18:00:00.000Z',
        timezone: 'Asia/Jakarta',
        location: 'Jakarta',
        category: 'badminton',
        level: 'international',
        source: 'bwf',
        customFields: {
          note: 'My favorite event!',
          priority: 'high',
        },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-05T00:00:00.000Z',
        scrapedAt: '2025-01-05T00:00:00.000Z',
      },
    ];

    const newEvents = [
      {
        id: 'event-1',
        title: 'New Title',  // Updated
        startDate: '2025-01-15T10:00:00.000Z',  // Updated time
        endDate: '2025-01-15T19:00:00.000Z',
        timezone: 'Asia/Jakarta',
        location: 'Jakarta Arena',  // Updated location
        category: 'badminton',
        level: 'international',
        source: 'bwf',
        createdAt: '2025-01-10T00:00:00.000Z',  // Should be ignored
        updatedAt: '2025-01-10T00:00:00.000Z',  // Will be updated
        scrapedAt: '2025-01-10T00:00:00.000Z',  // Will be updated
      },
    ];

    const result = mergeEvents(existing, newEvents);

    expect(result).toHaveLength(1);
    expect(result[0].title).toBe('New Title');  // Updated from new
    expect(result[0].startDate).toBe('2025-01-15T10:00:00.000Z');  // Updated from new
    expect(result[0].location).toBe('Jakarta Arena');  // Updated from new
    expect(result[0].customFields).toEqual({
      note: 'My favorite event!',
      priority: 'high',
    });  // Preserved from existing
    expect(result[0].createdAt).toBe('2025-01-01T00:00:00.000Z');  // Preserved from existing
    expect(result[0].updatedAt).not.toBe('2025-01-05T00:00:00.000Z');  // Should be updated
    expect(result[0].scrapedAt).not.toBe('2025-01-05T00:00:00.000Z');  // Should be updated
  });

  it('should add new events that don\'t exist in existing', () => {
    const existing = [
      {
        id: 'event-1',
        title: 'Existing Event',
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

    const newEvents = [
      {
        id: 'event-1',
        title: 'Existing Event',
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

    const result = mergeEvents(existing, newEvents);

    expect(result).toHaveLength(2);
    expect(result.find(e => e.id === 'event-2')).toBeDefined();
    expect(result.find(e => e.id === 'event-2').title).toBe('New Event');
  });

  it('should remove events that no longer exist in new data', () => {
    const existing = [
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

    const newEvents = [
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
      // event-2 is removed
    ];

    const result = mergeEvents(existing, newEvents);

    expect(result).toHaveLength(1);
    expect(result.find(e => e.id === 'event-2')).toBeUndefined();
  });

  it('should handle empty existing events', () => {
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

    const result = mergeEvents([], newEvents);

    expect(result).toHaveLength(1);
    expect(result[0].id).toBe('event-1');
  });

  it('should handle empty new events', () => {
    const existing = [
      {
        id: 'event-1',
        title: 'Existing Event',
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

    const result = mergeEvents(existing, []);

    expect(result).toHaveLength(0);
  });

  it('should preserve nested customFields', () => {
    const existing = [
      {
        id: 'event-1',
        title: 'Event',
        startDate: '2025-01-15T09:00:00.000Z',
        endDate: '2025-01-15T18:00:00.000Z',
        timezone: 'Asia/Jakarta',
        location: 'Jakarta',
        category: 'badminton',
        level: 'international',
        source: 'bwf',
        customFields: {
          note: 'Important',
          nested: {
            deep: 'value',
            array: [1, 2, 3],
          },
        },
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        scrapedAt: '2025-01-01T00:00:00.000Z',
      },
    ];

    const newEvents = [
      {
        id: 'event-1',
        title: 'Updated Event',
        startDate: '2025-01-15T09:00:00.000Z',
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
    ];

    const result = mergeEvents(existing, newEvents);

    expect(result[0].customFields).toEqual({
      note: 'Important',
      nested: {
        deep: 'value',
        array: [1, 2, 3],
      },
    });
  });

  it('should not add customFields if existing event has none', () => {
    const existing = [
      {
        id: 'event-1',
        title: 'Event',
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

    const newEvents = [
      {
        id: 'event-1',
        title: 'Updated Event',
        startDate: '2025-01-15T09:00:00.000Z',
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
    ];

    const result = mergeEvents(existing, newEvents);

    expect(result[0].customFields).toBeUndefined();
  });
});

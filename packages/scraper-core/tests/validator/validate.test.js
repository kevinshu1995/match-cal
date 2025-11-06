import { describe, it, expect } from 'vitest';
import { validateEvent, validateEvents } from '../../src/validator/validate.js';

describe('validateEvent', () => {
  const validEvent = {
    id: 'badminton-bwf-2025-01-15-indonesia-masters',
    title: 'Indonesia Masters 2025',
    startDate: '2025-01-15T09:00:00.000Z',
    endDate: '2025-01-15T18:00:00.000Z',
    timezone: 'Asia/Jakarta',
    location: 'Jakarta, Indonesia',
    category: 'badminton',
    level: 'international',
    source: 'bwf',
    createdAt: '2025-01-01T00:00:00.000Z',
    updatedAt: '2025-01-01T00:00:00.000Z',
    scrapedAt: '2025-01-01T00:00:00.000Z',
  };

  it('should validate event with all required fields', () => {
    expect(() => validateEvent(validEvent)).not.toThrow();
    const result = validateEvent(validEvent);
    expect(result.id).toBe(validEvent.id);
  });

  it('should validate event with optional fields', () => {
    const eventWithOptional = {
      ...validEvent,
      description: 'Test event',
      organizer: 'BWF',
      participants: ['Player 1', 'Player 2'],
      officialUrl: 'https://example.com',
      tier: 'Super 1000',
      status: 'scheduled',
      customFields: { note: 'test' },
    };

    expect(() => validateEvent(eventWithOptional)).not.toThrow();
    const result = validateEvent(eventWithOptional);
    expect(result.description).toBe('Test event');
    expect(result.customFields).toEqual({ note: 'test' });
  });

  it('should throw error for missing required field', () => {
    const invalidEvent = { ...validEvent };
    delete invalidEvent.title;

    expect(() => validateEvent(invalidEvent)).toThrow();
  });

  it('should throw error for invalid date format', () => {
    const invalidEvent = {
      ...validEvent,
      startDate: 'invalid-date',
    };

    expect(() => validateEvent(invalidEvent)).toThrow();
  });

  it('should throw error for invalid level', () => {
    const invalidEvent = {
      ...validEvent,
      level: 'invalid-level',
    };

    expect(() => validateEvent(invalidEvent)).toThrow();
  });

  it('should throw error for invalid status', () => {
    const invalidEvent = {
      ...validEvent,
      status: 'invalid-status',
    };

    expect(() => validateEvent(invalidEvent)).toThrow();
  });

  it('should throw error for invalid URL', () => {
    const invalidEvent = {
      ...validEvent,
      officialUrl: 'not-a-url',
    };

    expect(() => validateEvent(invalidEvent)).toThrow();
  });
});

describe('validateEvents', () => {
  const validEvent1 = {
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
  };

  const validEvent2 = {
    ...validEvent1,
    id: 'event-2',
    title: 'Event 2',
  };

  it('should validate array of valid events', () => {
    const events = [validEvent1, validEvent2];
    expect(() => validateEvents(events)).not.toThrow();
    const result = validateEvents(events);
    expect(result).toHaveLength(2);
  });

  it('should throw error if any event is invalid', () => {
    const invalidEvent = { ...validEvent1 };
    delete invalidEvent.title;

    const events = [validEvent1, invalidEvent];
    expect(() => validateEvents(events)).toThrow(/index 1/);
  });

  it('should handle empty array', () => {
    expect(() => validateEvents([])).not.toThrow();
    const result = validateEvents([]);
    expect(result).toHaveLength(0);
  });
});

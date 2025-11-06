import { describe, it, expect } from 'vitest';
import { generateEventId } from '../../src/utils/id-generator.js';

describe('generateEventId', () => {
  it('should generate id from event data', () => {
    const event = {
      category: 'badminton',
      source: 'bwf',
      startDate: '2025-01-15T09:00:00.000Z',
      title: 'Indonesia Masters 2025',
    };

    const id = generateEventId(event);

    expect(id).toBe('badminton-bwf-2025-01-15-indonesia-masters-2025');
  });

  it('should handle titles with special characters', () => {
    const event = {
      category: 'badminton',
      source: 'bwf',
      startDate: '2025-03-12T09:00:00.000Z',
      title: 'YONEX All England Open 2025!',
    };

    const id = generateEventId(event);

    expect(id).toBe('badminton-bwf-2025-03-12-yonex-all-england-open-2025');
  });

  it('should create url-safe slugs', () => {
    const event = {
      category: 'basketball',
      source: 'fiba',
      startDate: '2025-06-20T09:00:00.000Z',
      title: 'NBA Finals: Game #1 (2025)',
    };

    const id = generateEventId(event);

    expect(id).toBe('basketball-fiba-2025-06-20-nba-finals-game-1-2025');
  });

  it('should handle multiple consecutive special characters', () => {
    const event = {
      category: 'football',
      source: 'fifa',
      startDate: '2025-07-15T09:00:00.000Z',
      title: 'World Cup -- Quarter Finals!!!',
    };

    const id = generateEventId(event);

    expect(id).toBe('football-fifa-2025-07-15-world-cup-quarter-finals');
  });

  it('should handle source URLs with domain', () => {
    const event = {
      category: 'badminton',
      source: 'bwfbadminton.com',
      startDate: '2025-01-15T09:00:00.000Z',
      title: 'Test Event',
    };

    const id = generateEventId(event);

    expect(id).toBe('badminton-bwfbadminton-2025-01-15-test-event');
  });

  it('should generate consistent ids for same event', () => {
    const event = {
      category: 'badminton',
      source: 'bwf',
      startDate: '2025-01-15T09:00:00.000Z',
      title: 'Test Event',
    };

    const id1 = generateEventId(event);
    const id2 = generateEventId(event);

    expect(id1).toBe(id2);
  });

  it('should throw error for missing required fields', () => {
    const invalidEvent1 = {
      source: 'bwf',
      startDate: '2025-01-15T09:00:00.000Z',
      title: 'Test',
    };

    expect(() => generateEventId(invalidEvent1)).toThrow();

    const invalidEvent2 = {
      category: 'badminton',
      startDate: '2025-01-15T09:00:00.000Z',
      title: 'Test',
    };

    expect(() => generateEventId(invalidEvent2)).toThrow();
  });

  it('should handle Chinese characters', () => {
    const event = {
      category: 'badminton',
      source: 'bwf',
      startDate: '2025-01-15T09:00:00.000Z',
      title: '中華台北公開賽 2025',
    };

    const id = generateEventId(event);

    expect(id).toBe('badminton-bwf-2025-01-15-2025');
  });
});

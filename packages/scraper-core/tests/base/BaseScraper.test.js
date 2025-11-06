import { describe, it, expect, vi } from 'vitest';
import { BaseScraper } from '../../src/base/BaseScraper.js';

// Create a test scraper class
class TestScraper extends BaseScraper {
  constructor(config) {
    super(config);
  }

  async scrape() {
    return [
      {
        id: 'test-1',
        title: 'Test Event',
        startDate: '2025-01-15T09:00:00.000Z',
        endDate: '2025-01-15T18:00:00.000Z',
        timezone: 'Asia/Jakarta',
        location: 'Jakarta',
        category: 'badminton',
        level: 'international',
        source: 'test',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z',
        scrapedAt: '2025-01-01T00:00:00.000Z',
      },
    ];
  }
}

describe('BaseScraper', () => {
  it('should create instance with config', () => {
    const scraper = new TestScraper({
      source: 'bwf',
      category: 'badminton',
      url: 'https://example.com',
    });

    expect(scraper.source).toBe('bwf');
    expect(scraper.category).toBe('badminton');
    expect(scraper.url).toBe('https://example.com');
  });

  it('should throw error when scrape() not implemented', async () => {
    class EmptyScraper extends BaseScraper {}

    const scraper = new EmptyScraper({
      source: 'test',
      category: 'test',
      url: 'https://example.com',
    });

    await expect(scraper.scrape()).rejects.toThrow('scrape() must be implemented');
  });

  it('should validate single event', () => {
    const scraper = new TestScraper({
      source: 'test',
      category: 'test',
      url: 'https://example.com',
    });

    const validEvent = {
      id: 'test-1',
      title: 'Test Event',
      startDate: '2025-01-15T09:00:00.000Z',
      endDate: '2025-01-15T18:00:00.000Z',
      timezone: 'Asia/Jakarta',
      location: 'Jakarta',
      category: 'badminton',
      level: 'international',
      source: 'test',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      scrapedAt: '2025-01-01T00:00:00.000Z',
    };

    expect(() => scraper.validateEvent(validEvent)).not.toThrow();
  });

  it('should throw error for invalid event', () => {
    const scraper = new TestScraper({
      source: 'test',
      category: 'test',
      url: 'https://example.com',
    });

    const invalidEvent = {
      id: 'test-1',
      // missing required fields
    };

    expect(() => scraper.validateEvent(invalidEvent)).toThrow();
  });

  it('should validate multiple events', () => {
    const scraper = new TestScraper({
      source: 'test',
      category: 'test',
      url: 'https://example.com',
    });

    const event1 = {
      id: 'test-1',
      title: 'Test Event 1',
      startDate: '2025-01-15T09:00:00.000Z',
      endDate: '2025-01-15T18:00:00.000Z',
      timezone: 'Asia/Jakarta',
      location: 'Jakarta',
      category: 'badminton',
      level: 'international',
      source: 'test',
      createdAt: '2025-01-01T00:00:00.000Z',
      updatedAt: '2025-01-01T00:00:00.000Z',
      scrapedAt: '2025-01-01T00:00:00.000Z',
    };

    const event2 = { ...event1, id: 'test-2', title: 'Test Event 2' };

    expect(() => scraper.validateEvents([event1, event2])).not.toThrow();
  });

  it('should retry failed operations', async () => {
    const scraper = new TestScraper({
      source: 'test',
      category: 'test',
      url: 'https://example.com',
    });

    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValueOnce('success');

    const result = await scraper.retry(fn, 3, 10);

    expect(result).toBe('success');
    expect(fn).toHaveBeenCalledTimes(2);
  });

  it('should allow scrape method to be called', async () => {
    const scraper = new TestScraper({
      source: 'test',
      category: 'test',
      url: 'https://example.com',
    });

    const events = await scraper.scrape();

    expect(events).toHaveLength(1);
    expect(events[0].title).toBe('Test Event');
  });
});

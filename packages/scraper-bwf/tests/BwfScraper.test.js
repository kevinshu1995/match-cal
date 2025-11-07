import { describe, it, expect } from 'vitest';
import { BwfScraper } from '../src/BwfScraper.js';
import { BaseScraper } from '@matchcal/scraper-core';

describe('BwfScraper', () => {
  describe('實例化', () => {
    it('應該可以建立 BwfScraper 實例', () => {
      const scraper = new BwfScraper();
      expect(scraper).toBeInstanceOf(BwfScraper);
    });

    it('應該繼承自 BaseScraper', () => {
      const scraper = new BwfScraper();
      expect(scraper).toBeInstanceOf(BaseScraper);
    });

    it('應該有正確的 config 設定', () => {
      const scraper = new BwfScraper();
      expect(scraper.source).toBe('bwf');
      expect(scraper.category).toBe('badminton');
      expect(scraper.url).toBe('https://bwfbadminton.com/calendar/');
    });
  });

  describe('scrape()', () => {
    it('應該實作 scrape() 方法', () => {
      const scraper = new BwfScraper();
      expect(typeof scraper.scrape).toBe('function');
    });

    it('應該回傳 StandardEvent 陣列', async () => {
      const scraper = new BwfScraper();
      const events = await scraper.scrape();

      expect(Array.isArray(events)).toBe(true);
    });

    it('回傳的事件應該符合 StandardEvent 格式', async () => {
      const scraper = new BwfScraper();
      const events = await scraper.scrape();

      if (events.length > 0) {
        const event = events[0];
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('title');
        expect(event).toHaveProperty('startDate');
        expect(event).toHaveProperty('endDate');
        expect(event).toHaveProperty('category');
        expect(event.category).toBe('badminton');
        expect(event.source).toBe('bwf');
      }
    });
  });
});

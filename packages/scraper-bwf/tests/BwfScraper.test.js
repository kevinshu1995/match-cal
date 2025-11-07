import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { BwfScraper } from '../src/BwfScraper.js';
import { BaseScraper } from '@matchcal/scraper-core';
import apiResponseSample from './fixtures/api-response-sample.json';

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
    let scraper;
    let mockFetchBwfEvents;

    beforeEach(() => {
      scraper = new BwfScraper();
      // Mock fetchBwfEvents 以避免真實網路請求
      mockFetchBwfEvents = vi.spyOn(scraper, 'fetchBwfEvents');
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it('應該實作 scrape() 方法', () => {
      expect(typeof scraper.scrape).toBe('function');
    });

    it('應該回傳 StandardEvent 陣列', async () => {
      // Mock fetchBwfEvents 返回轉換後的資料
      mockFetchBwfEvents.mockResolvedValue(
        scraper.transformApiData(apiResponseSample)
      );

      const events = await scraper.scrape();

      expect(Array.isArray(events)).toBe(true);
      expect(mockFetchBwfEvents).toHaveBeenCalled();
    });

    it('回傳的事件應該符合 StandardEvent 格式', async () => {
      // Mock fetchBwfEvents 返回轉換後的資料
      mockFetchBwfEvents.mockResolvedValue(
        scraper.transformApiData(apiResponseSample)
      );

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

    it('應該處理爬取錯誤', async () => {
      // Mock fetchBwfEvents 拋出錯誤
      const error = new Error('Network error');
      mockFetchBwfEvents.mockRejectedValue(error);

      await expect(scraper.scrape()).rejects.toThrow('Network error');
    });
  });

  describe('transformApiData()', () => {
    it('應該將 API 回應轉換為內部格式', () => {
      const scraper = new BwfScraper();
      const result = scraper.transformApiData(apiResponseSample);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(3); // fixtures 中有 3 筆賽事
    });

    it('應該正確對應欄位', () => {
      const scraper = new BwfScraper();
      const result = scraper.transformApiData(apiResponseSample);
      const firstEvent = result[0];

      expect(firstEvent.name).toBe('PETRONAS Malaysia Open 2025');
      expect(firstEvent.startDate).toBe('2025-01-07');
      expect(firstEvent.endDate).toBe('2025-01-12');
      expect(firstEvent.location).toBe('Kuala Lumpur, Malaysia');
      expect(firstEvent.url).toBe('https://bwfworldtour.bwfbadminton.com/tournament/5222/petronas-malaysia-open-2025/results/');
    });

    it('應該從 category 提取 tier', () => {
      const scraper = new BwfScraper();
      const result = scraper.transformApiData(apiResponseSample);

      expect(result[0].tier).toBe('Super 1000');
      expect(result[1].tier).toBe('Super 750');
      expect(result[2].tier).toBe('Super 500');
    });

    it('應該處理日期格式（去除時間部分）', () => {
      const scraper = new BwfScraper();
      const result = scraper.transformApiData(apiResponseSample);
      const firstEvent = result[0];

      // 確認日期格式是 YYYY-MM-DD（沒有時間）
      expect(firstEvent.startDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(firstEvent.endDate).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    });

    it('應該展平 results 和 tournaments 結構', () => {
      const scraper = new BwfScraper();
      const result = scraper.transformApiData(apiResponseSample);

      // 確認是單一陣列，不是巢狀結構
      expect(result.every(event => !event.tournaments)).toBe(true);
    });

    it('應該處理空資料', () => {
      const scraper = new BwfScraper();
      const emptyData = { results: [] };
      const result = scraper.transformApiData(emptyData);

      expect(Array.isArray(result)).toBe(true);
      expect(result.length).toBe(0);
    });
  });

  describe('extractTier()', () => {
    it('應該從 category 提取 Super XXX', () => {
      const scraper = new BwfScraper();

      expect(scraper.extractTier('HSBC BWF World Tour Super 1000')).toBe('Super 1000');
      expect(scraper.extractTier('HSBC BWF World Tour Super 750')).toBe('Super 750');
      expect(scraper.extractTier('HSBC BWF World Tour Super 500')).toBe('Super 500');
      expect(scraper.extractTier('BWF Tour Super 100')).toBe('Super 100');
    });

    it('當無法提取時應該回傳原始 category', () => {
      const scraper = new BwfScraper();

      expect(scraper.extractTier('Grade 1 – Team Tournaments')).toBe('Grade 1 – Team Tournaments');
      expect(scraper.extractTier('Other Category')).toBe('Other Category');
    });
  });
});

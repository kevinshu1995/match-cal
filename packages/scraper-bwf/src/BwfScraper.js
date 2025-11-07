import { BaseScraper } from '@matchcal/scraper-core';
import { transformBwfEvent } from './transformer.js';

/**
 * BWF 羽球賽事爬蟲
 * 爬取 https://bwfbadminton.com/calendar/ 的賽事資訊
 */
export class BwfScraper extends BaseScraper {
  constructor() {
    super({
      source: 'bwf',
      category: 'badminton',
      url: 'https://bwfbadminton.com/calendar/',
    });
  }

  /**
   * 爬取賽事資料
   * @returns {Promise<StandardEvent[]>} 賽事陣列
   */
  async scrape() {
    try {
      // 使用 retry 機制爬取資料
      const rawEvents = await this.retry(async () => {
        return await this.fetchBwfEvents();
      });

      // 轉換為 StandardEvent 格式
      const events = rawEvents.map(event => transformBwfEvent(event));

      // 驗證資料
      return this.validateEvents(events);
    } catch (error) {
      console.error('Failed to scrape BWF events:', error);
      throw error;
    }
  }

  /**
   * 從 BWF 網站爬取原始資料
   * TODO: 實作真實的 Puppeteer 爬蟲
   * 目前使用 mock 資料驗證流程
   * @returns {Promise<Object[]>} 原始賽事資料
   */
  async fetchBwfEvents() {
    // Mock 資料（用於驗證流程）
    // TODO: 替換成真實的 Puppeteer 爬取邏輯
    return [
      {
        name: '2025 Indonesia Masters',
        startDate: '2025-01-15',
        endDate: '2025-01-22',
        location: 'Jakarta, Indonesia',
        tier: 'Super 1000',
        url: 'https://bwfbadminton.com/tournament/2025-indonesia-masters',
      },
      {
        name: '2025 Malaysia Open',
        startDate: '2025-02-10',
        endDate: '2025-02-17',
        location: 'Kuala Lumpur, Malaysia',
        tier: 'Super 750',
        url: 'https://bwfbadminton.com/tournament/2025-malaysia-open',
      },
      {
        name: '2025 All England Open',
        startDate: '2025-03-12',
        endDate: '2025-03-19',
        location: 'Birmingham, England',
        tier: 'Super 1000',
        url: 'https://bwfbadminton.com/tournament/2025-all-england-open',
      },
    ];
  }
}

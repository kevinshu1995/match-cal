import { BaseScraper } from '@matchcal/scraper-core';
import { transformBwfEvent } from './transformer.js';
import puppeteer from 'puppeteer';

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
   * 使用 Puppeteer 攔截 API 請求取得真實資料
   * @returns {Promise<Object[]>} 原始賽事資料
   */
  async fetchBwfEvents() {
    const browser = await puppeteer.launch({
      headless: true,
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
      ],
    });

    try {
      const page = await browser.newPage();

      // 設定 User-Agent 避免被偵測為爬蟲
      await page.setUserAgent(
        'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
        'AppleWebKit/537.36 (KHTML, like Gecko) ' +
        'Chrome/120.0.0.0 Safari/537.36'
      );

      // 攔截 API 回應
      let apiData = null;
      page.on('response', async (response) => {
        const url = response.url();
        if (url.includes('vue-grouped-year-tournaments')) {
          try {
            // 只處理 POST 請求，避免 preflight OPTIONS 請求
            if (response.request().method() === 'POST') {
              apiData = await response.json();
            }
          } catch (error) {
            // 忽略 preflight 請求的錯誤
            if (!error.message.includes('preflight')) {
              console.error('Failed to parse API response:', error.message);
            }
          }
        }
      });

      // 導航到頁面，觸發 API 請求
      await page.goto(this.url, {
        waitUntil: 'networkidle2',
        timeout: 30000,
      });

      // 等待 API 回應（使用 setTimeout 替代已棄用的 waitForTimeout）
      await new Promise(resolve => setTimeout(resolve, 3000));

      if (!apiData) {
        throw new Error('Failed to intercept API response');
      }

      // 轉換 API 資料格式
      return this.transformApiData(apiData);
    } finally {
      await browser.close();
    }
  }

  /**
   * 將 API 回應轉換為內部格式
   * @param {Object} apiData - API 原始回應
   * @returns {Array} 轉換後的賽事陣列
   */
  transformApiData(apiData) {
    const events = [];

    // 遍歷所有月份
    for (const monthData of apiData.results) {
      // 遍歷該月份的所有賽事
      for (const tournament of monthData.tournaments) {
        events.push({
          name: tournament.name,
          startDate: tournament.start_date.split(' ')[0], // 只取日期部分
          endDate: tournament.end_date.split(' ')[0],
          location: tournament.location,
          tier: this.extractTier(tournament.category), // 從 category 提取等級
          url: tournament.url,
        });
      }
    }

    return events;
  }

  /**
   * 從 category 提取賽事等級
   * 例：「HSBC BWF World Tour Super 1000」→「Super 1000」
   * @param {string} category - 賽事分類
   * @returns {string} 賽事等級
   */
  extractTier(category) {
    const match = category.match(/Super \d+/);
    return match ? match[0] : category;
  }
}

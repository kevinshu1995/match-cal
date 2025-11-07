#!/usr/bin/env node

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { BwfScraper } from './BwfScraper.js';
import { JsonManager } from '@matchcal/json-manager';
import { IcsGenerator } from '@matchcal/ics-generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * BWF 爬蟲 CLI 工具
 * 執行爬取、儲存 JSON、生成 ICS 的完整流程
 */
async function main() {
  console.log('🏸 開始爬取 BWF 羽球賽事...\n');

  try {
    // 步驟 1：爬取資料
    console.log('📥 步驟 1/3：爬取賽事資料...');
    const scraper = new BwfScraper();
    const events = await scraper.scrape();
    console.log(`✅ 成功爬取 ${events.length} 個賽事\n`);

    // 設定輸出路徑
    const dataDir = join(__dirname, '..', '..', '..', 'data', 'badminton');
    const jsonPath = join(dataDir, 'bwf-2025.json');
    const icsPath = join(dataDir, 'bwf-2025.ics');

    // 步驟 2：儲存 JSON
    console.log('💾 步驟 2/3：儲存 JSON 檔案...');
    const jsonManager = new JsonManager();
    await jsonManager.write(jsonPath, events, {
      category: 'badminton',
      source: 'bwf',
      sourceUrl: 'https://bwfbadminton.com/calendar/',
    });
    console.log(`✅ JSON 已儲存至：${jsonPath}\n`);

    // 步驟 3：生成 ICS
    console.log('📅 步驟 3/3：生成 ICS 檔案...');
    const icsGenerator = new IcsGenerator({
      calendarName: 'BWF 羽球賽事 2025',
      description: '世界羽聯（BWF）官方賽事行事曆',
      timezone: 'UTC',
    });
    await icsGenerator.generate(icsPath, events);
    console.log(`✅ ICS 已生成至：${icsPath}\n`);

    // 完成
    console.log('🎉 完成！');
    console.log('\n📊 統計：');
    console.log(`   - 賽事數量：${events.length}`);
    console.log(`   - JSON 檔案：${jsonPath}`);
    console.log(`   - ICS 檔案：${icsPath}`);

  } catch (error) {
    console.error('\n❌ 錯誤：', error.message);
    process.exit(1);
  }
}

// 執行
main();

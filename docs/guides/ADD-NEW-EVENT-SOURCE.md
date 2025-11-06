# 新增賽事來源流程

> 完整的賽事來源新增指南，從頭到尾一步步教你如何新增新的賽事爬蟲

---

## 📋 目錄

1. [概覽](#概覽)
2. [前置需求](#前置需求)
3. [完整流程](#完整流程)
4. [測試檢查清單](#測試檢查清單)
5. [範例：新增籃球賽事](#範例新增籃球賽事)
6. [常見問題](#常見問題)

---

## 概覽

### 為什麼容易擴充？

本專案採用**低耦合設計**，新增賽事來源只需：

1. ✅ 建立一個新的 scraper package
2. ✅ 實作爬蟲邏輯（繼承 `BaseScraper`）
3. ✅ 設定排程與分類
4. ❌ **不需要修改**核心框架（`scraper-core`、`json-manager`、`ics-generator`）
5. ❌ **不需要修改**前端核心邏輯

### 新增賽事架構圖

```
1. 建立 Package
   packages/scraper-{event}/

2. 實作 Scraper（TDD）
   繼承 BaseScraper
   實作 scrape() 與 transform()

3. 設定資料輸出
   data/{category}/

4. 設定排程
   .github/workflows/scrape-{event}.yml

5. 前端設定
   data/categories.json

6. 測試整合
   手動執行 + 驗證輸出
```

---

## 前置需求

### 你需要準備

1. **目標賽事網站**
   - 網址（例如：https://www.fiba.basketball/competitions）
   - 網站結構（靜態 HTML 或需要 JavaScript 渲染）
   - 資料格式（HTML、JSON、XML 等）

2. **賽事分類資訊**
   - 運動種類（例如：basketball、football）
   - 賽事級別（例如：international、professional）
   - 時區資訊

3. **開發環境**
   - 已完成階段 1（`scraper-core`、`json-manager`、`ics-generator`）
   - 測試環境可正常運作

---

## 完整流程

### Step 1：建立新 Scraper Package

#### 1.1 複製範本

```bash
# 從 scraper-bwf 複製結構
cp -r packages/scraper-bwf packages/scraper-{event-name}
cd packages/scraper-{event-name}
```

#### 1.2 修改 package.json

```json
{
  "name": "@matchcal/scraper-{event-name}",
  "version": "0.1.0",
  "description": "{Event Name} event scraper",
  "main": "src/index.js",
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "scrape": "node src/cli.js"
  },
  "dependencies": {
    "@matchcal/scraper-core": "workspace:*",
    "@matchcal/json-manager": "workspace:*",
    "@matchcal/ics-generator": "workspace:*",
    "puppeteer": "^23.0.0"
  },
  "devDependencies": {
    "vitest": "^2.0.0"
  }
}
```

#### 1.3 建立目錄結構

```
packages/scraper-{event-name}/
├── src/
│   ├── index.js         # 主要輸出
│   ├── scraper.js       # 爬蟲實作
│   ├── transformer.js   # 資料轉換
│   └── cli.js           # CLI 執行檔
├── tests/
│   ├── scraper.test.js
│   └── transformer.test.js
├── package.json
└── SPEC.md
```

---

### Step 2：實作 Scraper（遵循 TDD）

#### 2.1 撰寫 SPEC.md

先定義這個 scraper 的規格：

```markdown
# Scraper {Event Name} 規格

## 職責
爬取 {Event Name} 官方網站的賽事資訊

## 資料來源
- URL: https://example.com/events
- 格式: HTML（或 JSON/XML）
- 更新頻率: 每天

## 輸出
- JSON: /data/{category}/{source}-2025.json
- ICS: /data/{category}/{source}-2025.ics

## API

### EventScraper.scrape()
爬取並返回 StandardEvent 陣列

### EventTransformer.transform(rawData)
轉換原始資料為 StandardEvent
```

#### 2.2 🔴 RED：寫失敗測試

```javascript
// tests/scraper.test.js
import { describe, it, expect } from 'vitest';
import { EventScraper } from '../src/scraper.js';

describe('EventScraper', () => {
  it('should scrape events and return array', async () => {
    const scraper = new EventScraper();
    const events = await scraper.scrape();

    expect(Array.isArray(events)).toBe(true);
  });

  it('should return events with standard schema', async () => {
    const scraper = new EventScraper();
    const events = await scraper.scrape();

    const firstEvent = events[0];
    expect(firstEvent).toHaveProperty('id');
    expect(firstEvent).toHaveProperty('title');
    expect(firstEvent).toHaveProperty('startDate');
    expect(firstEvent).toHaveProperty('endDate');
    expect(firstEvent).toHaveProperty('category');
  });
});
```

執行 `pnpm test` → ❌ 失敗

#### 2.3 🟢 GREEN：實作 Scraper

```javascript
// src/scraper.js
import { BaseScraper } from '@matchcal/scraper-core';
import { EventTransformer } from './transformer.js';
import puppeteer from 'puppeteer';

export class EventScraper extends BaseScraper {
  constructor() {
    super({
      source: '{source-name}',
      category: '{category}',
      url: 'https://example.com/events'
    });
    this.transformer = new EventTransformer();
  }

  async scrape() {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
      await page.goto(this.url, { waitUntil: 'networkidle2' });

      // 爬取資料
      const rawData = await page.evaluate(() => {
        // 實作爬取邏輯
        // 返回原始資料陣列
        return [];
      });

      await browser.close();

      // 轉換為 StandardEvent 格式
      return rawData.map(item => this.transformer.transform(item));
    } catch (error) {
      await browser.close();
      throw error;
    }
  }
}
```

```javascript
// src/transformer.js
import { generateEventId } from '@matchcal/scraper-core';

export class EventTransformer {
  transform(rawData) {
    // 實作轉換邏輯
    const event = {
      title: rawData.name,
      startDate: new Date(rawData.start).toISOString(),
      endDate: new Date(rawData.end).toISOString(),
      timezone: 'Asia/Taipei',
      location: rawData.location,
      category: 'basketball',
      level: 'international',
      source: 'fiba',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
    };

    // 生成 ID
    event.id = generateEventId(event);

    return event;
  }
}
```

執行 `pnpm test` → ✅ 通過

#### 2.4 🔵 REFACTOR：改善程式碼

- 提取重複邏輯
- 改善命名
- 加入錯誤處理

---

### Step 3：設定資料輸出

#### 3.1 建立資料目錄

```bash
mkdir -p data/{category}
```

例如：
```bash
mkdir -p data/basketball
```

#### 3.2 建立 CLI 執行檔

```javascript
// src/cli.js
import { EventScraper } from './scraper.js';
import { JsonManager } from '@matchcal/json-manager';
import { IcsGenerator } from '@matchcal/ics-generator';
import path from 'path';

async function main() {
  try {
    console.log('Starting scraper...');

    // 爬取資料
    const scraper = new EventScraper();
    const events = await scraper.scrape();

    console.log(`Scraped ${events.length} events`);

    // 輸出路徑
    const dataDir = path.resolve(process.cwd(), '../../data/{category}');
    const jsonPath = path.join(dataDir, '{source}-2025.json');
    const icsPath = path.join(dataDir, '{source}-2025.ics');

    // 儲存 JSON
    const jsonManager = new JsonManager();
    await jsonManager.write(jsonPath, events);
    console.log(`JSON saved to ${jsonPath}`);

    // 生成 ICS
    const icsGenerator = new IcsGenerator();
    await icsGenerator.generate(icsPath, events);
    console.log(`ICS saved to ${icsPath}`);

    console.log('✅ Scraping completed successfully');
  } catch (error) {
    console.error('❌ Scraping failed:', error);
    process.exit(1);
  }
}

main();
```

#### 3.3 測試手動執行

```bash
pnpm --filter @matchcal/scraper-{event} scrape
```

驗證：
- `/data/{category}/{source}-2025.json` 已生成
- `/data/{category}/{source}-2025.ics` 已生成

---

### Step 4：設定 GitHub Actions 排程

#### 4.1 建立 workflow 檔案

```yaml
# .github/workflows/scrape-{event}.yml
name: Scrape {Event Name} Events

on:
  schedule:
    # 每天 UTC 00:00 執行
    - cron: '0 0 * * *'
  workflow_dispatch:  # 允許手動觸發

jobs:
  scrape:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 9

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install

      - name: Run scraper
        run: pnpm --filter @matchcal/scraper-{event} scrape

      - name: Commit and push changes
        run: |
          git config user.name "GitHub Actions"
          git config user.email "actions@github.com"
          git add data/
          git commit -m "chore: update {event-name} events data [skip ci]" || exit 0
          git push
```

#### 4.2 測試手動觸發

在 GitHub Actions 頁面點擊「Run workflow」測試。

---

### Step 5：前端設定

#### 5.1 更新 categories.json

```json
{
  "categories": [
    {
      "id": "basketball",
      "name": "籃球",
      "nameEn": "Basketball",
      "icon": "🏀",
      "color": "#F59E0B",
      "description": "國際籃球賽事",
      "sources": [
        {
          "id": "fiba",
          "name": "FIBA 官方賽程",
          "dataFile": "/data/basketball/fiba-2025.json",
          "icsFile": "/data/basketball/fiba-2025.ics"
        }
      ]
    }
  ]
}
```

#### 5.2 測試前端顯示

```bash
pnpm --filter @matchcal/web dev
```

訪問 http://localhost:3000，確認新分類顯示正確。

---

### Step 6：整合測試

#### 6.1 測試檢查清單

使用下方的[測試檢查清單](#測試檢查清單)逐項驗證。

#### 6.2 寫整合測試（可選）

```javascript
// tests/integration.test.js
import { describe, it, expect } from 'vitest';
import { EventScraper } from '../src/scraper.js';
import { validateEvents } from '@matchcal/scraper-core';
import fs from 'fs/promises';

describe('Integration Test', () => {
  it('should scrape, transform, and save data', async () => {
    // Scrape
    const scraper = new EventScraper();
    const events = await scraper.scrape();

    // Validate
    expect(events.length).toBeGreaterThan(0);
    expect(() => validateEvents(events)).not.toThrow();

    // Check JSON file exists
    const jsonExists = await fs.access('../../data/{category}/{source}-2025.json')
      .then(() => true)
      .catch(() => false);
    expect(jsonExists).toBe(true);

    // Check ICS file exists
    const icsExists = await fs.access('../../data/{category}/{source}-2025.ics')
      .then(() => true)
      .catch(() => false);
    expect(icsExists).toBe(true);
  });
});
```

---

## 測試檢查清單

### ✅ Scraper 功能測試

- [ ] **Scraper 單元測試通過**
  ```bash
  pnpm --filter @matchcal/scraper-{event} test
  ```

- [ ] **資料符合 StandardEvent Schema**
  - [ ] 所有必要欄位存在（id, title, startDate, endDate, timezone, location, category, level, source）
  - [ ] 日期格式正確（ISO 8601）
  - [ ] timezone 為有效的 IANA timezone
  - [ ] id 格式正確（`{category}-{source}-{date}-{slug}`）

- [ ] **手動執行爬蟲成功**
  ```bash
  pnpm --filter @matchcal/scraper-{event} scrape
  ```

### ✅ 資料輸出測試

- [ ] **JSON 檔案正確生成**
  - [ ] 檔案存在於 `/data/{category}/{source}-2025.json`
  - [ ] 檔案包含 `meta` 與 `events` 欄位
  - [ ] `meta.eventCount` 正確
  - [ ] 所有 events 符合 StandardEvent 格式

- [ ] **ICS 檔案正確生成**
  - [ ] 檔案存在於 `/data/{category}/{source}-2025.ics`
  - [ ] 檔案符合 RFC 5545 規範
  - [ ] 包含 `BEGIN:VCALENDAR` 和 `END:VCALENDAR`
  - [ ] 每個賽事有對應的 `VEVENT`

- [ ] **ICS 檔案可被行事曆軟體讀取**
  - [ ] Google Calendar 可匯入
  - [ ] Apple Calendar 可匯入
  - [ ] Outlook 可匯入

### ✅ 前端整合測試

- [ ] **分類顯示正確**
  - [ ] 新分類出現在首頁
  - [ ] 分類圖示與顏色正確
  - [ ] 分類名稱正確（中英文）

- [ ] **賽事列表顯示正確**
  - [ ] 點擊分類後顯示賽事列表
  - [ ] 賽事資訊完整（標題、時間、地點）
  - [ ] 時間格式正確（本地化顯示）

- [ ] **訂閱功能正常**
  - [ ] 可下載 ICS 檔案
  - [ ] 訂閱連結正確（Webcal）
  - [ ] 訂閱後行事曆自動同步

### ✅ GitHub Actions 測試

- [ ] **排程任務正常執行**
  - [ ] 手動觸發 workflow 成功
  - [ ] 資料自動更新
  - [ ] 自動 commit 並 push

- [ ] **錯誤處理正常運作**
  - [ ] 爬蟲失敗時有錯誤訊息
  - [ ] 失敗時不 commit 錯誤資料
  - [ ] GitHub Actions logs 可查看錯誤

### ✅ 程式碼品質測試

- [ ] **所有測試通過**
  ```bash
  pnpm test
  ```

- [ ] **Linter 檢查通過**
  ```bash
  pnpm lint
  ```

- [ ] **測試覆蓋率達標**（目標 80%+）
  ```bash
  pnpm test:coverage
  ```

---

## 範例：新增籃球賽事

### 場景

新增 FIBA 籃球賽事來源：https://www.fiba.basketball/competitions

### Step 1：建立 Package

```bash
cp -r packages/scraper-bwf packages/scraper-fiba
cd packages/scraper-fiba
```

### Step 2：修改 package.json

```json
{
  "name": "@matchcal/scraper-fiba",
  "description": "FIBA basketball event scraper"
}
```

### Step 3：實作 Scraper

```javascript
// src/scraper.js
export class FibaScraper extends BaseScraper {
  constructor() {
    super({
      source: 'fiba',
      category: 'basketball',
      url: 'https://www.fiba.basketball/competitions'
    });
  }

  async scrape() {
    // 實作爬取邏輯
  }
}
```

### Step 4：建立資料目錄

```bash
mkdir -p data/basketball
```

### Step 5：設定排程

```yaml
# .github/workflows/scrape-fiba.yml
name: Scrape FIBA Events
on:
  schedule:
    - cron: '0 0 * * *'
```

### Step 6：更新分類

```json
{
  "categories": [
    {
      "id": "basketball",
      "name": "籃球",
      "icon": "🏀",
      "sources": [
        {
          "id": "fiba",
          "name": "FIBA 官方賽程",
          "dataFile": "/data/basketball/fiba-2025.json",
          "icsFile": "/data/basketball/fiba-2025.ics"
        }
      ]
    }
  ]
}
```

### Step 7：測試

```bash
# 執行爬蟲
pnpm --filter @matchcal/scraper-fiba scrape

# 檢查輸出
ls data/basketball/

# 啟動前端
pnpm --filter @matchcal/web dev
```

✅ 完成！

---

## 常見問題

### Q: 需要修改 scraper-core 嗎？

A: **不需要**。`scraper-core` 是通用框架，新增賽事只需繼承 `BaseScraper`。

### Q: 如何處理需要登入的網站？

A: 在 scraper 中使用 Puppeteer 處理登入流程，或使用環境變數儲存憑證。

### Q: 如何處理分頁資料？

A: 在 `scrape()` 方法中實作分頁邏輯：

```javascript
async scrape() {
  const allEvents = [];
  let page = 1;

  while (true) {
    const events = await this.scrapePage(page);
    if (events.length === 0) break;

    allEvents.push(...events);
    page++;
  }

  return allEvents;
}
```

### Q: 如何測試爬蟲不會被封鎖？

A:
- 設定合理的 delay
- 使用隨機 User-Agent
- 遵守 robots.txt
- 避免過度請求

### Q: 自訂欄位會被覆蓋嗎？

A: **不會**。`json-manager` 會保留 `customFields` 中的所有手動新增欄位。

### Q: 可以同時支援多個資料來源嗎？

A: 可以。在同一個 category 下建立多個 scraper packages，例如：
- `packages/scraper-fiba`（FIBA 官方）
- `packages/scraper-nba`（NBA 官方）

兩者都輸出到 `data/basketball/`，前端會合併顯示。

---

## 📚 相關文件

- [資料格式規範](../technical/DATA-SCHEMA.md)
- [爬蟲介面](../technical/SCRAPER-INTERFACE.md)
- [TDD 工作流程](TDD-WORKFLOW.md)
- [系統架構](../ARCHITECTURE.md)

---

🎯 **輕鬆新增賽事來源，擴充專案功能！**

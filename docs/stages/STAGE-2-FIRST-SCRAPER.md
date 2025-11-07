# 階段 2：第一個資料源（scraper-bwf）

> 使用核心框架實作第一個實際爬蟲，驗證架構設計

**狀態：✅ 已完成**（使用 mock 資料驗證流程）

> ⚠️ **注意**：本階段使用 mock 資料完成架構驗證。真實 API 爬取請參考 [階段 2.1](STAGE-2.1-BWF-CORRECTION.md)。

---

## 📋 階段資訊

| 項目 | 內容 |
|------|------|
| 階段名稱 | 階段 2：第一個資料源（scraper-bwf） |
| 實際工期 | 1 天 |
| 涉及 Packages | scraper-bwf |
| 前置需求 | 階段 1 完成（scraper-core, json-manager, ics-generator） |
| 輸出 | BWF 羽球賽事資料（JSON + ICS，mock 資料） |
| 完成日期 | 2025-11-07 |

---

## 🎯 階段目標

實作第一個實際的爬蟲，爬取 BWF（世界羽聯）賽事資料，並驗證階段 1 建立的核心框架是否可用。

**為什麼選擇 BWF**：
- 公開的賽程資訊
- 資料結構相對規範
- 適合作為第一個爬蟲範例
- 驗證核心框架設計

---

## 📅 主要任務

### 1. 分析 BWF 網站（1 天）

- [ ] 研究 BWF 官方賽程頁面結構
- [ ] 確認資料來源格式（JSON/XML/HTML）
- [ ] 設計爬取策略（靜態/動態渲染）
- [ ] 確認更新頻率與排程設定

**參考資源**：
- BWF 官網：https://bwf.tournamentsoftware.com/
- 確認是否需要 Puppeteer（動態渲染）或只需 Axios（靜態資料）

---

### 2. 建立 Package 結構（0.5 天）

- [ ] 建立 `packages/scraper-bwf/` 目錄
- [ ] 設定 `package.json`（依賴 scraper-core）
- [ ] 建立 `src/` 和 `tests/` 目錄
- [ ] 建立 `SPEC.md` 規格文件

**目錄結構**：
```
packages/scraper-bwf/
├── package.json
├── SPEC.md
├── src/
│   ├── BwfScraper.ts          # 主爬蟲類別
│   ├── parsers/
│   │   └── eventParser.ts     # 解析賽事資料
│   └── config/
│       └── scraper.config.ts  # 爬蟲設定
└── tests/
    ├── BwfScraper.test.ts
    └── fixtures/              # 測試用假資料
```

---

### 3. TDD 實作爬蟲（2.5 天）

遵循 TDD 循環：🔴 RED → 🟢 GREEN → 🔵 REFACTOR

#### 3.1 繼承 BaseScraper

```typescript
// src/BwfScraper.ts
import { BaseScraper } from '@matchcal/scraper-core';

export class BwfScraper extends BaseScraper {
  async scrape(): Promise<StandardEvent[]> {
    // TODO: TDD 實作
  }
}
```

**測試先行**：
- [ ] 測試 BwfScraper 可被實例化
- [ ] 測試 scrape() 回傳 StandardEvent[]
- [ ] 測試錯誤處理（網路失敗、解析失敗）

---

#### 3.2 實作 HTML/JSON 解析

```typescript
// src/parsers/eventParser.ts
export function parseEvent(rawData: any): StandardEvent {
  // TODO: TDD 實作
}
```

**測試先行**：
- [ ] 測試解析單一賽事資料
- [ ] 測試處理缺失欄位
- [ ] 測試日期格式轉換
- [ ] 測試時區處理

---

#### 3.3 整合核心框架

```typescript
// 使用 json-manager 儲存資料
import { JsonManager } from '@matchcal/json-manager';

// 使用 ics-generator 生成行事曆
import { IcsGenerator } from '@matchcal/ics-generator';
```

**測試先行**：
- [ ] 測試呼叫 JsonManager.write()
- [ ] 測試呼叫 IcsGenerator.generate()
- [ ] 測試完整流程：爬取 → 儲存 JSON → 生成 ICS

---

### 4. 設定排程（0.5 天）

- [ ] 使用 scraper-core 的 Scheduler
- [ ] 設定 cron 表達式（例：每天 02:00 執行）
- [ ] 測試排程器可正確觸發

```typescript
// src/config/scraper.config.ts
export const scraperConfig = {
  schedule: '0 2 * * *', // 每天凌晨 2 點
  timezone: 'Asia/Taipei',
  retryAttempts: 3,
};
```

---

### 5. 整合測試（0.5 天）

- [ ] 測試完整爬取流程
- [ ] 驗證輸出 JSON 格式正確
- [ ] 驗證輸出 ICS 可被行事曆軟體讀取
- [ ] 測試錯誤處理與重試

**整合測試範例**：
```javascript
describe('BWF Scraper Integration', () => {
  it('should scrape, save JSON, and generate ICS', async () => {
    const scraper = new BwfScraper();
    const events = await scraper.scrape();

    // 驗證資料
    expect(events.length).toBeGreaterThan(0);
    expect(events[0]).toMatchObject({
      id: expect.any(String),
      title: expect.any(String),
      startDate: expect.any(String),
    });

    // 儲存 JSON
    const jsonManager = new JsonManager();
    await jsonManager.write('data/bwf/events.json', events);

    // 生成 ICS
    const icsGenerator = new IcsGenerator();
    await icsGenerator.generate('data/bwf/badminton.ics', events);
  });
});
```

---

## 🔄 開發流程

### Step 1：分析目標網站

```bash
# 手動瀏覽 BWF 網站，記錄：
# - 資料格式（JSON/HTML）
# - 資料欄位
# - 更新頻率
```

### Step 2：建立 Package

```bash
cd packages
mkdir scraper-bwf
cd scraper-bwf
pnpm init
```

### Step 3：TDD 開發

遵循 [TDD 工作流程](../guides/TDD-WORKFLOW.md)：

1. 🔴 **RED**：寫失敗測試
2. 🟢 **GREEN**：最小實作
3. 🔵 **REFACTOR**：重構優化

### Step 4：本地測試

```bash
# 執行測試
pnpm --filter @matchcal/scraper-bwf test

# 執行爬蟲
pnpm --filter @matchcal/scraper-bwf dev
```

### Step 5：驗證輸出

```bash
# 檢查 JSON 檔案
cat data/bwf/events.json

# 匯入 ICS 到行事曆軟體測試
open data/bwf/badminton.ics
```

### Step 6：更新文件

- [ ] 更新 `CURRENT-STAGE.md` 任務勾選
- [ ] 撰寫 `packages/scraper-bwf/SPEC.md`
- [ ] 更新 `README.md`（如有需要）

---

## 🧪 測試策略

### 單元測試

**測試重點**：
- BwfScraper 繼承 BaseScraper
- parseEvent() 正確解析資料
- 錯誤處理與重試機制
- 排程器設定正確

**測試範例**：
```javascript
describe('BwfScraper', () => {
  it('should extend BaseScraper', () => {
    const scraper = new BwfScraper();
    expect(scraper).toBeInstanceOf(BaseScraper);
  });

  it('should parse event correctly', () => {
    const rawData = {
      name: '2025 世界羽球錦標賽',
      start: '2025-05-15',
      end: '2025-05-22',
      location: '台北',
    };

    const event = parseEvent(rawData);
    expect(event.title).toBe('2025 世界羽球錦標賽');
    expect(event.category).toBe('badminton');
  });
});
```

### 整合測試

- 測試完整流程：爬取 → 儲存 → 生成
- 使用 fixtures 模擬 HTTP 回應（避免真實爬取）
- 驗證輸出檔案格式

### 手動測試

- [ ] 匯入 ICS 到 Google Calendar
- [ ] 匯入 ICS 到 Apple Calendar
- [ ] 匯入 ICS 到 Outlook
- [ ] 驗證時區正確
- [ ] 驗證提醒功能

---

## 📦 Package 依賴

```json
// packages/scraper-bwf/package.json
{
  "name": "@matchcal/scraper-bwf",
  "version": "0.1.0",
  "dependencies": {
    "@matchcal/scraper-core": "workspace:*",
    "@matchcal/json-manager": "workspace:*",
    "@matchcal/ics-generator": "workspace:*",
    "axios": "^1.6.0",
    "cheerio": "^1.0.0"  // 如果需要解析 HTML
  },
  "devDependencies": {
    "vitest": "^1.0.0"
  }
}
```

---

## ✅ 階段完成標準

### 功能完成

- [ ] BwfScraper 可成功爬取賽事資料
- [ ] 資料符合 StandardEvent 格式
- [ ] 可儲存為 JSON 檔案
- [ ] 可生成 ICS 檔案
- [ ] 排程器設定完成

### 測試完成

- [ ] 單元測試覆蓋率 ≥ 80%
- [ ] 整合測試通過
- [ ] 手動測試通過（ICS 可被行事曆軟體讀取）

### 文件完成

- [ ] `packages/scraper-bwf/SPEC.md` 完成
- [ ] 範例程式碼齊全
- [ ] README 更新

### 輸出驗證

- [ ] `data/bwf/events.json` 生成成功
- [ ] `data/bwf/badminton.ics` 生成成功
- [ ] JSON 格式符合 [JSON Schema](../technical/JSON-SCHEMA.md)
- [ ] ICS 格式符合 [ICS 規格](../technical/ICS-SPEC.md)

---

## 🚨 常見問題

### Q: BWF 網站使用動態渲染，Axios 抓不到資料怎麼辦？

A: 改用 Puppeteer：

```bash
pnpm add puppeteer
```

```typescript
import puppeteer from 'puppeteer';

async scrape() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://bwf.tournamentsoftware.com/');
  // ...
}
```

### Q: 爬取速度太慢怎麼辦？

A: 加入快取機制：
- 檢查 `data/bwf/events.json` 是否已存在
- 只爬取新增或更新的賽事
- 使用 `scrapedAt` 欄位判斷是否需要更新

### Q: 賽事資料缺失某些欄位怎麼辦？

A: 提供預設值：

```typescript
const event: StandardEvent = {
  ...requiredFields,
  location: rawData.location || '待公布',
  description: rawData.description || '',
};
```

### Q: 測試時不想真實爬取網站怎麼辦？

A: 使用 fixtures：

```typescript
// tests/fixtures/bwf-response.json
export const mockBwfResponse = { /* ... */ };

// tests/BwfScraper.test.ts
vi.mock('axios', () => ({
  get: vi.fn(() => Promise.resolve({ data: mockBwfResponse })),
}));
```

---

## 📚 相關文件

- [scraper-bwf 規格](../../packages/scraper-bwf/SPEC.md)
- [scraper-core 規格](../../packages/scraper-core/SPEC.md)
- [資料格式規範](../technical/DATA-SCHEMA.md)
- [TDD 工作流程](../guides/TDD-WORKFLOW.md)
- [開發指南](../DEVELOPMENT-GUIDE.md)

---

## ✅ 階段完成總結

- ✅ 成功驗證核心框架（scraper-core, json-manager, ics-generator）可正常整合
- ✅ 建立完整的 scraper-bwf 架構
- ✅ 使用 mock 資料完成端到端流程驗證
- ✅ 測試覆蓋率達 100%
- ✅ 成功生成 JSON 和 ICS 檔案

---

## ⏭️ 下一階段

階段 2 完成後，進入：

**階段 2.1：BWF 爬蟲修正（真實資料源）**

→ [階段 2.1 文件](STAGE-2.1-BWF-CORRECTION.md)

**目標**：將 mock 資料改為真實 API 攔截，使用 Puppeteer 攔截 BWF API 請求。

完成階段 2.1 後，才會進入階段 3（前端網站）。

---

## 🎯 重點提醒

1. ✅ **架構驗證成功**：核心框架設計經過實際使用驗證，運作正常
2. ✅ **TDD 流程順暢**：測試先行的開發方式能有效確保程式碼品質
3. ⚠️ **下一步是真實資料**：階段 2.1 將實作 Puppeteer API 攔截
4. 📝 **測試覆蓋率優秀**：達到 100%，為後續修改提供安全網

---

🚀 **架構驗證完成！接下來實作真實資料爬取！**

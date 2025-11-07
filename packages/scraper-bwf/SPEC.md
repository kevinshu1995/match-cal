# scraper-bwf 規格文件

> BWF 羽球賽事爬蟲 Package 規格

---

## 📦 Package 資訊

| 項目 | 內容 |
|------|------|
| Package 名稱 | @matchcal/scraper-bwf |
| 版本 | 0.2.0 |
| 職責 | 爬取 BWF 官方網站的羽球賽事資訊 |
| 依賴 | @matchcal/scraper-core, @matchcal/json-manager, @matchcal/ics-generator, puppeteer |
| 被依賴 | 無 |

---

## 🎯 職責

1. 使用 Puppeteer 攔截 BWF API 請求
2. 爬取 https://bwfbadminton.com/calendar/ 的真實賽事資訊
3. 轉換為 StandardEvent 格式
4. 生成 JSON 與 ICS 檔案
5. 定時更新資料

---

## 📊 資料來源

### 網站與 API

| 項目 | 內容 |
|------|------|
| 頁面 URL | https://bwfbadminton.com/calendar/ |
| API URL | https://extranet-lv.bwfbadminton.com/api/vue-grouped-year-tournaments |
| 請求方法 | POST |
| 回應格式 | JSON |
| 更新頻率 | 每天 |

### 技術實作

使用 **Puppeteer Request Interception** 攔截 API 回應：

```javascript
// 基本流程
1. 啟動 Puppeteer Browser
2. 設定 User-Agent 避免被偵測
3. 攔截 API response
4. 導航到頁面觸發 API 請求
5. 等待 API 回應
6. 解析 JSON 資料
7. 轉換為內部格式
```

**優勢**：
- 不需要解析複雜的前端 DOM
- 直接取得結構化的 JSON 資料
- 較不受前端 UI 變動影響

---

## 📚 公開 API

### BwfScraper

```javascript
import { BwfScraper } from '@matchcal/scraper-bwf';

const scraper = new BwfScraper();
const events = await scraper.scrape();
```

**方法說明**：

#### `async scrape()`

爬取 BWF 賽事資料並回傳 StandardEvent 陣列。

- **回傳**: `Promise<StandardEvent[]>`
- **拋出**: `Error` 當爬取失敗時

#### `async fetchBwfEvents()` (內部方法)

使用 Puppeteer 攔截 API 並取得原始賽事資料。

- **回傳**: `Promise<Object[]>` 原始 API 回應資料
- **拋出**: `Error` 當 API 攔截失敗時

#### `transformApiData(apiData)` (內部方法)

將 API 回應轉換為 transformer 期望的格式。

- **參數**: `apiData` - API 原始回應
- **回傳**: `Object[]` - 轉換後的資料

---

## 📂 目錄結構

```
packages/scraper-bwf/
├── src/
│   ├── index.js           # 匯出 BwfScraper
│   ├── BwfScraper.js      # 主爬蟲類別（含 Puppeteer 邏輯）
│   ├── transformer.js     # transformBwfEvent（轉換為 StandardEvent）
│   └── cli.js             # CLI 工具
├── tests/
│   ├── BwfScraper.test.js
│   ├── transformer.test.js
│   └── fixtures/
│       └── api-response.json  # 真實 API 回應範例
├── package.json
└── SPEC.md
```

---

## 🔄 資料流程

```
1. fetchBwfEvents()
   ├── 啟動 Puppeteer
   ├── 攔截 API 請求
   ├── 取得 JSON 回應
   └── transformApiData() → 轉換欄位名稱
       ↓
2. transformBwfEvent()
   ├── 轉換為 StandardEvent
   ├── 生成 ID
   ├── 處理時區
   └── 加入 metadata
       ↓
3. JsonManager.write()
   ├── 生成 meta 資訊
   └── 寫入 data/badminton/bwf-2025.json
       ↓
4. IcsGenerator.generate()
   └── 生成 data/badminton/bwf-2025.ics
```

---

## 🧪 測試案例列表

### 單元測試

- [x] `should extend BaseScraper`
- [x] `should have correct config (source, category, url)`
- [ ] `should launch browser and intercept API`
- [ ] `should transform API response to internal format`
- [ ] `should handle missing fields in API response`
- [ ] `should retry on network error`
- [ ] `should throw error when API interception fails`

### 整合測試

- [x] `should scrape and return StandardEvent array`
- [x] `should generate valid JSON output`
- [x] `should generate valid ICS output`
- [ ] `should fetch real BWF data (E2E)` - 使用環境變數控制

---

## 🔧 API 資料結構

### ✅ API 回應格式（已驗證）

```json
{
  "results": [
    {
      "month": "January",
      "monthNo": 1,
      "tournaments": [
        {
          "id": 5222,
          "code": "BD7DDFAC-145A-4865-B58A-C00977D5A3C3",
          "name": "PETRONAS Malaysia Open 2025",
          "start_date": "2025-01-07 00:00:00",
          "end_date": "2025-01-12 00:00:00",
          "location": "Kuala Lumpur, Malaysia",
          "country": "Malaysia",
          "url": "https://bwfworldtour.bwfbadminton.com/tournament/5222/...",
          "category": "HSBC BWF World Tour Super 1000",
          "prize_money": "1,450,000",
          "live_status": "post",
          "has_live_scores": true,
          "date": "07  - 12 Jan",
          "flag_url": "...",
          "logo": "...",
          "status": {
            "status": "0",
            "code": "normal",
            "label": "Normal"
          }
        }
      ]
    }
  ],
  "remaining": 6,
  "completed": 35
}
```

**重要特徵**：
- 資料以月份分組：`results[].tournaments[]`
- 日期格式：`YYYY-MM-DD HH:MM:SS`
- 賽事等級在 `category` 欄位（非 `tier`）
- 包含豐富的視覺資源（logo, flag_url, header_url）

**完整範例**：
→ `tests/fixtures/api-response-sample.json`

### 轉換對應

| API 欄位 | 內部格式欄位 | 轉換邏輯 | 備註 |
|----------|-------------|---------|------|
| `name` | `name` | 直接對應 | - |
| `start_date` | `startDate` | 提取日期部分 | `"2025-01-07 00:00:00"` → `"2025-01-07"` |
| `end_date` | `endDate` | 提取日期部分 | 同上 |
| `location` | `location` | 直接對應 | 已包含國家資訊 |
| `url` | `url` | 直接對應 | 官方網址 |
| `category` | `tier` | 提取等級 | `"HSBC BWF World Tour Super 1000"` → `"Super 1000"` |
| `id` | - | 保留供未來使用 | BWF 官方 ID |
| `prize_money` | - | 可選 | 字串格式（含逗號） |
| `live_status` | - | 可選 | `"post"` / `"live"` / `"future"` |

### 資料處理重點

1. **展平結構**：從月份分組展平為單一賽事陣列
2. **日期處理**：去除時間部分，只保留日期
3. **等級提取**：使用正則提取 `Super XXX` 或直接使用 category
4. **空值處理**：`prize_money` 可能為 `null`

---

## 📝 輸出

- **JSON**: `/data/badminton/bwf-2025.json`
- **ICS**: `/data/badminton/bwf-2025.ics`

### JSON 範例

```json
{
  "meta": {
    "category": "badminton",
    "source": "bwf",
    "sourceUrl": "https://bwfbadminton.com/calendar/",
    "generatedAt": "2025-11-07T...",
    "version": "1.0.0",
    "eventCount": 20
  },
  "events": [...]
}
```

---

## ⚠️ 注意事項

### Puppeteer 設定

```javascript
const browser = await puppeteer.launch({
  headless: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',  // 避免記憶體不足
  ],
});
```

### User-Agent

使用真實的瀏覽器 User-Agent 避免被偵測：

```javascript
await page.setUserAgent(
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ' +
  'AppleWebKit/537.36 (KHTML, like Gecko) ' +
  'Chrome/120.0.0.0 Safari/537.36'
);
```

### Timeout 設定

```javascript
await page.goto(url, {
  waitUntil: 'networkidle2',
  timeout: 30000,  // 30 秒
});
```

### 錯誤處理

- 網路錯誤 → 使用 BaseScraper 的 `retry()` 重試
- API 攔截失敗 → 拋出明確錯誤訊息
- 資料解析錯誤 → 記錄警告但不中斷

---

## 🚧 待完成項目

根據 Stage 2.1 規劃：

- [ ] 手動驗證 API 結構並更新本文件
- [ ] 實作 Puppeteer API 攔截
- [ ] 實作 `transformApiData()` 方法
- [ ] 更新測試案例以使用真實 API fixtures
- [ ] 驗證完整的爬取流程
- [ ] 測試覆蓋率 ≥ 80%

---

## 📚 相關文件

- [階段 2.1 文件](../../docs/stages/STAGE-2.1-BWF-CORRECTION.md) - 詳細實作計畫
- [scraper-core 規格](../scraper-core/SPEC.md)
- [資料格式規範](../../docs/technical/DATA-SCHEMA.md)
- [TDD 工作流程](../../docs/guides/TDD-WORKFLOW.md)

---

🎯 **使用 Puppeteer 攔截真實 API，取得完整的 BWF 賽事資料！**

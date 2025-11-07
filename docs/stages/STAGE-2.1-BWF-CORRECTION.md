# 階段 2.1：BWF 爬蟲修正（真實資料源）

> 將 BWF 爬蟲從 mock 資料改為真實 API 攔截

---

## 📋 階段資訊

| 項目 | 內容 |
|------|------|
| 階段名稱 | 階段 2.1：BWF 爬蟲修正 |
| 預計工期 | 2-3 天 |
| 涉及 Packages | scraper-bwf |
| 前置需求 | 階段 2 完成（已使用 mock 資料驗證流程） |
| 輸出 | 真實的 BWF 羽球賽事資料（JSON + ICS） |

---

## 🎯 階段目標

修正 `scraper-bwf` 的資料來源，從 mock 資料改為使用 Puppeteer 攔截真實 API 請求。

### 為什麼需要修正？

- **階段 2** 使用 mock 資料驗證了整體架構流程
- **階段 2.1** 實作真實的資料爬取，取得實際的賽事資料
- 使用 Puppeteer 的 Request Interception 攔截 API 回應，避免解析複雜的前端 DOM

---

## 📊 資料來源

### 目標網站

- **頁面 URL**: https://bwfbadminton.com/calendar/
- **API URL**: https://extranet-lv.bwfbadminton.com/api/vue-grouped-year-tournaments
- **請求方法**: POST
- **回應格式**: JSON

### 技術方案

使用 Puppeteer 的 Request Interception 功能：

```javascript
// 攔截 API 請求並獲取回應
await page.setRequestInterception(true);

page.on('response', async (response) => {
  const url = response.url();
  if (url.includes('vue-grouped-year-tournaments')) {
    const data = await response.json();
    // 處理資料
  }
});
```

---

## 📅 主要任務

### 1. ✅ API 結構已驗證

**API 基本資訊**：
- **URL**: https://extranet-lv.bwfbadminton.com/api/vue-grouped-year-tournaments
- **方法**: POST
- **回應格式**: JSON

**已完成**：
- [x] 手動造訪 https://bwfbadminton.com/calendar/
- [x] 使用瀏覽器 DevTools 觀察 Network 請求
- [x] 確認 API 回應的資料結構
- [x] 記錄範例資料到 fixtures

#### API 回應結構

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
          "cat_logo": "...",
          "header_url": "...",
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

**重要發現**：
1. ✅ 資料結構：`results` 陣列 → 月份物件 → `tournaments` 陣列
2. ✅ 日期格式：`YYYY-MM-DD HH:MM:SS`（需要解析處理）
3. ✅ 賽事等級：使用 `category` 欄位（例：HSBC BWF World Tour Super 1000）
4. ✅ 沒有 `tier` 欄位，需要從 `category` 提取
5. ✅ 獎金格式：字串包含逗號（例：`"1,450,000"`）
6. ✅ 包含大量額外欄位（logo, flag_url 等）

**完整範例資料**：
→ 儲存於 `packages/scraper-bwf/tests/fixtures/api-response-sample.json`

---

### 2. 設計資料轉換邏輯

#### 欄位對應表

| API 欄位 | 內部格式欄位 | 轉換邏輯 | 備註 |
|----------|-------------|---------|------|
| `name` | `name` | 直接對應 | - |
| `start_date` | `startDate` | 解析 `YYYY-MM-DD HH:MM:SS` → ISO 8601 | 需處理時間部分 |
| `end_date` | `endDate` | 解析 `YYYY-MM-DD HH:MM:SS` → ISO 8601 | 需處理時間部分 |
| `location` | `location` | 直接對應 | - |
| `country` | - | 可選，暫不使用 | 地點已包含國家資訊 |
| `url` | `url` | 直接對應 | 官方網址 |
| `category` | `tier` | 提取等級資訊 | 例：`"Super 1000"` → `"Super 1000"` |
| `prize_money` | - | 可選，未來可加入 | 字串格式，包含逗號 |
| `id` | - | 可選，未來可用於去重 | BWF 官方 ID |
| `live_status` | - | 可選，未來可加入狀態 | `"post"`, `"live"`, `"future"` |

#### 資料轉換流程

```javascript
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
 */
extractTier(category) {
  const match = category.match(/Super \d+/);
  return match ? match[0] : category;
}
```

#### 待處理的特殊情況

1. **日期格式**：
   - API: `"2025-01-07 00:00:00"`
   - 需要: `"2025-01-07"` 或完整 ISO 8601
   - 決策：先只取日期部分，時間處理交給 transformer

2. **Category 格式多樣**：
   - `"HSBC BWF World Tour Super 1000"`
   - `"Grade 1 – Team Tournaments"`
   - `"BWF Tour Super 100"`
   - 需要靈活的提取邏輯

3. **空值處理**：
   - `prize_money` 可能為 `null`
   - 需要提供預設值或跳過

**任務**：
- [ ] 實作 `transformApiData()` 方法
- [ ] 實作 `extractTier()` 輔助函式
- [ ] 撰寫單元測試使用 fixtures
- [ ] 處理邊界情況（空值、異常格式）

---

### 3. TDD 實作 Puppeteer 攔截（1-1.5 天）

遵循 TDD 循環：🔴 RED → 🟢 GREEN → 🔵 REFACTOR

#### 3.1 測試設計

```javascript
describe('BwfScraper - Puppeteer API Interception', () => {
  it('should launch browser and navigate to calendar page', async () => {
    // 測試瀏覽器啟動
  });

  it('should intercept API request and extract response', async () => {
    // 測試 API 攔截
  });

  it('should transform API response to internal format', async () => {
    // 測試資料轉換
  });

  it('should handle empty API response', async () => {
    // 測試空資料
  });

  it('should retry on network failure', async () => {
    // 測試重試機制
  });
});
```

#### 3.2 實作重點

**BwfScraper.js 修改**：

```javascript
async fetchBwfEvents() {
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  try {
    const page = await browser.newPage();

    // 設定 User-Agent 避免被偵測為爬蟲
    await page.setUserAgent('Mozilla/5.0...');

    // 攔截 API 回應
    let apiData = null;
    page.on('response', async (response) => {
      const url = response.url();
      if (url.includes('vue-grouped-year-tournaments')) {
        try {
          apiData = await response.json();
        } catch (error) {
          console.error('Failed to parse API response:', error);
        }
      }
    });

    // 導航到頁面，觸發 API 請求
    await page.goto('https://bwfbadminton.com/calendar/', {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });

    // 等待 API 回應
    await page.waitForTimeout(3000); // 給 API 時間回應

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
 * 轉換 API 回應為內部格式
 * @param {Object} apiData - API 原始回應
 * @returns {Array} 轉換後的資料
 */
transformApiData(apiData) {
  // TODO: 根據真實 API 結構實作
  // 這裡需要將 API 的欄位名稱對應到 transformer 期望的格式
  return apiData.tournaments.map(t => ({
    name: t.name,
    startDate: t.start_date,
    endDate: t.end_date,
    location: t.location,
    tier: t.tier,
    url: t.official_url,
  }));
}
```

**測試策略**：
- [ ] 使用真實 API 進行整合測試（需要網路連線）
- [ ] 建立 fixtures 儲存真實 API 回應範例
- [ ] 單元測試使用 fixtures，避免每次都呼叫真實 API

---

### 4. 驗證與測試（0.5 天）

- [ ] 執行完整爬蟲流程
- [ ] 驗證爬取到的資料量（應該比 mock 的 3 筆多很多）
- [ ] 檢查資料品質：
  - [ ] 日期格式正確
  - [ ] 地點資訊完整
  - [ ] 所有必要欄位都有值
- [ ] 測試覆蓋率維持 ≥ 80%
- [ ] 生成的 JSON 和 ICS 檔案正確

---

## 🧪 測試策略

### 測試層級

1. **單元測試**
   - `transformApiData()` 的資料轉換邏輯
   - 各種邊界條件（null, undefined, 缺失欄位）

2. **整合測試**
   - 使用 fixtures 模擬 API 回應
   - 測試完整的爬取 → 轉換流程

3. **E2E 測試**（可選，手動執行）
   - 真實連線到 BWF 網站
   - 驗證完整的資料管線

### 測試注意事項

```javascript
// 使用環境變數控制是否執行真實 API 測試
const SKIP_REAL_API = process.env.SKIP_REAL_API === 'true';

describe('BwfScraper - Real API', () => {
  it.skipIf(SKIP_REAL_API)('should fetch real BWF data', async () => {
    // 真實 API 測試
  });
});
```

---

## 📝 待驗證的需求

以下項目無法在不實際測試的情況下確認，需要加入開發 TODO：

### 1. API 請求是否需要特殊 Headers？

- [ ] 驗證是否需要 Authentication
- [ ] 驗證是否需要 CSRF Token
- [ ] 驗證是否需要特定的 Referer

### 2. API 回應的資料結構

- [ ] 確認資料是在哪個 JSON 路徑下（例：`data.tournaments` 或 `results`）
- [ ] 確認欄位命名（snake_case? camelCase?）
- [ ] 確認日期格式（ISO 8601? Unix timestamp?）
- [ ] 確認是否包含時區資訊

### 3. API 回應的資料完整性

- [ ] 是否包含所有年份的賽事？
- [ ] 是否需要多次請求才能取得完整資料？
- [ ] 是否有分頁機制？

### 4. 反爬蟲機制

- [ ] 是否有 rate limiting？
- [ ] 是否會檢測 headless browser？
- [ ] 是否需要加入隨機延遲？

### 5. 資料更新頻率

- [ ] 賽事資料多久更新一次？
- [ ] 是否需要實作增量更新（只抓新資料）？

---

## 📋 開發 TODO 清單

根據以上待驗證項目，建立開發 TODO：

```markdown
## Stage 2.1 開發任務

### Phase 1: API 結構分析
- [ ] 手動訪問 BWF 網站，記錄 API 請求
- [ ] 截圖或複製 Request Headers
- [ ] 複製至少一筆完整的 API Response 到 fixtures
- [ ] 分析 Response 的資料結構，更新技術文件

### Phase 2: Puppeteer 實作（TDD）
- [ ] 🔴 RED: 測試瀏覽器啟動
- [ ] 🟢 GREEN: 實作瀏覽器啟動
- [ ] 🔴 RED: 測試 API 攔截
- [ ] 🟢 GREEN: 實作 Request Interception
- [ ] 🔴 RED: 測試資料轉換
- [ ] 🟢 GREEN: 實作 `transformApiData()`
- [ ] 🔵 REFACTOR: 重構提取共用邏輯

### Phase 3: 資料轉換
- [ ] 根據真實 API 結構更新 `transformApiData()`
- [ ] 確保轉換後的資料符合 transformer 期望格式
- [ ] 處理缺失欄位的預設值

### Phase 4: 錯誤處理
- [ ] 實作 API 攔截失敗的錯誤處理
- [ ] 實作 timeout 機制
- [ ] 實作重試邏輯（使用 BaseScraper 的 retry）

### Phase 5: 測試與驗證
- [ ] 所有單元測試通過
- [ ] 整合測試通過
- [ ] 手動執行一次完整爬取
- [ ] 驗證生成的 JSON 檔案資料正確
- [ ] 驗證生成的 ICS 檔案可被行事曆軟體讀取
- [ ] 測試覆蓋率 ≥ 80%

### Phase 6: 文件更新
- [ ] 更新 scraper-bwf/SPEC.md
- [ ] 更新 CURRENT-STAGE.md
- [ ] 記錄 API 結構到技術文件
- [ ] 提交變更
```

---

## ✅ 階段完成標準

### 功能完成

- [ ] `fetchBwfEvents()` 使用 Puppeteer 攔截真實 API
- [ ] `transformApiData()` 正確轉換 API 回應
- [ ] 錯誤處理完善（網路錯誤、API 失敗、解析錯誤）
- [ ] 生成的 JSON 資料品質良好
- [ ] 生成的 ICS 檔案可正常使用

### 測試完成

- [ ] 單元測試覆蓋率 ≥ 80%
- [ ] 整合測試使用 fixtures
- [ ] 手動測試確認真實 API 可用

### 文件完成

- [ ] scraper-bwf/SPEC.md 更新技術細節
- [ ] 記錄 API 結構與範例資料
- [ ] CURRENT-STAGE.md 更新狀態

### 資料驗證

- [ ] 爬取到的賽事數量合理（預期 > 10 筆）
- [ ] 所有必要欄位都有值
- [ ] 日期格式正確
- [ ] ICS 檔案可被 Google/Apple/Outlook 匯入

---

## 🚨 風險與注意事項

### 風險 1: API 結構與預期不符

**應對方案**：
- 先手動驗證 API 回應
- 建立完整的 fixtures
- 逐步實作轉換邏輯

### 風險 2: 反爬蟲機制

**應對方案**：
- 使用合理的 User-Agent
- 加入隨機延遲
- 如果被封鎖，考慮使用 Proxy

### 風險 3: API 回應速度慢

**應對方案**：
- 設定合理的 timeout（30 秒）
- 實作重試機制
- 考慮使用快取

### 風險 4: 資料格式變動

**應對方案**：
- 實作健壯的錯誤處理
- 記錄警告但不中斷執行
- 定期檢查資料品質

---

## 📚 相關文件

- [scraper-bwf 規格](../../packages/scraper-bwf/SPEC.md)
- [scraper-core 規格](../../packages/scraper-core/SPEC.md)
- [階段 2 文件](STAGE-2-FIRST-SCRAPER.md)
- [TDD 工作流程](../guides/TDD-WORKFLOW.md)

---

## 🎯 重點提醒

1. **這是修正階段，不是新功能**
   - 保持 API 介面不變
   - 只修改 `fetchBwfEvents()` 的實作
   - transformer 邏輯可能需要調整以適應真實資料

2. **遵循 TDD**
   - 先寫測試，後寫實作
   - 使用 fixtures 避免過度依賴真實 API
   - 保持高測試覆蓋率

3. **先驗證，後實作**
   - 務必先手動確認 API 結構
   - 記錄真實的 API 回應範例
   - 規劃好資料對應關係

4. **錯誤處理很重要**
   - 網路可能失敗
   - API 可能變更
   - 資料可能不完整

---

🚀 **從 Mock 到真實資料，完善 BWF 爬蟲！**

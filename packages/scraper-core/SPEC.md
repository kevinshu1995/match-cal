# scraper-core 規格文件

> 爬蟲核心框架 Package 規格

---

## 📦 Package 資訊

| 項目 | 內容 |
|------|------|
| Package 名稱 | @matchcal/scraper-core |
| 版本 | 0.1.0 |
| 職責 | 提供爬蟲基礎設施與共用工具 |
| 依賴 | 無（基礎 package） |
| 被依賴 | json-manager, ics-generator, scraper-* |

---

## 🎯 職責

提供可重用的爬蟲核心框架，包含：

1. **BaseScraper**：可繼承的抽象爬蟲類別
2. **Scheduler**：Cron 排程器
3. **資料驗證**：StandardEvent Schema 驗證
4. **工具函式**：ID 生成、錯誤處理等

---

## 📚 公開 API

### 1. BaseScraper（抽象類別）

所有爬蟲都應繼承此類別。

#### 建構函式

```javascript
import { BaseScraper } from '@matchcal/scraper-core';

class MyScraper extends BaseScraper {
  constructor() {
    super({
      source: 'bwf',           // 資料來源識別碼
      category: 'badminton',   // 賽事分類
      url: 'https://...'       // 目標網址
    });
  }
}
```

#### 必須實作的方法

```javascript
class MyScraper extends BaseScraper {
  /**
   * 爬取資料並返回 StandardEvent 陣列
   * @returns {Promise<StandardEvent[]>}
   */
  async scrape() {
    // 子類別必須實作
    throw new Error('scrape() must be implemented');
  }
}
```

#### 提供的方法

```javascript
// 驗證賽事資料
this.validateEvent(event);  // 拋出錯誤如果無效

// 驗證多個賽事
this.validateEvents(events);  // 拋出錯誤如果任一無效

// 錯誤處理與重試
await this.retry(fn, maxRetries, delay);
```

---

### 2. Scheduler（排程器）

Cron 表達式排程器。

#### 建立排程

```javascript
import { Scheduler } from '@matchcal/scraper-core';

const scheduler = new Scheduler('0 0 * * *');  // 每天 00:00
```

#### 方法

```javascript
// 取得 cron 表達式
scheduler.cronExpression  // '0 0 * * *'

// 驗證 cron 表達式
scheduler.isValid()  // true/false

// 解析下次執行時間
scheduler.next()  // Date 物件

// 執行排程任務
await scheduler.run(async () => {
  // 執行爬蟲
});
```

---

### 3. 資料驗證

#### StandardEventSchema

```javascript
import { StandardEventSchema, validateEvent, validateEvents } from '@matchcal/scraper-core';

// 單一賽事驗證
const event = { ... };
const validEvent = validateEvent(event);  // 拋出錯誤如果無效

// 多個賽事驗證
const events = [ ... ];
const validEvents = validateEvents(events);  // 拋出錯誤如果任一無效
```

#### Schema 定義

參考 [資料格式規範](../../docs/technical/DATA-SCHEMA.md)

---

### 4. 工具函式

#### generateEventId()

```javascript
import { generateEventId } from '@matchcal/scraper-core';

const event = {
  category: 'badminton',
  source: 'bwf',
  startDate: '2025-01-15T09:00:00.000Z',
  title: 'Indonesia Masters 2025'
};

const id = generateEventId(event);
// 'badminton-bwf-2025-01-15-indonesia-masters-2025'
```

#### delay()

```javascript
import { delay } from '@matchcal/scraper-core';

await delay(1000);  // 延遲 1 秒
```

#### retry()

```javascript
import { retry } from '@matchcal/scraper-core';

const result = await retry(
  async () => {
    // 可能失敗的操作
    return await fetchData();
  },
  3,     // 最多重試 3 次
  1000   // 每次重試間隔 1 秒
);
```

---

## 📂 目錄結構

```
packages/scraper-core/
├── src/
│   ├── index.js              # 主要輸出
│   ├── base/
│   │   └── BaseScraper.js    # 抽象爬蟲類別
│   ├── scheduler/
│   │   └── Scheduler.js      # 排程器
│   ├── validator/
│   │   ├── schema.js         # StandardEventSchema
│   │   └── validate.js       # 驗證函式
│   └── utils/
│       ├── id-generator.js   # ID 生成
│       ├── delay.js          # 延遲工具
│       └── retry.js          # 重試機制
├── tests/
│   ├── base/
│   │   └── BaseScraper.test.js
│   ├── scheduler/
│   │   └── Scheduler.test.js
│   ├── validator/
│   │   └── validate.test.js
│   └── utils/
│       ├── id-generator.test.js
│       ├── delay.test.js
│       └── retry.test.js
├── package.json
├── vitest.config.js
└── SPEC.md（本文件）
```

---

## 🧪 測試案例列表

### BaseScraper 測試

- [ ] `should create instance with config`
- [ ] `should throw error when scrape() not implemented`
- [ ] `should validate single event`
- [ ] `should validate multiple events`
- [ ] `should throw error for invalid event`
- [ ] `should retry failed operations`

### Scheduler 測試

- [ ] `should create scheduler with cron expression`
- [ ] `should validate cron expression`
- [ ] `should throw error for invalid cron`
- [ ] `should calculate next execution time`
- [ ] `should run scheduled task`

### Validator 測試

- [ ] `should validate event with all required fields`
- [ ] `should throw error for missing required fields`
- [ ] `should throw error for invalid date format`
- [ ] `should throw error for invalid timezone`
- [ ] `should allow optional fields to be undefined`
- [ ] `should validate customFields as object`

### ID Generator 測試

- [ ] `should generate id from event data`
- [ ] `should handle titles with special characters`
- [ ] `should create url-safe slugs`
- [ ] `should throw error for missing required fields`
- [ ] `should generate consistent ids for same event`

### Utils 測試

- [ ] `delay() should wait for specified time`
- [ ] `retry() should retry on failure`
- [ ] `retry() should return result on success`
- [ ] `retry() should throw after max retries`

---

## 📋 開發檢查清單

### 實作階段

- [ ] 實作 `BaseScraper` 抽象類別
- [ ] 實作 `Scheduler` 排程器
- [ ] 實作 `StandardEventSchema`
- [ ] 實作 `validateEvent()` 與 `validateEvents()`
- [ ] 實作 `generateEventId()`
- [ ] 實作 `delay()` 與 `retry()`

### 測試階段

- [ ] 所有測試案例通過
- [ ] 測試覆蓋率 ≥ 85%
- [ ] 整合測試通過

### 文件階段

- [ ] API 文件完整
- [ ] 範例程式碼齊全
- [ ] SPEC.md 更新

---

## 💡 使用範例

### 完整範例：建立自訂爬蟲

```javascript
// packages/scraper-custom/src/scraper.js
import { BaseScraper, generateEventId } from '@matchcal/scraper-core';

export class CustomScraper extends BaseScraper {
  constructor() {
    super({
      source: 'custom',
      category: 'basketball',
      url: 'https://example.com/events'
    });
  }

  async scrape() {
    // 1. 爬取原始資料
    const rawData = await this.fetchData();

    // 2. 轉換為 StandardEvent 格式
    const events = rawData.map(item => {
      const event = {
        title: item.name,
        startDate: new Date(item.start).toISOString(),
        endDate: new Date(item.end).toISOString(),
        timezone: 'Asia/Taipei',
        location: item.location,
        category: this.category,
        level: 'international',
        source: this.source,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        scrapedAt: new Date().toISOString(),
      };

      // 生成 ID
      event.id = generateEventId(event);

      return event;
    });

    // 3. 驗證資料
    this.validateEvents(events);

    return events;
  }

  async fetchData() {
    // 實作資料爬取邏輯
    return await retry(
      async () => {
        const response = await fetch(this.url);
        return await response.json();
      },
      3,     // 重試 3 次
      1000   // 間隔 1 秒
    );
  }
}
```

---

## 🔗 相關文件

- [資料格式規範](../../docs/technical/DATA-SCHEMA.md)
- [TDD 工作流程](../../docs/guides/TDD-WORKFLOW.md)
- [階段 1 文件](../../docs/stages/STAGE-1-INFRASTRUCTURE.md)

---

🎯 **這是整個專案的基石，務必確保高品質！**

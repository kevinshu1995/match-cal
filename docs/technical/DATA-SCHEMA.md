# 資料格式規範

> 定義 MatchCal 系統中所有資料的標準格式

---

## 📋 目錄

1. [StandardEvent（標準賽事格式）](#standardevent標準賽事格式)
2. [JSON 輸出格式](#json-輸出格式)
3. [Categories 分類格式](#categories-分類格式)
4. [資料驗證規則](#資料驗證規則)
5. [範例資料](#範例資料)

---

## StandardEvent（標準賽事格式）

所有爬蟲都必須將原始資料轉換為 `StandardEvent` 格式。

### TypeScript 定義

```typescript
interface StandardEvent {
  // === 必要欄位（由 Scraper 生成） ===

  /** 唯一識別碼（用於去重與更新） */
  id: string;

  /** 賽事名稱 */
  title: string;

  /** 開始時間（ISO 8601 格式） */
  startDate: string;

  /** 結束時間（ISO 8601 格式） */
  endDate: string;

  /** 時區（IANA timezone，例如 "Asia/Taipei"） */
  timezone: string;

  /** 地點（城市、國家或場館名稱） */
  location: string;

  /** 分類（運動種類，例如 "badminton", "basketball"） */
  category: string;

  /** 級別（例如 "professional", "amateur", "international"） */
  level: string;

  /** 資料來源 URL */
  source: string;

  // === 可選欄位（由 Scraper 生成） ===

  /** 賽事描述 */
  description?: string;

  /** 主辦單位 */
  organizer?: string;

  /** 參賽者/隊伍 */
  participants?: string[];

  /** 官方網站 */
  officialUrl?: string;

  /** 賽事級別細節（例如 "Super 1000", "Grand Slam"） */
  tier?: string;

  /** 賽事狀態（例如 "scheduled", "ongoing", "completed", "cancelled"） */
  status?: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';

  // === 手動新增欄位（由使用者手動編輯，不被覆蓋） ===

  /** 自訂欄位（可包含任意 key-value） */
  customFields?: Record<string, any>;

  // === 系統欄位（自動管理） ===

  /** 建立時間（ISO 8601） */
  createdAt: string;

  /** 最後更新時間（ISO 8601） */
  updatedAt: string;

  /** 最後爬取時間（ISO 8601） */
  scrapedAt: string;
}
```

### 欄位說明

#### id（唯一識別碼）

- **格式**：`{category}-{source}-{date}-{slug}`
- **範例**：`badminton-bwf-2025-01-15-indonesia-masters`
- **用途**：去重、更新比對

**生成規則**：
```javascript
function generateEventId(event) {
  const dateStr = event.startDate.split('T')[0]; // YYYY-MM-DD
  const slug = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${event.category}-${event.source.split('.')[0]}-${dateStr}-${slug}`;
}
```

#### startDate / endDate

- **格式**：ISO 8601（`YYYY-MM-DDTHH:mm:ss.sssZ`）
- **範例**：`2025-01-15T09:00:00.000Z`
- **時區**：必須是 UTC 或包含 timezone offset

#### timezone

- **格式**：IANA timezone database 名稱
- **範例**：`Asia/Taipei`, `Europe/London`, `America/New_York`
- **查詢**：https://en.wikipedia.org/wiki/List_of_tz_database_time_zones

#### category

- **可選值**：`badminton`, `basketball`, `football`, `esports`, 等
- **命名規則**：全小寫英文，使用 `-` 連接多個單字

#### level

- **可選值**：
  - `international`：國際級
  - `professional`：職業級
  - `amateur`：業餘級
  - `youth`：青年級
  - `university`：大學級

#### status

- **可選值**：
  - `scheduled`：已排程（未開始）
  - `ongoing`：進行中
  - `completed`：已完成
  - `cancelled`：已取消

---

## JSON 輸出格式

### 單一賽事檔案格式

每個賽事來源會生成一個 JSON 檔案，例如 `/data/badminton/bwf-2025.json`。

```json
{
  "meta": {
    "category": "badminton",
    "source": "bwf",
    "sourceUrl": "https://bwfbadminton.com/calendar/",
    "generatedAt": "2025-11-06T10:30:00.000Z",
    "version": "1.0.0",
    "eventCount": 42
  },
  "events": [
    {
      "id": "badminton-bwf-2025-01-15-indonesia-masters",
      "title": "YONEX Indonesia Masters 2025",
      "startDate": "2025-01-15T09:00:00.000Z",
      "endDate": "2025-01-20T18:00:00.000Z",
      "timezone": "Asia/Jakarta",
      "location": "Jakarta, Indonesia",
      "category": "badminton",
      "level": "international",
      "source": "bwf",
      "tier": "Super 750",
      "status": "scheduled",
      "officialUrl": "https://bwfbadminton.com/tournament/...",
      "createdAt": "2025-11-06T10:30:00.000Z",
      "updatedAt": "2025-11-06T10:30:00.000Z",
      "scrapedAt": "2025-11-06T10:30:00.000Z"
    },
    {
      "id": "badminton-bwf-2025-01-22-malaysia-open",
      "title": "PETRONAS Malaysia Open 2025",
      "startDate": "2025-01-22T09:00:00.000Z",
      "endDate": "2025-01-27T18:00:00.000Z",
      "timezone": "Asia/Kuala_Lumpur",
      "location": "Kuala Lumpur, Malaysia",
      "category": "badminton",
      "level": "international",
      "source": "bwf",
      "tier": "Super 1000",
      "status": "scheduled",
      "customFields": {
        "note": "這場比賽值得關注！",
        "favoritePlayer": "安賽龍"
      },
      "createdAt": "2025-11-05T08:00:00.000Z",
      "updatedAt": "2025-11-06T10:30:00.000Z",
      "scrapedAt": "2025-11-06T10:30:00.000Z"
    }
  ]
}
```

### Meta 欄位說明

| 欄位 | 說明 |
|------|------|
| category | 賽事分類 |
| source | 資料來源識別碼 |
| sourceUrl | 原始資料網址 |
| generatedAt | 檔案生成時間 |
| version | 資料格式版本 |
| eventCount | 賽事數量 |

---

## Categories 分類格式

前端使用的分類設定檔：`/data/categories.json`

```json
{
  "categories": [
    {
      "id": "badminton",
      "name": "羽球",
      "nameEn": "Badminton",
      "icon": "🏸",
      "color": "#10B981",
      "description": "國際羽球賽事",
      "sources": [
        {
          "id": "bwf",
          "name": "BWF 官方賽程",
          "dataFile": "/data/badminton/bwf-2025.json",
          "icsFile": "/data/badminton/bwf-2025.ics"
        }
      ]
    },
    {
      "id": "basketball",
      "name": "籃球",
      "nameEn": "Basketball",
      "icon": "🏀",
      "color": "#F59E0B",
      "description": "國際籃球賽事",
      "sources": []
    }
  ]
}
```

### Category 欄位說明

| 欄位 | 說明 |
|------|------|
| id | 分類唯一識別碼 |
| name | 分類名稱（繁體中文） |
| nameEn | 分類名稱（英文） |
| icon | 分類圖示（emoji） |
| color | 分類主題色（hex） |
| description | 分類描述 |
| sources | 資料來源列表 |

---

## 資料驗證規則

### Zod Schema

使用 Zod 進行資料驗證：

```typescript
import { z } from 'zod';

export const StandardEventSchema = z.object({
  // 必要欄位
  id: z.string().min(1),
  title: z.string().min(1),
  startDate: z.string().datetime(),
  endDate: z.string().datetime(),
  timezone: z.string(),
  location: z.string().min(1),
  category: z.string().min(1),
  level: z.enum(['international', 'professional', 'amateur', 'youth', 'university']),
  source: z.string().min(1),

  // 可選欄位
  description: z.string().optional(),
  organizer: z.string().optional(),
  participants: z.array(z.string()).optional(),
  officialUrl: z.string().url().optional(),
  tier: z.string().optional(),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled']).optional(),

  // 手動欄位
  customFields: z.record(z.any()).optional(),

  // 系統欄位
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  scrapedAt: z.string().datetime(),
});

export type StandardEvent = z.infer<typeof StandardEventSchema>;
```

### 驗證函式

```typescript
import { StandardEventSchema } from './schema';

export function validateEvent(data: unknown): StandardEvent {
  try {
    return StandardEventSchema.parse(data);
  } catch (error) {
    console.error('Event validation failed:', error);
    throw new Error(`Invalid event data: ${error.message}`);
  }
}

export function validateEvents(data: unknown[]): StandardEvent[] {
  return data.map((event, index) => {
    try {
      return validateEvent(event);
    } catch (error) {
      throw new Error(`Event at index ${index} is invalid: ${error.message}`);
    }
  });
}
```

### 驗證規則

| 規則 | 說明 |
|------|------|
| id 不可為空 | 必須有唯一識別碼 |
| startDate < endDate | 開始時間必須早於結束時間 |
| timezone 合法 | 必須是有效的 IANA timezone |
| officialUrl 格式 | 如果有值，必須是有效的 URL |
| level 在可選值內 | 必須是預定義的值之一 |

---

## 範例資料

### BWF 羽球賽事

```json
{
  "id": "badminton-bwf-2025-03-12-all-england",
  "title": "YONEX All England Open 2025",
  "startDate": "2025-03-12T09:00:00.000Z",
  "endDate": "2025-03-17T18:00:00.000Z",
  "timezone": "Europe/London",
  "location": "Birmingham, England",
  "category": "badminton",
  "level": "international",
  "source": "bwf",
  "description": "世界上歷史最悠久的羽毛球錦標賽之一",
  "organizer": "Badminton World Federation",
  "tier": "Super 1000",
  "status": "scheduled",
  "officialUrl": "https://bwfbadminton.com/tournament/3221/yonex-all-england-open-badminton-championships-2025",
  "createdAt": "2025-11-06T10:00:00.000Z",
  "updatedAt": "2025-11-06T10:00:00.000Z",
  "scrapedAt": "2025-11-06T10:00:00.000Z"
}
```

### 手動新增自訂欄位

```json
{
  "id": "badminton-bwf-2025-03-12-all-england",
  "title": "YONEX All England Open 2025",
  ...
  "customFields": {
    "note": "記得訂閱！",
    "favoritePlayer": "戴資穎",
    "watchPriority": "high",
    "recordedVideos": [
      "https://youtube.com/watch?v=xxx",
      "https://youtube.com/watch?v=yyy"
    ]
  }
}
```

**重要**：`customFields` 內的資料不會被爬蟲覆蓋，永久保留！

---

## 🔄 資料更新策略

### 智慧合併規則（json-manager）

當爬蟲更新資料時：

1. **比對 id**：找到對應的現有賽事
2. **更新必要欄位**：覆蓋爬蟲生成的欄位
3. **保留 customFields**：不覆蓋手動新增的欄位
4. **更新 updatedAt**：記錄最後更新時間
5. **更新 scrapedAt**：記錄最後爬取時間
6. **保留 createdAt**：不更新建立時間

### 範例

**原始資料**：
```json
{
  "id": "badminton-bwf-2025-03-12-all-england",
  "title": "YONEX All England Open 2025",
  "startDate": "2025-03-12T09:00:00.000Z",
  "customFields": {
    "note": "我的最愛！"
  },
  "createdAt": "2025-11-01T10:00:00.000Z",
  "updatedAt": "2025-11-01T10:00:00.000Z",
  "scrapedAt": "2025-11-01T10:00:00.000Z"
}
```

**爬蟲新資料**：
```json
{
  "id": "badminton-bwf-2025-03-12-all-england",
  "title": "YONEX All England Open 2025",
  "startDate": "2025-03-12T08:00:00.000Z",  // 時間改了
  "location": "Birmingham Arena",            // 新增地點細節
  ...
}
```

**合併後結果**：
```json
{
  "id": "badminton-bwf-2025-03-12-all-england",
  "title": "YONEX All England Open 2025",
  "startDate": "2025-03-12T08:00:00.000Z",  // ✅ 更新
  "location": "Birmingham Arena",            // ✅ 更新
  "customFields": {
    "note": "我的最愛!"                      // ✅ 保留
  },
  "createdAt": "2025-11-01T10:00:00.000Z",  // ✅ 保留
  "updatedAt": "2025-11-06T10:30:00.000Z",  // ✅ 更新
  "scrapedAt": "2025-11-06T10:30:00.000Z"   // ✅ 更新
}
```

---

## 📚 相關文件

- [ICS 規格](ICS-SPEC.md)
- [JSON Schema](JSON-SCHEMA.md)
- [爬蟲介面](SCRAPER-INTERFACE.md)
- [系統架構](../ARCHITECTURE.md)

---

🎯 **資料格式規範完成！** 所有 Package 都必須遵循此規範。

# 階段 1：基礎設施層

> 建立專案核心框架，為後續開發奠定基礎

---

## 📋 階段資訊

| 項目 | 內容 |
|------|------|
| 階段名稱 | 階段 1：基礎設施層 |
| 預計工期 | 10 天 |
| 涉及 Packages | scraper-core, json-manager, ics-generator |
| 前置需求 | 無（這是第一個開發階段） |
| 輸出 | 可重用的核心框架 |

---

## 🎯 階段目標

建立三個核心 packages，提供完整的爬蟲基礎設施：

1. **scraper-core**：爬蟲核心框架（抽象類別、排程器、資料驗證）
2. **json-manager**：JSON 資料管理（智慧合併、保留手動欄位）
3. **ics-generator**：ICS 檔案生成（符合 RFC 5545 規範）

---

## 📅 子階段劃分

### 階段 1-1：scraper-core（3 天）

**目標**：建立可繼承的爬蟲核心框架

**主要任務**：
- [ ] 定義 `BaseScraper` 抽象類別
- [ ] 實作 `Scheduler`（cron 排程器）
- [ ] 實作資料驗證（`StandardEventSchema`）
- [ ] 實作錯誤處理與重試機制
- [ ] 實作 `generateEventId()` 工具函式

**輸入**：無

**輸出**：
- `@matchcal/scraper-core` package
- 可被其他 scraper 繼承的基礎類別
- 資料驗證工具

**相關文件**：
- [scraper-core 規格](../../packages/scraper-core/SPEC.md)
- [資料格式規範](../technical/DATA-SCHEMA.md)

---

### 階段 1-2：json-manager（3 天）

**目標**：實作 JSON 檔案讀寫與智慧合併

**主要任務**：
- [ ] 實作 `JsonReader`（讀取 JSON）
- [ ] 實作 `JsonWriter`（寫入 JSON）
- [ ] 實作 `JsonMerger`（智慧合併策略）
- [ ] 保留 `customFields` 不被覆蓋
- [ ] 實作 meta 資訊生成

**輸入**：
- `StandardEvent[]` 陣列（來自 scraper）

**輸出**：
- `@matchcal/json-manager` package
- JSON 檔案（包含 meta 與 events）

**相關文件**：
- [json-manager 規格](../../packages/json-manager/SPEC.md)
- [JSON Schema](../technical/JSON-SCHEMA.md)
- [資料格式規範](../technical/DATA-SCHEMA.md)

---

### 階段 1-3：ics-generator（4 天）

**目標**：生成符合 RFC 5545 規範的 ICS 檔案

**主要任務**：
- [ ] 實作 `IcsGenerator`（生成 VCALENDAR）
- [ ] 實作 `VEventBuilder`（生成 VEVENT）
- [ ] 實作時區處理（`VTIMEZONE`）
- [ ] 實作 UID 生成策略
- [ ] 實作 VALARM（提醒）設定
- [ ] 驗證 ICS 檔案正確性

**輸入**：
- `StandardEvent[]` 陣列

**輸出**：
- `@matchcal/ics-generator` package
- .ics 檔案（可被行事曆軟體讀取）

**相關文件**：
- [ics-generator 規格](../../packages/ics-generator/SPEC.md)
- [ICS 規格](../technical/ICS-SPEC.md)
- [RFC 5545](https://datatracker.ietf.org/doc/html/rfc5545)

---

## 🔄 開發順序

**嚴格按照以下順序進行**，不可跳過或同時開發：

```
階段 1-1: scraper-core
    ↓ (完成後)
階段 1-2: json-manager
    ↓ (完成後)
階段 1-3: ics-generator
    ↓ (完成後)
階段 1 完成 ✅
```

**原因**：
- `json-manager` 需要使用 `scraper-core` 的資料格式
- `ics-generator` 需要使用 `scraper-core` 的資料格式
- 三者低耦合，分開開發確保品質

---

## 🎓 開發流程（每個子階段）

### Step 1：閱讀規格

```bash
# 例如：開發 scraper-core
cat packages/scraper-core/SPEC.md
```

### Step 2：建立 Package 結構

```bash
cd packages/scraper-core
mkdir -p src tests
```

### Step 3：TDD 開發

遵循 [TDD 工作流程](../guides/TDD-WORKFLOW.md)：

1. 🔴 **RED**：寫失敗測試
2. 🟢 **GREEN**：最小實作
3. 🔵 **REFACTOR**：重構優化

### Step 4：更新文件

- 更新 `CURRENT-STAGE.md` 的任務勾選
- 如果 API 有變更，更新 Package 的 `SPEC.md`

### Step 5：Commit

```bash
# 結構性變更
git commit -m "refactor(scraper-core): extract validation logic"

# 行為變更
git commit -m "feat(scraper-core): add BaseScraper class"
```

### Step 6：階段完成檢查

- [ ] 所有測試通過（`pnpm test`）
- [ ] Linter 檢查通過（`pnpm lint`）
- [ ] 測試覆蓋率 ≥ 80%
- [ ] SPEC.md 已更新
- [ ] CURRENT-STAGE.md 已更新

---

## 📦 Package 依賴關係

```
scraper-core (無依賴)
    ↓
    ├─ json-manager (依賴 scraper-core)
    └─ ics-generator (依賴 scraper-core)
```

**package.json 範例**：

```json
// packages/json-manager/package.json
{
  "dependencies": {
    "@matchcal/scraper-core": "workspace:*"
  }
}
```

---

## 🧪 測試策略

### 單元測試

每個 Package 都必須有完整的單元測試：

```bash
# 執行單一 package 測試
pnpm --filter @matchcal/scraper-core test

# 執行所有測試
pnpm test
```

### 測試覆蓋率目標

| Package | 目標覆蓋率 |
|---------|-----------|
| scraper-core | ≥ 85% |
| json-manager | ≥ 80% |
| ics-generator | ≥ 80% |

### 測試重點

#### scraper-core
- BaseScraper 抽象類別可被繼承
- Scheduler 可正確解析 cron 表達式
- StandardEventSchema 驗證正確
- generateEventId() 生成正確格式

#### json-manager
- 讀取現有 JSON 檔案
- 寫入新 JSON 檔案
- 智慧合併保留 customFields
- meta 資訊正確生成

#### ics-generator
- 生成有效的 VCALENDAR
- VEVENT 包含所有必要欄位
- VTIMEZONE 正確處理
- 可被 Google/Apple/Outlook 讀取

---

## ✅ 階段完成標準

### 功能完成

- [ ] scraper-core 所有功能實作完成
- [ ] json-manager 所有功能實作完成
- [ ] ics-generator 所有功能實作完成

### 測試完成

- [ ] 所有單元測試通過
- [ ] 測試覆蓋率達標（≥ 80%）
- [ ] 整合測試通過（三個 packages 協同工作）

### 文件完成

- [ ] 每個 Package 的 SPEC.md 完成
- [ ] API 文件完整
- [ ] 範例程式碼齊全

### 程式碼品質

- [ ] ESLint 檢查通過
- [ ] 無 console.log 殘留
- [ ] 無 TODO 註解殘留
- [ ] Commit 歷史清晰

---

## 📝 整合測試範例

階段 1 完成後，應該可以執行以下整合測試：

```javascript
// tests/integration/stage-1.test.js
import { describe, it, expect } from 'vitest';
import { validateEvent } from '@matchcal/scraper-core';
import { JsonManager } from '@matchcal/json-manager';
import { IcsGenerator } from '@matchcal/ics-generator';

describe('Stage 1 Integration', () => {
  it('should work together: validate → save JSON → generate ICS', async () => {
    // 準備測試資料
    const event = {
      id: 'test-event',
      title: 'Test Event',
      startDate: '2025-01-15T09:00:00.000Z',
      endDate: '2025-01-15T18:00:00.000Z',
      timezone: 'Asia/Taipei',
      location: 'Taipei',
      category: 'test',
      level: 'professional',
      source: 'test',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      scrapedAt: new Date().toISOString(),
    };

    // 驗證資料
    expect(() => validateEvent(event)).not.toThrow();

    // 儲存 JSON
    const jsonManager = new JsonManager();
    await jsonManager.write('/tmp/test.json', [event]);

    // 生成 ICS
    const icsGenerator = new IcsGenerator();
    await icsGenerator.generate('/tmp/test.ics', [event]);

    // 驗證檔案存在
    expect(await fs.access('/tmp/test.json')).resolves.toBeUndefined();
    expect(await fs.access('/tmp/test.ics')).resolves.toBeUndefined();
  });
});
```

執行：
```bash
pnpm test tests/integration/stage-1.test.js
```

---

## 🚨 常見問題

### Q: 可以同時開發 json-manager 和 ics-generator 嗎？

A: **不可以**。必須等 scraper-core 完成後，才能開發 json-manager，然後再開發 ics-generator。這確保低耦合與高品質。

### Q: 測試覆蓋率不到 80% 怎麼辦？

A: 必須補足測試，不可進入下一階段。可參考 [TDD 工作流程](../guides/TDD-WORKFLOW.md)。

### Q: 發現設計問題需要重構怎麼辦？

A: 立即重構！遵循 Tidy First 原則，先做結構性變更（獨立 commit），再繼續行為變更。

### Q: 階段 1 完成後可以直接進入階段 3 嗎？

A: **不可以**。必須按順序完成階段 2（scraper-bwf）。

---

## 📚 相關文件

- [scraper-core 規格](../../packages/scraper-core/SPEC.md)
- [json-manager 規格](../../packages/json-manager/SPEC.md)
- [ics-generator 規格](../../packages/ics-generator/SPEC.md)
- [資料格式規範](../technical/DATA-SCHEMA.md)
- [TDD 工作流程](../guides/TDD-WORKFLOW.md)
- [開發指南](../DEVELOPMENT-GUIDE.md)

---

## ⏭️ 下一階段

階段 1 完成後，進入：

**階段 2：第一個資料源（scraper-bwf）**

→ 使用階段 1 建立的核心框架，實作第一個實際的爬蟲。

---

🎯 **嚴格遵循 TDD，建立穩固的基礎！**

# json-manager 規格文件

> JSON 資料管理 Package 規格

---

## 📦 Package 資訊

| 項目 | 內容 |
|------|------|
| Package 名稱 | @matchcal/json-manager |
| 版本 | 0.1.0 |
| 職責 | JSON 檔案讀寫與智慧合併 |
| 依賴 | @matchcal/scraper-core |
| 被依賴 | scraper-* |

---

## 🎯 職責

1. 讀取 JSON 檔案
2. 寫入 JSON 檔案（包含 meta 資訊）
3. 智慧合併（保留 `customFields` 不被覆蓋）
4. 資料版本控制

---

## 📚 公開 API

### JsonManager

```javascript
import { JsonManager } from '@matchcal/json-manager';

const manager = new JsonManager();

// 讀取 JSON
const data = await manager.read('/path/to/file.json');

// 寫入 JSON（新檔案或覆蓋）
await manager.write('/path/to/file.json', events);

// 智慧合併（保留 customFields）
await manager.merge('/path/to/file.json', newEvents);
```

### 方法詳細說明

#### read(filePath)

讀取 JSON 檔案並返回解析後的資料。

```javascript
const data = await manager.read('/data/badminton/bwf-2025.json');
// {
//   meta: { ... },
//   events: [ ... ]
// }
```

#### write(filePath, events)

寫入 JSON 檔案，自動生成 meta 資訊。

```javascript
await manager.write('/data/badminton/bwf-2025.json', events);
```

#### merge(filePath, newEvents)

智慧合併新資料與現有資料：
- 比對 `id` 欄位
- 更新爬蟲生成的欄位
- **保留** `customFields`
- 更新 `updatedAt` 與 `scrapedAt`

```javascript
await manager.merge('/data/badminton/bwf-2025.json', newEvents);
```

---

## 📂 目錄結構

```
packages/json-manager/
├── src/
│   ├── index.js
│   ├── JsonManager.js
│   ├── reader.js
│   ├── writer.js
│   └── merger.js
├── tests/
│   ├── JsonManager.test.js
│   ├── reader.test.js
│   ├── writer.test.js
│   └── merger.test.js
├── package.json
└── SPEC.md
```

---

## 🧪 測試案例列表

- [ ] `should read JSON file`
- [ ] `should throw error if file not found`
- [ ] `should write JSON file with meta`
- [ ] `should merge events preserving customFields`
- [ ] `should update timestamp fields on merge`
- [ ] `should add new events on merge`
- [ ] `should remove deleted events on merge`

---

🎯 **智慧合併是核心功能，確保不覆蓋手動欄位！**

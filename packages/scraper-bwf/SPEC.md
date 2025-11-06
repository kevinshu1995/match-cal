# scraper-bwf 規格文件

> BWF 羽球賽事爬蟲 Package 規格

---

## 📦 Package 資訊

| 項目 | 內容 |
|------|------|
| Package 名稱 | @matchcal/scraper-bwf |
| 版本 | 0.1.0 |
| 職責 | 爬取 BWF 官方網站的羽球賽事資訊 |
| 依賴 | @matchcal/scraper-core, @matchcal/json-manager, @matchcal/ics-generator, puppeteer |
| 被依賴 | 無 |

---

## 🎯 職責

1. 爬取 https://bwfbadminton.com/calendar/ 的賽事資訊
2. 轉換為 StandardEvent 格式
3. 生成 JSON 與 ICS 檔案
4. 定時更新資料

---

## 📚 公開 API

### BwfScraper

```javascript
import { BwfScraper } from '@matchcal/scraper-bwf';

const scraper = new BwfScraper();
const events = await scraper.scrape();
```

---

## 📂 目錄結構

```
packages/scraper-bwf/
├── src/
│   ├── index.js
│   ├── BwfScraper.js
│   ├── transformer.js
│   └── cli.js
├── tests/
│   ├── BwfScraper.test.js
│   └── transformer.test.js
├── package.json
└── SPEC.md
```

---

## 🧪 測試案例列表

- [ ] `should scrape BWF calendar`
- [ ] `should return array of StandardEvent`
- [ ] `should transform BWF data correctly`
- [ ] `should handle empty results`
- [ ] `should retry on network error`

---

## 📊 資料來源

- **URL**: https://bwfbadminton.com/calendar/
- **格式**: HTML（需要 Puppeteer）
- **更新頻率**: 每天

---

## 📝 輸出

- **JSON**: `/data/badminton/bwf-2025.json`
- **ICS**: `/data/badminton/bwf-2025.ics`

---

🎯 **第一個實際爬蟲，驗證核心框架的可用性！**

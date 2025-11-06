# ics-generator 規格文件

> ICS 檔案生成器 Package 規格

---

## 📦 Package 資訊

| 項目 | 內容 |
|------|------|
| Package 名稱 | @matchcal/ics-generator |
| 版本 | 0.1.0 |
| 職責 | 生成符合 RFC 5545 規範的 ICS 檔案 |
| 依賴 | @matchcal/scraper-core |
| 被依賴 | scraper-* |

---

## 🎯 職責

1. 生成 VCALENDAR
2. 生成 VEVENT（每個賽事）
3. 處理時區（VTIMEZONE）
4. 生成 UID（唯一識別碼）
5. 設定 VALARM（提醒）
6. 符合 RFC 5545 規範

---

## 📚 公開 API

### IcsGenerator

```javascript
import { IcsGenerator } from '@matchcal/ics-generator';

const generator = new IcsGenerator();

// 生成 ICS 檔案
await generator.generate('/path/to/file.ics', events);

// 生成 ICS 字串（不儲存檔案）
const icsString = generator.generateString(events);
```

---

## 📂 目錄結構

```
packages/ics-generator/
├── src/
│   ├── index.js
│   ├── IcsGenerator.js
│   ├── VCalendarBuilder.js
│   ├── VEventBuilder.js
│   ├── timezone.js
│   └── validator.js
├── tests/
│   ├── IcsGenerator.test.js
│   ├── VCalendarBuilder.test.js
│   ├── VEventBuilder.test.js
│   └── timezone.test.js
├── package.json
└── SPEC.md
```

---

## 🧪 測試案例列表

- [ ] `should generate valid VCALENDAR`
- [ ] `should include VEVENT for each event`
- [ ] `should handle VTIMEZONE correctly`
- [ ] `should generate unique UID`
- [ ] `should include VALARM for reminders`
- [ ] `should be importable by Google Calendar`
- [ ] `should be importable by Apple Calendar`
- [ ] `should be importable by Outlook`

---

## 📋 ICS 格式範例

```ics
BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MatchCal//Event Calendar//EN
CALSCALE:GREGORIAN
METHOD:PUBLISH

BEGIN:VEVENT
UID:badminton-bwf-2025-01-15-indonesia-masters
DTSTAMP:20251106T100000Z
DTSTART;TZID=Asia/Jakarta:20250115T090000
DTEND;TZID=Asia/Jakarta:20250120T180000
SUMMARY:YONEX Indonesia Masters 2025
DESCRIPTION:BWF Super 750 Tournament
LOCATION:Jakarta, Indonesia
STATUS:CONFIRMED
CATEGORIES:Badminton,International
URL:https://bwfbadminton.com/tournament/...
BEGIN:VALARM
TRIGGER:-PT24H
ACTION:DISPLAY
DESCRIPTION:Event reminder
END:VALARM
END:VEVENT

BEGIN:VTIMEZONE
TZID:Asia/Jakarta
...
END:VTIMEZONE

END:VCALENDAR
```

---

🎯 **符合 RFC 5545 是關鍵，確保跨平台相容！**

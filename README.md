# 比賽賽程自動整合行事曆專案 — 完整需求規格書

## 1. 專案簡介

本專案旨在自動化爬取各種公開比賽（如羽球、足球、籃球、電競等）的賽程資訊，並集成為開放式行事曆網站，讓使用者可一鍵訂閱賽程至自己的 Google/Apple/Outlook 行事曆，並且定時更新資料，確保賽程資訊即時同步。系統架構以最低成本設計，可支撐穩定自動化運作。

---

## 2. 功能需求

### 2.1 前台功能

-   競賽賽程首頁
    -   依分類（運動種類、地區、賽事級別）瀏覽賽程
    -   依時間（本週、本月、全部）篩選賽程
    -   支援搜尋比賽關鍵字
-   行事曆訂閱
    -   提供公開 .ics 檔案下載
    -   提供 .ics 網址訂閱（Webcal 連結）
-   賽事詳情頁
    -   展示賽事詳細資訊：名稱、開始/結束時間、地點、主辦單位、簡介
    -   連結原始官方賽事網站
    -   展示賽事類型、分類
-   語言支援：繁體中文優先（多語系預留）

### 2.2 後台/自動化功能

-   定時爬蟲任務（排程）
    -   支援多來源網站（JSON/XML/HTML/表格等格式）
    -   可擴充爬蟲規則（易於維護與新增新賽事來源）
    -   失敗重試，錯誤資訊自動回報
-   資料聚合與去重
    -   將不同來源賽程內容比對、去重
    -   賽事資料標準化格式（轉換為統一欄位）
-   自動生成/更新 .ics 行事曆
    -   依類別分組（如「足球賽程.ics」「羽球賽程.ics」）
    -   事件欄位包含 UID、DTSTART、DTEND、SUMMARY、DESCRIPTION、LOCATION 等
    -   支援時區（TZID）、重複規則（RRULE）、提醒（VALARM）
-   行事曆檔案自動託管、公開網址

---

## 3. 技術需求

### 3.1 前端

-   使用 Nuxt.js/Vue.js 建構 SPA 網站
-   介面支援 RWD 行動裝置自適應
-   客製化賽程列表、行事曆元件
-   載入 ICS 連結與同步狀態提示

### 3.2 後端/爬蟲

-   Python（Requests、BeautifulSoup、icalendar、pytz 函式庫）
-   定時任務採用 GitHub Actions 或 Cloudflare Workers Cron（免費方案）
-   賽程資料儲存於 GitHub repo 或 JSON/CSV 檔案管理

### 3.3 檔案託管

-   ICS 檔案公開於 GitHub Pages 或 Cloudflare Pages
-   API / Static File 供前端查詢與下載

### 3.4 其他技術

-   時區處理（Asia/Taipei/etc.，支援全球使用者）
-   爬蟲防反爬機制（User-Agent 隨機化、Proxy/ip 池預留設計）
-   可擴充賽事來源（模組化爬蟲）

---

## 4. .ICS 欄位規格

-   BEGIN:VCALENDAR / END:VCALENDAR
-   VERSION / PRODID
-   BEGIN:VEVENT / END:VEVENT（每一場比賽）
    -   UID（唯一識別碼，利於更新/去重）
    -   DTSTAMP（事件建立時間，UTC 格式）
    -   DTSTART（開始時間，可帶 TZID）
    -   DTEND（結束時間）
    -   SUMMARY（標題，例如“羽球 B 組賽事”）
    -   DESCRIPTION（詳細描述、參賽隊伍、官方網址等）
    -   LOCATION（地點，可自動 GPS 化預留）
    -   RRULE（重複規則，例：每週五開打）
    -   VALARM（賽前提醒）
    -   CATEGORIES（自訂分類，例：籃球/公開賽）
-   VTIMEZONE（時區元件，國際標準相容）

---

## 5. 系統運作流程

1. 使用者造訪網站，選擇感興趣的賽程類型
2. 取得賽程列表，查閱賽事詳細內容
3. 按下「訂閱」取得 .ics 檔案或訂閱連結
4. 加入至自己的 Google/Apple/Outlook 行事曆
5. 背景爬蟲定時更新賽程資料，ICS 檔自動更新，使用者行事曆自動同步

---

## 6. 成本與維運需求

| 項目       | 方法                                     | 預估成本 |
| ---------- | ---------------------------------------- | -------- |
| 爬蟲排程   | Github Actions / Cloudflare Workers Cron | 免費     |
| 檔案託管   | GitHub Pages / Cloudflare Pages          | 免費     |
| 資料儲存   | JSON/ICS 靜態檔案                        | 免費     |
| 擴充 Proxy | 初期無需，日後可自建或購買               | 0~200/月 |
| 技術維運   | 開源架構、模組化且易維護                 | 低       |

---

## 7. 擴充規劃

-   增加推播通知（如 Telegram/LINE Bot）
-   社群賽事留言/討論
-   會員制與個人化訂閱管理
-   支援多語系行事曆

---

## 8. 安全性與隱私

-   資料來源僅爬取公開賽事資訊
-   無存取用戶個資
-   行事曆檔案不含敏感資料

---

## 9. 參考資料

-   [RFC 5545 iCalendar 規範]
-   [GitHub Actions 時間排程]
-   [Cloudflare Workers Cron]
-   [icalendar Python 函式庫]
-   [賽程官方網站]


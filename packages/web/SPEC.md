# web 規格文件

> Nuxt 4 前端網站 Package 規格

---

## 📦 Package 資訊

| 項目 | 內容 |
|------|------|
| Package 名稱 | @matchcal/web |
| 版本 | 0.1.0 |
| 職責 | 靜態網站前端（Nuxt 4 generate 模式） |
| 依賴 | nuxt, @nuxt/ui, vue |
| 被依賴 | 無 |

---

## 🎯 職責

1. 展示賽事列表（讀取 JSON 檔案）
2. 提供賽事篩選與搜尋
3. 提供 ICS 下載與訂閱功能
4. RWD 響應式設計（支援手機、平板、桌面）

---

## 📚 功能需求

### 首頁

- 展示所有賽事分類（羽球、籃球等）
- 分類卡片顯示圖示、名稱、賽事數量
- 點擊分類進入賽事列表

### 賽事列表頁

- 展示該分類的所有賽事
- 篩選：本週、本月、全部
- 搜尋：賽事名稱、地點
- 排序：開始時間

### 賽事詳情頁

- 展示賽事完整資訊
- 開始/結束時間（本地化顯示）
- 地點、主辦單位、級別
- 官方網站連結
- ICS 下載按鈕
- ICS 訂閱連結（Webcal）

---

## 📂 目錄結構

```
packages/web/
├── pages/
│   ├── index.vue              # 首頁
│   ├── [category]/
│   │   └── index.vue          # 賽事列表
│   └── [category]/
│       └── [id].vue           # 賽事詳情
├── components/
│   ├── CategoryCard.vue
│   ├── EventList.vue
│   ├── EventCard.vue
│   └── EventDetail.vue
├── composables/
│   ├── useEvents.ts           # 讀取 JSON
│   ├── useCategories.ts       # 讀取分類
│   └── useIcs.ts              # ICS 下載/訂閱
├── public/
│   └── data/                  # → /data (symlink)
├── nuxt.config.ts
├── package.json
└── SPEC.md
```

---

## 🎨 UI 元件（Nuxt UI）

使用 Nuxt UI 提供的元件：

- `UButton`
- `UCard`
- `UInput`（搜尋）
- `USelect`（篩選）
- `UBadge`（級別標籤）
- `UIcon`

---

## 🧪 測試需求

- [ ] 首頁正確載入分類
- [ ] 賽事列表正確顯示
- [ ] 篩選功能正常
- [ ] 搜尋功能正常
- [ ] ICS 下載正常
- [ ] ICS 訂閱連結正確
- [ ] RWD 在手機上正常顯示

---

## 📝 部署

### Generate 模式

```bash
pnpm --filter @matchcal/web generate
```

輸出至 `.output/public/`，可部署到 GitHub Pages。

---

🎯 **使用 Nuxt UI 快速建立美觀的介面！**

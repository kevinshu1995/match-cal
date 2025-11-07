# MatchCal 專案文件

> 比賽賽程自動整合行事曆專案 - 開發文件入口

## 📍 快速開始

### 我是開發人員，現在要開始開發

1. **查看當前開發階段** → [CURRENT-STAGE.md](CURRENT-STAGE.md)
2. **了解開發流程** → [DEVELOPMENT-GUIDE.md](DEVELOPMENT-GUIDE.md)
3. **遵循 TDD 工作流程** → [guides/TDD-WORKFLOW.md](guides/TDD-WORKFLOW.md)

### 我想了解專案架構

-   **系統架構總覽** → [ARCHITECTURE.md](ARCHITECTURE.md)
-   **技術細節文件** → [technical/](technical/)

### 我要新增一個新的賽事來源

-   **新增賽事完整流程** → [guides/ADD-NEW-EVENT-SOURCE.md](guides/ADD-NEW-EVENT-SOURCE.md)

---

## 📚 文件結構（金字塔導覽）

```
docs/
├── INDEX.md                          ← 你在這裡（文件入口）
├── CURRENT-STAGE.md                  ← 當前開發階段（動態更新）
├── DEVELOPMENT-GUIDE.md              ← 開發流程總覽
├── ARCHITECTURE.md                   ← 系統架構總覽
│
├── stages/                           ← 各階段詳細文件
│   ├── STAGE-1-INFRASTRUCTURE.md
│   ├── STAGE-2-FIRST-SCRAPER.md
│   ├── STAGE-3-FRONTEND.md
│   └── STAGE-4-AUTOMATION.md
│
├── technical/                        ← 技術規格文件
│   ├── DATA-SCHEMA.md
│   ├── ICS-SPEC.md
│   ├── JSON-SCHEMA.md
│   └── SCRAPER-INTERFACE.md
│
└── guides/                           ← 操作指南
    ├── ADD-NEW-EVENT-SOURCE.md
    ├── TDD-WORKFLOW.md
    └── COMMIT-CONVENTION.md
```

---

## 🎯 核心開發原則

本專案嚴格遵循以下開發方法論：

### TDD（測試驅動開發）

```
🔴 RED → 🟢 GREEN → 🔵 REFACTOR
```

1. 先寫失敗測試（RED）
2. 寫最小程式碼讓測試通過（GREEN）
3. 重構優化（REFACTOR）

### Tidy First（結構優先）

-   **結構性變更**與**行為變更**必須分開 commit
-   結構性變更：重新命名、提取方法、移動程式碼
-   行為變更：新增功能、修改邏輯

### 低耦合設計

-   不同 Package 獨立開發，不同時進行
-   透過標準化資料格式溝通
-   每個 Package 可獨立測試

---

## 🔄 開發流程速查

```
START
  ↓
查看 CURRENT-STAGE.md（知道現在在哪個階段）
  ↓
閱讀該階段文件（stages/STAGE-X-XXX.md）
  ↓
閱讀 Package 規格（packages/{package}/SPEC.md）
  ↓
開始 TDD 開發（參考 TDD-WORKFLOW.md）
  ↓
完成功能 → 更新文件 → Commit
  ↓
階段完成 → 更新 docs/CURRENT-STAGE.md、 docs/stages/STAGE-x-x.md → 進入下一階段
```

---

## 📦 Monorepo 結構

```
MatchCal/
├── packages/
│   ├── scraper-core/      # 爬蟲核心框架
│   ├── json-manager/      # JSON 資料管理
│   ├── ics-generator/     # ICS 檔案生成器
│   ├── scraper-bwf/       # BWF 羽球賽事爬蟲
│   └── web/               # Nuxt 4 前端
├── docs/                  # 文件（你在這裡）
└── data/                  # 賽事資料輸出目錄
```

---

## ❓ 常見問題

### Q: 我不知道現在應該做什麼？

→ 查看 [CURRENT-STAGE.md](CURRENT-STAGE.md)，它會告訴你當前階段和待辦事項。

### Q: 我要查閱某個技術細節？

→ 查看 [technical/](technical/) 目錄下的技術文件。

### Q: 我要新增一個新的比賽來源？

→ 遵循 [guides/ADD-NEW-EVENT-SOURCE.md](guides/ADD-NEW-EVENT-SOURCE.md) 的步驟。

### Q: 我不確定要寫什麼測試？

→ 參考 [guides/TDD-WORKFLOW.md](guides/TDD-WORKFLOW.md) 和各 Package 的 SPEC.md。

### Q: 我可以跳過測試嗎？

→ **絕對不行**。本專案嚴格遵循 TDD，所有程式碼必須先有測試。

---

## 📝 文件更新規則

-   當 **API 變更**時 → 更新對應 Package 的 SPEC.md
-   當 **完成階段里程碑**時 → 更新 CURRENT-STAGE.md
-   當 **新增技術決策**時 → 新增或更新 technical/ 下的文件
-   當 **完成整個階段**時 → 更新 CURRENT-STAGE.md 指向下一階段

---

## 🚀 立即開始

現在請前往 → [CURRENT-STAGE.md](CURRENT-STAGE.md)

查看當前開發階段並開始工作！


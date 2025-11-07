# MatchCal 開發指南

> 完整的開發環境設定與工作流程說明

---

## 📋 目錄

1. [開發環境設定](#開發環境設定)
2. [Monorepo 工具使用](#monorepo-工具使用)
3. [開發流程總覽](#開發流程總覽)
4. [如何找到當前階段文件](#如何找到當前階段文件)
5. [常用指令](#常用指令)

---

## 開發環境設定

### 必要工具

| 工具 | 版本要求 | 用途 |
|------|---------|------|
| Node.js | >= 20.x | 執行環境 |
| pnpm | >= 9.x | 套件管理工具 |
| Git | >= 2.x | 版本控制 |

### 安裝步驟

#### 1. 安裝 Node.js

```bash
# 使用 nvm 安裝（推薦）
nvm install 20
nvm use 20
```

#### 2. 安裝 pnpm

```bash
npm install -g pnpm
```

#### 3. Clone 專案

```bash
git clone <repository-url>
cd MatchCal
```

#### 4. 安裝相依套件

```bash
pnpm install
```

這會安裝所有 packages 的相依套件。

### MCP 工具設定

本專案使用以下 MCP 工具來輔助開發：

| MCP 工具 | 用途 |
|---------|------|
| context7 (nuxt) | Nuxt 框架文件查詢 |
| context7 (shadcn-vue) | shadcn-vue 組件文件查詢 |
| context7 (radix-vue) | Radix Vue 無頭組件文件查詢 |
| chrome-devtools | 瀏覽器偵錯與爬蟲測試 |
| GitHub MCP | GitHub Actions、Issues、PRs 管理 |
| Filesystem MCP | 檔案系統操作與監控 |

---

## Monorepo 工具使用

### pnpm workspaces 基礎

本專案使用 **pnpm workspaces** 管理 Monorepo。

#### Workspace 設定

專案根目錄的 `package.json`：

```json
{
  "name": "matchcal",
  "private": true,
  "workspaces": [
    "packages/*"
  ]
}
```

#### Package 命名規範

所有 packages 使用 `@matchcal/` 前綴：

- `@matchcal/scraper-core`
- `@matchcal/json-manager`
- `@matchcal/ics-generator`
- `@matchcal/scraper-bwf`
- `@matchcal/web`

### 常用 pnpm 指令

#### 安裝套件

```bash
# 在根目錄安裝開發工具
pnpm add -D <package-name> -w

# 在特定 package 安裝相依套件
pnpm add <package-name> --filter @matchcal/scraper-core

# 在特定 package 安裝開發相依
pnpm add -D <package-name> --filter @matchcal/scraper-core
```

#### 執行指令

```bash
# 在所有 packages 執行測試
pnpm test

# 在特定 package 執行測試
pnpm --filter @matchcal/scraper-core test

# 在所有 packages 執行 build
pnpm -r build

# 在特定 package 執行開發模式
pnpm --filter @matchcal/web dev
```

#### Package 間相依

在 `packages/scraper-bwf/package.json` 中引用另一個 package：

```json
{
  "dependencies": {
    "@matchcal/scraper-core": "workspace:*"
  }
}
```

使用 `workspace:*` 表示使用本地 workspace 版本。

---

## 開發流程總覽

### 🎯 核心開發循環

```
查看當前階段
    ↓
閱讀階段文件
    ↓
閱讀 Package 規格
    ↓
TDD 開發（RED → GREEN → REFACTOR）
    ↓
更新文件
    ↓
Commit（結構性與行為分離）
    ↓
階段完成 → 更新 CURRENT-STAGE.md
```

### 詳細流程

#### Step 1：查看當前階段

```bash
# 開啟當前階段文件
cat docs/CURRENT-STAGE.md
```

這個文件會告訴你：
- 現在在哪個階段
- 本階段的目標和任務
- 需要閱讀哪些相關文件

#### Step 2：閱讀階段文件

根據 `CURRENT-STAGE.md` 的指引，閱讀對應的階段文件：

```bash
# 例如：階段 1-1
cat docs/stages/STAGE-1-INFRASTRUCTURE.md
```

階段文件會提供：
- 階段目標
- 涉及的 Packages
- 開發順序
- 輸入/輸出定義

#### Step 3：閱讀 Package 規格

```bash
# 例如：scraper-core
cat packages/scraper-core/SPEC.md
```

規格文件包含：
- Package 職責
- 公開 API
- 資料格式
- 測試案例列表

#### Step 4：TDD 開發

遵循嚴格的 TDD 循環（詳見 [TDD-WORKFLOW.md](guides/TDD-WORKFLOW.md)）：

1. **🔴 RED**：寫一個失敗的測試
2. **🟢 GREEN**：寫最小程式碼讓測試通過
3. **🔵 REFACTOR**：重構優化

#### Step 5：更新文件

完成功能後：
- 更新 `CURRENT-STAGE.md` 的任務勾選
- 如果 API 有變更，更新 Package 的 SPEC.md
- 如果有技術決策，更新 technical/ 下的文件

#### Step 6：Commit

遵循 Tidy First 原則：

```bash
# 結構性變更（重構）
git commit -m "refactor(scraper-core): extract scheduler into separate class"

# 行為變更（新功能）
git commit -m "feat(scraper-core): add cron scheduler support"
```

**重要**：結構性變更與行為變更必須分開 commit！

---

## 如何找到當前階段文件

### 金字塔導航系統

```
START（你在任何地方）
    ↓
docs/INDEX.md（文件入口）
    ↓
docs/CURRENT-STAGE.md（當前階段標記）
    ↓
docs/stages/STAGE-X-XXX.md（階段詳細文件）
    ↓
packages/{package}/SPEC.md（Package 規格）
    ↓
docs/technical/XXX.md（技術細節，按需查閱）
```

### 導航原則

1. **永遠從 INDEX.md 開始**（如果你不知道要看什麼）
2. **查看 CURRENT-STAGE.md 知道當前進度**（每天開始工作前必看）
3. **只閱讀當前階段相關文件**（不要跨階段閱讀）
4. **按需查閱技術文件**（遇到技術問題時才看）

### 快速導航指令

```bash
# 快速查看當前階段
cat docs/CURRENT-STAGE.md

# 快速查看入口文件
cat docs/INDEX.md

# 列出所有階段文件
ls docs/stages/

# 列出所有技術文件
ls docs/technical/

# 查看特定 Package 規格
cat packages/scraper-core/SPEC.md
```

---

## 常用指令

### 專案管理

```bash
# 安裝所有相依套件
pnpm install

# 清除所有 node_modules
pnpm -r exec rm -rf node_modules
rm -rf node_modules

# 重新安裝
pnpm install
```

### 測試

```bash
# 執行所有測試
pnpm test

# 執行特定 package 的測試
pnpm --filter @matchcal/scraper-core test

# 執行測試並顯示覆蓋率
pnpm test:coverage

# 監聽模式（開發時使用）
pnpm --filter @matchcal/scraper-core test:watch
```

### 程式碼品質

```bash
# 執行 ESLint
pnpm lint

# 自動修復 ESLint 錯誤
pnpm lint:fix

# 執行型別檢查（如果使用 TypeScript）
pnpm type-check
```

### 建置

```bash
# 建置所有 packages
pnpm -r build

# 建置特定 package
pnpm --filter @matchcal/scraper-core build

# 清除建置結果
pnpm -r clean
```

### 開發

```bash
# 啟動前端開發伺服器
pnpm --filter @matchcal/web dev

# 執行爬蟲（開發測試用）
pnpm --filter @matchcal/scraper-bwf scrape

# 生成 ICS 檔案
pnpm --filter @matchcal/ics-generator generate
```

### Git 工作流程

```bash
# 查看當前狀態
git status

# 階段性提交（功能完成時）
git add .
git commit -m "feat(package): description"

# 查看提交歷史
git log --oneline

# 推送到遠端
git push origin main
```

---

## 🚨 開發注意事項

### ✅ 務必遵守

1. **嚴格遵循 TDD**：所有程式碼必須先有測試
2. **分階段開發**：不要同時開發多個 Package
3. **分離 Commit**：結構性變更與行為變更分開提交
4. **更新文件**：完成功能後立即更新 CURRENT-STAGE.md
5. **低耦合設計**：Package 間透過標準化資料格式溝通

### ❌ 絕對禁止

1. **跳過測試**：不寫測試直接寫程式碼
2. **跨階段開發**：當前階段未完成就開始下一階段
3. **混合 Commit**：在同一個 commit 中包含結構性與行為變更
4. **修改其他 Package**：開發 Package A 時修改 Package B 的程式碼
5. **直接推送到 main**：未經測試的程式碼

### 💡 最佳實踐

1. **小步前進**：每次只實作一個小功能
2. **頻繁提交**：功能完成就提交，不要累積
3. **持續測試**：每次修改後都執行測試
4. **及時重構**：測試通過後立即重構
5. **保持溝通**：遇到問題及時討論

---

## 📚 延伸閱讀

- [TDD 工作流程](guides/TDD-WORKFLOW.md)
- [Commit 規範](guides/COMMIT-CONVENTION.md)
- [系統架構](ARCHITECTURE.md)
- [新增賽事流程](guides/ADD-NEW-EVENT-SOURCE.md)

---

## ❓ 常見問題

### Q: 我應該使用哪個 Node.js 版本？

A: Node.js 20.x（LTS），使用 `nvm` 管理版本。

### Q: 為什麼使用 pnpm 而不是 npm 或 yarn？

A: pnpm 有更快的安裝速度、更節省磁碟空間，且對 Monorepo 支援良好。

### Q: 我可以跳過某個階段直接開發嗎？

A: **絕對不行**。階段之間有依賴關係，必須按順序開發。

### Q: 測試覆蓋率要達到多少？

A: 目標是 80% 以上，核心邏輯必須 100% 覆蓋。

### Q: 我修改了 Package A，需要重新建置其他 Package 嗎？

A: 如果其他 Package 依賴 Package A，需要重新建置。使用 `pnpm -r build` 建置所有 packages。

---

🚀 **準備好了嗎？** 現在前往 [CURRENT-STAGE.md](CURRENT-STAGE.md) 開始開發！

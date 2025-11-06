# 階段 4：自動化整合

> 設定 GitHub Actions 自動化爬取、建置與部署

---

## 📋 階段資訊

| 項目 | 內容 |
|------|------|
| 階段名稱 | 階段 4：自動化整合 |
| 預計工期 | 5 天 |
| 涉及元件 | GitHub Actions, 部署流程 |
| 前置需求 | 階段 1、2、3 完成 |
| 輸出 | 完全自動化的 CI/CD 流程 |

---

## 🎯 階段目標

建立完全自動化的工作流程，實現：

1. **定時爬取**：每天自動執行爬蟲，更新賽事資料
2. **自動建置**：資料更新後自動重新建置網站
3. **自動部署**：建置完成後自動部署至 GitHub Pages
4. **錯誤通知**：爬取或建置失敗時自動通知
5. **零成本運行**：完全使用免費服務（GitHub Actions + GitHub Pages）

---

## 📅 主要任務

### 1. 定時爬取工作流程（1.5 天）

- [ ] 建立 `.github/workflows/scrape.yml`
- [ ] 設定 cron 排程（每天執行）
- [ ] 執行爬蟲並更新 JSON/ICS
- [ ] Commit 並 Push 更新
- [ ] 實作錯誤處理與重試

**工作流程檔案**：

```yaml
# .github/workflows/scrape.yml
name: Scrape Events

on:
  schedule:
    # 每天 UTC 18:00 執行（台北時間凌晨 2:00）
    - cron: '0 18 * * *'
  workflow_dispatch:  # 允許手動觸發

jobs:
  scrape:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run BWF scraper
        run: pnpm --filter @matchcal/scraper-bwf scrape
        env:
          NODE_ENV: production

      - name: Check for changes
        id: check_changes
        run: |
          if [[ -n $(git status --porcelain data/) ]]; then
            echo "changes=true" >> $GITHUB_OUTPUT
          else
            echo "changes=false" >> $GITHUB_OUTPUT
          fi

      - name: Commit and push if changed
        if: steps.check_changes.outputs.changes == 'true'
        run: |
          git config --local user.email "github-actions[bot]@users.noreply.github.com"
          git config --local user.name "github-actions[bot]"
          git add data/
          git commit -m "chore(data): update events data [skip ci]"
          git push

      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 Scraper 執行失敗',
              body: '定時爬取任務執行失敗，請檢查 workflow logs。',
              labels: ['automation', 'bug']
            })
```

---

### 2. 自動建置與部署工作流程（1.5 天）

- [ ] 建立 `.github/workflows/deploy.yml`
- [ ] 監聽 `data/` 目錄變更
- [ ] 建置 Nuxt 網站（SSG）
- [ ] 部署至 GitHub Pages
- [ ] 實作錯誤處理

**工作流程檔案**：

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
    paths:
      - 'packages/web/**'
      - 'data/**'
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest

    permissions:
      contents: read
      pages: write
      id-token: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Copy data to web public directory
        run: |
          mkdir -p packages/web/public/data
          cp -r data/* packages/web/public/data/

      - name: Build Nuxt website
        run: pnpm --filter web generate
        env:
          NODE_ENV: production

      - name: Setup Pages
        uses: actions/configure-pages@v4

      - name: Upload artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './packages/web/.output/public'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4

      - name: Notify on failure
        if: failure()
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.create({
              owner: context.repo.owner,
              repo: context.repo.repo,
              title: '🚨 部署失敗',
              body: '網站建置或部署失敗，請檢查 workflow logs。',
              labels: ['automation', 'deployment', 'bug']
            })
```

---

### 3. 測試工作流程（1 天）

- [ ] 建立 `.github/workflows/test.yml`
- [ ] 在 PR 時自動執行測試
- [ ] 確保測試通過才能合併
- [ ] 產生測試覆蓋率報告

**工作流程檔案**：

```yaml
# .github/workflows/test.yml
name: Run Tests

on:
  pull_request:
    branches: [main]
  push:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout repository
        uses: actions/checkout@v4

      - name: Setup pnpm
        uses: pnpm/action-setup@v2
        with:
          version: 8

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'pnpm'

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Run linter
        run: pnpm lint

      - name: Run type check
        run: pnpm type-check

      - name: Run tests
        run: pnpm test --coverage

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
          flags: unittests
          name: codecov-umbrella

      - name: Comment PR with coverage
        if: github.event_name == 'pull_request'
        uses: romeovs/lcov-reporter-action@v0.3.1
        with:
          lcov-file: ./coverage/lcov.info
          github-token: ${{ secrets.GITHUB_TOKEN }}
```

---

### 4. 監控與通知設定（0.5 天）

- [ ] 設定失敗通知（GitHub Issues）
- [ ] 設定成功通知（選用）
- [ ] 建立 Slack/Discord Webhook（選用）
- [ ] 設定 Uptime 監控（選用）

**Slack 通知範例**：

```yaml
# 在 scrape.yml 或 deploy.yml 中加入
- name: Notify Slack on success
  if: success()
  uses: slackapi/slack-github-action@v1
  with:
    payload: |
      {
        "text": "✅ 賽事資料已更新並部署成功",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*MatchCal 自動化任務完成*\n已更新賽事資料並重新部署網站。"
            }
          }
        ]
      }
  env:
    SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK_URL }}
```

---

### 5. 文件與維護（0.5 天）

- [ ] 撰寫自動化流程說明文件
- [ ] 建立故障排除指南
- [ ] 建立監控儀表板（選用）
- [ ] 設定 GitHub Repository 設定

**Repository 設定**：

1. **啟用 GitHub Pages**：
   - Settings → Pages
   - Source: GitHub Actions
   - Custom domain（選用）

2. **設定 Secrets**（如需要）：
   - Settings → Secrets and variables → Actions
   - 新增 `SLACK_WEBHOOK_URL`（如使用 Slack 通知）

3. **Branch Protection**：
   - Settings → Branches → Add rule
   - Require status checks to pass before merging
   - Require branches to be up to date before merging

---

### 6. 整合測試（0.5 天）

- [ ] 手動觸發爬取工作流程
- [ ] 驗證資料更新
- [ ] 驗證網站自動重新部署
- [ ] 驗證錯誤通知機制
- [ ] 驗證完整端到端流程

**測試檢查清單**：

```bash
# 1. 手動觸發爬取
# GitHub → Actions → Scrape Events → Run workflow

# 2. 檢查 data/ 目錄是否更新
git pull
ls -la data/bwf/

# 3. 檢查是否觸發部署
# GitHub → Actions → Deploy to GitHub Pages

# 4. 驗證網站更新
# 訪問 https://[username].github.io/MatchCal

# 5. 測試錯誤通知
# 故意讓爬蟲失敗，檢查是否建立 Issue
```

---

## 🔄 完整自動化流程

```
定時觸發（每天 02:00）
    ↓
執行爬蟲（scrape.yml）
    ↓
更新 data/ 目錄
    ↓
Commit & Push
    ↓
觸發部署（deploy.yml）
    ↓
建置 Nuxt 網站
    ↓
部署至 GitHub Pages
    ↓
使用者看到最新賽事 ✅
```

**失敗處理**：
```
任務失敗
    ↓
自動重試（最多 3 次）
    ↓
仍然失敗
    ↓
建立 GitHub Issue
    ↓
通知開發者（Email/Slack）
```

---

## 🧪 測試策略

### 本地測試

在推送至 GitHub 前先本地測試：

```bash
# 測試爬蟲
pnpm --filter @matchcal/scraper-bwf scrape

# 測試建置
pnpm --filter web generate

# 測試部署（本地預覽）
pnpm --filter web preview
```

### GitHub Actions 測試

使用 `workflow_dispatch` 手動觸發：

```yaml
on:
  workflow_dispatch:  # 允許手動觸發
```

在 GitHub Actions 頁面手動執行工作流程。

### 模擬失敗情境

```bash
# 測試爬蟲失敗通知
# 修改爬蟲程式碼故意拋出錯誤
throw new Error('Test error');

# 推送至 GitHub，檢查是否建立 Issue
```

---

## ✅ 階段完成標準

### 工作流程完成

- [ ] `scrape.yml` 建立並可正常執行
- [ ] `deploy.yml` 建立並可正常執行
- [ ] `test.yml` 建立並可正常執行
- [ ] 定時任務正常運作（cron schedule）
- [ ] 手動觸發功能正常

### 自動化驗證

- [ ] 爬蟲每天自動執行
- [ ] 資料更新自動觸發部署
- [ ] 網站自動重新建置與部署
- [ ] 失敗自動通知（GitHub Issue）
- [ ] 測試自動執行（PR 時）

### 監控設定

- [ ] GitHub Actions 狀態監控
- [ ] 錯誤通知機制完成
- [ ] Uptime 監控設定（選用）
- [ ] 效能監控設定（選用）

### 文件完成

- [ ] 自動化流程說明文件
- [ ] 故障排除指南
- [ ] 維護手冊

---

## 📊 成本分析

### GitHub Actions 免費額度

| 項目 | 免費額度 | 預估使用量 |
|------|---------|----------|
| 執行時間 | 2000 分鐘/月 | ~100 分鐘/月 |
| 儲存空間 | 500 MB | ~50 MB |
| 並行任務 | 20 個 | 3 個 |

**預估月成本**：**$0**（完全在免費額度內）

### 成本優化建議

1. **減少執行頻率**：
   - 改為每週執行（而非每天）
   - 節省 ~70% 執行時間

2. **快取依賴套件**：
   ```yaml
   - uses: actions/setup-node@v4
     with:
       cache: 'pnpm'  # 快取 node_modules
   ```

3. **條件式觸發**：
   ```yaml
   on:
     push:
       paths:
         - 'data/**'  # 只在 data 變更時觸發
   ```

---

## 🚨 常見問題

### Q: GitHub Actions 執行失敗怎麼辦？

A: 檢查 workflow logs：
1. GitHub → Actions → 選擇失敗的 workflow
2. 點擊失敗的 job 查看詳細 logs
3. 根據錯誤訊息修正問題

### Q: 爬蟲執行成功但沒有 Commit？

A: 檢查是否真的有資料變更：

```yaml
- name: Check for changes
  run: git status --porcelain data/
```

如果沒有輸出，代表資料沒有變更，不會產生 commit。

### Q: 部署後網站顯示 404？

A: 檢查 `nuxt.config.ts` 的 `baseURL` 設定：

```typescript
export default defineNuxtConfig({
  app: {
    baseURL: '/MatchCal/',  // 必須與 repo 名稱一致
  },
});
```

### Q: 如何設定自訂網域？

A:
1. 在 DNS 設定 CNAME 記錄指向 `[username].github.io`
2. Settings → Pages → Custom domain
3. 輸入網域名稱（例：`matchcal.example.com`）
4. 等待 DNS 驗證完成

### Q: cron 排程不執行？

A: 檢查：
1. 主分支是否為 `main`（GitHub Actions 只在預設分支執行 schedule）
2. workflow 檔案是否在 `.github/workflows/` 目錄
3. cron 語法是否正確（使用 UTC 時區）

---

## 📚 相關文件

- [GitHub Actions 文件](https://docs.github.com/en/actions)
- [GitHub Pages 文件](https://docs.github.com/en/pages)
- [Cron 語法說明](https://crontab.guru/)
- [開發指南](../DEVELOPMENT-GUIDE.md)

---

## 🎓 維護指南

### 新增爬蟲時

1. 複製現有的 scraper package
2. 修改 `scrape.yml`，加入新的爬蟲任務：

```yaml
- name: Run Basketball scraper
  run: pnpm --filter @matchcal/scraper-basketball scrape
```

### 修改排程時間

```yaml
on:
  schedule:
    - cron: '0 18 * * *'  # 修改此行
```

**常用排程**：
- 每天凌晨 2:00（UTC 18:00）：`0 18 * * *`
- 每週一凌晨 2:00：`0 18 * * 1`
- 每月 1 號凌晨 2:00：`0 18 1 * *`

### 監控儀表板

建立 `STATUS.md` 展示自動化狀態：

```markdown
# MatchCal 系統狀態

## 自動化任務

| 任務 | 狀態 | 最後執行 |
|------|------|---------|
| BWF 爬蟲 | ![](https://github.com/[user]/MatchCal/workflows/Scrape%20Events/badge.svg) | 2025-01-15 02:00 |
| 網站部署 | ![](https://github.com/[user]/MatchCal/workflows/Deploy/badge.svg) | 2025-01-15 02:05 |
```

---

## ✨ 進階功能（選用）

### 1. 多地區部署

使用 Cloudflare Pages 作為備援：

```yaml
- name: Deploy to Cloudflare Pages
  uses: cloudflare/pages-action@v1
  with:
    apiToken: ${{ secrets.CLOUDFLARE_API_TOKEN }}
    accountId: ${{ secrets.CLOUDFLARE_ACCOUNT_ID }}
    projectName: matchcal
    directory: packages/web/.output/public
```

### 2. 效能監控

使用 Lighthouse CI：

```yaml
- name: Run Lighthouse CI
  uses: treosh/lighthouse-ci-action@v9
  with:
    urls: |
      https://[username].github.io/MatchCal/
    uploadArtifacts: true
```

### 3. 自動更新依賴套件

使用 Dependabot：

```yaml
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
```

---

## 🎯 階段完成後

**恭喜！專案已完全自動化運行！**

現在你擁有：
- ✅ 自動化爬取賽事資料
- ✅ 自動化建置與部署網站
- ✅ 自動化測試與品質檢查
- ✅ 錯誤監控與通知
- ✅ 零成本運行

**後續維護**：
1. 定期檢查 GitHub Issues（錯誤通知）
2. 新增更多賽事來源（參考 [新增賽事來源指南](../guides/ADD-NEW-EVENT-SOURCE.md)）
3. 優化網站 UI/UX
4. 收集使用者回饋並改進

---

🚀 **享受全自動化的比賽賽程整合服務！**

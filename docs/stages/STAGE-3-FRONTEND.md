# 階段 3：前端網站（web）

> 建立 Nuxt 4 網站，展示賽事資料並提供訂閱功能

---

## 📋 階段資訊

| 項目 | 內容 |
|------|------|
| 階段名稱 | 階段 3：前端網站（web） |
| 預計工期 | 10 天 |
| 涉及 Packages | web |
| 前置需求 | 階段 2 完成（至少有一個資料源） |
| 輸出 | 可部署的 Nuxt 4 網站 |

---

## 🎯 階段目標

建立開放式行事曆網站，讓使用者可以：
- 瀏覽所有賽事
- 依分類/時間篩選賽事
- 一鍵訂閱行事曆（下載 ICS 或訂閱 URL）
- 查看賽事詳情

**技術選擇**：
- 框架：Nuxt 4（Vue 3）
- UI 框架：Nuxt UI
- 部署：GitHub Pages / Cloudflare Pages
- 資料來源：靜態 JSON 檔案（來自 `data/` 目錄）

---

## 📅 主要任務

### 1. 專案初始化（1 天）

- [ ] 建立 `packages/web/` 目錄
- [ ] 初始化 Nuxt 4 專案
- [ ] 安裝 Nuxt UI
- [ ] 設定 TypeScript
- [ ] 設定 ESLint / Prettier
- [ ] 建立基礎目錄結構

**初始化指令**：
```bash
cd packages
npx nuxi@latest init web
cd web
pnpm add @nuxt/ui
```

**目錄結構**：
```
packages/web/
├── nuxt.config.ts
├── app.vue
├── pages/
│   ├── index.vue              # 首頁
│   ├── events/
│   │   ├── index.vue          # 賽事列表
│   │   └── [id].vue           # 賽事詳情
│   └── subscribe.vue          # 訂閱說明
├── components/
│   ├── EventCard.vue          # 賽事卡片
│   ├── EventList.vue          # 賽事列表
│   ├── FilterBar.vue          # 篩選條件
│   └── SubscribeButton.vue    # 訂閱按鈕
├── composables/
│   ├── useEvents.ts           # 賽事資料邏輯
│   └── useFilters.ts          # 篩選邏輯
├── public/
│   └── data/                  # 複製自 ../../data/
│       └── bwf/
│           ├── events.json
│           └── badminton.ics
└── types/
    └── event.ts               # TypeScript 型別定義
```

---

### 2. 首頁設計（1 天）

- [ ] 設計首頁 UI（Hero Section + CTA）
- [ ] 展示最新賽事
- [ ] 導航至賽事列表
- [ ] RWD 響應式設計

**頁面結構**：
```vue
<!-- pages/index.vue -->
<template>
  <div>
    <Hero />
    <LatestEvents :events="latestEvents" />
    <CategoriesSection />
  </div>
</template>
```

---

### 3. 賽事列表頁面（2 天）

- [ ] 展示所有賽事（卡片或列表模式）
- [ ] 實作篩選功能（分類/日期/關鍵字）
- [ ] 實作排序功能（依日期/名稱）
- [ ] 實作分頁或無限滾動
- [ ] RWD 響應式設計

**功能需求**：

#### 3.1 篩選條件
- 分類（羽球/籃球/足球等）
- 時間範圍（本週/本月/全部）
- 搜尋關鍵字

```vue
<!-- components/FilterBar.vue -->
<template>
  <div class="filter-bar">
    <USelect v-model="category" :options="categories" />
    <USelect v-model="timeRange" :options="timeRanges" />
    <UInput v-model="searchQuery" placeholder="搜尋賽事..." />
  </div>
</template>
```

#### 3.2 賽事卡片

```vue
<!-- components/EventCard.vue -->
<template>
  <UCard>
    <h3>{{ event.title }}</h3>
    <p>{{ formatDate(event.startDate) }}</p>
    <p>{{ event.location }}</p>
    <UButton @click="navigateTo(`/events/${event.id}`)">
      查看詳情
    </UButton>
  </UCard>
</template>
```

---

### 4. 賽事詳情頁面（1 天）

- [ ] 展示完整賽事資訊
- [ ] 顯示開始/結束時間
- [ ] 顯示地點與主辦單位
- [ ] 連結官方網站
- [ ] 提供訂閱按鈕

**頁面結構**：
```vue
<!-- pages/events/[id].vue -->
<template>
  <div>
    <h1>{{ event.title }}</h1>
    <div>開始時間：{{ formatDate(event.startDate) }}</div>
    <div>結束時間：{{ formatDate(event.endDate) }}</div>
    <div>地點：{{ event.location }}</div>
    <div>{{ event.description }}</div>

    <SubscribeButton :event="event" />
    <UButton :to="event.sourceUrl" external>
      前往官方網站
    </UButton>
  </div>
</template>
```

---

### 5. 訂閱功能（2 天）

- [ ] 實作下載 ICS 功能
- [ ] 實作訂閱 URL 功能（Webcal）
- [ ] 提供訂閱說明頁面
- [ ] 支援分類訂閱（只訂閱羽球/籃球等）

#### 5.1 訂閱按鈕

```vue
<!-- components/SubscribeButton.vue -->
<template>
  <div>
    <UButton @click="downloadICS">下載 ICS 檔案</UButton>
    <UButton @click="copyWebcalUrl">複製訂閱連結</UButton>
  </div>
</template>

<script setup lang="ts">
const downloadICS = () => {
  // 下載 /data/bwf/badminton.ics
  window.location.href = '/data/bwf/badminton.ics';
};

const copyWebcalUrl = () => {
  // 複製 webcal:// 連結
  const url = 'webcal://matchcal.example.com/data/bwf/badminton.ics';
  navigator.clipboard.writeText(url);
};
</script>
```

#### 5.2 訂閱說明頁面

```vue
<!-- pages/subscribe.vue -->
<template>
  <div>
    <h1>如何訂閱賽事行事曆</h1>

    <section>
      <h2>方法一：下載 ICS 檔案</h2>
      <p>下載後匯入至 Google/Apple/Outlook 行事曆</p>
    </section>

    <section>
      <h2>方法二：訂閱 URL（推薦）</h2>
      <p>使用訂閱連結，賽事自動同步更新</p>
      <ol>
        <li>複製訂閱連結</li>
        <li>在行事曆軟體中選擇「新增訂閱」</li>
        <li>貼上連結</li>
      </ol>
    </section>
  </div>
</template>
```

---

### 6. 資料載入（1 天）

- [ ] 實作 composable 載入 JSON 資料
- [ ] 實作資料快取（localStorage）
- [ ] 實作錯誤處理
- [ ] 實作載入狀態

```typescript
// composables/useEvents.ts
export const useEvents = () => {
  const events = ref<StandardEvent[]>([]);
  const loading = ref(false);
  const error = ref<Error | null>(null);

  const fetchEvents = async () => {
    loading.value = true;
    try {
      const response = await fetch('/data/bwf/events.json');
      const data = await response.json();
      events.value = data.events;
    } catch (e) {
      error.value = e as Error;
    } finally {
      loading.value = false;
    }
  };

  return { events, loading, error, fetchEvents };
};
```

---

### 7. SEO 優化（1 天）

- [ ] 設定 meta tags（title, description）
- [ ] 設定 Open Graph tags
- [ ] 設定 sitemap.xml
- [ ] 設定 robots.txt
- [ ] 實作 SSG（Static Site Generation）

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  app: {
    head: {
      title: 'MatchCal - 比賽賽程自動整合行事曆',
      meta: [
        { name: 'description', content: '一鍵訂閱各種比賽賽程至個人行事曆' },
        { property: 'og:title', content: 'MatchCal' },
        { property: 'og:description', content: '比賽賽程自動整合行事曆' },
      ],
    },
  },
  nitro: {
    prerender: {
      routes: ['/sitemap.xml'],
    },
  },
});
```

---

### 8. 測試（1 天）

- [ ] 元件測試（Vitest + Testing Library）
- [ ] E2E 測試（Playwright）
- [ ] 手動測試（多瀏覽器/裝置）

```typescript
// components/EventCard.test.ts
import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import EventCard from './EventCard.vue';

describe('EventCard', () => {
  it('renders event title', () => {
    const wrapper = mount(EventCard, {
      props: {
        event: {
          id: 'test-1',
          title: 'Test Event',
          startDate: '2025-01-15T09:00:00.000Z',
        },
      },
    });
    expect(wrapper.text()).toContain('Test Event');
  });
});
```

---

### 9. 部署設定（1 天）

- [ ] 設定 GitHub Pages 部署
- [ ] 設定 Cloudflare Pages 部署（備選）
- [ ] 設定自訂網域（選用）
- [ ] 測試部署流程

**GitHub Pages 部署**：
```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
      - uses: actions/setup-node@v3
      - run: pnpm install
      - run: pnpm --filter web build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./packages/web/.output/public
```

---

## 🔄 開發流程

### Step 1：初始化專案

```bash
cd packages
npx nuxi@latest init web
cd web
pnpm add @nuxt/ui
pnpm dev  # 啟動開發伺服器
```

### Step 2：TDD 開發元件

遵循 [TDD 工作流程](../guides/TDD-WORKFLOW.md)：

1. 🔴 **RED**：寫失敗測試
2. 🟢 **GREEN**：最小實作
3. 🔵 **REFACTOR**：重構優化

### Step 3：本地測試

```bash
# 開發模式
pnpm dev

# 建置
pnpm build

# 預覽建置結果
pnpm preview
```

### Step 4：部署測試

```bash
# 建置 SSG
pnpm generate

# 測試靜態檔案
pnpm preview
```

---

## 🧪 測試策略

### 元件測試

使用 Vitest + Vue Test Utils：

```typescript
describe('EventList', () => {
  it('renders event list', () => {
    const events = [
      { id: '1', title: 'Event 1' },
      { id: '2', title: 'Event 2' },
    ];
    const wrapper = mount(EventList, { props: { events } });
    expect(wrapper.findAll('.event-card')).toHaveLength(2);
  });
});
```

### E2E 測試

使用 Playwright：

```typescript
test('user can subscribe to calendar', async ({ page }) => {
  await page.goto('/events');
  await page.click('[data-test="subscribe-button"]');
  await expect(page.locator('[data-test="webcal-url"]')).toBeVisible();
});
```

### 手動測試

- [ ] Chrome / Firefox / Safari 測試
- [ ] 行動裝置測試（iOS / Android）
- [ ] 下載 ICS 並匯入行事曆測試
- [ ] 訂閱 URL 測試

---

## ✅ 階段完成標準

### 功能完成

- [ ] 首頁完成
- [ ] 賽事列表頁面完成（含篩選/搜尋）
- [ ] 賽事詳情頁面完成
- [ ] 訂閱功能完成（下載 ICS + 訂閱 URL）
- [ ] 訂閱說明頁面完成
- [ ] RWD 響應式設計完成

### 測試完成

- [ ] 元件測試覆蓋率 ≥ 70%
- [ ] E2E 測試通過
- [ ] 手動測試通過（多瀏覽器/裝置）
- [ ] ICS 檔案可被行事曆軟體讀取

### 部署完成

- [ ] GitHub Pages 部署成功
- [ ] 網站可正常訪問
- [ ] 所有功能正常運作
- [ ] SEO meta tags 正確

### 文件完成

- [ ] `packages/web/README.md` 完成
- [ ] 使用者操作指南完成
- [ ] 開發者文件完成

---

## 🎨 UI/UX 設計原則

### 色彩主題

使用 Nuxt UI 的主題系統：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    primary: 'blue',
    gray: 'slate',
  },
});
```

### 響應式設計

- 手機版：單欄佈局
- 平板版：雙欄佈局
- 桌面版：三欄佈局

### 無障礙設計

- [ ] 語義化 HTML
- [ ] ARIA 標籤
- [ ] 鍵盤導航
- [ ] 色彩對比度符合 WCAG AA

---

## 🚨 常見問題

### Q: 如何處理大量賽事資料（效能問題）？

A: 實作分頁或虛擬滾動：

```vue
<template>
  <VirtualScroller :items="events" :item-height="100">
    <template #default="{ item }">
      <EventCard :event="item" />
    </template>
  </VirtualScroller>
</template>
```

### Q: 如何讓訂閱 URL 自動更新？

A: 使用 Webcal 協議：

```
webcal://matchcal.github.io/data/bwf/badminton.ics
```

行事曆軟體會定期重新下載此檔案。

### Q: 如何支援多語系？

A: 使用 `@nuxtjs/i18n`：

```bash
pnpm add @nuxtjs/i18n
```

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['@nuxtjs/i18n'],
  i18n: {
    locales: ['zh-TW', 'en'],
    defaultLocale: 'zh-TW',
  },
});
```

### Q: GitHub Pages 部署後 404 錯誤？

A: 檢查 `nuxt.config.ts` 的 `baseURL` 設定：

```typescript
export default defineNuxtConfig({
  app: {
    baseURL: '/MatchCal/',  // 你的 repo 名稱
  },
});
```

---

## 📚 相關文件

- [Nuxt 4 文件](https://nuxt.com/)
- [Nuxt UI 文件](https://ui.nuxt.com/)
- [資料格式規範](../technical/DATA-SCHEMA.md)
- [開發指南](../DEVELOPMENT-GUIDE.md)

---

## ⏭️ 下一階段

階段 3 完成後,進入：

**階段 4：自動化整合**

→ 設定 GitHub Actions 自動化爬取、建置與部署。

---

## 🎯 重點提醒

1. **優先實作核心功能**（列表/詳情/訂閱），美化設計可之後調整
2. **務必測試 ICS 訂閱功能**，確保可被各大行事曆軟體讀取
3. **RWD 響應式設計**，確保行動裝置體驗良好
4. **SEO 優化**，提高搜尋引擎可見度
5. **效能優化**，使用 SSG 減少伺服器負擔

---

🎨 **打造優質使用者體驗！**

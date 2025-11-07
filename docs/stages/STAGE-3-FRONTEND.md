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
- UI 框架：shadcn-vue（基於 Radix Vue + Tailwind CSS）
- 部署：GitHub Pages / Cloudflare Pages
- 資料來源：靜態 JSON 檔案（來自 `data/` 目錄）

---

## 📅 主要任務

### 1. 專案初始化（1 天）

- [ ] 建立 `packages/web/` 目錄
- [ ] 初始化 Nuxt 4 專案
- [ ] 安裝 shadcn-vue
- [ ] 設定 TypeScript
- [ ] 設定 ESLint / Prettier
- [ ] 建立基礎目錄結構

**初始化指令**：
```bash
cd packages
npx nuxi@latest init web
cd web

# 方法 1：使用 shadcn-nuxt 模块（推荐）
pnpm add -D shadcn-nuxt
# 添加 'shadcn-nuxt' 到 nuxt.config.ts 的 modules

# 方法 2：手动配置
pnpm add -D tailwindcss class-variance-authority clsx tailwind-merge
pnpm add @vueuse/core radix-vue

# 初始化 shadcn-vue
pnpm dlx shadcn-vue@latest init

# 添加常用组件
pnpm dlx shadcn-vue@latest add button card input select badge
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
│   ├── ui/                    # shadcn-vue 组件目录
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── select/
│   │   └── badge/
│   ├── EventCard.vue          # 賽事卡片
│   ├── EventList.vue          # 賽事列表
│   ├── FilterBar.vue          # 篩選條件
│   └── SubscribeButton.vue    # 訂閱按鈕
├── composables/
│   ├── useEvents.ts           # 賽事資料邏輯
│   └── useFilters.ts          # 篩選邏輯
├── lib/
│   └── utils.ts               # cn() 等工具函数
├── assets/
│   └── css/
│       └── tailwind.css       # Tailwind 入口文件
├── public/
│   └── data/                  # 複製自 ../../data/
│       └── bwf/
│           ├── events.json
│           └── badminton.ics
├── types/
│   └── event.ts               # TypeScript 型別定義
├── tailwind.config.js         # Tailwind 配置
└── components.json            # shadcn-vue 配置
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
<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const category = ref('')
const timeRange = ref('')
const searchQuery = ref('')

const categories = ['全部', '羽球', '籃球']
const timeRanges = ['本週', '本月', '全部']
</script>

<template>
  <div class="flex gap-4">
    <Select v-model="category">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="選擇分類" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="cat in categories" :key="cat" :value="cat">
          {{ cat }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Select v-model="timeRange">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="時間範圍" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem v-for="range in timeRanges" :key="range" :value="range">
          {{ range }}
        </SelectItem>
      </SelectContent>
    </Select>

    <Input v-model="searchQuery" placeholder="搜尋賽事..." class="max-w-xs" />
  </div>
</template>
```

#### 3.2 賽事卡片

```vue
<!-- components/EventCard.vue -->
<script setup lang="ts">
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

defineProps<{
  event: Event
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <h3 class="text-lg font-semibold">{{ event.title }}</h3>
    </CardHeader>
    <CardContent class="space-y-2">
      <p class="text-sm text-muted-foreground">{{ formatDate(event.startDate) }}</p>
      <p class="text-sm">{{ event.location }}</p>
    </CardContent>
    <CardFooter>
      <Button @click="navigateTo(`/events/${event.id}`)">
        查看詳情
      </Button>
    </CardFooter>
  </Card>
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
    <Button as-child>
      <a :href="event.sourceUrl" target="_blank" rel="noopener noreferrer">
        前往官方網站
      </a>
    </Button>
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
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const downloadICS = () => {
  // 下載 /data/bwf/badminton.ics
  window.location.href = '/data/bwf/badminton.ics'
}

const copyWebcalUrl = async () => {
  // 複製 webcal:// 連結
  const url = 'webcal://matchcal.example.com/data/bwf/badminton.ics'
  await navigator.clipboard.writeText(url)
  toast({
    title: '已複製連結',
    description: '訂閱連結已複製到剪貼簿'
  })
}
</script>

<template>
  <div class="flex gap-2">
    <Button @click="downloadICS">下載 ICS 檔案</Button>
    <Button variant="outline" @click="copyWebcalUrl">複製訂閱連結</Button>
  </div>
</template>
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
  modules: ['shadcn-nuxt'],

  shadcn: {
    prefix: '',
    componentDir: './components/ui'
  },

  css: ['~/assets/css/tailwind.css'],

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

# 安装 shadcn-vue
pnpm add -D shadcn-nuxt
pnpm dlx shadcn-vue@latest init

# 添加常用组件
pnpm dlx shadcn-vue@latest add button card input select badge

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

使用 shadcn-vue 的主題系統（基於 CSS 變量）：

```css
/* assets/css/tailwind.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    /* 更多主題變量... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* 暗色模式變量... */
  }
}
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
- [shadcn-vue 文件](https://www.shadcn-vue.com/)
- [Radix Vue 文件](https://www.radix-vue.com/)
- [Tailwind CSS 文件](https://tailwindcss.com/)
- [資料格式規範](../technical/DATA-SCHEMA.md)
- [開發指南](../DEVELOPMENT-GUIDE.md)
- [UI 框架遷移計劃](../MIGRATION-NUXT-UI-TO-SHADCN-VUE.md)

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

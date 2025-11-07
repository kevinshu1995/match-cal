# UI 框架迁移计划：从 Nuxt UI 到 shadcn-vue

> 从 Nuxt UI 迁移至 shadcn-vue 的完整规划文档

---

## 📋 迁移概览

### 迁移原因

- **shadcn-vue** 提供更灵活的组件自定义能力
- 组件代码直接在项目中，便于定制和维护
- 基于 Radix Vue 和 Tailwind CSS，设计更现代
- 社区活跃，组件丰富

### Nuxt UI vs shadcn-vue

| 特性 | Nuxt UI | shadcn-vue |
|------|---------|------------|
| 安装方式 | npm 依赖 | CLI 复制组件到项目 |
| 组件位置 | node_modules | packages/web/components/ui |
| 自定义程度 | 通过配置 | 直接修改组件代码 |
| 主题系统 | Nuxt UI 主题 | Tailwind CSS + CSS 变量 |
| 组件前缀 | `U` (UButton) | 无前缀或自定义 (Button) |
| 依赖 | @nuxt/ui | Radix Vue + class-variance-authority |

---

## 🎯 迁移目标

### 核心目标

1. 移除所有 Nuxt UI 相关依赖和配置
2. 集成 shadcn-vue 到 Nuxt 4 项目
3. 更新所有文档中的 UI 框架引用
4. 确保组件示例代码使用 shadcn-vue 组件

### 非目标（本次不执行）

- ❌ 实际安装 shadcn-vue
- ❌ 实际开发组件
- ❌ 实际修改代码

---

## 📂 需要修改的文件清单

### 1. 核心规格文档

#### `packages/web/SPEC.md`

**当前内容**：
- 依赖列表包含 `@nuxt/ui`
- UI 组件章节列出 Nuxt UI 组件（UButton, UCard, UInput 等）
- 代码示例使用 `U` 前缀组件

**需要修改为**：
- 依赖列表改为 `shadcn-vue`, `@radix-vue/ui`, `tailwindcss`
- UI 组件章节改为 shadcn-vue 组件（Button, Card, Input 等）
- 代码示例更新为 shadcn-vue 组件用法

#### `docs/stages/STAGE-3-FRONTEND.md`

**当前内容**：
- 技术选择提到 "UI 框架：Nuxt UI"
- 初始化步骤包含 `pnpm add @nuxt/ui`
- 多处组件示例使用 Nuxt UI 组件
- nuxt.config.ts 配置包含 Nuxt UI 主题设置

**需要修改为**：
- 技术选择改为 "UI 框架：shadcn-vue"
- 初始化步骤改为 shadcn-vue CLI 安装流程
- 组件示例更新为 shadcn-vue 组件
- nuxt.config.ts 配置更新为 shadcn-vue 配置

#### `docs/ARCHITECTURE.md`

**当前内容**：
- Frontend 技术栈表格包含 "Nuxt UI | ^3.x | UI 元件庫"

**需要修改为**：
- "shadcn-vue | latest | UI 組件庫（基於 Radix Vue）"

#### `docs/DEVELOPMENT-GUIDE.md`

**当前内容**：
- MCP 工具设定包含 "context7 (nuxt-ui) | Nuxt UI 元件文件查詢"

**需要修改为**：
- "context7 (shadcn-vue) | shadcn-vue 組件文件查詢"

#### `README.md`

**当前内容**：
- 技术栈表格包含 "Nuxt UI | ^3.x | UI 元件庫"
- 原始需求规格书提到 "使用 Nuxt UI 提供的元件"

**需要修改为**：
- "shadcn-vue | latest | UI 組件庫"
- 更新需求规格书描述

---

## 🔧 shadcn-vue 集成方案

### 安装流程

基于官方文档 https://www.shadcn-vue.com/docs/installation/nuxt.html

#### 方法 1：使用 shadcn-nuxt 模块（推荐）

```bash
# 1. 进入 web package
cd packages/web

# 2. 安装 shadcn-nuxt 模块
pnpm add -D shadcn-nuxt

# 3. 添加模块到 nuxt.config.ts
# 见下方配置示例

# 4. 运行 CLI 初始化
pnpm dlx shadcn-vue@latest init
```

**nuxt.config.ts 配置**：

```typescript
export default defineNuxtConfig({
  modules: ['shadcn-nuxt'],
  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  }
})
```

#### 方法 2：手动配置（备选）

```bash
# 1. 安装依赖
pnpm add -D tailwindcss @tailwindcss/typography @tailwindcss/forms
pnpm add class-variance-authority clsx tailwind-merge
pnpm add @vueuse/core radix-vue

# 2. 初始化 shadcn-vue
pnpm dlx shadcn-vue@latest init
```

### 目录结构

```
packages/web/
├── components/
│   ├── ui/                      # shadcn-vue 组件
│   │   ├── button/
│   │   │   └── Button.vue
│   │   ├── card/
│   │   │   ├── Card.vue
│   │   │   ├── CardHeader.vue
│   │   │   ├── CardContent.vue
│   │   │   └── CardFooter.vue
│   │   ├── input/
│   │   │   └── Input.vue
│   │   └── ...
│   ├── CategoryCard.vue         # 业务组件
│   ├── EventList.vue
│   └── EventCard.vue
├── lib/
│   └── utils.ts                 # cn() 工具函数
├── assets/
│   └── css/
│       └── tailwind.css         # Tailwind 入口
├── nuxt.config.ts
├── tailwind.config.js
└── components.json              # shadcn-vue 配置
```

### 常用组件对照表

| Nuxt UI | shadcn-vue | 说明 |
|---------|------------|------|
| UButton | Button | 按钮 |
| UCard | Card + CardHeader + CardContent | 卡片 |
| UInput | Input | 输入框 |
| USelect | Select | 选择器 |
| UBadge | Badge | 徽章 |
| UIcon | 直接使用 iconify | 图标 |
| UModal | Dialog | 对话框 |
| UDropdown | DropdownMenu | 下拉菜单 |

### 组件使用示例

#### Nuxt UI（旧）

```vue
<template>
  <UCard>
    <template #header>
      <h3>{{ event.title }}</h3>
    </template>
    <p>{{ formatDate(event.startDate) }}</p>
    <p>{{ event.location }}</p>
    <template #footer>
      <UButton @click="navigateTo(`/events/${event.id}`)">
        查看詳情
      </UButton>
    </template>
  </UCard>
</template>
```

#### shadcn-vue（新）

```vue
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
    <CardContent>
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

## 📝 文档修改详细方案

### 1. packages/web/SPEC.md

#### 修改：依赖列表

**原内容（第 14 行）**：
```
| 依賴 | nuxt, @nuxt/ui, vue |
```

**修改为**：
```
| 依賴 | nuxt, shadcn-vue (shadcn-nuxt), vue, @radix-vue/ui, tailwindcss |
```

#### 修改：UI 组件章节（第 82-92 行）

**原内容**：
```markdown
## 🎨 UI 元件（Nuxt UI）

使用 Nuxt UI 提供的元件：

- `UButton`
- `UCard`
- `UInput`（搜尋）
- `USelect`（篩選）
- `UBadge`（級別標籤）
- `UIcon`
```

**修改为**：
```markdown
## 🎨 UI 元件（shadcn-vue）

使用 shadcn-vue 提供的元件（基於 Radix Vue）：

- `Button` - 按鈕組件
- `Card` + `CardHeader` + `CardContent` + `CardFooter` - 卡片組件
- `Input` - 輸入框（搜尋）
- `Select` - 選擇器（篩選）
- `Badge` - 徽章（級別標籤）
- 圖標使用 `@iconify/vue` 或內聯 SVG

**组件特性**：
- 完全可定制：组件代码在 `components/ui/` 目录下，可直接修改
- 可访问性：基于 Radix Vue，符合 ARIA 标准
- 主题系统：使用 CSS 变量，支持亮色/暗色模式
- TypeScript：完整的类型支持
```

#### 修改：最后一行提示（第 119 行）

**原内容**：
```
🎯 **使用 Nuxt UI 快速建立美觀的介面！**
```

**修改为**：
```
🎯 **使用 shadcn-vue 打造高度定制化的美觀介面！**
```

### 2. docs/stages/STAGE-3-FRONTEND.md

#### 修改：技术选择（第 28-30 行）

**原内容**：
```markdown
**技術選擇**：
- 框架：Nuxt 4（Vue 3）
- UI 框架：Nuxt UI
```

**修改为**：
```markdown
**技術選擇**：
- 框架：Nuxt 4（Vue 3）
- UI 框架：shadcn-vue（基於 Radix Vue + Tailwind CSS）
```

#### 修改：初始化指令（第 46-52 行）

**原内容**：
```bash
cd packages
npx nuxi@latest init web
cd web
pnpm add @nuxt/ui
```

**修改为**：
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
```

#### 修改：目录结构（第 54-80 行）

**原内容**：
```
packages/web/
├── nuxt.config.ts
├── app.vue
├── pages/
...
```

**修改为**：
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

#### 修改：专案初始化步骤（第 367-376 行）

**原内容**：
```bash
cd packages
npx nuxi@latest init web
cd web
pnpm add @nuxt/ui
pnpm dev  # 啟動開發伺服器
```

**修改为**：
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

#### 修改：所有组件示例

将文档中所有使用 Nuxt UI 组件的示例（`UButton`, `UCard`, `USelect`, `UInput` 等）更新为 shadcn-vue 组件。

**示例 - FilterBar 组件（第 120-129 行）**：

**原内容**：
```vue
<template>
  <div class="filter-bar">
    <USelect v-model="category" :options="categories" />
    <USelect v-model="timeRange" :options="timeRanges" />
    <UInput v-model="searchQuery" placeholder="搜尋賽事..." />
  </div>
</template>
```

**修改为**：
```vue
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

**示例 - EventCard 组件（第 133-145 行）**：

**原内容**：
```vue
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

**修改为**：
```vue
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

#### 修改：SubscribeButton 组件（第 186-208 行）

**原内容**：
```vue
<template>
  <div>
    <UButton @click="downloadICS">下載 ICS 檔案</UButton>
    <UButton @click="copyWebcalUrl">複製訂閱連結</UButton>
  </div>
</template>
```

**修改为**：
```vue
<script setup lang="ts">
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/toast'

const { toast } = useToast()

const downloadICS = () => {
  window.location.href = '/data/bwf/badminton.ics'
}

const copyWebcalUrl = async () => {
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

#### 修改：nuxt.config.ts 配置（第 280-298, 490-497 行）

**原内容**：
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

以及：

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  ui: {
    primary: 'blue',
    gray: 'slate',
  },
});
```

**修改为**：
```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  modules: ['shadcn-nuxt'],

  shadcn: {
    /**
     * Prefix for all the imported component
     */
    prefix: '',
    /**
     * Directory that the component lives in.
     * @default "./components/ui"
     */
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

#### 修改：相关文档链接（第 573-578 行）

**原内容**：
```markdown
## 📚 相關文件

- [Nuxt 4 文件](https://nuxt.com/)
- [Nuxt UI 文件](https://ui.nuxt.com/)
- [資料格式規範](../technical/DATA-SCHEMA.md)
- [開發指南](../DEVELOPMENT-GUIDE.md)
```

**修改为**：
```markdown
## 📚 相關文件

- [Nuxt 4 文件](https://nuxt.com/)
- [shadcn-vue 文件](https://www.shadcn-vue.com/)
- [Radix Vue 文件](https://www.radix-vue.com/)
- [Tailwind CSS 文件](https://tailwindcss.com/)
- [資料格式規範](../technical/DATA-SCHEMA.md)
- [開發指南](../DEVELOPMENT-GUIDE.md)
```

### 3. docs/ARCHITECTURE.md

#### 修改：技术栈表格（第 312-318 行）

**原内容**：
```markdown
### Frontend

| 技術 | 版本 | 用途 |
|------|------|------|
| Nuxt 4 | ^4.x | 前端框架 |
| Vue 3 | ^3.x | UI 框架 |
| Nuxt UI | ^3.x | UI 元件庫 |
| TailwindCSS | ^3.x | CSS 框架 |
```

**修改为**：
```markdown
### Frontend

| 技術 | 版本 | 用途 |
|------|------|------|
| Nuxt 4 | ^4.x | 前端框架 |
| Vue 3 | ^3.x | UI 框架 |
| shadcn-vue | latest | UI 組件庫（基於 Radix Vue） |
| Radix Vue | ^1.x | 無頭組件庫 |
| TailwindCSS | ^4.x | CSS 框架 |
| class-variance-authority | ^0.7.x | 變體管理 |
```

#### 修改：MCP 工具（第 337-343 行）

**原内容**：
```markdown
### MCP 工具

| 工具 | 用途 |
|------|------|
| context7 (nuxt) | Nuxt 框架文件查詢 |
| context7 (nuxt-ui) | Nuxt UI 元件文件查詢 |
| chrome-devtools | 瀏覽器偵錯與爬蟲測試 |
| GitHub MCP | GitHub Actions、Issues、PRs 管理 |
| Filesystem MCP | 檔案系統操作與監控 |
```

**修改为**：
```markdown
### MCP 工具

| 工具 | 用途 |
|------|------|
| context7 (nuxt) | Nuxt 框架文件查詢 |
| context7 (shadcn-vue) | shadcn-vue 組件文件查詢 |
| context7 (radix-vue) | Radix Vue 無頭組件文件查詢 |
| chrome-devtools | 瀏覽器偵錯與爬蟲測試 |
| GitHub MCP | GitHub Actions、Issues、PRs 管理 |
| Filesystem MCP | 檔案系統操作與監控 |
```

### 4. docs/DEVELOPMENT-GUIDE.md

#### 修改：MCP 工具设定（第 60-68 行）

**原内容**：
```markdown
### MCP 工具設定

本專案使用以下 MCP 工具來輔助開發：

| MCP 工具 | 用途 |
|---------|------|
| context7 (nuxt) | Nuxt 框架文件查詢 |
| context7 (nuxt-ui) | Nuxt UI 元件文件查詢 |
| chrome-devtools | 瀏覽器偵錯與爬蟲測試 |
| GitHub MCP | GitHub Actions、Issues、PRs 管理 |
| Filesystem MCP | 檔案系統操作與監控 |
```

**修改为**：
```markdown
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
```

### 5. README.md

#### 修改：技术栈表格（第 57 行附近）

**原内容**：
```markdown
| 前端 | Nuxt 4 + Nuxt UI |
```

**修改为**：
```markdown
| 前端 | Nuxt 4 + shadcn-vue |
```

如果有更详细的技术栈表格：

**原内容**：
```markdown
| 層級 | 技術 |
|------|------|
| 前端 | Nuxt 4 + Nuxt UI |
```

**修改为**：
```markdown
| 層級 | 技術 |
|------|------|
| 前端 | Nuxt 4 + shadcn-vue (Radix Vue + Tailwind CSS) |
```

---

## 🔄 迁移执行流程（仅规划，不执行）

当实际执行迁移时，建议按以下顺序：

### 阶段 1：文档更新（本次完成）

1. ✅ 更新所有文档中的 UI 框架引用
2. ✅ 更新组件示例代码
3. ✅ 更新安装和配置说明
4. ✅ 创建本迁移计划文档

### 阶段 2：实际开发（未来执行）

1. ⏸️ 进入 packages/web 目录
2. ⏸️ 安装 shadcn-vue 相关依赖
3. ⏸️ 运行 shadcn-vue init 初始化
4. ⏸️ 配置 nuxt.config.ts
5. ⏸️ 添加常用组件（button, card, input, select, badge 等）
6. ⏸️ 移除 @nuxt/ui 依赖

### 阶段 3：组件开发（未来执行）

1. ⏸️ 按照更新后的文档开发业务组件
2. ⏸️ 使用 shadcn-vue 组件构建界面
3. ⏸️ 测试所有组件功能

---

## 📌 注意事项

### shadcn-vue 的特点

1. **组件在项目中**：组件代码会被复制到 `components/ui/` 目录，可以直接修改
2. **按需添加**：使用 CLI 命令添加需要的组件，不是一次性安装所有组件
3. **完全控制**：你拥有组件的完整源码，可以根据需求自定义

### 开发建议

1. **渐进式迁移**：先完成文档更新，再在实际开发时逐步实现
2. **组件复用**：shadcn-vue 的组件是可复用的，可以在不同项目间共享
3. **主题定制**：通过修改 CSS 变量实现主题定制，比 Nuxt UI 更灵活
4. **TypeScript**：shadcn-vue 对 TypeScript 支持良好，建议充分利用

### 相关资源

- **官方文档**: https://www.shadcn-vue.com/
- **GitHub 仓库**: https://github.com/unovue/shadcn-vue
- **Radix Vue 文档**: https://www.radix-vue.com/
- **Nuxt 集成指南**: https://www.shadcn-vue.com/docs/installation/nuxt.html
- **shadcn-nuxt 模块**: https://nuxt.com/modules/shadcn

---

## ✅ 迁移检查清单

### 文档更新

- [ ] packages/web/SPEC.md
- [ ] docs/stages/STAGE-3-FRONTEND.md
- [ ] docs/ARCHITECTURE.md
- [ ] docs/DEVELOPMENT-GUIDE.md
- [ ] README.md

### 配置文件（未来）

- [ ] packages/web/package.json（依赖）
- [ ] packages/web/nuxt.config.ts（模块配置）
- [ ] packages/web/tailwind.config.js（Tailwind 配置）
- [ ] packages/web/components.json（shadcn-vue 配置）

### 组件开发（未来）

- [ ] 添加 Button 组件
- [ ] 添加 Card 组件系列
- [ ] 添加 Input 组件
- [ ] 添加 Select 组件
- [ ] 添加 Badge 组件
- [ ] 添加 Dialog 组件
- [ ] 添加 Toast 组件

---

## 🎯 完成标准

### 文档阶段（本次）

- ✅ 所有文档中的 Nuxt UI 引用已更新为 shadcn-vue
- ✅ 所有组件示例代码已更新
- ✅ 安装和配置说明已更新
- ✅ 技术栈说明已更新

### 开发阶段（未来）

- ⏸️ shadcn-vue 成功集成到 Nuxt 4 项目
- ⏸️ 所有需要的组件已添加
- ⏸️ @nuxt/ui 依赖已完全移除
- ⏸️ 项目可正常启动和构建

---

📌 **本文档仅为迁移规划，不涉及实际代码修改和开发工作**

# UI 框架規劃：shadcn-vue

> 前端 UI 框架選型說明與集成方案

---

## 📋 規劃說明

本專案 **packages/web** 前端部分尚未開始開發，原規劃文件中提到使用 Nuxt UI，現已調整為使用 **shadcn-vue**。

### 選擇 shadcn-vue 的原因

- **完全可定製**：組件代碼直接在專案中（`components/ui/`），可以隨意修改
- **靈活性高**：不依賴 npm 套件，擁有組件完整原始碼
- **基於 Radix Vue**：無頭組件庫，提供完善的可訪問性支援
- **Tailwind CSS 集成**：使用 CSS 變數管理主題，支援亮色/暗色模式
- **TypeScript 支援**：完整的型別定義
- **社群活躍**：組件豐富，持續更新

---

## 🎯 本次更新內容

### 文件更新

本次更新將所有規劃文件中的 UI 框架從 Nuxt UI 更改為 shadcn-vue：

#### 1. **packages/web/SPEC.md**
- 依賴清單：更新為 `shadcn-vue (shadcn-nuxt)`, `@radix-vue/ui`, `tailwindcss`
- UI 組件章節：說明 shadcn-vue 組件特性和用法

#### 2. **docs/stages/STAGE-3-FRONTEND.md**
- 技術選擇：明確使用 shadcn-vue
- 初始化指令：更新為 shadcn-vue CLI 命令
- 目錄結構：新增 `components/ui/`, `lib/`, `assets/css/` 等
- 組件範例：使用 shadcn-vue 組件（Button, Card, Select, Input 等）
- nuxt.config.ts：shadcn-nuxt 模組配置
- 主題系統：CSS 變數說明

#### 3. **docs/ARCHITECTURE.md**
- Frontend 技術棧：列出 shadcn-vue 及相關依賴
- MCP 工具：更新文件查詢工具

#### 4. **docs/DEVELOPMENT-GUIDE.md**
- MCP 工具設定：更新為 shadcn-vue 相關工具

#### 5. **docs/INDEX.md**
- 新增本文件的引用

#### 6. **README.md**
- 技術棧：明確說明使用 shadcn-vue

---

## 🔧 shadcn-vue 集成方案

### 安裝流程（推薦）

當開始開發 packages/web 時，按以下步驟安裝：

```bash
cd packages/web

# 方法 1：使用 shadcn-nuxt 模組（推薦）
pnpm add -D shadcn-nuxt

# 初始化 shadcn-vue
pnpm dlx shadcn-vue@latest init

# 新增常用組件
pnpm dlx shadcn-vue@latest add button card input select badge dialog toast
```

### Nuxt 配置

**nuxt.config.ts**：

```typescript
export default defineNuxtConfig({
  modules: ['shadcn-nuxt'],

  shadcn: {
    /**
     * 組件前綴（留空表示無前綴）
     */
    prefix: '',
    /**
     * 組件目錄
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  css: ['~/assets/css/tailwind.css'],

  // 其他配置...
})
```

### 目錄結構

```
packages/web/
├── components/
│   ├── ui/                    # shadcn-vue 組件（CLI 生成）
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── select/
│   │   └── badge/
│   ├── EventCard.vue          # 業務組件
│   ├── EventList.vue
│   └── FilterBar.vue
├── lib/
│   └── utils.ts               # cn() 工具函式
├── assets/
│   └── css/
│       └── tailwind.css       # Tailwind 入口
├── nuxt.config.ts
├── tailwind.config.js
└── components.json            # shadcn-vue 配置
```

---

## 💡 shadcn-vue 核心概念

### 1. 組件不是依賴套件

shadcn-vue 不是 npm 套件，而是透過 CLI 將組件原始碼複製到你的專案中：

```bash
# 新增 Button 組件
pnpm dlx shadcn-vue@latest add button

# 結果：組件代碼被複製到 components/ui/button/
```

這意味著：
- ✅ 你擁有完整原始碼，可以隨意修改
- ✅ 不受套件版本限制
- ✅ 可以根據需求定製組件

### 2. 基於 Radix Vue

所有組件都基於 [Radix Vue](https://www.radix-vue.com/)（無頭組件庫）：
- 完善的鍵盤導航
- 符合 ARIA 標準
- 完全可訪問性支援

### 3. 主題系統

使用 CSS 變數管理主題，支援亮色/暗色模式：

```css
/* assets/css/tailwind.css */
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    /* ... */
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    /* ... */
  }
}
```

---

## 📦 常用組件清單

### 基礎組件

| 組件 | 用途 | CLI 命令 |
|------|------|---------|
| Button | 按鈕 | `add button` |
| Card | 卡片 | `add card` |
| Input | 輸入框 | `add input` |
| Select | 選擇器 | `add select` |
| Badge | 徽章 | `add badge` |

### 互動組件

| 組件 | 用途 | CLI 命令 |
|------|------|---------|
| Dialog | 對話框 | `add dialog` |
| Toast | 提示訊息 | `add toast` |
| Dropdown Menu | 下拉選單 | `add dropdown-menu` |
| Popover | 彈出框 | `add popover` |

### 表單組件

| 組件 | 用途 | CLI 命令 |
|------|------|---------|
| Form | 表單 | `add form` |
| Checkbox | 核取方塊 | `add checkbox` |
| Radio Group | 單選按鈕組 | `add radio-group` |
| Switch | 開關 | `add switch` |

---

## 🎨 組件使用範例

### EventCard 組件

```vue
<script setup lang="ts">
import { Card, CardHeader, CardContent, CardFooter } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

defineProps<{
  event: Event
}>()
</script>

<template>
  <Card>
    <CardHeader>
      <div class="flex items-center justify-between">
        <h3 class="text-lg font-semibold">{{ event.title }}</h3>
        <Badge>{{ event.level }}</Badge>
      </div>
    </CardHeader>
    <CardContent class="space-y-2">
      <p class="text-sm text-muted-foreground">
        {{ formatDate(event.startDate) }}
      </p>
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

### FilterBar 組件

```vue
<script setup lang="ts">
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Input } from '@/components/ui/input'

const category = ref('')
const timeRange = ref('')
const searchQuery = ref('')
</script>

<template>
  <div class="flex gap-4">
    <Select v-model="category">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="選擇分類" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">全部</SelectItem>
        <SelectItem value="badminton">羽球</SelectItem>
        <SelectItem value="basketball">籃球</SelectItem>
      </SelectContent>
    </Select>

    <Select v-model="timeRange">
      <SelectTrigger class="w-[180px]">
        <SelectValue placeholder="時間範圍" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="week">本週</SelectItem>
        <SelectItem value="month">本月</SelectItem>
        <SelectItem value="all">全部</SelectItem>
      </SelectContent>
    </Select>

    <Input
      v-model="searchQuery"
      placeholder="搜尋賽事..."
      class="max-w-xs"
    />
  </div>
</template>
```

### SubscribeButton 組件

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
    <Button @click="downloadICS">
      下載 ICS 檔案
    </Button>
    <Button variant="outline" @click="copyWebcalUrl">
      複製訂閱連結
    </Button>
  </div>
</template>
```

---

## 📚 相關資源

### 官方文件

- **shadcn-vue 官網**: https://www.shadcn-vue.com/
- **Nuxt 集成指南**: https://www.shadcn-vue.com/docs/installation/nuxt.html
- **組件文件**: https://www.shadcn-vue.com/docs/components/accordion.html
- **GitHub 儲存庫**: https://github.com/unovue/shadcn-vue

### 依賴文件

- **Radix Vue**: https://www.radix-vue.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Nuxt 4**: https://nuxt.com/

### shadcn-nuxt 模組

- **NPM**: https://www.npmjs.com/package/shadcn-nuxt
- **Nuxt Modules**: https://nuxt.com/modules/shadcn

---

## 🎯 開發建議

### 1. 按需新增組件

不需要一次性新增所有組件，根據實際需求逐個新增：

```bash
# 只新增需要的組件
pnpm dlx shadcn-vue@latest add button card input
```

### 2. 自訂組件

因為組件代碼在專案中，可以直接修改：

```bash
# 編輯 Button 組件
vim components/ui/button/Button.vue
```

### 3. 主題定製

透過修改 CSS 變數實現主題定製：

```css
/* 自訂主品牌色 */
:root {
  --primary: 221.2 83.2% 53.3%; /* 藍色 */
}

/* 或者改為綠色 */
:root {
  --primary: 142.1 76.2% 36.3%; /* 綠色 */
}
```

### 4. 組件變體

shadcn-vue 使用 `class-variance-authority` 管理組件變體：

```vue
<Button variant="default">預設按鈕</Button>
<Button variant="outline">輪廓按鈕</Button>
<Button variant="ghost">幽靈按鈕</Button>
<Button size="sm">小按鈕</Button>
<Button size="lg">大按鈕</Button>
```

---

## ✅ 總結

- **本專案選用 shadcn-vue** 作為 UI 框架
- **尚未開始開發**，本文件為規劃說明
- **所有相關文件已更新**，移除了 Nuxt UI 的內容
- **開發時**按照本文件的集成方案進行安裝和配置

---

📌 **本文件為規劃說明，不涉及實際程式碼開發**

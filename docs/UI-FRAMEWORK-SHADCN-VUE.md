# UI 框架规划：shadcn-vue

> 前端 UI 框架选型说明与集成方案

---

## 📋 规划说明

本项目 **packages/web** 前端部分尚未开始开发，原规划文档中提到使用 Nuxt UI，现已调整为使用 **shadcn-vue**。

### 选择 shadcn-vue 的原因

- **完全可定制**：组件代码直接在项目中（`components/ui/`），可以随意修改
- **灵活性高**：不依赖 npm 包，拥有组件完整源码
- **基于 Radix Vue**：无头组件库，提供完善的可访问性支持
- **Tailwind CSS 集成**：使用 CSS 变量管理主题，支持亮色/暗色模式
- **TypeScript 支持**：完整的类型定义
- **社区活跃**：组件丰富，持续更新

---

## 🎯 本次更新内容

### 文档更新

本次更新将所有规划文档中的 UI 框架从 Nuxt UI 更改为 shadcn-vue：

#### 1. **packages/web/SPEC.md**
- 依赖列表：更新为 `shadcn-vue (shadcn-nuxt)`, `@radix-vue/ui`, `tailwindcss`
- UI 组件章节：说明 shadcn-vue 组件特性和用法

#### 2. **docs/stages/STAGE-3-FRONTEND.md**
- 技术选择：明确使用 shadcn-vue
- 初始化指令：更新为 shadcn-vue CLI 命令
- 目录结构：添加 `components/ui/`, `lib/`, `assets/css/` 等
- 组件示例：使用 shadcn-vue 组件（Button, Card, Select, Input 等）
- nuxt.config.ts：shadcn-nuxt 模块配置
- 主题系统：CSS 变量说明

#### 3. **docs/ARCHITECTURE.md**
- Frontend 技术栈：列出 shadcn-vue 及相关依赖
- MCP 工具：更新文档查询工具

#### 4. **docs/DEVELOPMENT-GUIDE.md**
- MCP 工具设定：更新为 shadcn-vue 相关工具

#### 5. **docs/INDEX.md**
- 添加本文档的引用

#### 6. **README.md**
- 技术栈：明确说明使用 shadcn-vue

---

## 🔧 shadcn-vue 集成方案

### 安装流程（推荐）

当开始开发 packages/web 时，按以下步骤安装：

```bash
cd packages/web

# 方法 1：使用 shadcn-nuxt 模块（推荐）
pnpm add -D shadcn-nuxt

# 初始化 shadcn-vue
pnpm dlx shadcn-vue@latest init

# 添加常用组件
pnpm dlx shadcn-vue@latest add button card input select badge dialog toast
```

### Nuxt 配置

**nuxt.config.ts**：

```typescript
export default defineNuxtConfig({
  modules: ['shadcn-nuxt'],

  shadcn: {
    /**
     * 组件前缀（留空表示无前缀）
     */
    prefix: '',
    /**
     * 组件目录
     * @default "./components/ui"
     */
    componentDir: './components/ui'
  },

  css: ['~/assets/css/tailwind.css'],

  // 其他配置...
})
```

### 目录结构

```
packages/web/
├── components/
│   ├── ui/                    # shadcn-vue 组件（CLI 生成）
│   │   ├── button/
│   │   ├── card/
│   │   ├── input/
│   │   ├── select/
│   │   └── badge/
│   ├── EventCard.vue          # 业务组件
│   ├── EventList.vue
│   └── FilterBar.vue
├── lib/
│   └── utils.ts               # cn() 工具函数
├── assets/
│   └── css/
│       └── tailwind.css       # Tailwind 入口
├── nuxt.config.ts
├── tailwind.config.js
└── components.json            # shadcn-vue 配置
```

---

## 💡 shadcn-vue 核心概念

### 1. 组件不是依赖包

shadcn-vue 不是 npm 包，而是通过 CLI 将组件源码复制到你的项目中：

```bash
# 添加 Button 组件
pnpm dlx shadcn-vue@latest add button

# 结果：组件代码被复制到 components/ui/button/
```

这意味着：
- ✅ 你拥有完整源码，可以随意修改
- ✅ 不受包版本限制
- ✅ 可以根据需求定制组件

### 2. 基于 Radix Vue

所有组件都基于 [Radix Vue](https://www.radix-vue.com/)（无头组件库）：
- 完善的键盘导航
- 符合 ARIA 标准
- 完全可访问性支持

### 3. 主题系统

使用 CSS 变量管理主题，支持亮色/暗色模式：

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

## 📦 常用组件列表

### 基础组件

| 组件 | 用途 | CLI 命令 |
|------|------|---------|
| Button | 按钮 | `add button` |
| Card | 卡片 | `add card` |
| Input | 输入框 | `add input` |
| Select | 选择器 | `add select` |
| Badge | 徽章 | `add badge` |

### 交互组件

| 组件 | 用途 | CLI 命令 |
|------|------|---------|
| Dialog | 对话框 | `add dialog` |
| Toast | 提示信息 | `add toast` |
| Dropdown Menu | 下拉菜单 | `add dropdown-menu` |
| Popover | 弹出框 | `add popover` |

### 表单组件

| 组件 | 用途 | CLI 命令 |
|------|------|---------|
| Form | 表单 | `add form` |
| Checkbox | 复选框 | `add checkbox` |
| Radio Group | 单选按钮组 | `add radio-group` |
| Switch | 开关 | `add switch` |

---

## 🎨 组件使用示例

### EventCard 组件

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

### FilterBar 组件

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

### SubscribeButton 组件

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

## 📚 相关资源

### 官方文档

- **shadcn-vue 官网**: https://www.shadcn-vue.com/
- **Nuxt 集成指南**: https://www.shadcn-vue.com/docs/installation/nuxt.html
- **组件文档**: https://www.shadcn-vue.com/docs/components/accordion.html
- **GitHub 仓库**: https://github.com/unovue/shadcn-vue

### 依赖文档

- **Radix Vue**: https://www.radix-vue.com/
- **Tailwind CSS**: https://tailwindcss.com/
- **Nuxt 4**: https://nuxt.com/

### shadcn-nuxt 模块

- **NPM**: https://www.npmjs.com/package/shadcn-nuxt
- **Nuxt Modules**: https://nuxt.com/modules/shadcn

---

## 🎯 开发建议

### 1. 按需添加组件

不需要一次性添加所有组件，根据实际需求逐个添加：

```bash
# 只添加需要的组件
pnpm dlx shadcn-vue@latest add button card input
```

### 2. 自定义组件

因为组件代码在项目中，可以直接修改：

```bash
# 编辑 Button 组件
vim components/ui/button/Button.vue
```

### 3. 主题定制

通过修改 CSS 变量实现主题定制：

```css
/* 自定义主品牌色 */
:root {
  --primary: 221.2 83.2% 53.3%; /* 蓝色 */
}

/* 或者改为绿色 */
:root {
  --primary: 142.1 76.2% 36.3%; /* 绿色 */
}
```

### 4. 组件变体

shadcn-vue 使用 `class-variance-authority` 管理组件变体：

```vue
<Button variant="default">默认按钮</Button>
<Button variant="outline">轮廓按钮</Button>
<Button variant="ghost">幽灵按钮</Button>
<Button size="sm">小按钮</Button>
<Button size="lg">大按钮</Button>
```

---

## ✅ 总结

- **本项目选用 shadcn-vue** 作为 UI 框架
- **尚未开始开发**，本文档为规划说明
- **所有相关文档已更新**，移除了 Nuxt UI 的内容
- **开发时**按照本文档的集成方案进行安装和配置

---

📌 **本文档为规划说明，不涉及实际代码开发**

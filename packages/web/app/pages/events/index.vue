<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { Badge } from '~/components/ui/badge'
import type { EventFilters } from '~/types/event'

// SEO
useHead({
  title: '賽事列表 - MatchCal',
  meta: [
    { name: 'description', content: '瀏覽所有比賽賽程，一鍵訂閱至您的行事曆' }
  ]
})

// 使用 composable
const { events, loading, error, fetchEvents, filterEvents, sortByDate } = useEvents()

// 篩選條件
const filters = ref<EventFilters>({
  search: '',
  category: 'all',
  timeRange: 'all',
  tier: 'all'
})

// 計算過濾後的賽事
const filteredEvents = computed(() => {
  return filterEvents(filters.value)
})

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

// 格式化日期範圍
const formatDateRange = (startDate: string, endDate?: string) => {
  if (!endDate) {
    return formatDate(startDate)
  }

  const start = new Date(startDate)
  const end = new Date(endDate)

  // 如果是同一天
  if (start.toDateString() === end.toDateString()) {
    return formatDate(startDate)
  }

  // 如果是同一個月
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${end.getDate()} ${start.toLocaleDateString('zh-TW', { year: 'numeric', month: 'long' })}`
  }

  return `${formatDate(startDate)} - ${formatDate(endDate)}`
}

// 載入資料
onMounted(async () => {
  await fetchEvents('badminton/bwf-2025.json')
  sortByDate(true) // 依日期升序排列
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-primary text-primary-foreground">
      <div class="container mx-auto px-4 py-12">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold mb-4">
            賽事列表
          </h1>
          <p class="text-lg opacity-90">
            瀏覽所有比賽賽程，選擇您感興趣的賽事訂閱
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <!-- Filters -->
      <div class="mb-8">
        <Card>
          <CardContent class="pt-6">
            <div class="grid md:grid-cols-4 gap-4">
              <!-- Search -->
              <div class="md:col-span-2">
                <Input
                  v-model="filters.search"
                  placeholder="搜尋賽事名稱、地點..."
                  class="w-full"
                />
              </div>

              <!-- Time Range -->
              <div>
                <select
                  v-model="filters.timeRange"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">所有時間</option>
                  <option value="week">本週</option>
                  <option value="month">本月</option>
                </select>
              </div>

              <!-- Category (for future use) -->
              <div>
                <select
                  v-model="filters.category"
                  class="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="all">所有分類</option>
                  <option value="badminton">羽球</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="text-center py-12">
        <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p class="mt-4 text-muted-foreground">載入中...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-destructive">載入失敗：{{ error.message }}</p>
        <Button class="mt-4" @click="fetchEvents('badminton/bwf-2025.json')">
          重試
        </Button>
      </div>

      <!-- Events List -->
      <div v-else>
        <!-- Results Count -->
        <div class="mb-4 text-sm text-muted-foreground">
          找到 {{ filteredEvents.length }} 場賽事
        </div>

        <!-- Events Grid -->
        <div v-if="filteredEvents.length > 0" class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card
            v-for="event in filteredEvents"
            :key="event.id"
            class="hover:shadow-lg transition-shadow cursor-pointer"
            @click="navigateTo(`/events/${event.id}`)"
          >
            <CardHeader>
              <div class="flex items-start justify-between gap-2 mb-2">
                <CardTitle class="text-lg line-clamp-2">
                  {{ event.title }}
                </CardTitle>
                <Badge v-if="event.tier" variant="secondary" class="flex-shrink-0">
                  {{ event.tier }}
                </Badge>
              </div>
              <CardDescription class="space-y-1">
                <div class="flex items-center gap-2">
                  <span>📅</span>
                  <span>{{ formatDateRange(event.startDate, event.endDate) }}</span>
                </div>
                <div class="flex items-center gap-2">
                  <span>📍</span>
                  <span class="line-clamp-1">{{ event.location }}</span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardFooter>
              <Button variant="outline" size="sm" class="w-full">
                查看詳情
              </Button>
            </CardFooter>
          </Card>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <p class="text-muted-foreground">找不到符合條件的賽事</p>
          <Button class="mt-4" variant="outline" @click="filters = { search: '', category: 'all', timeRange: 'all', tier: 'all' }">
            清除篩選
          </Button>
        </div>
      </div>

      <!-- Download ICS -->
      <div class="mt-12 text-center">
        <Card class="max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle>訂閱整個賽季</CardTitle>
            <CardDescription>
              一次訂閱所有 BWF 2025 賽事
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="flex gap-4 justify-center">
              <Button as-child>
                <a href="/data/badminton/bwf-2025.ics" download>
                  下載 ICS 檔案
                </a>
              </Button>
              <Button variant="outline" @click="navigator.clipboard.writeText(window.location.origin + '/data/badminton/bwf-2025.ics')">
                複製訂閱連結
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  </div>
</template>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>

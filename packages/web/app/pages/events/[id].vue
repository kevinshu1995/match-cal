<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'
import { Badge } from '~/components/ui/badge'
import type { StandardEvent } from '~/types/event'

// 路由參數
const route = useRoute()
const eventId = computed(() => route.params.id as string)

// 使用 composable
const { events, loading, error, fetchEvents, getEventById } = useEvents()

// 當前賽事
const currentEvent = ref<StandardEvent | null>(null)

// 格式化日期
const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  })
}

// 格式化完整日期時間
const formatDateTime = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
    hour: '2-digit',
    minute: '2-digit'
  })
}

// 複製連結到剪貼簿
const copyToClipboard = async (text: string, label: string) => {
  try {
    await navigator.clipboard.writeText(text)
    alert(`${label}已複製到剪貼簿`)
  } catch (err) {
    console.error('複製失敗:', err)
  }
}

// 載入資料
onMounted(async () => {
  await fetchEvents('badminton/bwf-2025.json')
  currentEvent.value = getEventById(eventId.value) || null

  // 設置 SEO
  if (currentEvent.value) {
    useHead({
      title: `${currentEvent.value.title} - MatchCal`,
      meta: [
        {
          name: 'description',
          content: `${currentEvent.value.title} - ${currentEvent.value.location} | ${formatDate(currentEvent.value.startDate)}`
        }
      ]
    })
  }
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Loading State -->
    <div v-if="loading" class="container mx-auto px-4 py-12 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      <p class="mt-4 text-muted-foreground">載入中...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="container mx-auto px-4 py-12 text-center">
      <p class="text-destructive">載入失敗：{{ error.message }}</p>
      <Button class="mt-4" @click="navigateTo('/events')">
        返回列表
      </Button>
    </div>

    <!-- Not Found -->
    <div v-else-if="!currentEvent" class="container mx-auto px-4 py-12 text-center">
      <h1 class="text-2xl font-bold mb-4">找不到此賽事</h1>
      <p class="text-muted-foreground mb-6">此賽事可能已被移除或不存在</p>
      <Button @click="navigateTo('/events')">
        返回列表
      </Button>
    </div>

    <!-- Event Detail -->
    <div v-else>
      <!-- Header -->
      <div class="bg-primary text-primary-foreground">
        <div class="container mx-auto px-4 py-12">
          <div class="max-w-4xl">
            <div class="flex items-center gap-4 mb-4">
              <Button variant="secondary" size="sm" @click="navigateTo('/events')">
                ← 返回列表
              </Button>
              <Badge v-if="currentEvent.tier" variant="secondary">
                {{ currentEvent.tier }}
              </Badge>
            </div>
            <h1 class="text-4xl font-bold mb-4">
              {{ currentEvent.title }}
            </h1>
            <div class="flex flex-wrap gap-4 text-lg opacity-90">
              <div class="flex items-center gap-2">
                <span>📅</span>
                <span>{{ formatDate(currentEvent.startDate) }}</span>
              </div>
              <div class="flex items-center gap-2">
                <span>📍</span>
                <span>{{ currentEvent.location }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Content -->
      <div class="container mx-auto px-4 py-8">
        <div class="max-w-4xl mx-auto space-y-6">
          <!-- Subscribe Actions -->
          <Card>
            <CardHeader>
              <CardTitle>訂閱此賽事</CardTitle>
              <CardDescription>
                將此賽事加入您的行事曆
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div class="flex flex-wrap gap-4">
                <Button as-child>
                  <a :href="`/data/badminton/bwf-2025.ics`" download>
                    下載 ICS 檔案
                  </a>
                </Button>
                <Button
                  variant="outline"
                  @click="copyToClipboard(`${window.location.origin}/data/badminton/bwf-2025.ics`, '訂閱連結')"
                >
                  複製訂閱連結
                </Button>
                <Button
                  v-if="currentEvent.sourceUrl"
                  variant="outline"
                  as-child
                >
                  <a :href="currentEvent.sourceUrl" target="_blank" rel="noopener noreferrer">
                    前往官方網站 ↗
                  </a>
                </Button>
              </div>
            </CardContent>
          </Card>

          <!-- Event Details -->
          <Card>
            <CardHeader>
              <CardTitle>賽事資訊</CardTitle>
            </CardHeader>
            <CardContent class="space-y-4">
              <!-- Time -->
              <div>
                <h3 class="font-semibold mb-2">時間</h3>
                <div class="text-muted-foreground space-y-1">
                  <div>開始：{{ formatDateTime(currentEvent.startDate) }}</div>
                  <div v-if="currentEvent.endDate">
                    結束：{{ formatDateTime(currentEvent.endDate) }}
                  </div>
                </div>
              </div>

              <!-- Location -->
              <div>
                <h3 class="font-semibold mb-2">地點</h3>
                <p class="text-muted-foreground">{{ currentEvent.location }}</p>
              </div>

              <!-- Category -->
              <div>
                <h3 class="font-semibold mb-2">分類</h3>
                <Badge>{{ currentEvent.category }}</Badge>
              </div>

              <!-- Tier -->
              <div v-if="currentEvent.tier">
                <h3 class="font-semibold mb-2">級別</h3>
                <Badge variant="secondary">{{ currentEvent.tier }}</Badge>
              </div>

              <!-- Organizer -->
              <div v-if="currentEvent.organizer">
                <h3 class="font-semibold mb-2">主辦單位</h3>
                <p class="text-muted-foreground">{{ currentEvent.organizer }}</p>
              </div>

              <!-- Description -->
              <div v-if="currentEvent.description">
                <h3 class="font-semibold mb-2">描述</h3>
                <p class="text-muted-foreground whitespace-pre-wrap">{{ currentEvent.description }}</p>
              </div>

              <!-- Custom Fields -->
              <div v-if="currentEvent.customFields && Object.keys(currentEvent.customFields).length > 0">
                <h3 class="font-semibold mb-2">其他資訊</h3>
                <div class="space-y-2">
                  <div
                    v-for="(value, key) in currentEvent.customFields"
                    :key="key"
                    class="text-sm"
                  >
                    <span class="font-medium">{{ key }}:</span>
                    <span class="text-muted-foreground ml-2">{{ value }}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- How to Subscribe -->
          <Card>
            <CardHeader>
              <CardTitle>如何訂閱？</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="space-y-4 text-sm">
                <div>
                  <h4 class="font-semibold mb-2">方法一：下載 ICS 檔案</h4>
                  <ol class="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>點擊「下載 ICS 檔案」按鈕</li>
                    <li>開啟您的行事曆軟體（Google Calendar、Apple Calendar、Outlook 等）</li>
                    <li>選擇「匯入」或「新增行事曆」</li>
                    <li>選擇剛下載的 ICS 檔案</li>
                  </ol>
                </div>

                <div>
                  <h4 class="font-semibold mb-2">方法二：訂閱連結（推薦）</h4>
                  <ol class="list-decimal list-inside text-muted-foreground space-y-1">
                    <li>點擊「複製訂閱連結」按鈕</li>
                    <li>在行事曆軟體中選擇「新增訂閱」或「從 URL 訂閱」</li>
                    <li>貼上剛複製的連結</li>
                    <li>賽事資訊將自動同步更新</li>
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 可選：添加自訂樣式 */
</style>

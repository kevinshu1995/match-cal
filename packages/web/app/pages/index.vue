<script setup lang="ts">
import { Button } from '~/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'

// SEO
useHead({
  title: 'MatchCal - 比賽賽程自動整合行事曆',
  meta: [
    {
      name: 'description',
      content: '自動化爬取比賽賽程，一鍵訂閱至個人行事曆。支援羽球、籃球等多種運動賽事。'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Hero Section -->
    <section class="container mx-auto px-4 py-16 md:py-24">
      <div class="max-w-3xl mx-auto text-center">
        <h1 class="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          比賽賽程自動整合行事曆
        </h1>
        <p class="text-xl text-muted-foreground mb-8">
          自動化爬取各種比賽賽程，一鍵訂閱至 Google、Apple、Outlook 行事曆
        </p>
        <div class="flex gap-4 justify-center">
          <Button size="lg" as-child>
            <NuxtLink to="/events">
              瀏覽賽事
            </NuxtLink>
          </Button>
          <Button size="lg" variant="outline" as-child>
            <a
              href="https://github.com/wenxiuxu/MatchCal"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </Button>
        </div>
      </div>
    </section>

    <!-- Features -->
    <section class="container mx-auto px-4 py-16 bg-muted/50">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">
          功能特色
        </h2>
        <div class="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>自動更新</CardTitle>
              <CardDescription>
                定時爬取最新賽程，即時同步到您的行事曆
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>一鍵訂閱</CardTitle>
              <CardDescription>
                支援 Google、Apple、Outlook 等主流行事曆
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>多種運動</CardTitle>
              <CardDescription>
                涵蓋羽球、籃球、足球等多種運動賽事
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    </section>

    <!-- Available Categories -->
    <section class="container mx-auto px-4 py-16">
      <div class="max-w-5xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">
          支援賽事類型
        </h2>
        <div class="grid md:grid-cols-2 gap-6">
          <Card class="hover:shadow-lg transition-shadow cursor-pointer" @click="navigateTo('/events')">
            <CardHeader>
              <CardTitle>🏸 羽球賽事</CardTitle>
              <CardDescription>
                BWF 世界巡迴賽、Super 系列賽等國際羽球賽事
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline">查看賽事</Button>
            </CardContent>
          </Card>

          <Card class="opacity-50">
            <CardHeader>
              <CardTitle>🏀 籃球賽事（即將推出）</CardTitle>
              <CardDescription>
                NBA、FIBA 等國際籃球賽事
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" disabled>敬請期待</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>

    <!-- How to Use -->
    <section class="container mx-auto px-4 py-16 bg-muted/50">
      <div class="max-w-3xl mx-auto">
        <h2 class="text-3xl font-bold text-center mb-12">
          如何使用
        </h2>
        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 class="font-semibold mb-2">瀏覽賽事</h3>
              <p class="text-muted-foreground">
                在賽事列表中找到您感興趣的比賽
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 class="font-semibold mb-2">下載或訂閱</h3>
              <p class="text-muted-foreground">
                選擇下載 ICS 檔案或訂閱 URL
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex-shrink-0 w-10 h-10 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 class="font-semibold mb-2">匯入行事曆</h3>
              <p class="text-muted-foreground">
                在您的行事曆軟體中匯入，即可自動同步更新
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="container mx-auto px-4 py-8 text-center text-muted-foreground">
      <p>
        由 <a href="https://github.com/wenxiuxu" target="_blank" rel="noopener noreferrer" class="underline">wenxiuxu</a> 開發
      </p>
      <p class="mt-2">
        MIT License | <a href="https://github.com/wenxiuxu/MatchCal" target="_blank" rel="noopener noreferrer" class="underline">查看原始碼</a>
      </p>
    </footer>
  </div>
</template>

<style scoped>
/* 可選：添加自訂樣式 */
</style>

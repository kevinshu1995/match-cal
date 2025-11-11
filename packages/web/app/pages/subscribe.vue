<script setup lang="ts">
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '~/components/ui/card'
import { Button } from '~/components/ui/button'

// SEO
useHead({
  title: '訂閱說明 - MatchCal',
  meta: [
    {
      name: 'description',
      content: '了解如何訂閱 MatchCal 賽事行事曆到 Google Calendar、Apple Calendar、Outlook 等行事曆軟體'
    }
  ]
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Header -->
    <div class="bg-primary text-primary-foreground">
      <div class="container mx-auto px-4 py-12">
        <div class="max-w-3xl">
          <h1 class="text-4xl font-bold mb-4">
            訂閱說明
          </h1>
          <p class="text-lg opacity-90">
            了解如何將 MatchCal 賽事加入您的行事曆
          </p>
        </div>
      </div>
    </div>

    <!-- Main Content -->
    <div class="container mx-auto px-4 py-8">
      <div class="max-w-4xl mx-auto space-y-8">
        <!-- Overview -->
        <Card>
          <CardHeader>
            <CardTitle>兩種訂閱方式</CardTitle>
            <CardDescription>
              選擇最適合您的訂閱方式
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div class="grid md:grid-cols-2 gap-6">
              <div class="space-y-2">
                <h3 class="font-semibold">📥 下載 ICS 檔案</h3>
                <p class="text-sm text-muted-foreground">
                  一次性匯入賽事到行事曆。簡單快速，但需要手動更新。
                </p>
              </div>
              <div class="space-y-2">
                <h3 class="font-semibold">🔗 訂閱連結（推薦）</h3>
                <p class="text-sm text-muted-foreground">
                  訂閱後自動同步更新。賽事資訊變更時會自動更新到您的行事曆。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Google Calendar -->
        <Card>
          <CardHeader>
            <CardTitle>Google Calendar 訂閱教學</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Method 1: ICS File -->
              <div>
                <h3 class="font-semibold mb-3">方法一：下載 ICS 檔案</h3>
                <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>在 MatchCal 上下載 ICS 檔案</li>
                  <li>開啟 <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" class="text-primary underline">Google Calendar</a></li>
                  <li>點擊左側選單中的「設定」齒輪圖示 → 「設定」</li>
                  <li>點擊左側選單「匯入和匯出」</li>
                  <li>點擊「從電腦選取檔案」，選擇剛下載的 ICS 檔案</li>
                  <li>選擇要匯入的行事曆，點擊「匯入」</li>
                </ol>
              </div>

              <!-- Method 2: Subscribe URL -->
              <div>
                <h3 class="font-semibold mb-3">方法二：訂閱 URL（推薦）</h3>
                <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>在 MatchCal 上複製訂閱連結</li>
                  <li>開啟 <a href="https://calendar.google.com" target="_blank" rel="noopener noreferrer" class="text-primary underline">Google Calendar</a></li>
                  <li>點擊左側「其他行事曆」旁的 + 號</li>
                  <li>選擇「透過 URL」</li>
                  <li>貼上剛複製的訂閱連結</li>
                  <li>點擊「新增行事曆」</li>
                  <li>完成！賽事會自動同步更新</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Apple Calendar -->
        <Card>
          <CardHeader>
            <CardTitle>Apple Calendar 訂閱教學</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- macOS -->
              <div>
                <h3 class="font-semibold mb-3">macOS</h3>
                <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>開啟「行事曆」app</li>
                  <li>點擊選單列的「檔案」→「新增行事曆訂閱」</li>
                  <li>貼上從 MatchCal 複製的訂閱連結</li>
                  <li>點擊「訂閱」</li>
                  <li>設定名稱、顏色和更新頻率（建議每天）</li>
                  <li>點擊「好」完成</li>
                </ol>
              </div>

              <!-- iOS -->
              <div>
                <h3 class="font-semibold mb-3">iOS / iPadOS</h3>
                <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>開啟「設定」app</li>
                  <li>點擊「行事曆」→「帳號」→「新增帳號」</li>
                  <li>選擇「其他」→「新增已訂閱的行事曆」</li>
                  <li>貼上從 MatchCal 複製的訂閱連結</li>
                  <li>點擊「下一步」→「儲存」</li>
                  <li>完成！賽事會自動同步</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- Outlook -->
        <Card>
          <CardHeader>
            <CardTitle>Outlook 訂閱教學</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <!-- Web -->
              <div>
                <h3 class="font-semibold mb-3">Outlook 網頁版</h3>
                <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>開啟 <a href="https://outlook.office.com/calendar" target="_blank" rel="noopener noreferrer" class="text-primary underline">Outlook 行事曆</a></li>
                  <li>點擊左側「新增行事曆」</li>
                  <li>選擇「從網際網路訂閱」</li>
                  <li>貼上從 MatchCal 複製的訂閱連結</li>
                  <li>輸入行事曆名稱</li>
                  <li>點擊「匯入」</li>
                </ol>
              </div>

              <!-- Desktop -->
              <div>
                <h3 class="font-semibold mb-3">Outlook 桌面版</h3>
                <ol class="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                  <li>開啟 Outlook 桌面應用程式</li>
                  <li>點擊「檔案」→「帳戶設定」→「帳戶設定」</li>
                  <li>切換到「網際網路行事曆」標籤</li>
                  <li>點擊「新增」</li>
                  <li>貼上從 MatchCal 複製的訂閱連結</li>
                  <li>點擊「新增」→「確定」</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- FAQ -->
        <Card>
          <CardHeader>
            <CardTitle>常見問題</CardTitle>
          </CardHeader>
          <CardContent>
            <div class="space-y-6">
              <div>
                <h3 class="font-semibold mb-2">Q: 訂閱後多久會更新？</h3>
                <p class="text-sm text-muted-foreground">
                  A: 這取決於您的行事曆軟體設定。通常 Google Calendar 會每 24 小時更新一次，Apple Calendar 可設定更新頻率（建議每天），Outlook 約每 3 小時更新一次。
                </p>
              </div>

              <div>
                <h3 class="font-semibold mb-2">Q: ICS 檔案下載和訂閱連結有什麼差別？</h3>
                <p class="text-sm text-muted-foreground">
                  A: ICS 檔案是一次性匯入，匯入後的資料不會自動更新。訂閱連結會定期從 MatchCal 同步最新資料，賽事變更時會自動更新到您的行事曆。
                </p>
              </div>

              <div>
                <h3 class="font-semibold mb-2">Q: 可以只訂閱特定類型的賽事嗎？</h3>
                <p class="text-sm text-muted-foreground">
                  A: 目前每個運動類型（如羽球）有獨立的 ICS 檔案和訂閱連結。您可以選擇只訂閱您感興趣的類型。未來會新增更細緻的篩選功能。
                </p>
              </div>

              <div>
                <h3 class="font-semibold mb-2">Q: 如何取消訂閱？</h3>
                <p class="text-sm text-muted-foreground">
                  A: 在您的行事曆軟體中，找到 MatchCal 相關的行事曆，點擊「取消訂閱」或「刪除」即可。已匯入的事件會被移除。
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <!-- CTA -->
        <div class="text-center">
          <Card>
            <CardContent class="pt-6">
              <h3 class="font-semibold mb-4">準備好訂閱了嗎？</h3>
              <div class="flex gap-4 justify-center">
                <Button as-child>
                  <NuxtLink to="/events">
                    瀏覽賽事
                  </NuxtLink>
                </Button>
                <Button variant="outline" as-child>
                  <NuxtLink to="/">
                    返回首頁
                  </NuxtLink>
                </Button>
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

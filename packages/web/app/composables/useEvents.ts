import { ref, readonly } from 'vue'
import type { StandardEvent, EventsData, EventFilters } from '~/types/event'

/**
 * 賽事資料管理 Composable
 */
export const useEvents = () => {
  const events = ref<StandardEvent[]>([])
  const loading = ref(false)
  const error = ref<Error | null>(null)
  const meta = ref<EventsData['meta'] | null>(null)

  /**
   * 從 JSON 檔案載入賽事資料
   * @param source 資料來源路徑（相對於 /public/data/）
   */
  const fetchEvents = async (source: string) => {
    loading.value = true
    error.value = null

    try {
      const response = await fetch(`/data/${source}`)

      if (!response.ok) {
        throw new Error(`Failed to fetch events: ${response.statusText}`)
      }

      const data: EventsData = await response.json()

      events.value = data.events
      meta.value = data.meta
    } catch (e) {
      error.value = e as Error
      console.error('Failed to fetch events:', e)
    } finally {
      loading.value = false
    }
  }

  /**
   * 篩選賽事
   * @param filters 篩選條件
   */
  const filterEvents = (filters: EventFilters) => {
    let filtered = [...events.value]

    // 搜尋關鍵字
    if (filters.search) {
      const searchLower = filters.search.toLowerCase()
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower)
      )
    }

    // 分類篩選
    if (filters.category && filters.category !== 'all') {
      filtered = filtered.filter(event => event.category === filters.category)
    }

    // 級別篩選
    if (filters.tier && filters.tier !== 'all') {
      filtered = filtered.filter(event => event.tier === filters.tier)
    }

    // 時間範圍篩選
    if (filters.timeRange && filters.timeRange !== 'all') {
      const now = new Date()
      const startOfWeek = new Date(now)
      startOfWeek.setDate(now.getDate() - now.getDay())
      startOfWeek.setHours(0, 0, 0, 0)

      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

      filtered = filtered.filter(event => {
        const eventDate = new Date(event.startDate)

        if (filters.timeRange === 'week') {
          return eventDate >= startOfWeek
        } else if (filters.timeRange === 'month') {
          return eventDate >= startOfMonth
        }

        return true
      })
    }

    return filtered
  }

  /**
   * 依開始時間排序
   */
  const sortByDate = (ascending = true) => {
    events.value.sort((a, b) => {
      const dateA = new Date(a.startDate).getTime()
      const dateB = new Date(b.startDate).getTime()
      return ascending ? dateA - dateB : dateB - dateA
    })
  }

  /**
   * 取得單一賽事
   */
  const getEventById = (id: string) => {
    return events.value.find(event => event.id === id)
  }

  /**
   * 取得所有分類
   */
  const getCategories = () => {
    const categories = new Set(events.value.map(event => event.category))
    return Array.from(categories)
  }

  /**
   * 取得所有級別
   */
  const getTiers = () => {
    const tiers = new Set(
      events.value
        .map(event => event.tier)
        .filter(tier => tier !== undefined)
    )
    return Array.from(tiers)
  }

  return {
    // 狀態
    events: readonly(events),
    loading: readonly(loading),
    error: readonly(error),
    meta: readonly(meta),

    // 方法
    fetchEvents,
    filterEvents,
    sortByDate,
    getEventById,
    getCategories,
    getTiers,
  }
}

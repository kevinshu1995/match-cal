/**
 * 賽事資料型別定義
 * 符合 data-schema 規範
 */

export interface StandardEvent {
  /** 唯一識別碼（格式：source-eventId） */
  id: string

  /** 賽事標題 */
  title: string

  /** 開始時間（ISO 8601 格式） */
  startDate: string

  /** 結束時間（ISO 8601 格式，可選） */
  endDate?: string

  /** 地點 */
  location: string

  /** 賽事描述 */
  description: string

  /** 官方網址 */
  sourceUrl: string

  /** 分類（如：羽球、籃球） */
  category: string

  /** 級別/等級（如：Super 1000, World Tour） */
  tier?: string

  /** 主辦單位 */
  organizer?: string

  /** 自訂欄位 */
  customFields?: Record<string, any>
}

/**
 * 賽事 JSON 檔案格式
 */
export interface EventsData {
  /** 元資料 */
  meta: {
    /** 資料來源名稱 */
    source: string

    /** 最後更新時間（ISO 8601 格式） */
    lastUpdated: string

    /** 事件總數 */
    count: number

    /** 年份 */
    year?: number

    /** 分類 */
    category?: string
  }

  /** 賽事列表 */
  events: StandardEvent[]
}

/**
 * 篩選條件
 */
export interface EventFilters {
  /** 搜尋關鍵字 */
  search?: string

  /** 分類 */
  category?: string

  /** 時間範圍 */
  timeRange?: 'week' | 'month' | 'all'

  /** 級別 */
  tier?: string
}

/**
 * 時間範圍選項
 */
export type TimeRangeOption = {
  label: string
  value: 'week' | 'month' | 'all'
}

import { generateEventId } from '@matchcal/scraper-core';

/**
 * 將 BWF 原始資料轉換為 StandardEvent 格式
 * @param {Object} bwfEvent - BWF 原始賽事資料
 * @returns {StandardEvent} 標準賽事格式
 */
export function transformBwfEvent(bwfEvent) {
  const now = new Date().toISOString();

  // 將日期轉換為 ISO 8601 格式
  const startDate = new Date(bwfEvent.startDate);
  startDate.setUTCHours(0, 0, 0, 0);

  const endDate = new Date(bwfEvent.endDate);
  endDate.setUTCHours(23, 59, 59, 999);

  const startDateISO = startDate.toISOString();
  const endDateISO = endDate.toISOString();

  // 生成唯一 ID
  const id = generateEventId({
    category: 'badminton',
    source: 'bwf',
    startDate: startDateISO,
    title: bwfEvent.name,
  });

  // 組裝 StandardEvent
  const standardEvent = {
    // 必要欄位
    id,
    title: bwfEvent.name,
    startDate: startDateISO,
    endDate: endDateISO,
    timezone: 'UTC',
    location: bwfEvent.location,
    category: 'badminton',
    level: 'professional',
    source: 'bwf',

    // 可選欄位
    status: 'scheduled',

    // 系統欄位
    createdAt: now,
    updatedAt: now,
    scrapedAt: now,
  };

  // 加入可選欄位（如果存在）
  if (bwfEvent.tier) {
    standardEvent.tier = bwfEvent.tier;
  }

  if (bwfEvent.url) {
    standardEvent.officialUrl = bwfEvent.url;
  }

  return standardEvent;
}

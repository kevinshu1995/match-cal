import { describe, it, expect } from 'vitest';
import { transformBwfEvent } from '../src/transformer.js';
import { mockBwfEvent } from './fixtures/bwf-event.js';

describe('transformBwfEvent', () => {
  it('應該將 BWF 原始資料轉換為 StandardEvent 格式', () => {
    const result = transformBwfEvent(mockBwfEvent);

    // 驗證必要欄位
    expect(result).toHaveProperty('id');
    expect(result).toHaveProperty('title');
    expect(result).toHaveProperty('startDate');
    expect(result).toHaveProperty('endDate');
    expect(result).toHaveProperty('timezone');
    expect(result).toHaveProperty('location');
    expect(result).toHaveProperty('category');
    expect(result).toHaveProperty('level');
    expect(result).toHaveProperty('source');
    expect(result).toHaveProperty('createdAt');
    expect(result).toHaveProperty('updatedAt');
    expect(result).toHaveProperty('scrapedAt');
  });

  it('應該正確轉換賽事名稱', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.title).toBe('2025 Indonesia Masters');
  });

  it('應該正確轉換日期為 ISO 8601 格式', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.startDate).toBe('2025-01-15T00:00:00.000Z');
    expect(result.endDate).toBe('2025-01-22T23:59:59.999Z');
  });

  it('應該設定正確的分類和來源', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.category).toBe('badminton');
    expect(result.source).toBe('bwf');
  });

  it('應該設定正確的地點', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.location).toBe('Jakarta, Indonesia');
  });

  it('應該包含 tier 資訊', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.tier).toBe('Super 1000');
  });

  it('應該包含官方網站 URL', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.officialUrl).toBe('https://bwfbadminton.com/tournament/2025-indonesia-masters');
  });

  it('應該生成唯一的 ID', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.id).toMatch(/^badminton-bwf-2025-01-15-/);
  });

  it('應該設定預設時區為 UTC', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.timezone).toBe('UTC');
  });

  it('應該設定預設級別為 professional', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.level).toBe('professional');
  });

  it('應該設定預設狀態為 scheduled', () => {
    const result = transformBwfEvent(mockBwfEvent);
    expect(result.status).toBe('scheduled');
  });

  it('應該處理缺失的可選欄位', () => {
    const minimalEvent = {
      name: 'Test Event',
      startDate: '2025-01-01',
      endDate: '2025-01-02',
      location: 'Test Location',
    };

    const result = transformBwfEvent(minimalEvent);
    expect(result.title).toBe('Test Event');
    expect(result.tier).toBeUndefined();
    expect(result.officialUrl).toBeUndefined();
  });
});

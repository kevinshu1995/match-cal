# TDD 工作流程

> Test-Driven Development（測試驅動開發）完整指南

---

## 📋 目錄

1. [TDD 核心概念](#tdd-核心概念)
2. [RED → GREEN → REFACTOR 循環](#red--green--refactor-循環)
3. [實戰範例](#實戰範例)
4. [測試框架使用](#測試框架使用)
5. [常見模式](#常見模式)
6. [常見錯誤](#常見錯誤)

---

## TDD 核心概念

### 什麼是 TDD？

**測試驅動開發**是一種開發方法論，核心原則是：

> **先寫測試，再寫程式碼**

### 為什麼要用 TDD？

✅ **優點**：
- 確保程式碼有測試覆蓋
- 設計更簡潔的 API
- 重構時更有信心
- 文件化程式碼行為
- 減少 bug

❌ **不用 TDD 的後果**：
- 程式碼難以維護
- 重構時容易出錯
- 不知道程式碼是否正確
- 技術債累積

### TDD 三大定律

1. **除非是為了讓失敗測試通過，否則不寫任何產品程式碼**
2. **只撰寫剛好能夠失敗的測試（編譯失敗也算失敗）**
3. **只撰寫剛好能讓測試通過的產品程式碼**

---

## RED → GREEN → REFACTOR 循環

### 🔴 RED（紅燈）：寫失敗測試

**目標**：寫一個失敗的測試，定義你想要的功能

#### 步驟：

1. 選擇一個小功能需求
2. 寫一個測試描述這個功能
3. 執行測試，確認它**失敗**
4. 確認失敗訊息是你預期的

#### 範例：

```javascript
// tests/scheduler.test.js
import { describe, it, expect } from 'vitest';
import { Scheduler } from '../src/scheduler.js';

describe('Scheduler', () => {
  it('should create a scheduler with cron expression', () => {
    const scheduler = new Scheduler('0 0 * * *');
    expect(scheduler.cronExpression).toBe('0 0 * * *');
  });
});
```

#### 執行測試：

```bash
pnpm test
```

**預期結果**：測試失敗（因為 `Scheduler` 類別還不存在）

```
❌ FAIL  tests/scheduler.test.js
  ● Scheduler › should create a scheduler with cron expression
    Cannot find module '../src/scheduler.js'
```

**✅ 紅燈階段完成**：測試失敗了！

---

### 🟢 GREEN（綠燈）：寫最小程式碼讓測試通過

**目標**：寫**剛好足夠**的程式碼讓測試通過，不要多寫

#### 步驟：

1. 寫最簡單的程式碼讓測試通過
2. 執行測試，確認它**通過**
3. 不要擔心程式碼品質（下一步會重構）

#### 範例：

```javascript
// src/scheduler.js
export class Scheduler {
  constructor(cronExpression) {
    this.cronExpression = cronExpression;
  }
}
```

#### 執行測試：

```bash
pnpm test
```

**預期結果**：測試通過

```
✅ PASS  tests/scheduler.test.js
  ✓ Scheduler › should create a scheduler with cron expression
```

**✅ 綠燈階段完成**：測試通過了！

---

### 🔵 REFACTOR（重構）：改善程式碼品質

**目標**：在測試通過的保護下，改善程式碼結構

#### 步驟：

1. 檢視程式碼，找出可改善的地方
2. 進行重構（提取方法、重新命名、消除重複等）
3. 每次重構後執行測試，確保仍然通過
4. 如果測試失敗，回退重構

#### 檢查清單：

- [ ] 有重複的程式碼嗎？
- [ ] 命名是否清晰？
- [ ] 方法是否太長？
- [ ] 職責是否單一？
- [ ] 是否有魔術數字？

#### 範例：

```javascript
// src/scheduler.js（重構前）
export class Scheduler {
  constructor(cronExpression) {
    this.cronExpression = cronExpression;
  }
}

// src/scheduler.js（重構後）
export class Scheduler {
  #cronExpression;

  constructor(cronExpression) {
    this.#validateCronExpression(cronExpression);
    this.#cronExpression = cronExpression;
  }

  get cronExpression() {
    return this.#cronExpression;
  }

  #validateCronExpression(expression) {
    if (!expression || typeof expression !== 'string') {
      throw new Error('Cron expression must be a non-empty string');
    }
  }
}
```

#### 執行測試：

```bash
pnpm test
```

**預期結果**：測試仍然通過

```
✅ PASS  tests/scheduler.test.js
  ✓ Scheduler › should create a scheduler with cron expression
```

**✅ 重構階段完成**：程式碼品質提升了！

---

### 循環繼續

現在回到 🔴 RED，為下一個功能寫測試：

```javascript
it('should throw error when cron expression is invalid', () => {
  expect(() => new Scheduler('')).toThrow('Cron expression must be a non-empty string');
});
```

---

## 實戰範例

### 範例：開發 ID 生成器

#### 需求

實作一個函式 `generateEventId(event)`，根據賽事資料生成唯一 ID。

格式：`{category}-{source}-{date}-{slug}`

---

#### 🔴 RED 1：測試基本功能

```javascript
// tests/id-generator.test.js
import { describe, it, expect } from 'vitest';
import { generateEventId } from '../src/id-generator.js';

describe('generateEventId', () => {
  it('should generate id from event data', () => {
    const event = {
      category: 'badminton',
      source: 'bwf',
      startDate: '2025-01-15T09:00:00.000Z',
      title: 'Indonesia Masters 2025'
    };

    const id = generateEventId(event);

    expect(id).toBe('badminton-bwf-2025-01-15-indonesia-masters-2025');
  });
});
```

執行 `pnpm test` → ❌ 失敗（模組不存在）

---

#### 🟢 GREEN 1：最小實作

```javascript
// src/id-generator.js
export function generateEventId(event) {
  const dateStr = event.startDate.split('T')[0]; // YYYY-MM-DD
  const slug = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  return `${event.category}-${event.source}-${dateStr}-${slug}`;
}
```

執行 `pnpm test` → ✅ 通過

---

#### 🔵 REFACTOR 1：提取方法

```javascript
// src/id-generator.js
export function generateEventId(event) {
  const dateStr = extractDate(event.startDate);
  const slug = createSlug(event.title);

  return `${event.category}-${event.source}-${dateStr}-${slug}`;
}

function extractDate(isoString) {
  return isoString.split('T')[0];
}

function createSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
```

執行 `pnpm test` → ✅ 仍然通過

---

#### 🔴 RED 2：測試邊界情況

```javascript
it('should handle titles with special characters', () => {
  const event = {
    category: 'badminton',
    source: 'bwf',
    startDate: '2025-01-15T09:00:00.000Z',
    title: 'YONEX® All England™ 2025!'
  };

  const id = generateEventId(event);

  expect(id).toBe('badminton-bwf-2025-01-15-yonex-all-england-2025');
});
```

執行 `pnpm test` → ✅ 通過（程式碼已經處理了）

---

#### 🔴 RED 3：測試錯誤處理

```javascript
it('should throw error when required fields are missing', () => {
  const event = {
    category: 'badminton',
    // missing source
    startDate: '2025-01-15T09:00:00.000Z',
    title: 'Test Event'
  };

  expect(() => generateEventId(event)).toThrow('Missing required fields');
});
```

執行 `pnpm test` → ❌ 失敗（沒有驗證）

---

#### 🟢 GREEN 3：加入驗證

```javascript
export function generateEventId(event) {
  validateEvent(event);

  const dateStr = extractDate(event.startDate);
  const slug = createSlug(event.title);

  return `${event.category}-${event.source}-${dateStr}-${slug}`;
}

function validateEvent(event) {
  const required = ['category', 'source', 'startDate', 'title'];
  const missing = required.filter(field => !event[field]);

  if (missing.length > 0) {
    throw new Error(`Missing required fields: ${missing.join(', ')}`);
  }
}
```

執行 `pnpm test` → ✅ 通過

---

#### 🔵 REFACTOR 3：改善錯誤訊息

```javascript
function validateEvent(event) {
  const required = ['category', 'source', 'startDate', 'title'];
  const missing = required.filter(field => !event[field]);

  if (missing.length > 0) {
    throw new Error(
      `Cannot generate event ID: missing required fields: ${missing.join(', ')}`
    );
  }
}
```

執行 `pnpm test` → ⚠️ 測試失敗（錯誤訊息改變了）

更新測試：

```javascript
expect(() => generateEventId(event))
  .toThrow('Cannot generate event ID: missing required fields: source');
```

執行 `pnpm test` → ✅ 通過

---

## 測試框架使用

### Vitest 基礎

本專案使用 **Vitest** 作為測試框架。

#### 安裝

```bash
pnpm add -D vitest
```

#### 設定（vitest.config.js）

```javascript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      exclude: ['tests/**', '*.config.js'],
    },
  },
});
```

#### package.json scripts

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage"
  }
}
```

---

### 常用 API

#### 基本斷言

```javascript
import { describe, it, expect } from 'vitest';

describe('Math', () => {
  it('should add two numbers', () => {
    expect(1 + 1).toBe(2);
  });

  it('should work with objects', () => {
    const obj = { name: 'John' };
    expect(obj).toEqual({ name: 'John' });
  });

  it('should check array contains', () => {
    expect([1, 2, 3]).toContain(2);
  });

  it('should check string matches', () => {
    expect('hello world').toMatch(/world/);
  });
});
```

#### 異步測試

```javascript
it('should resolve promise', async () => {
  const result = await Promise.resolve('hello');
  expect(result).toBe('hello');
});

it('should handle async functions', async () => {
  const data = await fetchData();
  expect(data).toBeDefined();
});
```

#### Mock 與 Spy

```javascript
import { vi } from 'vitest';

it('should call function', () => {
  const mockFn = vi.fn();
  mockFn('hello');

  expect(mockFn).toHaveBeenCalledWith('hello');
  expect(mockFn).toHaveBeenCalledTimes(1);
});

it('should spy on method', () => {
  const obj = { method: () => 'original' };
  const spy = vi.spyOn(obj, 'method');

  obj.method();

  expect(spy).toHaveBeenCalled();
  spy.mockRestore();
});
```

---

## 常見模式

### 測試命名

使用 **should** 語句描述行為：

```javascript
describe('Scheduler', () => {
  it('should create instance with cron expression', () => {});
  it('should throw error when expression is invalid', () => {});
  it('should parse cron expression correctly', () => {});
});
```

### 測試結構（AAA Pattern）

**Arrange → Act → Assert**

```javascript
it('should calculate total correctly', () => {
  // Arrange（準備）
  const calculator = new Calculator();
  const numbers = [1, 2, 3];

  // Act（執行）
  const result = calculator.sum(numbers);

  // Assert（斷言）
  expect(result).toBe(6);
});
```

### 一次測試一件事

❌ **不好**：

```javascript
it('should create user and send email and log event', () => {
  // 太多職責
});
```

✅ **好**：

```javascript
it('should create user', () => {});
it('should send welcome email after user creation', () => {});
it('should log user creation event', () => {});
```

---

## 常見錯誤

### ❌ 錯誤 1：先寫程式碼再寫測試

```javascript
// 錯誤流程
// 1. 寫 src/feature.js
// 2. 寫 tests/feature.test.js
```

✅ **正確**：先寫測試，再寫程式碼！

---

### ❌ 錯誤 2：寫太多程式碼

```javascript
// ❌ 測試還沒通過就寫了一堆功能
export class Scheduler {
  constructor(cronExpression) {
    this.expression = cronExpression;
    this.jobs = [];
    this.isRunning = false;
    // ... 寫了一堆功能
  }
}
```

✅ **正確**：只寫剛好讓測試通過的程式碼！

---

### ❌ 錯誤 3：跳過測試失敗階段

```javascript
// ❌ 寫了測試就直接寫實作
it('should work', () => {
  expect(fn()).toBe('result');
});

// 沒有執行測試確認它會失敗
```

✅ **正確**：先執行測試，確認它**失敗**！

---

### ❌ 錯誤 4：在綠燈階段重構

```javascript
// ❌ 測試剛通過就立刻重構
// 1. 測試通過
// 2. 馬上重構（還在 GREEN 階段）
```

✅ **正確**：綠燈後進入獨立的 REFACTOR 階段！

---

## 📝 TDD 檢查清單

每次開發新功能時，確認：

### 🔴 RED 階段
- [ ] 寫了一個失敗的測試
- [ ] 執行測試並確認它失敗
- [ ] 失敗訊息符合預期

### 🟢 GREEN 階段
- [ ] 寫了最小程式碼讓測試通過
- [ ] 執行測試並確認它通過
- [ ] 沒有寫多餘的程式碼

### 🔵 REFACTOR 階段
- [ ] 檢查是否有重複程式碼
- [ ] 檢查命名是否清晰
- [ ] 檢查方法是否太長
- [ ] 每次重構後執行測試

### 整體
- [ ] 所有測試都通過（`pnpm test`）
- [ ] 測試覆蓋率足夠（目標 80%+）
- [ ] Commit 前確認測試通過

---

## 📚 延伸閱讀

- [Kent Beck - Test-Driven Development: By Example](https://www.amazon.com/Test-Driven-Development-Kent-Beck/dp/0321146530)
- [Vitest 官方文件](https://vitest.dev/)
- [Tidy First](../DEVELOPMENT-GUIDE.md)

---

🎯 **嚴格遵循 TDD，寫出高品質程式碼！**

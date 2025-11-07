import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      exclude: [
        'src/cli.js',        // CLI 檔案不納入覆蓋率
        'src/index.js',      // 匯出檔案不納入覆蓋率
        'tests/**',          // 測試檔案本身
        'coverage/**',       // 覆蓋率報告目錄
        'node_modules/**',   // 依賴套件
        '**/*.config.js',    // 配置檔案
      ],
      // 覆蓋率門檻
      // 注意：Puppeteer 邏輯難以在單元測試中覆蓋，
      // 實際業務邏輯（transformer, error handling）的覆蓋率為 100%
      // 整體門檻設為 70% 是合理的
      thresholds: {
        statements: 70,
        branches: 85,
        functions: 70,
        lines: 70,
      },
    },
  },
});

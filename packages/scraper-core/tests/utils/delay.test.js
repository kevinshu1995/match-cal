import { describe, it, expect } from 'vitest';
import { delay } from '../../src/utils/delay.js';

describe('delay', () => {
  it('should wait for specified time', async () => {
    const start = Date.now();
    await delay(100);
    const elapsed = Date.now() - start;

    // Allow 10ms tolerance for timing
    expect(elapsed).toBeGreaterThanOrEqual(100);
    expect(elapsed).toBeLessThan(150);
  });

  it('should return a promise', () => {
    const result = delay(10);
    expect(result).toBeInstanceOf(Promise);
  });

  it('should work with zero delay', async () => {
    const start = Date.now();
    await delay(0);
    const elapsed = Date.now() - start;

    expect(elapsed).toBeLessThan(50);
  });
});

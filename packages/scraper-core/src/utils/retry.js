import { delay } from './delay.js';

/**
 * Retry a function with exponential backoff
 * @param {Function} fn - The function to retry
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} delayMs - Delay between retries in milliseconds (default: 1000)
 * @returns {Promise<*>} The result of the function
 * @throws {Error} If all retries fail
 */
export async function retry(fn, maxRetries = 3, delayMs = 1000) {
  let lastError;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (attempt < maxRetries - 1) {
        await delay(delayMs);
      }
    }
  }

  throw lastError;
}

import { validateEvent, validateEvents } from '../validator/validate.js';
import { retry } from '../utils/retry.js';

/**
 * Base scraper class that all scrapers should extend
 * Provides common functionality for validation, retry logic, and configuration
 */
export class BaseScraper {
  /**
   * @param {Object} config - Scraper configuration
   * @param {string} config.source - Data source identifier
   * @param {string} config.category - Event category
   * @param {string} config.url - Target URL to scrape
   */
  constructor(config) {
    if (!config) {
      throw new Error('Scraper config is required');
    }

    this.source = config.source;
    this.category = config.category;
    this.url = config.url;
  }

  /**
   * Scrape events from the source
   * Must be implemented by subclasses
   * @returns {Promise<StandardEvent[]>} Array of scraped events
   * @throws {Error} If not implemented
   */
  async scrape() {
    throw new Error('scrape() must be implemented by subclass');
  }

  /**
   * Validate a single event
   * @param {unknown} event - Event to validate
   * @returns {StandardEvent} Validated event
   * @throws {Error} If validation fails
   */
  validateEvent(event) {
    return validateEvent(event);
  }

  /**
   * Validate multiple events
   * @param {unknown[]} events - Events to validate
   * @returns {StandardEvent[]} Validated events
   * @throws {Error} If any validation fails
   */
  validateEvents(events) {
    return validateEvents(events);
  }

  /**
   * Retry a function with exponential backoff
   * @param {Function} fn - Function to retry
   * @param {number} maxRetries - Maximum retry attempts
   * @param {number} delayMs - Delay between retries in milliseconds
   * @returns {Promise<*>} Result of the function
   * @throws {Error} If all retries fail
   */
  async retry(fn, maxRetries = 3, delayMs = 1000) {
    return retry(fn, maxRetries, delayMs);
  }
}

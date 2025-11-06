/**
 * @matchcal/scraper-core
 * Core framework for building event scrapers
 */

// Base scraper class
export { BaseScraper } from './base/BaseScraper.js';

// Scheduler
export { Scheduler } from './scheduler/Scheduler.js';

// Validation
export { StandardEventSchema } from './validator/schema.js';
export { validateEvent, validateEvents } from './validator/validate.js';

// Utilities
export { delay } from './utils/delay.js';
export { retry } from './utils/retry.js';
export { generateEventId } from './utils/id-generator.js';

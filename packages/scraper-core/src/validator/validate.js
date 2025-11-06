import { StandardEventSchema } from './schema.js';

/**
 * Validate a single event against the StandardEvent schema
 * @param {unknown} data - The event data to validate
 * @returns {StandardEvent} The validated event
 * @throws {Error} If validation fails
 */
export function validateEvent(data) {
  try {
    return StandardEventSchema.parse(data);
  } catch (error) {
    if (error.errors) {
      const messages = error.errors.map((err) => `${err.path.join('.')}: ${err.message}`);
      throw new Error(`Invalid event data: ${messages.join(', ')}`);
    }
    throw new Error(`Invalid event data: ${error.message}`);
  }
}

/**
 * Validate an array of events
 * @param {unknown[]} data - Array of event data to validate
 * @returns {StandardEvent[]} Array of validated events
 * @throws {Error} If any event is invalid
 */
export function validateEvents(data) {
  return data.map((event, index) => {
    try {
      return validateEvent(event);
    } catch (error) {
      throw new Error(`Event at index ${index} is invalid: ${error.message}`);
    }
  });
}

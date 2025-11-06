/**
 * Generate a unique event ID from event data
 * Format: {category}-{source}-{YYYY-MM-DD}-{slug}
 *
 * @param {Object} event - Event data
 * @param {string} event.category - Event category
 * @param {string} event.source - Event source
 * @param {string} event.startDate - Event start date (ISO 8601)
 * @param {string} event.title - Event title
 * @returns {string} Generated event ID
 * @throws {Error} If required fields are missing
 *
 * @example
 * generateEventId({
 *   category: 'badminton',
 *   source: 'bwf',
 *   startDate: '2025-01-15T09:00:00.000Z',
 *   title: 'Indonesia Masters 2025'
 * })
 * // Returns: 'badminton-bwf-2025-01-15-indonesia-masters-2025'
 */
export function generateEventId(event) {
  // Validate required fields
  if (!event.category) {
    throw new Error('Event category is required for ID generation');
  }
  if (!event.source) {
    throw new Error('Event source is required for ID generation');
  }
  if (!event.startDate) {
    throw new Error('Event startDate is required for ID generation');
  }
  if (!event.title) {
    throw new Error('Event title is required for ID generation');
  }

  // Extract date (YYYY-MM-DD)
  const dateStr = event.startDate.split('T')[0];

  // Extract source identifier (remove domain if present)
  const sourceId = event.source.split('.')[0];

  // Create URL-safe slug from title
  const slug = event.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with dash
    .replace(/^-+|-+$/g, '');     // Remove leading/trailing dashes

  // Combine parts
  return `${event.category}-${sourceId}-${dateStr}-${slug}`;
}

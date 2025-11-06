/**
 * Merge new events with existing events
 * - Updates existing events while preserving customFields
 * - Adds new events
 * - Removes events that no longer exist in new data
 * - Updates timestamps appropriately
 *
 * @param {Array} existingEvents - Current events
 * @param {Array} newEvents - New events from scraper
 * @returns {Array} Merged events
 */
export function mergeEvents(existingEvents, newEvents) {
  const now = new Date().toISOString();

  // Create a map of existing events by ID for quick lookup
  const existingMap = new Map();
  for (const event of existingEvents) {
    existingMap.set(event.id, event);
  }

  // Merge new events with existing ones
  const mergedEvents = newEvents.map((newEvent) => {
    const existing = existingMap.get(newEvent.id);

    if (existing) {
      // Event exists - merge while preserving customFields and createdAt
      return {
        ...newEvent,  // Take all fields from new event
        customFields: existing.customFields,  // Preserve customFields
        createdAt: existing.createdAt,  // Preserve original creation time
        updatedAt: now,  // Update modification time
        scrapedAt: now,  // Update scrape time
      };
    } else {
      // New event - use as is but update timestamps
      return {
        ...newEvent,
        updatedAt: now,
        scrapedAt: now,
      };
    }
  });

  return mergedEvents;
}

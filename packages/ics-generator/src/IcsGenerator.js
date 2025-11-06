import { createEvents } from 'ics';
import fs from 'fs/promises';
import path from 'path';

/**
 * ICS Generator class for creating iCalendar files
 * Uses the ics library to generate RFC 5545 compliant ICS files
 */
export class IcsGenerator {
  /**
   * Generate ICS string from events
   * @param {Array} events - Array of StandardEvent objects
   * @returns {string} ICS formatted string
   */
  generateString(events) {
    // Convert StandardEvent to ics format
    const icsEvents = events.map((event) => this._convertToIcsFormat(event));

    // Generate ICS using the ics library
    const { error, value } = createEvents(icsEvents);

    if (error) {
      throw new Error(`Failed to generate ICS: ${error.message}`);
    }

    return value;
  }

  /**
   * Generate ICS file and write to disk
   * @param {string} filePath - Path to write the ICS file
   * @param {Array} events - Array of StandardEvent objects
   * @returns {Promise<void>}
   */
  async generate(filePath, events) {
    // Create parent directories if they don't exist
    const dirPath = path.dirname(filePath);
    await fs.mkdir(dirPath, { recursive: true });

    // Generate ICS string
    const icsString = this.generateString(events);

    // Write to file
    await fs.writeFile(filePath, icsString, 'utf-8');
  }

  /**
   * Convert StandardEvent to ics library format
   * @private
   * @param {Object} event - StandardEvent object
   * @returns {Object} Event object in ics library format
   */
  _convertToIcsFormat(event) {
    // Parse ISO date string to components
    const start = this._parseDate(event.startDate);
    const end = this._parseDate(event.endDate);

    const icsEvent = {
      uid: event.id,
      title: event.title,
      start,
      end,
      location: event.location,
      status: 'CONFIRMED',
      busyStatus: 'BUSY',
      productId: '-//MatchCal//Event Calendar//EN',
      calName: 'Match Calendar',
    };

    // Add optional description
    if (event.description) {
      icsEvent.description = event.description;
    }

    // Add optional URL
    if (event.officialUrl) {
      icsEvent.url = event.officialUrl;
    }

    // Add categories
    const categories = [event.category];
    if (event.level) {
      categories.push(event.level);
    }
    icsEvent.categories = categories;

    return icsEvent;
  }

  /**
   * Parse ISO 8601 date string to ics date array format
   * @private
   * @param {string} isoString - ISO 8601 date string
   * @returns {Array} Date array [year, month, day, hour, minute]
   */
  _parseDate(isoString) {
    const date = new Date(isoString);
    return [
      date.getUTCFullYear(),
      date.getUTCMonth() + 1, // Month is 0-indexed, ics expects 1-indexed
      date.getUTCDate(),
      date.getUTCHours(),
      date.getUTCMinutes(),
    ];
  }
}

import parser from 'cron-parser';

/**
 * Scheduler for managing cron-based task execution
 */
export class Scheduler {
  /**
   * Create a new scheduler
   * @param {string} cronExpression - Cron expression (e.g., '0 0 * * *')
   * @throws {Error} If cron expression is invalid
   */
  constructor(cronExpression) {
    this.cronExpression = cronExpression;

    // Validate cron expression on construction
    try {
      parser.parseExpression(cronExpression);
    } catch (error) {
      throw new Error(`Invalid cron expression: ${error.message}`);
    }
  }

  /**
   * Check if the cron expression is valid
   * @returns {boolean} True if valid
   */
  isValid() {
    try {
      parser.parseExpression(this.cronExpression);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Calculate the next execution time
   * @param {Date} [currentDate] - Reference date (defaults to now)
   * @returns {Date} Next execution time
   */
  next(currentDate) {
    const interval = parser.parseExpression(this.cronExpression, {
      currentDate: currentDate || new Date(),
    });

    return interval.next().toDate();
  }

  /**
   * Run a task immediately
   * @param {Function} task - Async function to execute
   * @returns {Promise<*>} Result of the task
   * @throws {Error} If task fails
   */
  async run(task) {
    return await task();
  }
}

import { describe, it, expect, vi } from 'vitest';
import { Scheduler } from '../../src/scheduler/Scheduler.js';

describe('Scheduler', () => {
  it('should create scheduler with cron expression', () => {
    const scheduler = new Scheduler('0 0 * * *');

    expect(scheduler.cronExpression).toBe('0 0 * * *');
  });

  it('should validate valid cron expression', () => {
    const scheduler = new Scheduler('0 0 * * *');

    expect(scheduler.isValid()).toBe(true);
  });

  it('should throw error for invalid cron expression', () => {
    expect(() => new Scheduler('invalid cron')).toThrow();
  });

  it('should calculate next execution time', () => {
    const scheduler = new Scheduler('0 0 * * *'); // Every day at midnight

    const next = scheduler.next();

    expect(next).toBeInstanceOf(Date);
    expect(next.getTime()).toBeGreaterThan(Date.now());
  });

  it('should run scheduled task', async () => {
    const scheduler = new Scheduler('* * * * *'); // Every minute
    const mockTask = vi.fn().mockResolvedValue('done');

    await scheduler.run(mockTask);

    expect(mockTask).toHaveBeenCalledTimes(1);
  });

  it('should handle task errors', async () => {
    const scheduler = new Scheduler('* * * * *');
    const mockTask = vi.fn().mockRejectedValue(new Error('task failed'));

    await expect(scheduler.run(mockTask)).rejects.toThrow('task failed');
  });

  it('should support different cron formats', () => {
    // Every hour
    const hourly = new Scheduler('0 * * * *');
    expect(hourly.isValid()).toBe(true);

    // Every day at 2:30 PM
    const daily = new Scheduler('30 14 * * *');
    expect(daily.isValid()).toBe(true);

    // Every Monday at 9 AM
    const weekly = new Scheduler('0 9 * * 1');
    expect(weekly.isValid()).toBe(true);

    // First day of month at midnight
    const monthly = new Scheduler('0 0 1 * *');
    expect(monthly.isValid()).toBe(true);
  });

  it('should calculate next multiple times consistently', () => {
    const scheduler = new Scheduler('0 0 * * *');

    const next1 = scheduler.next();
    const next2 = scheduler.next(next1);

    expect(next2.getTime()).toBeGreaterThan(next1.getTime());
  });
});

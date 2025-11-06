import { z } from 'zod';

/**
 * Standard Event Schema
 * Defines the structure and validation rules for all events in the system
 */
export const StandardEventSchema = z.object({
  // Required fields
  id: z.string().min(1, 'ID is required'),
  title: z.string().min(1, 'Title is required'),
  startDate: z.string().datetime('Start date must be in ISO 8601 format'),
  endDate: z.string().datetime('End date must be in ISO 8601 format'),
  timezone: z.string().min(1, 'Timezone is required'),
  location: z.string().min(1, 'Location is required'),
  category: z.string().min(1, 'Category is required'),
  level: z.enum(['international', 'professional', 'amateur', 'youth', 'university'], {
    errorMap: () => ({ message: 'Level must be one of: international, professional, amateur, youth, university' }),
  }),
  source: z.string().min(1, 'Source is required'),

  // Optional fields
  description: z.string().optional(),
  organizer: z.string().optional(),
  participants: z.array(z.string()).optional(),
  officialUrl: z.string().url('Official URL must be a valid URL').optional(),
  tier: z.string().optional(),
  status: z.enum(['scheduled', 'ongoing', 'completed', 'cancelled'], {
    errorMap: () => ({ message: 'Status must be one of: scheduled, ongoing, completed, cancelled' }),
  }).optional(),

  // Custom fields (user-edited, preserved on merge)
  customFields: z.record(z.any()).optional(),

  // System fields
  createdAt: z.string().datetime('Created date must be in ISO 8601 format'),
  updatedAt: z.string().datetime('Updated date must be in ISO 8601 format'),
  scrapedAt: z.string().datetime('Scraped date must be in ISO 8601 format'),
});

/**
 * TypeScript type inferred from the schema
 * @typedef {z.infer<typeof StandardEventSchema>} StandardEvent
 */

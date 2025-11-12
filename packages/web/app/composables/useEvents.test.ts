import { describe, it, expect, beforeEach, vi } from 'vitest'
import { useEvents } from './useEvents'
import type { EventsData } from '~/types/event'

// Mock fetch
const mockFetch = vi.fn()
global.fetch = mockFetch

const mockEventsData: EventsData = {
  meta: {
    source: 'bwf',
    category: 'badminton',
    generatedAt: '2025-01-15T10:00:00.000Z',
    totalEvents: 3,
    year: 2025,
  },
  events: [
    {
      id: 'bwf-2025-event-1',
      title: 'BWF World Championships 2025',
      startDate: '2025-08-25T09:00:00.000Z',
      endDate: '2025-08-31T18:00:00.000Z',
      location: 'Tokyo, Japan',
      description: 'BWF World Championships',
      category: 'badminton',
      tier: 'Level 1',
      sourceUrl: 'https://bwfbadminton.com/event/1',
      organizer: 'BWF',
    },
    {
      id: 'bwf-2025-event-2',
      title: 'Japan Open 2025',
      startDate: '2025-07-29T09:00:00.000Z',
      endDate: '2025-08-03T18:00:00.000Z',
      location: 'Osaka, Japan',
      description: 'Japan Open Super 750',
      category: 'badminton',
      tier: 'Level 2',
      sourceUrl: 'https://bwfbadminton.com/event/2',
      organizer: 'BWF',
    },
    {
      id: 'bwf-2025-event-3',
      title: 'China Masters 2025',
      startDate: '2025-11-25T09:00:00.000Z',
      endDate: '2025-11-30T18:00:00.000Z',
      location: 'Shenzhen, China',
      description: 'China Masters Super 750',
      category: 'badminton',
      tier: 'Level 2',
      sourceUrl: 'https://bwfbadminton.com/event/3',
      organizer: 'BWF',
    },
  ],
}

describe('useEvents', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('fetchEvents', () => {
    it('should fetch events successfully', async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData,
      })

      const { fetchEvents, events, loading, error, meta } = useEvents()

      expect(loading.value).toBe(false)
      expect(events.value).toEqual([])

      await fetchEvents('badminton/bwf-2025.json')

      expect(loading.value).toBe(false)
      expect(error.value).toBeNull()
      expect(events.value).toEqual(mockEventsData.events)
      expect(meta.value).toEqual(mockEventsData.meta)
      expect(mockFetch).toHaveBeenCalledWith('/data/badminton/bwf-2025.json')
    })

    it('should handle fetch error', async () => {
      const errorMessage = 'Not Found'
      mockFetch.mockResolvedValueOnce({
        ok: false,
        statusText: errorMessage,
      })

      const { fetchEvents, events, loading, error } = useEvents()

      await fetchEvents('badminton/invalid.json')

      expect(loading.value).toBe(false)
      expect(error.value).toBeInstanceOf(Error)
      expect(error.value?.message).toContain(errorMessage)
      expect(events.value).toEqual([])
    })

    it('should handle network error', async () => {
      const networkError = new Error('Network error')
      mockFetch.mockRejectedValueOnce(networkError)

      const { fetchEvents, loading, error } = useEvents()

      await fetchEvents('badminton/bwf-2025.json')

      expect(loading.value).toBe(false)
      expect(error.value).toBe(networkError)
    })
  })

  describe('filterEvents', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData,
      })
    })

    it('should filter events by search keyword', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({ search: 'world' })

      expect(filtered).toHaveLength(1)
      expect(filtered[0].title).toContain('World Championships')
    })

    it('should filter events by location keyword', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({ search: 'tokyo' })

      expect(filtered).toHaveLength(1)
      expect(filtered[0].location).toContain('Tokyo')
    })

    it('should filter events by category', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({ category: 'badminton' })

      expect(filtered).toHaveLength(3)
    })

    it('should not filter when category is "all"', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({ category: 'all' })

      expect(filtered).toHaveLength(3)
    })

    it('should filter events by tier', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({ tier: 'Level 2' })

      expect(filtered).toHaveLength(2)
      expect(filtered[0].tier).toBe('Level 2')
      expect(filtered[1].tier).toBe('Level 2')
    })

    it('should not filter when tier is "all"', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({ tier: 'all' })

      expect(filtered).toHaveLength(3)
    })

    it('should filter events by multiple criteria', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({
        category: 'badminton',
        tier: 'Level 2',
        search: 'japan',
      })

      expect(filtered).toHaveLength(1)
      expect(filtered[0].title).toContain('Japan Open')
    })

    it('should return all events when no filters applied', async () => {
      const { fetchEvents, filterEvents } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const filtered = filterEvents({})

      expect(filtered).toHaveLength(3)
    })
  })

  describe('sortByDate', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData,
      })
    })

    it('should sort events by date ascending', async () => {
      const { fetchEvents, sortByDate, events } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      sortByDate(true)

      expect(events.value[0].title).toContain('Japan Open')
      expect(events.value[1].title).toContain('World Championships')
      expect(events.value[2].title).toContain('China Masters')
    })

    it('should sort events by date descending', async () => {
      const { fetchEvents, sortByDate, events } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      sortByDate(false)

      expect(events.value[0].title).toContain('China Masters')
      expect(events.value[1].title).toContain('World Championships')
      expect(events.value[2].title).toContain('Japan Open')
    })
  })

  describe('getEventById', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData,
      })
    })

    it('should return event by id', async () => {
      const { fetchEvents, getEventById } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const event = getEventById('bwf-2025-event-1')

      expect(event).toBeDefined()
      expect(event?.title).toContain('World Championships')
    })

    it('should return undefined for non-existent id', async () => {
      const { fetchEvents, getEventById } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const event = getEventById('non-existent-id')

      expect(event).toBeUndefined()
    })
  })

  describe('getCategories', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData,
      })
    })

    it('should return all unique categories', async () => {
      const { fetchEvents, getCategories } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const categories = getCategories()

      expect(categories).toEqual(['badminton'])
    })
  })

  describe('getTiers', () => {
    beforeEach(async () => {
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => mockEventsData,
      })
    })

    it('should return all unique tiers', async () => {
      const { fetchEvents, getTiers } = useEvents()
      await fetchEvents('badminton/bwf-2025.json')

      const tiers = getTiers()

      expect(tiers).toHaveLength(2)
      expect(tiers).toContain('Level 1')
      expect(tiers).toContain('Level 2')
    })
  })
})

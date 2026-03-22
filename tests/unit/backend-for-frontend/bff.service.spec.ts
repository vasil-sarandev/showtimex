import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  eventService: { findOneOrFail: vi.fn() },
  performerService: { findOneOrFail: vi.fn() },
  venueService: { findOneOrFail: vi.fn() },
}));

vi.mock('@/components/event/event.service', () => ({
  eventService: mocks.eventService,
}));
vi.mock('@/components/performer/performer.service', () => ({
  performerService: mocks.performerService,
}));
vi.mock('@/components/venue/venue.service', () => ({
  venueService: mocks.venueService,
}));

import { bffService } from '@/components/backend-for-frontend/bff.service';

describe('BackendForFrontEndService', () => {
  beforeEach(() => {
    mocks.eventService.findOneOrFail.mockReset();
    mocks.performerService.findOneOrFail.mockReset();
    mocks.venueService.findOneOrFail.mockReset();
  });

  it('builds event page data', async () => {
    mocks.eventService.findOneOrFail.mockResolvedValue({
      id: 1,
      title: 'Rock Night',
      venue: { id: 2 },
      tickets: [{ id: 10 }],
      performers: [{ id: 20 }],
    });

    const result = await bffService.getEventPageData(1);

    expect(result).toEqual({
      event: { id: 1, title: 'Rock Night' },
      venue: { id: 2 },
      tickets: [{ id: 10 }],
      performers: [{ id: 20 }],
    });
  });

  it('builds performer page data', async () => {
    mocks.performerService.findOneOrFail.mockResolvedValue({
      id: 4,
      name: 'Artist',
      events: [{ id: 1 }],
    });

    const result = await bffService.getPerformerPageData(4);

    expect(result).toEqual({
      performer: { id: 4, name: 'Artist' },
      events: [{ id: 1 }],
    });
  });

  it('builds venue page data', async () => {
    mocks.venueService.findOneOrFail.mockResolvedValue({
      id: 6,
      name: 'Main Hall',
      events: [{ id: 1 }],
    });

    const result = await bffService.getVenuePageData(6);

    expect(result).toEqual({
      venue: { id: 6, name: 'Main Hall' },
      events: [{ id: 1 }],
    });
  });
});

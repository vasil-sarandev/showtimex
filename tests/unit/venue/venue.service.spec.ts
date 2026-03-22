import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ILike } from 'typeorm';
import { CreateVenueDTO } from '@/components/venue/venue.dto';

const mocks = vi.hoisted(() => ({
  repository: {
    create: vi.fn(),
    save: vi.fn(),
    findOne: vi.fn(),
    findOneOrFail: vi.fn(),
    findAndCount: vi.fn(),
  },
  validateOrReject: vi.fn(),
}));

vi.mock('@/components/venue/venue.repository', () => ({
  venueRepository: mocks.repository,
}));

vi.mock('class-validator', async importOriginal => {
  const actual = await importOriginal<typeof import('class-validator')>();
  return {
    ...actual,
    validateOrReject: mocks.validateOrReject,
  };
});

import { venueService } from '@/components/venue/venue.service';

describe('VenueService', () => {
  beforeEach(() => {
    mocks.repository.create.mockReset();
    mocks.repository.save.mockReset();
    mocks.repository.findOne.mockReset();
    mocks.repository.findOneOrFail.mockReset();
    mocks.repository.findAndCount.mockReset();
    mocks.validateOrReject.mockReset();
  });

  it('creates and saves a venue', async () => {
    const payload: CreateVenueDTO = {
      name: 'Main Concert Hall',
      capacity: 3000,
      google_maps_url: 'https://maps.google.com/?q=main+hall',
    };
    const entity = { id: 10, ...payload };

    mocks.repository.create.mockReturnValue(entity);
    mocks.repository.save.mockResolvedValue(entity);

    const result = await venueService.create(payload);

    expect(mocks.repository.create).toHaveBeenCalledWith(payload);
    expect(mocks.validateOrReject).toHaveBeenCalledWith(entity);
    expect(mocks.repository.save).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('delegates findOne', async () => {
    const expected = { id: 1, name: 'A' };
    mocks.repository.findOne.mockResolvedValue(expected);

    const result = await venueService.findOne({ where: { id: 1 } });

    expect(mocks.repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual(expected);
  });

  it('searches with pagination and optional name filter', async () => {
    mocks.repository.findAndCount.mockResolvedValue([[], 0]);

    await venueService.search({ name: 'hall', page: '2', limit: '5' });

    expect(mocks.repository.findAndCount).toHaveBeenCalledWith({
      where: { name: ILike('%hall%') },
      skip: 5,
      take: 5,
    });
  });

  it('searches without name filter', async () => {
    mocks.repository.findAndCount.mockResolvedValue([[], 0]);

    await venueService.search({ page: '1', limit: '20' });

    expect(mocks.repository.findAndCount).toHaveBeenCalledWith({
      where: {},
      skip: 0,
      take: 20,
    });
  });
});

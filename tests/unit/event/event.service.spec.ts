import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateEventDTO } from '@/components/event/event.dto';

const mocks = vi.hoisted(() => {
  const qb = {
    andWhere: vi.fn(),
    skip: vi.fn(),
    take: vi.fn(),
    getManyAndCount: vi.fn(),
  };
  qb.andWhere.mockReturnValue(qb);
  qb.skip.mockReturnValue(qb);
  qb.take.mockReturnValue(qb);

  return {
    repository: {
      create: vi.fn(),
      save: vi.fn(),
      findOne: vi.fn(),
      findOneOrFail: vi.fn(),
      createQueryBuilder: vi.fn(() => qb),
    },
    validateOrReject: vi.fn(),
    qb,
  };
});

vi.mock('@/components/event/event.repository', () => ({
  eventRepository: mocks.repository,
}));

vi.mock('class-validator', async importOriginal => {
  const actual = await importOriginal<typeof import('class-validator')>();
  return {
    ...actual,
    validateOrReject: mocks.validateOrReject,
  };
});

import { eventService } from '@/components/event/event.service';

describe('EventService', () => {
  beforeEach(() => {
    mocks.repository.create.mockReset();
    mocks.repository.save.mockReset();
    mocks.repository.findOne.mockReset();
    mocks.repository.findOneOrFail.mockReset();
    mocks.repository.createQueryBuilder.mockClear();
    mocks.qb.andWhere.mockClear();
    mocks.qb.skip.mockClear();
    mocks.qb.take.mockClear();
    mocks.qb.getManyAndCount.mockReset();
    mocks.validateOrReject.mockReset();
  });

  it('creates an event with performer relation mapping', async () => {
    const payload: CreateEventDTO = {
      title: 'Rock Night',
      description: 'Live show',
      date: '2026-03-22',
      venueId: 3,
      performerIds: [2, 4],
    };

    const entity = { id: 5 };
    mocks.repository.create.mockReturnValue(entity);
    mocks.repository.save.mockResolvedValue(entity);

    const result = await eventService.create(payload);

    expect(mocks.repository.create).toHaveBeenCalledWith({
      title: payload.title,
      description: payload.description,
      date: payload.date,
      venueId: payload.venueId,
      performers: [{ id: 2 }, { id: 4 }],
    });
    expect(mocks.validateOrReject).toHaveBeenCalledWith(entity);
    expect(result).toEqual(entity);
  });

  it('delegates findOne', async () => {
    mocks.repository.findOne.mockResolvedValue({ id: 1 });

    const result = await eventService.findOne({ where: { id: 1 } });

    expect(mocks.repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    expect(result).toEqual({ id: 1 });
  });

  it('builds search query with all filters', async () => {
    mocks.qb.getManyAndCount.mockResolvedValue([[], 0]);

    await eventService.search({
      term: 'rock',
      venueId: '9',
      date: '2026-03-22',
      page: '2',
      limit: '10',
    });

    expect(mocks.repository.createQueryBuilder).toHaveBeenCalledWith('event');
    expect(mocks.qb.andWhere).toHaveBeenCalledWith('event.venueId = :venueId', { venueId: 9 });
    expect(mocks.qb.andWhere).toHaveBeenCalledWith('event.date = :date', { date: '2026-03-22' });
    expect(mocks.qb.andWhere).toHaveBeenCalledWith(
      '(event.title ILIKE :term OR event.description ILIKE :term)',
      { term: '%rock%' },
    );
    expect(mocks.qb.skip).toHaveBeenCalledWith(10);
    expect(mocks.qb.take).toHaveBeenCalledWith(10);
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/middlewares/error.middleware';
import { eventController } from '@/components/event/event.controller';

type CreateArgs = Parameters<typeof eventController.create>;
type GetByIdArgs = Parameters<typeof eventController.getById>;
type SearchArgs = Parameters<typeof eventController.search>;

const mocks = vi.hoisted(() => ({
  eventService: {
    create: vi.fn(),
    findOne: vi.fn(),
    search: vi.fn(),
  },
}));

vi.mock('@/components/event/event.service', () => ({
  eventService: mocks.eventService,
}));

const createRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  return res;
};

describe('EventController', () => {
  beforeEach(() => {
    mocks.eventService.create.mockReset();
    mocks.eventService.findOne.mockReset();
    mocks.eventService.search.mockReset();
  });

  it('create returns 201', async () => {
    const req = {
      body: {
        title: 'Rock Night',
        description: 'Live show',
        date: '2026-03-22',
        venueId: 3,
        performerIds: [2],
      },
    };
    const event = { id: 1, ...req.body };
    const res = createRes();
    const next = vi.fn();

    mocks.eventService.create.mockResolvedValue(event);

    await eventController.create(
      req as unknown as CreateArgs[0],
      res as unknown as CreateArgs[1],
      next as unknown as CreateArgs[2],
    );

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(event);
  });

  it('getById forwards not found', async () => {
    const req = { params: { id: '99' } };
    const res = createRes();
    const next = vi.fn();

    mocks.eventService.findOne.mockResolvedValue(null);

    await eventController.getById(
      req as unknown as GetByIdArgs[0],
      res as unknown as GetByIdArgs[1],
      next as unknown as GetByIdArgs[2],
    );

    const err = next.mock.calls[0][0] as AppError;
    expect(err.status).toBe(404);
    expect(err.message).toBe('event not found');
  });

  it('search returns paginated response', async () => {
    const req = { query: { term: 'rock', page: '1', limit: '10' } };
    const res = createRes();
    const next = vi.fn();

    mocks.eventService.search.mockResolvedValue([[{ id: 1 }], 1]);

    await eventController.search(
      req as unknown as SearchArgs[0],
      res as unknown as SearchArgs[1],
      next as unknown as SearchArgs[2],
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1 }], totalCount: 1 });
  });
});

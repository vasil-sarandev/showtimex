import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/middlewares/error.middleware';
import { performerConroller } from '@/components/performer/performer.controller';

type CreateArgs = Parameters<typeof performerConroller.create>;
type GetByIdArgs = Parameters<typeof performerConroller.getById>;
type SearchArgs = Parameters<typeof performerConroller.search>;

const mocks = vi.hoisted(() => ({
  performerService: {
    create: vi.fn(),
    findOne: vi.fn(),
    search: vi.fn(),
  },
}));

vi.mock('@/components/performer/performer.service', () => ({
  performerService: mocks.performerService,
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

describe('PerformerController', () => {
  beforeEach(() => {
    mocks.performerService.create.mockReset();
    mocks.performerService.findOne.mockReset();
    mocks.performerService.search.mockReset();
  });

  it('creates performer', async () => {
    const req = {
      body: {
        name: 'New Artist',
        social_url: 'https://instagram.com/newartist',
        label: 'Independent',
      },
    };
    const res = createRes();
    const next = vi.fn();

    mocks.performerService.create.mockResolvedValue({ id: 1, ...req.body });

    await performerConroller.create(
      req as unknown as CreateArgs[0],
      res as unknown as CreateArgs[1],
      next as unknown as CreateArgs[2],
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('returns not found error in getById', async () => {
    const req = { params: { id: '99' } };
    const res = createRes();
    const next = vi.fn();

    mocks.performerService.findOne.mockResolvedValue(null);

    await performerConroller.getById(
      req as unknown as GetByIdArgs[0],
      res as unknown as GetByIdArgs[1],
      next as unknown as GetByIdArgs[2],
    );

    const err = next.mock.calls[0][0] as AppError;
    expect(err.status).toBe(404);
    expect(err.message).toBe('performer not found');
  });

  it('search returns paginated payload', async () => {
    const req = { query: { name: 'artist' } };
    const res = createRes();
    const next = vi.fn();

    mocks.performerService.search.mockResolvedValue([[{ id: 1 }], 1]);

    await performerConroller.search(
      req as unknown as SearchArgs[0],
      res as unknown as SearchArgs[1],
      next as unknown as SearchArgs[2],
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ id: 1 }], totalCount: 1 });
  });
});

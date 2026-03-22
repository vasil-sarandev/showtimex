import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/middlewares/error.middleware';
import { ticketController } from '@/components/ticket/ticket.controller';

type CreateBatchArgs = Parameters<typeof ticketController.createBatch>;
type GetByIdArgs = Parameters<typeof ticketController.getById>;
type SearchArgs = Parameters<typeof ticketController.search>;

const mocks = vi.hoisted(() => ({
  ticketService: {
    createBatchTransaction: vi.fn(),
    findOne: vi.fn(),
    search: vi.fn(),
  },
}));

vi.mock('@/components/ticket/ticket.service', () => ({
  ticketService: mocks.ticketService,
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

describe('TicketController', () => {
  beforeEach(() => {
    mocks.ticketService.createBatchTransaction.mockReset();
    mocks.ticketService.findOne.mockReset();
    mocks.ticketService.search.mockReset();
  });

  it('createBatch returns 201', async () => {
    const req = {
      body: {
        eventId: 3,
        price: 25,
        type: 'VIP',
        section: 'A',
        count: 2,
      },
    };
    const res = createRes();
    const next = vi.fn();

    mocks.ticketService.createBatchTransaction.mockResolvedValue([{ id: 1 }]);

    await ticketController.createBatch(
      req as unknown as CreateBatchArgs[0],
      res as unknown as CreateBatchArgs[1],
      next as unknown as CreateBatchArgs[2],
    );

    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('getById forwards 404', async () => {
    const req = { params: { id: '404' } };
    const res = createRes();
    const next = vi.fn();

    mocks.ticketService.findOne.mockResolvedValue(null);

    await ticketController.getById(
      req as unknown as GetByIdArgs[0],
      res as unknown as GetByIdArgs[1],
      next as unknown as GetByIdArgs[2],
    );

    const err = next.mock.calls[0][0] as AppError;
    expect(err.status).toBe(404);
    expect(err.message).toBe('ticket not found');
  });

  it('search returns paginated payload', async () => {
    const req = { query: { eventId: '3' } };
    const res = createRes();
    const next = vi.fn();

    mocks.ticketService.search.mockResolvedValue([[{ id: 2 }], 1]);

    await ticketController.search(
      req as unknown as SearchArgs[0],
      res as unknown as SearchArgs[1],
      next as unknown as SearchArgs[2],
    );

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ data: [{ id: 2 }], totalCount: 1 });
  });
});

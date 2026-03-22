import { beforeEach, describe, expect, it, vi } from 'vitest';
import { TicketStatus } from '@/components/ticket/ticket.entity';

const mocks = vi.hoisted(() => {
  const qb = {
    where: vi.fn(),
    andWhere: vi.fn(),
    orderBy: vi.fn(),
    getOne: vi.fn(),
  };
  qb.where.mockReturnValue(qb);
  qb.andWhere.mockReturnValue(qb);
  qb.orderBy.mockReturnValue(qb);

  const txRepository = {
    createQueryBuilder: vi.fn(() => qb),
    create: vi.fn(),
    save: vi.fn(),
  };

  return {
    repository: {
      findOne: vi.fn(),
      find: vi.fn(),
      findAndCount: vi.fn(),
    },
    appDataSource: {
      transaction: vi.fn(),
    },
    extractSeatNumberFromTicket: vi.fn(),
    generateSeats: vi.fn(),
    txRepository,
    qb,
  };
});

vi.mock('@/components/ticket/ticket.repository', () => ({
  ticketRepository: mocks.repository,
}));

vi.mock('@/lib/typeorm/typeorm.index', () => ({
  AppDataSource: mocks.appDataSource,
}));

vi.mock('@/components/ticket/ticket.util', () => ({
  extractSeatNumberFromTicket: mocks.extractSeatNumberFromTicket,
  generateSeats: mocks.generateSeats,
}));

import { ticketService } from '@/components/ticket/ticket.service';

describe('TicketService', () => {
  beforeEach(() => {
    mocks.repository.findOne.mockReset();
    mocks.repository.find.mockReset();
    mocks.repository.findAndCount.mockReset();
    mocks.appDataSource.transaction.mockReset();
    mocks.extractSeatNumberFromTicket.mockReset();
    mocks.generateSeats.mockReset();
    mocks.txRepository.create.mockReset();
    mocks.txRepository.save.mockReset();
    mocks.txRepository.createQueryBuilder.mockClear();
    mocks.qb.where.mockClear();
    mocks.qb.andWhere.mockClear();
    mocks.qb.orderBy.mockClear();
    mocks.qb.getOne.mockReset();
  });

  it('creates ticket batch transaction', async () => {
    const manager = {
      getRepository: vi.fn(() => mocks.txRepository),
    };
    const savedTickets = [{ id: 1, seat: 'A1' }];

    mocks.appDataSource.transaction.mockImplementation(async callback => callback(manager));
    mocks.qb.getOne.mockResolvedValue({ seat: 'A10' });
    mocks.extractSeatNumberFromTicket.mockReturnValue(10);
    mocks.generateSeats.mockReturnValue(['A11', 'A12']);
    mocks.txRepository.create.mockReturnValue([{ seat: 'A11' }, { seat: 'A12' }]);
    mocks.txRepository.save.mockResolvedValue(savedTickets);

    const result = await ticketService.createBatchTransaction({
      eventId: 3,
      price: 20,
      type: 'VIP',
      section: 'A',
      count: 2,
    });

    expect(mocks.appDataSource.transaction).toHaveBeenCalledTimes(1);
    expect(mocks.generateSeats).toHaveBeenCalledWith({ count: 2, section: 'A', startNumber: 11 });
    expect(mocks.txRepository.create).toHaveBeenCalledWith([
      { price: 20, type: 'VIP', seat: 'A11', status: TicketStatus.available, eventId: 3 },
      { price: 20, type: 'VIP', seat: 'A12', status: TicketStatus.available, eventId: 3 },
    ]);
    expect(result).toEqual(savedTickets);
  });

  it('delegates findOne', async () => {
    mocks.repository.findOne.mockResolvedValue({ id: 7 });

    const result = await ticketService.findOne({ where: { id: 7 } });

    expect(mocks.repository.findOne).toHaveBeenCalledWith({ where: { id: 7 } });
    expect(result).toEqual({ id: 7 });
  });

  it('searches with required eventId and optional status', async () => {
    mocks.repository.findAndCount.mockResolvedValue([[], 0]);

    await ticketService.search({
      eventId: '3',
      status: TicketStatus.available,
      page: '2',
      limit: '10',
    });

    expect(mocks.repository.findAndCount).toHaveBeenCalledWith({
      where: { eventId: 3, status: TicketStatus.available },
      skip: 10,
      take: 10,
    });
  });
});

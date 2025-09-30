import { FindOneOptions, FindOptionsWhere, Repository } from 'typeorm';
import { Ticket, TicketStatus } from './ticket.entity';
import { ticketRepository } from './ticket.repository';
import { CreateTicketBatchDTO } from './ticket.dto';
import { extractSeatNumberFromTicket, generateSeats } from './ticket.util';
import { TicketSearchParams } from './ticket.controller';
import { appDataSource } from '@/lib/typeorm/typeorm.index';
import { computePaginationParams } from '@/lib/shared';
import { validateOrReject } from 'class-validator';

class TicketService {
  private repository: Repository<Ticket>;
  constructor() {
    this.repository = ticketRepository;
  }

  findOne = async (options: FindOneOptions<Ticket>) => {
    return this.repository.findOne(options);
  };

  createBatchTransaction = async ({
    eventId,
    price,
    type,
    section,
    count,
  }: CreateTicketBatchDTO) => {
    return appDataSource.transaction(async manager => {
      const transactionRepository = manager.getRepository(Ticket);
      const lastTicketInSection = await transactionRepository
        .createQueryBuilder('ticket')
        .where('ticket.eventId = :eventId', { eventId })
        .andWhere('ticket.seat LIKE :section', { section: `${section}%` })
        .orderBy("CAST(SUBSTRING(ticket.seat, '\\d+$') AS INT)", 'DESC')
        .getOne();
      const lastSeatNumber = extractSeatNumberFromTicket(lastTicketInSection);
      const seats = generateSeats({ count, section, startNumber: lastSeatNumber + 1 });
      const tickets = transactionRepository.create(
        seats.map(seat => ({
          price,
          type,
          seat,
          status: TicketStatus.available,
          eventId,
        })),
      );
      await validateOrReject(tickets);
      return transactionRepository.save(tickets);
    });
  };

  search = async ({ eventId, status, ...rest }: TicketSearchParams) => {
    const { skip, take } = computePaginationParams({ ...rest });

    const where: FindOptionsWhere<Ticket> = { eventId: parseInt(eventId, 10) };
    if (status) where.status = status;

    return this.repository.findAndCount({
      where,
      skip,
      take,
    });
  };
}

export const ticketService = new TicketService();

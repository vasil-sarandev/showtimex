import { Ticket } from './ticket.entity';
import { AppDataSource } from '@/lib/typeorm/typeorm.index';

export const ticketRepository = AppDataSource.getRepository(Ticket);

import { Ticket } from './ticket.entity';
import { appDataSource } from '@/lib/typeorm/typeorm.index';

export const ticketRepository = appDataSource.getRepository(Ticket);

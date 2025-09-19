import { Ticket } from './ticket.entity';
import { appDataSource } from '@/lib/services/typeorm';

export const ticketRepository = appDataSource.getRepository(Ticket);

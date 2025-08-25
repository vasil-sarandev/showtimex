import { Ticket } from './entity';
import { appDataSource } from '@/lib/typeorm';

export const ticketRepository = appDataSource.getRepository(Ticket);

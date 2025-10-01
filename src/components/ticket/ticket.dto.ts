import { Ticket } from './ticket.entity';

export interface CreateTicketBatchDTO {
  eventId: number;
  price: number;
  count: number;
  section: string;
  type?: string;
}

// default dto - no relations
export type TicketResponseDTO = Omit<Ticket, 'event' | 'user' | 'payment'>;

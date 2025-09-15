import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Event } from '../event/entity';
import { User } from '../user/entity';

const TICKET_PRICE_PRECISION = 10;
const TICKET_PRICE_SCALE = 2;

export enum TicketStatus {
  available = 'AVAILABLE',
  // "RESERVED" is the status used to lock the ticket during payment session so no double booking occurrs.
  reserved = 'RESERVED',
  purchased = 'PURCHASED',
}

@Entity()
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'numeric', precision: TICKET_PRICE_PRECISION, scale: TICKET_PRICE_SCALE })
  price: number;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.available })
  status: TicketStatus;

  @ManyToOne(() => Event, event => event.tickets)
  event: Event;

  @ManyToOne(() => User, user => user.tickets, { nullable: true })
  user: User;
}

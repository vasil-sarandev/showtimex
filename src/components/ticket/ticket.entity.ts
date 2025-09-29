import {
  Check,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Length } from 'class-validator';
import { Event } from '../event/event.entity';
import { User } from '../user/user.entity';
import { Payment } from '../payment/payment.entity';

const TICKET_PRICE_PRECISION = 10;
const TICKET_PRICE_SCALE = 2;
const TYPE_MIN_LEN = 2;
const TYPE_MAX_LEN = 20;
const SEAT_MIN_LEN = 1;
const SEAT_MAX_LEN = 10;

export enum TicketStatus {
  available = 'AVAILABLE',
  // "RESERVED" is the status used to lock the ticket during payment session so no double booking occurrs.
  reserved = 'RESERVED',
  purchased = 'PURCHASED',
}

@Entity()
@Check(`char_length("type") >= ${TYPE_MIN_LEN} AND char_length("type") <= ${TYPE_MAX_LEN}`)
@Check(`char_length("seat") >= ${SEAT_MIN_LEN} AND char_length("type") <= ${SEAT_MAX_LEN}`)
export class Ticket {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'numeric', precision: TICKET_PRICE_PRECISION, scale: TICKET_PRICE_SCALE })
  price: number;

  @Column({ type: 'enum', enum: TicketStatus, default: TicketStatus.available })
  status: TicketStatus;

  @Column({ type: 'varchar', default: 'Regular', nullable: true })
  @Length(TYPE_MIN_LEN, TYPE_MAX_LEN)
  type: string;

  @Column({ type: 'varchar', unique: true })
  @Length(SEAT_MIN_LEN, SEAT_MAX_LEN)
  seat: string;

  // Event - ManyToOne
  @ManyToOne(() => Event, event => event.tickets)
  @JoinColumn({ name: 'eventId' })
  event: Event;

  @Column({ type: 'int' })
  eventId: string; // expose FK
  // ---

  // User - ManyToOne
  @ManyToOne(() => User, user => user.tickets, { nullable: true })
  user: User;

  @Column({ type: 'int' })
  userId: number; //expose FK
  // ---

  @OneToOne(() => Payment, payment => payment.ticket)
  payment: Payment;
}

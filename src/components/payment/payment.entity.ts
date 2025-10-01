import {
  Entity,
  PrimaryGeneratedColumn,
  OneToOne,
  ManyToOne,
  Column,
  JoinColumn,
  Relation,
} from 'typeorm';
import { Ticket } from '../ticket/ticket.entity';
import { User } from '../user/user.entity';

export enum PaymentStatus {
  pending = 'PENDING',
  successful = 'SUCCESSFUL',
  failed = 'FAILED',
}

@Entity()
export class Payment {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'enum', enum: PaymentStatus, default: PaymentStatus.pending })
  status: PaymentStatus;

  @Column({ type: 'varchar', nullable: true })
  stripe_payment_id: string;

  // Ticket - OneToOne
  @OneToOne(() => Ticket, ticket => ticket.payment)
  @JoinColumn({ name: 'ticketId' })
  ticket: Relation<Ticket>;

  @Column({ type: 'int' })
  ticketId: number; // expose FK
  // ---

  // User - ManyToOne
  @ManyToOne(() => User, user => user.payments)
  user: Relation<User>;

  @Column({ type: 'int' })
  userId: number;
  // ---
}

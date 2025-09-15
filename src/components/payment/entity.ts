import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, Column } from 'typeorm';
import { Ticket } from '../ticket/entity';
import { User } from '../user/entity';

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

  @Column({ type: 'int', nullable: true })
  stripe_payment_id: number;

  @OneToOne(() => Ticket, ticket => ticket)
  ticket: Ticket;

  @ManyToOne(() => User, user => user.payments)
  user: User;
}

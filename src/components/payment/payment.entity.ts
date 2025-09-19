import { Entity, PrimaryGeneratedColumn, OneToOne, ManyToOne, Column, JoinColumn } from 'typeorm';
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

  @OneToOne(() => Ticket, ticket => ticket.payment)
  @JoinColumn()
  ticket: Ticket;

  @ManyToOne(() => User, user => user.payments)
  user: User;
}

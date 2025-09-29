import { IsEmail, IsPhoneNumber } from 'class-validator';
import { Check, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ticket } from '../ticket/ticket.entity';
import { Payment } from '../payment/payment.entity';

@Entity()
@Check(`"email" ~ '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$'`)
@Check(`"phone_number" ~ '^\\+[1-9][0-9]{7,14}$'`)
export class User {
  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ type: 'varchar' })
  first_name: string;

  @Column({ type: 'varchar' })
  last_name: string;

  @Column({ type: 'varchar', unique: true })
  @IsEmail()
  email: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  @IsPhoneNumber()
  phone_number: string | null;

  // Ticket - OneToMany
  @OneToMany(() => Ticket, ticket => ticket.user)
  tickets: Ticket[];
  // ---

  // Payment - OneToMany
  @OneToMany(() => Payment, payment => payment.user)
  payments: Payment[];
  // ---
}

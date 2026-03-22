import { User } from './user.entity';
import { EventResponseDTO } from '../event/event.dto';
import { TicketResponseDTO } from '../ticket/ticket.dto';
import { Payment } from '../payment/payment.entity';

export interface CreateUserDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string | undefined;
}

// default dto - no relations
export type UserResponseDTO = Omit<User, 'tickets' | 'payments'>;

type UserTicketPaymentResponseDTO = Pick<Payment, 'id' | 'status' | 'stripe_payment_id'>;

export interface UserTicketResponseDTO extends TicketResponseDTO {
  event: EventResponseDTO;
  payment: UserTicketPaymentResponseDTO | null;
}

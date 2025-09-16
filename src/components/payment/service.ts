import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Ticket, TicketStatus } from '../ticket/entity';
import { Payment } from './entity';
import { paymentRepository } from './repository';
import { AppError } from '@/middlewares/error';
import { appStripeInstance } from '@/lib/stripe';
import { appDataSource } from '@/lib/typeorm';

class PaymentService {
  repository: Repository<Payment>;
  constructor(injectedRepository?: Repository<Payment>) {
    this.repository = injectedRepository ?? paymentRepository;
  }

  initiatePaymentTransaction = async ({
    userId,
    ticketId,
  }: {
    userId: number;
    ticketId: number;
  }): Promise<Stripe.PaymentIntent> => {
    // flow for the transaction:
    // 1. find the ticket, set its status to RESERVED
    // 2. create a payment in the table (with status PENDING)
    // 3. create a stripe payment intent which contains the ticket and payment ids in metadata
    // 4. return the payment intent to the client
    return appDataSource.transaction(async manager => {
      const ticket = await manager.findOneByOrFail(Ticket, { id: ticketId });
      if (ticket.status !== TicketStatus.available) {
        throw new AppError(400, 'Ticket not available');
      }
      ticket.status = TicketStatus.reserved;
      await manager.save(ticket);

      const payment = manager.create(Payment, { ticket, user: { id: userId } });
      await manager.save(payment);

      const paymentIntent = await appStripeInstance.paymentIntents.create({
        amount: Math.round(ticket.price * 100),
        currency: 'usd',
        metadata: { paymentId: payment.id, ticketId: ticket.id },
        automatic_payment_methods: { enabled: true }, // allows card, wallet, etc.
      });
      return paymentIntent;
    });
  };
}

export const paymentService = new PaymentService();

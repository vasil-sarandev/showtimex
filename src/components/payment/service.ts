import { Repository } from 'typeorm';
import Stripe from 'stripe';
import { Ticket, TicketStatus } from '../ticket/entity';
import { Payment, PaymentStatus } from './entity';
import { paymentRepository } from './repository';
import { AppError } from '@/middlewares/error';
import { appStripeInstance, IStripeTicketPaymentIntentMetadata } from '@/lib/stripe';
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

      const metadata: IStripeTicketPaymentIntentMetadata = {
        paymentId: payment.id.toString(),
        ticketId: ticket.id.toString(),
      };
      const paymentIntent = await appStripeInstance.paymentIntents.create({
        amount: Math.round(ticket.price * 100),
        currency: 'usd',
        metadata,
        automatic_payment_methods: { enabled: true }, // allows card, wallet, etc.
      });
      return paymentIntent;
    });
  };

  handlePaymentSuccessTransaction = async ({
    event,
  }: {
    event: Stripe.PaymentIntentSucceededEvent;
  }) => {
    // flow for the transaction:
    // 1. find the ticket, set its status to PURCHASED
    // 2. find the payment, set its status to SUCCESSFUL
    const { ticketId, paymentId } = event.data.object.metadata;
    return appDataSource.transaction(async manager => {
      const ticket = await manager.findOneByOrFail(Ticket, { id: parseInt(ticketId) });
      ticket.status = TicketStatus.purchased;
      await manager.save(ticket);

      const payment = await manager.findOneByOrFail(Payment, { id: parseInt(paymentId) });
      payment.status = PaymentStatus.successful;
      await manager.save(payment);
    });
  };
  handlePaymentFailedTransaction = async ({
    event,
  }: {
    event: Stripe.PaymentIntentPaymentFailedEvent | Stripe.PaymentIntentCanceledEvent;
  }) => {
    // flow for the transaction:
    // 1. find the ticket, set its status to AVAILABLE
    // 2. find the payment, set its status to FAILED
    const { ticketId, paymentId } = event.data.object.metadata;
    return appDataSource.transaction(async manager => {
      const ticket = await manager.findOneByOrFail(Ticket, { id: parseInt(ticketId) });
      ticket.status = TicketStatus.available;
      await manager.save(ticket);

      const payment = await manager.findOneByOrFail(Payment, { id: parseInt(paymentId) });
      payment.status = PaymentStatus.failed;
      await manager.save(payment);
    });
  };
}

export const paymentService = new PaymentService();

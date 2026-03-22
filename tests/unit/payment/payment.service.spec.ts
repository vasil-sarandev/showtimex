import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PaymentStatus } from '@/components/payment/payment.entity';
import { TicketStatus } from '@/components/ticket/ticket.entity';

const mocks = vi.hoisted(() => ({
  appDataSource: {
    getRepository: vi.fn(),
    transaction: vi.fn(),
  },
  stripeService: {
    createPaymentIntent: vi.fn(),
  },
}));

vi.mock('@/lib/typeorm/typeorm.index', () => ({
  AppDataSource: mocks.appDataSource,
}));

vi.mock('@/lib/stripe/stripe.index', () => ({
  stripeService: mocks.stripeService,
}));

import { paymentService } from '@/components/payment/payment.service';

describe('PaymentService', () => {
  beforeEach(() => {
    mocks.appDataSource.transaction.mockReset();
    mocks.stripeService.createPaymentIntent.mockReset();
  });

  it('initiates payment transaction', async () => {
    const ticket = { id: 5, status: TicketStatus.available, price: 22 };
    const payment = { id: 9, userId: 4 };
    const manager = {
      findOneByOrFail: vi.fn().mockResolvedValue(ticket),
      save: vi.fn().mockResolvedValue(undefined),
      create: vi.fn().mockReturnValue(payment),
    };
    const intent = { id: 'pi_123' };

    mocks.appDataSource.transaction.mockImplementation(async callback => callback(manager));
    mocks.stripeService.createPaymentIntent.mockResolvedValue(intent);

    const result = await paymentService.initiatePaymentTransaction({ userId: 4, ticketId: 5 });

    expect(ticket.status).toBe(TicketStatus.reserved);
    expect(mocks.stripeService.createPaymentIntent).toHaveBeenCalledWith({
      price: 22,
      metadata: { paymentId: '9', ticketId: '5' },
    });
    expect(result).toEqual(intent);
  });

  it('handles successful payment transaction', async () => {
    const payment = { id: 9, userId: 4, status: PaymentStatus.pending };
    const ticket = { id: 5, status: TicketStatus.reserved, userId: null };
    const manager = {
      findOneByOrFail: vi.fn().mockResolvedValueOnce(payment).mockResolvedValueOnce(ticket),
      save: vi.fn().mockResolvedValue(undefined),
    };

    mocks.appDataSource.transaction.mockImplementation(async callback => callback(manager));

    await paymentService.handlePaymentSuccessTransaction({
      event: { data: { object: { metadata: { paymentId: '9', ticketId: '5' } } } } as never,
    });

    expect(payment.status).toBe(PaymentStatus.successful);
    expect(ticket.status).toBe(TicketStatus.purchased);
    expect(ticket.userId).toBe(4);
  });

  it('handles failed payment transaction', async () => {
    const ticket = { id: 5, status: TicketStatus.reserved };
    const payment = { id: 9, status: PaymentStatus.pending };
    const manager = {
      findOneByOrFail: vi.fn().mockResolvedValueOnce(ticket).mockResolvedValueOnce(payment),
      save: vi.fn().mockResolvedValue(undefined),
    };

    mocks.appDataSource.transaction.mockImplementation(async callback => callback(manager));

    await paymentService.handlePaymentFailedTransaction({
      event: { data: { object: { metadata: { paymentId: '9', ticketId: '5' } } } } as never,
    });

    expect(ticket.status).toBe(TicketStatus.available);
    expect(payment.status).toBe(PaymentStatus.failed);
  });
});

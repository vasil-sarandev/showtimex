import { beforeEach, describe, expect, it, vi } from 'vitest';
import { AppError } from '@/middlewares/error.middleware';
import { paymentController } from '@/components/payment/payment.controller';

type InitiateArgs = Parameters<typeof paymentController.initiatePayment>;
type WebhookArgs = Parameters<typeof paymentController.stripeWebhookHandler>;

const mocks = vi.hoisted(() => ({
  paymentService: {
    initiatePaymentTransaction: vi.fn(),
    handlePaymentSuccessTransaction: vi.fn(),
    handlePaymentFailedTransaction: vi.fn(),
  },
  stripe: {
    verifyWebhookSignature: vi.fn(),
    success: 'payment_intent.succeeded',
    failed: 'payment_intent.payment_failed',
    canceled: 'payment_intent.canceled',
    sigHeader: 'stripe-signature',
  },
  config: {
    APP_STRIPE_PAYMENTS_WEBHOOK_SECRET_KEY: 'whsec_test',
  },
}));

vi.mock('@/components/payment/payment.service', () => ({
  paymentService: mocks.paymentService,
}));

vi.mock('@/lib/stripe/stripe.index', () => ({
  stripeService: { verifyWebhookSignature: mocks.stripe.verifyWebhookSignature },
  STRIPE_EVENT_PAYMENT_SUCCEEDED: mocks.stripe.success,
  STRIPE_EVENT_PAYMENT_FAILED: mocks.stripe.failed,
  STRIPE_EVENT_PAYMENT_CANCELED: mocks.stripe.canceled,
  STRIPE_SIGNATURE_HEADER: mocks.stripe.sigHeader,
}));

vi.mock('@/config', () => mocks.config);

const createRes = () => {
  const res = {
    status: vi.fn(),
    json: vi.fn(),
    send: vi.fn(),
  };
  res.status.mockReturnValue(res);
  res.json.mockReturnValue(res);
  res.send.mockReturnValue(res);
  return res;
};

describe('PaymentController', () => {
  beforeEach(() => {
    mocks.paymentService.initiatePaymentTransaction.mockReset();
    mocks.paymentService.handlePaymentSuccessTransaction.mockReset();
    mocks.paymentService.handlePaymentFailedTransaction.mockReset();
    mocks.stripe.verifyWebhookSignature.mockReset();
  });

  it('initiatePayment returns 201', async () => {
    const req = { user: { sub: '3' }, body: { ticketId: 9 } };
    const res = createRes();
    const next = vi.fn();

    mocks.paymentService.initiatePaymentTransaction.mockResolvedValue({ id: 'pi_test' });

    await paymentController.initiatePayment(
      req as unknown as InitiateArgs[0],
      res as unknown as InitiateArgs[1],
      next as unknown as InitiateArgs[2],
    );

    expect(mocks.paymentService.initiatePaymentTransaction).toHaveBeenCalledWith({
      userId: 3,
      ticketId: 9,
    });
    expect(res.status).toHaveBeenCalledWith(201);
  });

  it('stripeWebhookHandler handles success events', async () => {
    const req = { headers: { 'stripe-signature': 'sig' }, body: Buffer.from('{}') };
    const res = createRes();
    const next = vi.fn();
    const event = { type: 'payment_intent.succeeded' };

    mocks.stripe.verifyWebhookSignature.mockReturnValue(event);

    await paymentController.stripeWebhookHandler(
      req as unknown as WebhookArgs[0],
      res as unknown as WebhookArgs[1],
      next as unknown as WebhookArgs[2],
    );

    expect(mocks.paymentService.handlePaymentSuccessTransaction).toHaveBeenCalledWith({ event });
    expect(res.status).toHaveBeenCalledWith(200);
  });

  it('stripeWebhookHandler rejects unsupported events', async () => {
    const req = { headers: { 'stripe-signature': 'sig' }, body: Buffer.from('{}') };
    const res = createRes();
    const next = vi.fn();

    mocks.stripe.verifyWebhookSignature.mockReturnValue({ type: 'unknown' });

    await paymentController.stripeWebhookHandler(
      req as unknown as WebhookArgs[0],
      res as unknown as WebhookArgs[1],
      next as unknown as WebhookArgs[2],
    );

    const err = next.mock.calls[0][0] as AppError;
    expect(err.status).toBe(400);
    expect(err.message).toBe('bad stripe request');
  });
});

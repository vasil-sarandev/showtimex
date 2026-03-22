import express from 'express';
import request from 'supertest';
import type { NextFunction, Request, Response } from 'express';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({
  authMiddleware: vi.fn((req, _res, next) => next()),
  raw: vi.fn(() => (req: Request, _res: Response, next: NextFunction) => next()),
  initiatePayment: vi.fn((_req, res) => res.status(201).json({ id: 'pi_1' })),
  stripeWebhookHandler: vi.fn((_req, res) => res.status(200).send()),
}));

vi.mock('@/middlewares/auth.middleware', () => ({ authMiddleware: mocks.authMiddleware }));
vi.mock('body-parser', () => ({ default: { raw: mocks.raw } }));
vi.mock('@/components/payment/payment.controller', () => ({
  paymentController: {
    initiatePayment: mocks.initiatePayment,
    stripeWebhookHandler: mocks.stripeWebhookHandler,
  },
}));

import { paymentRouter } from '@/components/payment/payment.router';

describe('paymentRouter', () => {
  beforeEach(() => {
    mocks.initiatePayment.mockClear();
    mocks.stripeWebhookHandler.mockClear();
  });

  it('routes POST /initiate', async () => {
    const app = express();
    app.use('/payment', paymentRouter);

    const response = await request(app).post('/payment/initiate').send({});

    expect(response.status).toBe(201);
    expect(mocks.initiatePayment).toHaveBeenCalledTimes(1);
  });

  it('routes POST /stripe-webhook', async () => {
    const app = express();
    app.use('/payment', paymentRouter);

    const response = await request(app)
      .post('/payment/stripe-webhook')
      .set('Content-Type', 'application/json')
      .send('{}');

    expect(response.status).toBe(200);
    expect(mocks.stripeWebhookHandler).toHaveBeenCalledTimes(1);
  });
});

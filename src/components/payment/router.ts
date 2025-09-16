import { Router } from 'express';
import bodyParser from 'body-parser';
import { paymentController } from './controller';
import { authMiddleware } from '@/middlewares/auth';

export const paymentRouter = Router();

paymentRouter.use(authMiddleware);

paymentRouter.post('/initiate', paymentController.initiatePayment);
paymentRouter.post(
  '/stripe-webhook',
  // parse raw body so webhook signature can be verified.
  bodyParser.raw({ type: 'application/json' }),
  paymentController.stripeWebhookHandler,
);

import { NextFunction, Request, Response } from 'express';
import { paymentService } from './service';
import { appStripeInstance } from '@/lib/stripe';
import { APP_STRIPE_PAYMENTS_WEBHOOK_SECRET_KEY } from '@/config';
import { AppError } from '@/middlewares/error';

const STRIPE_SIGNATURE_HEADER = 'stripe-signature';
const STRIPE_EVENT_PAYMENT_SUCCEEDED = 'payment_intent.succeeded';
const STRIPE_EVENT_PAYMENT_CANCELED = 'payment_intent.canceled';
const STRIPE_EVENT_PAYMENT_FAILED = 'payment_intent.payment_failed';

class PaymentController {
  initiatePayment = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = parseInt(req.user!.sub as string);
      const intent = await paymentService.initiatePaymentTransaction({
        userId,
        ticketId: req.body.ticketId,
      });
      res.status(200).json(intent);
    } catch (err) {
      next(err);
    }
  };
  stripeWebhookHandler = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sig = req.headers[STRIPE_SIGNATURE_HEADER] as string;
      const event = appStripeInstance.webhooks.constructEvent(
        req.body,
        sig,
        APP_STRIPE_PAYMENTS_WEBHOOK_SECRET_KEY,
      );
      if (event.type === STRIPE_EVENT_PAYMENT_SUCCEEDED) {
        await paymentService.handlePaymentSuccessTransaction({
          event,
        });
        return res.status(200).send();
      } else if (
        event.type === STRIPE_EVENT_PAYMENT_FAILED ||
        event.type === STRIPE_EVENT_PAYMENT_CANCELED
      ) {
        await paymentService.handlePaymentFailedTransaction({ event });
        return res.status(200).send();
      }
      throw new AppError(400, 'bad stripe request');
    } catch (err) {
      next(err);
    }
  };
}

export const paymentController = new PaymentController();

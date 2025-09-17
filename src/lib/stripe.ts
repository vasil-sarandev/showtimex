import Stripe from 'stripe';
import { APP_STRIPE_API_KEY } from '@/config';

export type IPaymentIntentMetadata<T> = T & {
  [key: string]: string;
};

export const STRIPE_SIGNATURE_HEADER = 'stripe-signature';
export const STRIPE_EVENT_PAYMENT_SUCCEEDED = 'payment_intent.succeeded';
export const STRIPE_EVENT_PAYMENT_CANCELED = 'payment_intent.canceled';
export const STRIPE_EVENT_PAYMENT_FAILED = 'payment_intent.payment_failed';

class StripeService {
  private stripeInstance: Stripe;
  constructor() {
    this.stripeInstance = new Stripe(APP_STRIPE_API_KEY);
  }

  verifyWebhookSignature = ({
    signature,
    body,
    webhookSecret,
  }: {
    signature: string;
    body: Buffer;
    webhookSecret: string;
  }) => {
    return this.stripeInstance.webhooks.constructEvent(body, signature, webhookSecret);
  };

  createPaymentIntent = async ({
    price,
    metadata,
    automaticPaymentsMethodEnabled = true,
    currency = 'usd',
  }: {
    price: number;
    metadata: IPaymentIntentMetadata<object>;
    automaticPaymentsMethodEnabled?: boolean;
    currency?: string;
  }) => {
    return this.stripeInstance.paymentIntents.create({
      amount: Math.round(price * 100),
      currency,
      metadata,
      automatic_payment_methods: { enabled: automaticPaymentsMethodEnabled },
    });
  };
}

export const stripeService = new StripeService();

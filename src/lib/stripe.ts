import Stripe from 'stripe';
import { APP_STRIPE_API_KEY } from '@/config';

export type IPaymentIntentMetadata<T> = T & {
  [key: string]: string;
};

class StripeService {
  private stripeInstance: Stripe;
  constructor() {
    this.stripeInstance = new Stripe(APP_STRIPE_API_KEY);
  }

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

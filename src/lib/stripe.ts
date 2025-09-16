import Stripe from 'stripe';
import { APP_STRIPE_API_KEY } from '@/config';

export interface IStripeTicketPaymentIntentMetadata {
  paymentId: string;
  ticketId: string;
  [key: string]: string; // unassignable to Stripe.PaymentIntent.Metadata without this.
}

export const appStripeInstance = new Stripe(APP_STRIPE_API_KEY);

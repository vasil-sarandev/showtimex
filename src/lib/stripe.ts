import Stripe from 'stripe';
import { APP_STRIPE_API_KEY } from '@/config';

export const appStripeInstance = new Stripe(APP_STRIPE_API_KEY);

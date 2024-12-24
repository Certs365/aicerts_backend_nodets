import Stripe from 'stripe';

const secretKey = process.env.STRIPE_TEST_KEY;

export const stripe = new Stripe(secretKey as string);

export type CheckoutSession = Stripe.Checkout.Session;
export type CheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams;
export type LineItem = Stripe.Checkout.SessionCreateParams.LineItem;

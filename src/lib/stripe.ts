import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || /your-|placeholder|sk_test_xxx/i.test(key)) return null;
  return new Stripe(key);
}

export function isStripeConfigured(): boolean {
  return (
    !!getStripe() &&
    !!process.env.STRIPE_PRICE_STARTER &&
    !/your-|placeholder/i.test(process.env.STRIPE_PRICE_STARTER)
  );
}

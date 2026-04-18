import Stripe from 'stripe'

let _stripe: Stripe | null = null

export function getStripe(): Stripe {
  if (!_stripe) {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) throw new Error('STRIPE_SECRET_KEY is not set')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _stripe = new (Stripe as any)(key, { apiVersion: '2026-03-25.dahlia' }) as Stripe
  }
  return _stripe
}

export const PRICE_MONTHLY = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!
export const PRICE_ANNUAL = process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL!

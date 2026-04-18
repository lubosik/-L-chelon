import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { priceId } = await req.json()
    if (!priceId) {
      return NextResponse.json({ error: 'Missing priceId' }, { status: 400 })
    }

    const origin = req.headers.get('origin') || 'https://lechelon.com'

    const session = await getStripe().checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${origin}/intelligence?subscribed=1`,
      cancel_url: `${origin}/subscribe?cancelled=1`,
      allow_promotion_codes: true,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('Checkout error:', err)
    return NextResponse.json({ error: 'Failed to create checkout' }, { status: 500 })
  }
}

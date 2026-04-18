import { NextRequest, NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { headers } from 'next/headers'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const headersList = await headers()
  const sig = headersList.get('stripe-signature')

  if (!sig) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 })
  }

  try {
    const event = getStripe().webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    )

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        // Update user metadata in Clerk after successful payment
        // session.customer_email, session.subscription
        console.log('Checkout completed:', session.id)
        break
      }
      case 'customer.subscription.deleted': {
        const subscription = event.data.object
        // Revoke premium access in Clerk
        console.log('Subscription cancelled:', subscription.id)
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Webhook error:', err)
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 })
  }
}

// Strapi lifecycle webhook — fires when a new issue is published
export async function PUT(req: NextRequest) {
  try {
    const payload = await req.json()
    if (payload?.model !== 'issue') {
      return NextResponse.json({ skipped: true })
    }
    // TODO: Trigger newsletter send via Resend
    console.log('New issue published:', payload?.entry?.id)
    return NextResponse.json({ triggered: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}

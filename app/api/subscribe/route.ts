import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(() => ({}))
  const { email, source } = body

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500 })
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.contacts.create({
    email: email.toLowerCase().trim(),
    audienceId,
    unsubscribed: false,
  })

  if (error) {
    // Duplicate contact is not a fatal error
    if ((error as { name?: string }).name !== 'validation_error') {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
    }
  }

  return NextResponse.json({ success: true, source: source || 'newsletter' })
}

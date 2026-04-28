import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

const ALLOWED_ORIGINS = [
  'https://rosenrelations.com',
  'https://www.rosenrelations.com',
  'http://localhost:3000',
]

function corsHeaders(origin: string | null) {
  const allowed = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  return {
    'Access-Control-Allow-Origin': allowed,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }
}

export async function OPTIONS(req: NextRequest) {
  const origin = req.headers.get('origin')
  return new NextResponse(null, { status: 204, headers: corsHeaders(origin) })
}

export async function POST(req: NextRequest) {
  const origin = req.headers.get('origin')
  const headers = corsHeaders(origin)

  const contentType = req.headers.get('content-type') || ''
  let email = ''
  let source = ''

  if (contentType.includes('application/json')) {
    const body = await req.json().catch(() => ({}))
    email = body.email || ''
    source = body.source || ''
  } else {
    const text = await req.text().catch(() => '')
    const params = new URLSearchParams(text)
    email = params.get('email') || ''
    source = params.get('source') || ''
  }

  if (!email || typeof email !== 'string' || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400, headers })
  }

  const apiKey = process.env.RESEND_API_KEY
  const audienceId = process.env.RESEND_AUDIENCE_ID
  if (!apiKey || !audienceId) {
    return NextResponse.json({ error: 'Not configured' }, { status: 500, headers })
  }

  const resend = new Resend(apiKey)
  const { error } = await resend.contacts.create({
    email: email.toLowerCase().trim(),
    audienceId,
    unsubscribed: false,
  })

  if (error) {
    if ((error as { name?: string }).name !== 'validation_error') {
      console.error('Resend error:', error)
      return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500, headers })
    }
  }

  return NextResponse.json({ success: true, source: source || 'rosen-relations' }, { headers })
}

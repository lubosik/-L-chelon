import { Resend } from 'resend'

export const AUDIENCE_ID = process.env.RESEND_AUDIENCE_ID || ''

function getResend(): Resend {
  const key = process.env.RESEND_API_KEY
  if (!key) throw new Error('RESEND_API_KEY is not set')
  return new Resend(key)
}

export async function addSubscriber(email: string) {
  return getResend().contacts.create({
    email,
    audienceId: AUDIENCE_ID,
    unsubscribed: false,
  })
}

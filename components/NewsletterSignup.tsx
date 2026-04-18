'use client'

import { useState } from 'react'

export default function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('loading')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'success' : 'error')
      if (res.ok) setEmail('')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ background: 'var(--cream)', border: '1px solid var(--light-border)', padding: 20, textAlign: 'center' }}>
      <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 18, color: '#111', letterSpacing: '0.08em', marginBottom: 10 }}>
        Join L&apos;Échelon
      </div>
      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#555', lineHeight: 1.6, marginBottom: 16 }}>
        Twice monthly. Five pillars. No noise.
      </p>
      {status === 'success' ? (
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#444', letterSpacing: '0.12em' }}>Thank you. You&apos;ll hear from us.</p>
      ) : (
        <form onSubmit={handleSubmit}>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address" required
            style={{ width: '100%', background: 'var(--white)', border: '1px solid var(--light-border)', color: '#333', padding: '9px 12px', fontSize: 12, fontFamily: 'Lato, sans-serif', marginBottom: 8, outline: 'none' }}
          />
          <button type="submit" disabled={status === 'loading'} className="btn-primary"
            style={{ width: '100%', opacity: status === 'loading' ? 0.7 : 1, fontSize: 10, padding: '11px 0' }}>
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
          {status === 'error' && (
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#777', marginTop: 6 }}>Something went wrong. Please try again.</p>
          )}
        </form>
      )}
    </div>
  )
}

'use client'

import { useState } from 'react'

export default function NewsletterCapture() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch { /* ignore */ }
    setStatus('done')
  }

  return (
    <section style={{ background: '#0A0A0A', padding: '80px 56px', textAlign: 'center' }}>
      <div style={{ maxWidth: 600, margin: '0 auto' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 11, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 20 }}>
          The Intelligence of Luxury
        </p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(36px, 4vw, 56px)', color: '#ffffff', letterSpacing: '0.04em', marginBottom: 8 }}>
          L&apos;Échelon
        </h2>
        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', lineHeight: 1.65, marginBottom: 36 }}>
          Twice monthly. Five pillars. No noise.
        </p>
        {status === 'done' ? (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(255,255,255,0.60)' }}>
            Thank you. You&apos;ll hear from us soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="nl-form">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email address"
              required
              style={{
                flex: 1, background: 'transparent', border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.25)',
                color: '#fff', fontFamily: 'Lato, sans-serif', fontSize: 12,
                padding: '12px 0', outline: 'none', borderRadius: 0,
              }}
              onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.70)' }}
              onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.25)' }}
            />
            <button
              type="submit"
              disabled={status === 'sending'}
              style={{
                background: '#fff', color: '#111', fontFamily: 'Lato, sans-serif', fontSize: 9,
                letterSpacing: '0.22em', textTransform: 'uppercase', padding: '12px 24px',
                border: 'none', borderRadius: 0, cursor: 'pointer', flexShrink: 0,
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8E5E0' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
            >
              {status === 'sending' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.20)', marginTop: 16 }}>
          No spam. Unsubscribe at any time.
        </p>
      </div>
      <style>{`
        @media (max-width: 768px) { .nl-form { flex-direction: column !important; } }
      `}</style>
    </section>
  )
}

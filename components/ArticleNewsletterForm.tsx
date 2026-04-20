'use client'

import { useState } from 'react'

export default function ArticleNewsletterForm({ variant }: { variant: 'sidebar' | 'mobile' }) {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    } catch { /* ignore */ }
    setStatus('done')
  }

  if (variant === 'sidebar') {
    return (
      <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid #E2DED8' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 18, color: '#111', marginBottom: 8 }}>
          Join L&apos;Échelon
        </p>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#888', lineHeight: 1.5, marginBottom: 16 }}>
          Twice monthly. Five pillars. No noise.
        </p>
        {status === 'done' ? (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: '#888' }}>
            Thank you. You&apos;ll hear from us soon.
          </p>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <input
              type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="Your email" required
              style={{ width: '100%', background: 'transparent', border: 'none', borderBottom: '1px solid #E2DED8', padding: '8px 0', fontSize: 14, color: '#333', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties}
              onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = '#111' }}
              onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = '#E2DED8' }}
            />
            <button
              type="submit" disabled={status === 'sending'}
              style={{ width: '100%', background: '#111', color: '#fff', border: 'none', borderRadius: 0, padding: 11, fontFamily: 'Lato, sans-serif', fontSize: 8.5, letterSpacing: '0.20em', textTransform: 'uppercase', marginTop: 8, cursor: 'pointer' }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#333' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#111' }}
            >
              {status === 'sending' ? '...' : 'Subscribe'}
            </button>
          </form>
        )}
      </div>
    )
  }

  // Mobile inline variant
  return (
    <div style={{ background: '#F8F7F5', padding: '40px 20px' }}>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 22, color: '#111', letterSpacing: '0.06em', textAlign: 'center', marginBottom: 8 }}>
        L&apos;Échelon
      </p>
      <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: '#888', lineHeight: 1.6, textAlign: 'center', marginBottom: 20 }}>
        Twice monthly. Five pillars. No noise.
      </p>
      {status === 'done' ? (
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 16, color: '#888', textAlign: 'center' }}>
          Thank you. You&apos;ll hear from us soon.
        </p>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address" required
            style={{ width: '100%', height: 52, background: '#fff', border: '1px solid #E2DED8', borderRadius: 0, padding: '0 16px', fontSize: 16, color: '#333', outline: 'none', boxSizing: 'border-box' } as React.CSSProperties}
            onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#111' }}
            onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#E2DED8' }}
          />
          <button
            type="submit" disabled={status === 'sending'}
            style={{ width: '100%', height: 52, background: '#111', color: '#fff', border: 'none', borderRadius: 0, fontFamily: 'Lato, sans-serif', fontSize: 8.5, letterSpacing: '0.20em', textTransform: 'uppercase', cursor: 'pointer' }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#333' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#111' }}
          >
            {status === 'sending' ? '...' : 'Subscribe free →'}
          </button>
        </form>
      )}
      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#bbb', textAlign: 'center', marginTop: 10 }}>
        No spam. Unsubscribe anytime.
      </p>
    </div>
  )
}

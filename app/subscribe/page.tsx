'use client'

import { useState } from 'react'

export default function SubscribePage() {
  const [loading, setLoading] = useState<string | null>(null)

  async function handleSubscribe(type: 'monthly' | 'annual') {
    setLoading(type)
    try {
      const priceId = type === 'monthly'
        ? process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY
        : process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_ANNUAL
      const res = await fetch('/api/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      })
      const { url } = await res.json()
      if (url) window.location.href = url
    } catch {
      setLoading(null)
    }
  }

  return (
    <div style={{ background: '#F8F7F5', minHeight: '80vh', padding: '80px 40px' }}>
      <div style={{ maxWidth: 800, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>
            Membership
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(36px, 5vw, 52px)', color: '#111', letterSpacing: '0.04em', marginBottom: 12 }}>
            L&apos;Échelon
          </h1>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#555', letterSpacing: '0.06em' }}>
            Twice monthly. Five pillars. No noise.
          </p>
        </div>

        <div style={{ height: 1, background: '#E2DED8', marginBottom: 40 }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }} className="tier-grid">
          {/* Free tier */}
          <div style={{ background: '#ffffff', border: '1px solid #E2DED8', padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#555', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>Reader</p>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 56, color: '#111', lineHeight: 1 }}>Free</div>
            </div>
            <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#444', lineHeight: 1.6 }}>
              Newsletter access and selected free articles from all five pillars.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Newsletter access', 'Bi-monthly editorial', 'Free articles'].map((f) => (
                <div key={f} style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#333', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#111' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <a href="#newsletter" className="btn-primary" style={{ textAlign: 'center', marginTop: 'auto', fontSize: 9, padding: '13px 0', display: 'block' }}>
              Get Started
            </a>
          </div>

          {/* Members tier */}
          <div style={{ background: '#ffffff', border: '2px solid #111', padding: 40, display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#555', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>Member</p>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, marginBottom: 4 }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 56, color: '#111', lineHeight: 1 }}>$12</span>
                <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 13, color: '#777', paddingBottom: 8 }}>/mo</span>
              </div>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#555' }}>or $99/yr · save 31%</p>
            </div>
            <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#444', lineHeight: 1.6 }}>
              Full access to every article, the complete L&apos;Échelon Index, and all intelligence across the five pillars.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {['Everything in Free', 'All premium articles', "Full L'Échelon Index", 'Intelligence dashboard'].map((f) => (
                <div key={f} style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#333', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#111' }}>✓</span> {f}
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
              <button onClick={() => handleSubscribe('monthly')} disabled={loading === 'monthly'} className="btn-primary"
                style={{ flex: 1, opacity: loading === 'monthly' ? 0.7 : 1, fontSize: 9, padding: '13px 0', cursor: 'pointer', border: 'none' }}>
                {loading === 'monthly' ? '...' : 'Monthly'}
              </button>
              <button onClick={() => handleSubscribe('annual')} disabled={loading === 'annual'} className="btn-pill"
                style={{ flex: 1, opacity: loading === 'annual' ? 0.7 : 1, fontSize: 9, padding: '13px 0', cursor: 'pointer', justifyContent: 'center' }}>
                {loading === 'annual' ? '...' : 'Annual · Save 31%'}
              </button>
            </div>
          </div>
        </div>

        <p style={{ textAlign: 'center', fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#777', marginTop: 24, letterSpacing: '0.10em' }}>
          Secure payment via Stripe · Cancel anytime
        </p>
      </div>

      <style>{`@media (max-width: 768px) { .tier-grid { grid-template-columns: 1fr !important; } }`}</style>
    </div>
  )
}

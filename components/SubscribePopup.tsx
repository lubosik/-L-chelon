'use client'

import { useState, useEffect } from 'react'
import { SignUpButton, useClerk } from '@clerk/nextjs'

const STORAGE_KEY = 'lechelon_popup_dismissed'
const DISMISS_DAYS = 7

export default function SubscribePopup() {
  const [visible, setVisible] = useState(false)
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'creating'>('idle')
  const { openSignUp } = useClerk()

  useEffect(() => {
    const dismissed = localStorage.getItem(STORAGE_KEY)
    if (dismissed) {
      const ts = parseInt(dismissed, 10)
      if (Date.now() - ts < DISMISS_DAYS * 24 * 60 * 60 * 1000) return
    }
    const timer = setTimeout(() => setVisible(true), 8000)
    return () => clearTimeout(timer)
  }, [])

  function dismiss() {
    localStorage.setItem(STORAGE_KEY, String(Date.now()))
    setVisible(false)
  }

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

  if (!visible) return null

  return (
    <>
      <div
        style={{
          position: 'fixed', inset: 0, zIndex: 9000,
          background: 'rgba(8,8,8,0.75)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'popupFadeIn 0.5s ease',
          padding: '20px',
        }}
        onClick={(e) => { if (e.target === e.currentTarget) dismiss() }}
      >
        <div style={{
          background: '#0A0A0A',
          border: '1px solid rgba(255,255,255,0.10)',
          maxWidth: 520, width: '100%',
          padding: '56px 52px 48px',
          position: 'relative',
          animation: 'popupSlideUp 0.5s ease',
        }}>
          {/* Close */}
          <button
            onClick={dismiss}
            style={{
              position: 'absolute', top: 20, right: 20,
              color: 'rgba(255,255,255,0.30)', fontSize: 18,
              background: 'none', border: 'none', cursor: 'pointer',
              lineHeight: 1, transition: 'color 0.2s',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.30)' }}
            aria-label="Close"
          >
            ✕
          </button>

          {/* Decorative line */}
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.20)', marginBottom: 28 }} />

          <p style={{
            fontFamily: 'Lato, sans-serif', fontSize: 9,
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.35)', marginBottom: 16,
          }}>
            The Intelligence of Luxury
          </p>

          <h2 style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 'clamp(32px, 5vw, 48px)', color: '#ffffff',
            letterSpacing: '0.04em', lineHeight: 1.05, marginBottom: 16,
          }}>
            L&apos;Échelon
          </h2>

          <p style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
            fontWeight: 300, fontSize: 17, color: 'rgba(255,255,255,0.55)',
            lineHeight: 1.5, marginBottom: 32,
          }}>
            Five pillars. Twice monthly. No noise.
            <br />Join the readers who move between worlds.
          </p>

          {status === 'done' ? (
            <div style={{ textAlign: 'center', padding: '8px 0 16px' }}>
              <p style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 22, color: '#fff', marginBottom: 8,
              }}>
                You&apos;re subscribed.
              </p>
              <p style={{
                fontFamily: 'Lato, sans-serif', fontSize: 11, color: 'rgba(255,255,255,0.50)',
                letterSpacing: '0.08em', lineHeight: 1.6, marginBottom: 28,
              }}>
                Complete your profile to access member content and the L&apos;Échelon Index.
              </p>
              <button
                onClick={() => {
                  openSignUp({ initialValues: { emailAddress: email } })
                  localStorage.setItem(STORAGE_KEY, String(Date.now()))
                  setVisible(false)
                }}
                style={{
                  width: '100%', background: '#ffffff', color: '#111',
                  fontFamily: 'Lato, sans-serif', fontSize: 9,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  padding: '14px', border: 'none', cursor: 'pointer',
                  transition: 'background 0.2s', marginBottom: 12,
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8E5E0' }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff' }}
              >
                Create Your Account
              </button>
              <button
                onClick={() => { localStorage.setItem(STORAGE_KEY, String(Date.now())); setVisible(false) }}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.12em',
                  color: 'rgba(255,255,255,0.30)', textTransform: 'uppercase', transition: 'color 0.2s',
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.60)' }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.30)' }}
              >
                Maybe later
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ marginBottom: 24 }}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  width: '100%', background: 'transparent',
                  border: 'none', borderBottom: '1px solid rgba(255,255,255,0.20)',
                  color: '#fff', fontFamily: 'Lato, sans-serif', fontSize: 13,
                  padding: '12px 0', outline: 'none', borderRadius: 0,
                  marginBottom: 20, display: 'block',
                  transition: 'border-color 0.2s',
                }}
                onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.60)' }}
                onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.20)' }}
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%', background: '#ffffff', color: '#111',
                  fontFamily: 'Lato, sans-serif', fontSize: 9,
                  letterSpacing: '0.24em', textTransform: 'uppercase',
                  padding: '14px', border: 'none', borderRadius: 0,
                  cursor: 'pointer', transition: 'background 0.2s',
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8E5E0' }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff' }}
              >
                {status === 'sending' ? '...' : 'Subscribe to L\'Échelon'}
              </button>
            </form>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em', textTransform: 'uppercase', flexShrink: 0 }}>
              or
            </p>
            <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.08)' }} />
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <SignUpButton mode="modal">
              <button style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontSize: 15, color: 'rgba(255,255,255,0.50)',
                background: 'none', border: 'none', cursor: 'pointer',
                borderBottom: '1px solid rgba(255,255,255,0.15)',
                paddingBottom: 2, transition: 'color 0.2s, border-color 0.2s',
              }}
                onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.80)'; el.style.borderBottomColor = 'rgba(255,255,255,0.50)' }}
                onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.50)'; el.style.borderBottomColor = 'rgba(255,255,255,0.15)' }}
              >
                Create a member account
              </button>
            </SignUpButton>
          </div>

          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.18)', marginTop: 20, textAlign: 'center', letterSpacing: '0.08em' }}>
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </div>

      <style>{`
        @keyframes popupFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes popupSlideUp {
          from { transform: translateY(24px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </>
  )
}

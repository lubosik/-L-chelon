'use client'

import { useClerk } from '@clerk/nextjs'

export default function AuthGate() {
  const { openSignUp, openSignIn } = useClerk()

  return (
    <div style={{ borderTop: '1px solid #E2DED8', paddingTop: 48 }}>
      <div style={{
        background: '#ffffff',
        padding: '48px 56px',
        textAlign: 'center',
        maxWidth: 520,
        margin: '0 auto',
      }} className="auth-gate-card">
        {/* É crest */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
          width: 40, height: 40, borderRadius: '50%', border: '1px solid #111',
          margin: '0 auto 20px',
        }}>
          <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 16, color: '#111', lineHeight: 1 }}>É</span>
        </div>

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 28, color: '#111', lineHeight: 1.1, marginBottom: 10 }}>
          Continue reading
        </h2>

        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#666', lineHeight: 1.65, maxWidth: 360, margin: '10px auto 28px' }}>
          Create a free L&apos;Échelon account to read this story in full — and every story across our five pillars. No payment required.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0 }}>
          <button
            onClick={() => openSignUp()}
            className="auth-gate-primary"
            style={{
              background: '#111', color: '#fff',
              fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '14px 32px', border: 'none', cursor: 'pointer', width: '100%', maxWidth: 280,
            }}
          >
            Create free account
          </button>
          <button
            onClick={() => openSignIn()}
            className="auth-gate-secondary"
            style={{
              background: 'transparent', border: '1px solid #E2DED8', color: '#555',
              fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
              padding: '13px 32px', cursor: 'pointer', width: '100%', maxWidth: 280, marginTop: 10,
            }}
          >
            Sign in
          </button>
        </div>

        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#bbb', marginTop: 16 }}>
          Free forever. No credit card.
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .auth-gate-card { padding: 36px 24px !important; }
          .auth-gate-primary, .auth-gate-secondary { max-width: 100% !important; min-height: 52px !important; }
        }
      `}</style>
    </div>
  )
}

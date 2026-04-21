'use client'

import { useClerk, SignedIn, SignedOut } from '@clerk/nextjs'
import Link from 'next/link'

export default function SubscribePage() {
  const { openSignUp, openSignIn } = useClerk()

  return (
    <div style={{ background: '#F8F7F5', minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 40px' }} className="subscribe-page">
      <div style={{ maxWidth: 560, width: '100%', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 24 }}>
          Join L&apos;Échelon
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(36px, 4vw, 56px)', color: '#111', lineHeight: 1.1, marginBottom: 24 }}>
          Read everything. Free, forever.
        </h1>
        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 14, color: '#666', lineHeight: 1.75, maxWidth: 480, margin: '0 auto 40px' }}>
          L&apos;Échelon covers the five pillars of the luxury world — fashion, motorsport, watches, equestrian, and lifestyle. Create your free account to read every story, access the archive, and join the conversation.
        </p>

        <SignedOut>
          <button
            onClick={() => openSignUp()}
            className="btn-primary"
            style={{ fontSize: 9, padding: '14px 32px', letterSpacing: '0.18em', cursor: 'pointer', border: 'none', display: 'inline-block', marginBottom: 20 }}
          >
            Create free account →
          </button>
          <div>
            <button
              onClick={() => openSignIn()}
              style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: '#aaa', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Already have an account? Sign in →
            </button>
          </div>
        </SignedOut>

        <SignedIn>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 16, color: '#666', marginBottom: 20 }}>
            You&apos;re in. Full access is yours.
          </p>
          <Link href="/" style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#fff', background: '#111', padding: '14px 32px', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none', display: 'inline-block' }}>
            Start reading →
          </Link>
        </SignedIn>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .subscribe-page { padding: 60px 24px !important; align-items: flex-start !important; }
        }
      `}</style>
    </div>
  )
}

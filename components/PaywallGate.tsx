'use client'

import Link from 'next/link'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function PaywallGate({ locale = 'en' }: { locale?: string }) {
  return (
    <div style={{ position: 'relative', marginTop: -80, paddingTop: 80, background: 'linear-gradient(to bottom, transparent 0%, #ffffff 35%)', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: 64 }}>
      <div style={{ background: '#ffffff', border: '1px solid #E2DED8', padding: '44px 52px', maxWidth: 480, textAlign: 'center' }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 28, color: '#111', letterSpacing: '0.06em', marginBottom: 12 }}>
          L&apos;Échelon
        </div>
        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#444', lineHeight: 1.7, marginBottom: 28 }}>
          This story is for members.<br />
          Subscribe to read the full article.
        </p>
        <Link href="/subscribe" className="btn-primary" style={{ fontSize: 10, padding: '13px 32px' }}>
          Unlock Access
        </Link>
        <div style={{ marginTop: 14, fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#777', letterSpacing: '0.10em' }}>
          From $12 / month · Cancel anytime
        </div>
      </div>
    </div>
  )
}

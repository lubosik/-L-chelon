'use client'

import Link from 'next/link'

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Subscribe', href: '/subscribe' },
  { label: 'Advertise', href: '#' },
  { label: 'Privacy', href: '#' },
]

export default function Footer() {
  return (
    <footer style={{ background: '#0A0A0A', padding: '48px 56px' }} className="site-footer">
      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', marginBottom: 32 }} />
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }} className="footer-inner">
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 16, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.06em' }}>
          L&apos;Échelon · Rosen Relations · 2026
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
          {FOOTER_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              style={{
                fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.25)',
                textDecoration: 'none', letterSpacing: '0.20em', textTransform: 'uppercase',
                transition: 'color 0.2s', minHeight: 'unset',
              }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.70)' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = 'rgba(255,255,255,0.25)' }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.15)' }}>
          © 2026 Rosen Relations
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .site-footer { padding: 36px 24px !important; }
          .footer-inner {
            flex-direction: column !important;
            align-items: center !important;
            text-align: center !important;
            gap: 20px !important;
          }
          .footer-inner > div { text-align: center !important; }
          .footer-inner > div > a { gap: 16px !important; }
        }
      `}</style>
    </footer>
  )
}

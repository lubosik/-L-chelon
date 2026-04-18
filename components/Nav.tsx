'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useHeroStore } from '@/lib/heroStore'

const LEFT_CATS = [
  { slug: 'la-mode',    french_name: 'LA MODE',    hero_video_slug: 'la-mode' },
  { slug: 'la-vitesse', french_name: 'LA VITESSE', hero_video_slug: 'la-vitesse' },
]
const RIGHT_CATS = [
  { slug: 'lhorlogerie',   french_name: "L'HORLOGERIE",   hero_video_slug: 'lhorlogerie' },
  { slug: 'lequitation',   french_name: "L'ÉQUITATION",   hero_video_slug: 'lequitation' },
  { slug: 'lart-de-vivre', french_name: "L'ART DE VIVRE", hero_video_slug: 'lart-de-vivre' },
]
const ALL_CATS = [...LEFT_CATS, ...RIGHT_CATS]

const catLinkStyle: React.CSSProperties = {
  fontFamily: 'Lato, sans-serif',
  fontSize: 9,
  letterSpacing: '0.20em',
  textTransform: 'uppercase' as const,
  color: '#555',
  cursor: 'pointer',
  textDecoration: 'none',
  paddingBottom: 2,
  borderBottom: '1px solid transparent',
  transition: 'color 0.2s, border-color 0.2s',
}

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const setHoverSlug = useHeroStore((s) => s.setHoverSlug)

  function handleCatHover(slug: string | null) {
    if (typeof window !== 'undefined' && window.innerWidth > 768) {
      setHoverSlug(slug)
    }
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 56, background: '#FFFFFF',
        borderBottom: '1px solid #E2DED8',
        zIndex: 1000, display: 'flex', alignItems: 'center', padding: '0 28px',
      }}>
        {/* LEFT categories */}
        <div className="nav-cats-left" style={{ display: 'flex', alignItems: 'center', gap: 32, flex: 1 }}>
          {LEFT_CATS.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} style={catLinkStyle}
              onMouseEnter={(e) => {
                handleCatHover(cat.hero_video_slug)
                const el = e.currentTarget as HTMLElement
                el.style.color = '#111'
                el.style.borderBottomColor = '#111'
              }}
              onMouseLeave={(e) => {
                handleCatHover(null)
                const el = e.currentTarget as HTMLElement
                el.style.color = '#555'
                el.style.borderBottomColor = 'transparent'
              }}
            >{cat.french_name}</Link>
          ))}
        </div>

        {/* CENTRE masthead */}
        <div style={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 15, letterSpacing: '0.24em', color: '#111' }}>L&apos;</span>
            <span style={{
              width: 34, height: 34, border: '1px solid #111', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, margin: '0 2px',
            }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontSize: 14, color: '#111' }}>É</span>
            </span>
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 15, letterSpacing: '0.24em', color: '#111' }}>chelon</span>
          </Link>
        </div>

        {/* RIGHT: categories + Google Translate + subscribe */}
        <div className="nav-cats-right" style={{ display: 'flex', alignItems: 'center', gap: 24, flex: 1, justifyContent: 'flex-end' }}>
          {RIGHT_CATS.map((cat) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} style={catLinkStyle}
              onMouseEnter={(e) => {
                handleCatHover(cat.hero_video_slug)
                const el = e.currentTarget as HTMLElement
                el.style.color = '#111'
                el.style.borderBottomColor = '#111'
              }}
              onMouseLeave={(e) => {
                handleCatHover(null)
                const el = e.currentTarget as HTMLElement
                el.style.color = '#555'
                el.style.borderBottomColor = 'transparent'
              }}
            >{cat.french_name}</Link>
          ))}
          <div id="google_translate_element" />
          <Link href="/subscribe" className="btn-primary" style={{ fontSize: 9, padding: '9px 20px', flexShrink: 0 }}>
            Subscribe
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          className="hamburger"
          onClick={() => setDrawerOpen(true)}
          aria-label="Open menu"
          style={{ display: 'none', position: 'absolute', right: 20, flexDirection: 'column', gap: 5, padding: 4 }}
        >
          <span style={{ display: 'block', width: 22, height: 1, background: '#111' }} />
          <span style={{ display: 'block', width: 22, height: 1, background: '#111' }} />
          <span style={{ display: 'block', width: 22, height: 1, background: '#111' }} />
        </button>
      </nav>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.3)' }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0, width: '80vw', maxWidth: 320,
              background: '#fff', borderLeft: '1px solid #E2DED8', padding: '60px 32px 32px',
              display: 'flex', flexDirection: 'column', gap: 20,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button onClick={() => setDrawerOpen(false)} style={{ position: 'absolute', top: 18, right: 18, color: '#666', fontSize: 18, cursor: 'pointer' }}>✕</button>
            {ALL_CATS.map((cat) => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setDrawerOpen(false)}
                style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#333', borderBottom: '1px solid #E2DED8', paddingBottom: 16, textDecoration: 'none' }}>
                {cat.french_name}
              </Link>
            ))}
            <Link href="/subscribe" className="btn-primary" onClick={() => setDrawerOpen(false)} style={{ textAlign: 'center', marginTop: 8 }}>
              Subscribe
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .hamburger { display: flex !important; }
          .nav-cats-left, .nav-cats-right { display: none !important; }
        }
        #google_translate_element select {
          border: none;
          background: transparent;
          font-family: 'Lato', sans-serif;
          font-size: 9px;
          letter-spacing: 0.14em;
          color: #555;
          cursor: pointer;
          outline: none;
          padding: 0;
          -webkit-appearance: none;
        }
        .goog-te-banner-frame { display: none !important; }
        body { top: 0 !important; }
      `}</style>
    </>
  )
}

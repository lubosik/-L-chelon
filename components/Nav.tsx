'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SignInButton, SignUpButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
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

const catLink: React.CSSProperties = {
  fontFamily: 'Lato, sans-serif',
  fontSize: 9,
  letterSpacing: '0.20em',
  textTransform: 'uppercase',
  color: '#666',
  textDecoration: 'none',
  paddingBottom: 2,
  borderBottom: '1px solid transparent',
  transition: 'color 0.2s, border-color 0.2s',
  whiteSpace: 'nowrap',
}

const utilLink: React.CSSProperties = {
  fontFamily: 'Lato, sans-serif',
  fontSize: 9,
  letterSpacing: '0.16em',
  textTransform: 'uppercase',
  color: '#888',
  textDecoration: 'none',
  transition: 'color 0.2s',
  whiteSpace: 'nowrap',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  padding: 0,
}

export default function Nav() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const setHoverSlug = useHeroStore((s) => s.setHoverSlug)

  function onCatEnter(e: React.MouseEvent, slug: string) {
    if (typeof window !== 'undefined' && window.innerWidth > 768) setHoverSlug(slug)
    const el = e.currentTarget as HTMLElement
    el.style.color = '#111'
    el.style.borderBottomColor = '#111'
  }
  function onCatLeave(e: React.MouseEvent) {
    if (typeof window !== 'undefined' && window.innerWidth > 768) setHoverSlug(null)
    const el = e.currentTarget as HTMLElement
    el.style.color = '#666'
    el.style.borderBottomColor = 'transparent'
  }
  function onUtilEnter(e: React.MouseEvent) {
    (e.currentTarget as HTMLElement).style.color = '#111'
  }
  function onUtilLeave(e: React.MouseEvent) {
    (e.currentTarget as HTMLElement).style.color = '#888'
  }

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 60,
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E4DF',
        zIndex: 1000,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 32px',
      }}>

        {/* LEFT: category links + About */}
        <div className="nav-left" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {LEFT_CATS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={catLink}
              onMouseEnter={(e) => onCatEnter(e, cat.hero_video_slug)}
              onMouseLeave={onCatLeave}
            >
              {cat.french_name}
            </Link>
          ))}
          <span style={{ width: 1, height: 14, background: '#E2DED8', flexShrink: 0 }} />
          <Link
            href="/about"
            style={catLink}
            onMouseEnter={onUtilEnter}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#666'; (e.currentTarget as HTMLElement).style.borderBottomColor = 'transparent' }}
          >
            About
          </Link>
        </div>

        {/* CENTRE: logo */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', gap: 6 }}>
            {/* Thin circle with cursive L inside */}
            <span style={{ position: 'relative', width: 30, height: 30, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="30" height="30" viewBox="0 0 30 30" fill="none" style={{ position: 'absolute' }}>
                <circle cx="15" cy="15" r="14" stroke="#111" strokeWidth="0.7"/>
              </svg>
              <span style={{
                position: 'relative',
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontWeight: 300, fontSize: 20, color: '#111', lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                &#x2113;
              </span>
            </span>
            {/* Wordmark */}
            <span style={{
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
              fontWeight: 300, fontSize: 19, color: '#111', letterSpacing: '0.04em',
              lineHeight: 1,
            }}>
              &lsquo;échelon
            </span>
          </Link>
        </div>

        {/* RIGHT: category links + auth cluster */}
        <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 24, justifyContent: 'flex-end' }}>
          {RIGHT_CATS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              style={catLink}
              onMouseEnter={(e) => onCatEnter(e, cat.hero_video_slug)}
              onMouseLeave={onCatLeave}
            >
              {cat.french_name}
            </Link>
          ))}

          {/* Divider */}
          <span style={{ width: 1, height: 14, background: '#E2DED8', flexShrink: 0 }} />

          {/* Auth */}
          <SignedOut>
            <button
              style={utilLink}
              onMouseOver={onUtilEnter}
              onMouseOut={onUtilLeave}
            >
              <SignInButton mode="modal">
                <span>Sign In</span>
              </SignInButton>
            </button>
            <SignUpButton mode="modal">
              <button style={{
                fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em',
                textTransform: 'uppercase', color: '#111', background: 'none',
                border: '1px solid #ccc', padding: '6px 14px', cursor: 'pointer',
                transition: 'border-color 0.2s, color 0.2s', whiteSpace: 'nowrap',
              }}
                onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#111' }}
                onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#ccc' }}
              >
                Sign Up
              </button>
            </SignUpButton>
          </SignedOut>
          <SignedIn>
            <UserButton />
          </SignedIn>

          {/* Subscribe CTA */}
          <Link
            href="/subscribe"
            className="btn-primary"
            style={{ fontSize: 9, padding: '8px 18px', flexShrink: 0, letterSpacing: '0.16em' }}
          >
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
          style={{ position: 'fixed', inset: 0, zIndex: 2000, background: 'rgba(0,0,0,0.35)' }}
          onClick={() => setDrawerOpen(false)}
        >
          <div
            style={{
              position: 'absolute', top: 0, right: 0, bottom: 0,
              width: '80vw', maxWidth: 320,
              background: '#fff', borderLeft: '1px solid #E2DED8',
              padding: '64px 32px 40px',
              display: 'flex', flexDirection: 'column', gap: 0,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setDrawerOpen(false)}
              style={{ position: 'absolute', top: 20, right: 20, color: '#888', fontSize: 18, cursor: 'pointer', background: 'none', border: 'none', lineHeight: 1 }}
            >
              ✕
            </button>

            {/* Categories */}
            {ALL_CATS.map((cat) => (
              <Link
                key={cat.slug}
                href={`/category/${cat.slug}`}
                onClick={() => setDrawerOpen(false)}
                style={{
                  fontFamily: 'Lato, sans-serif', fontSize: 10, letterSpacing: '0.20em',
                  textTransform: 'uppercase', color: '#333',
                  borderBottom: '1px solid #F0EDE8', paddingBottom: 18, marginBottom: 18,
                  textDecoration: 'none',
                }}
              >
                {cat.french_name}
              </Link>
            ))}

            {/* About */}
            <Link
              href="/about"
              onClick={() => setDrawerOpen(false)}
              style={{
                fontFamily: 'Lato, sans-serif', fontSize: 10, letterSpacing: '0.20em',
                textTransform: 'uppercase', color: '#888',
                borderBottom: '1px solid #F0EDE8', paddingBottom: 18, marginBottom: 24,
                textDecoration: 'none',
              }}
            >
              About
            </Link>

            {/* Auth row */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
              <SignedOut>
                <SignInButton mode="modal">
                  <button style={{
                    flex: 1, fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: '#555', background: 'none',
                    border: '1px solid #ccc', padding: '10px 0', cursor: 'pointer',
                  }}>
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button style={{
                    flex: 1, fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em',
                    textTransform: 'uppercase', color: '#fff', background: '#111',
                    border: 'none', padding: '10px 0', cursor: 'pointer',
                  }}>
                    Sign Up
                  </button>
                </SignUpButton>
              </SignedOut>
              <SignedIn>
                <UserButton />
              </SignedIn>
            </div>

            <Link
              href="/subscribe"
              className="btn-primary"
              onClick={() => setDrawerOpen(false)}
              style={{ textAlign: 'center', letterSpacing: '0.16em' }}
            >
              Subscribe
            </Link>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 1200px) {
          .hamburger { display: flex !important; }
          .nav-left, .nav-right { display: none !important; }
        }
      `}</style>
    </>
  )
}

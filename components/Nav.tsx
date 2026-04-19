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
  minHeight: 'unset',
  display: 'inline',
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
  minHeight: 'unset',
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
      <nav className="site-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        height: 60,
        background: '#FFFFFF',
        borderBottom: '1px solid #E8E4DF',
        zIndex: 1000,
        display: 'grid',
        gridTemplateColumns: '1fr auto 1fr',
        alignItems: 'center',
        padding: '0 32px',
        columnGap: 40,
      }}>

        {/* COL 1: desktop nav-left OR mobile hamburger */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
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
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLElement
                el.style.color = '#666'
                el.style.borderBottomColor = 'transparent'
              }}
            >
              About
            </Link>
          </div>

          {/* Mobile hamburger — left side */}
          <button
            className="hamburger"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
            style={{
              display: 'none',
              width: 48, height: 48,
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              gap: 5, background: 'none', border: 'none', cursor: 'pointer',
              marginLeft: -12,
            }}
          >
            <span style={{ display: 'block', width: 18, height: 1, background: '#111' }} />
            <span style={{ display: 'block', width: 18, height: 1, background: '#111' }} />
            <span style={{ display: 'block', width: 18, height: 1, background: '#111' }} />
          </button>
        </div>

        {/* COL 2: emblem */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none', minHeight: 'unset' }}>
            <span style={{ position: 'relative', width: 38, height: 38, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="38" height="38" viewBox="0 0 38 38" fill="none" style={{ position: 'absolute' }}>
                <circle cx="19" cy="19" r="18" stroke="#111" strokeWidth="0.75"/>
              </svg>
              <span style={{
                position: 'relative',
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
                fontWeight: 300, fontSize: 26, color: '#111', lineHeight: 1,
                letterSpacing: '-0.02em',
              }}>
                L
              </span>
            </span>
          </Link>
        </div>

        {/* COL 3: desktop nav-right OR mobile subscribe */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 24 }}>
          <div className="nav-right" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
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
            <span style={{ width: 1, height: 14, background: '#E2DED8', flexShrink: 0 }} />
            <SignedOut>
              <button style={utilLink} onMouseOver={onUtilEnter} onMouseOut={onUtilLeave}>
                <SignInButton mode="modal"><span>Sign In</span></SignInButton>
              </button>
              <SignUpButton mode="modal">
                <button style={{
                  fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: '#111', background: 'none',
                  border: '1px solid #ccc', padding: '6px 14px', cursor: 'pointer',
                  transition: 'border-color 0.2s', whiteSpace: 'nowrap',
                }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#111' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.borderColor = '#ccc' }}
                >
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn><UserButton /></SignedIn>
            <Link
              href="/subscribe"
              className="btn-primary"
              style={{ fontSize: 9, padding: '8px 18px', flexShrink: 0, letterSpacing: '0.16em', minHeight: 'unset', display: 'inline-block' }}
            >
              Subscribe
            </Link>
          </div>

          {/* Mobile: subscribe button — right side */}
          <Link
            className="nav-subscribe-mobile"
            href="/subscribe"
            style={{
              display: 'none',
              fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em',
              textTransform: 'uppercase', color: '#fff', background: '#111',
              padding: '8px 16px', textDecoration: 'none',
              minHeight: 44, alignItems: 'center',
            }}
          >
            Subscribe
          </Link>
        </div>
      </nav>

      {/* Backdrop */}
      <div
        onClick={() => setDrawerOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 199,
          background: 'rgba(0,0,0,0.45)',
          opacity: drawerOpen ? 1 : 0,
          pointerEvents: drawerOpen ? 'auto' : 'none',
          transition: 'opacity 0.35s ease',
        }}
      />

      {/* Drawer — slides from left */}
      <div style={{
        position: 'fixed', top: 0, left: 0, bottom: 0,
        width: '85vw', maxWidth: 360,
        background: '#ffffff',
        borderRight: '1px solid #E2DED8',
        zIndex: 200,
        transform: drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.35s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        display: 'flex', flexDirection: 'column',
        overflowY: 'auto',
      }}>
        {/* Close button */}
        <button
          onClick={() => setDrawerOpen(false)}
          style={{
            position: 'absolute', top: 16, right: 16,
            width: 36, height: 36,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#888', fontSize: 18, cursor: 'pointer',
            background: 'none', border: 'none', lineHeight: 1,
          }}
        >
          ✕
        </button>

        {/* Header */}
        <div style={{ padding: '24px 24px 0' }}>
          <div style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 28, color: '#111', marginBottom: 6,
          }}>
            L&apos;Échelon
          </div>
          <div style={{
            fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa',
            letterSpacing: '0.22em', textTransform: 'uppercase',
          }}>
            The Intelligence of Luxury
          </div>
          <div style={{ height: 1, background: '#E2DED8', margin: '20px 0' }} />
        </div>

        {/* Nav links */}
        <div style={{ flex: 1 }}>
          {ALL_CATS.map((cat) => (
            <Link
              key={cat.slug}
              href={`/category/${cat.slug}`}
              onClick={() => setDrawerOpen(false)}
              style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                height: 56, padding: '0 24px',
                fontFamily: 'Lato, sans-serif', fontSize: 11, letterSpacing: '0.18em',
                textTransform: 'uppercase', color: '#555',
                borderBottom: '1px solid #F0EDE8',
                textDecoration: 'none',
              }}
            >
              <span>{cat.french_name}</span>
              <span style={{ color: '#bbb', fontFamily: 'sans-serif' }}>→</span>
            </Link>
          ))}

          <div style={{ height: 1, background: '#E2DED8', margin: '8px 0' }} />

          <Link
            href="/articles"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              height: 56, padding: '0 24px',
              fontFamily: 'Lato, sans-serif', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#555',
              borderBottom: '1px solid #F0EDE8',
              textDecoration: 'none',
            }}
          >
            <span>Articles</span>
            <span style={{ color: '#bbb', fontFamily: 'sans-serif' }}>→</span>
          </Link>

          <Link
            href="/about"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              height: 56, padding: '0 24px',
              fontFamily: 'Lato, sans-serif', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#555',
              borderBottom: '1px solid #F0EDE8',
              textDecoration: 'none',
            }}
          >
            <span>About</span>
            <span style={{ color: '#bbb', fontFamily: 'sans-serif' }}>→</span>
          </Link>

          <Link
            href="/subscribe"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              height: 56, padding: '0 24px',
              fontFamily: 'Lato, sans-serif', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#555',
              borderBottom: '1px solid #F0EDE8',
              textDecoration: 'none',
            }}
          >
            <span>Subscribe</span>
            <span style={{ color: '#bbb', fontFamily: 'sans-serif' }}>→</span>
          </Link>

          <Link
            href="/intelligence"
            onClick={() => setDrawerOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              height: 56, padding: '0 24px',
              fontFamily: 'Lato, sans-serif', fontSize: 11, letterSpacing: '0.18em',
              textTransform: 'uppercase', color: '#555',
              borderBottom: '1px solid #F0EDE8',
              textDecoration: 'none',
            }}
          >
            <span>Intelligence</span>
            <span style={{
              fontFamily: 'Lato, sans-serif', fontSize: 7, letterSpacing: '0.12em',
              textTransform: 'uppercase', color: '#fff', background: '#111',
              padding: '3px 8px',
            }}>
              Members
            </span>
          </Link>

          {/* Auth */}
          <div style={{ padding: '20px 24px', display: 'flex', gap: 10 }}>
            <SignedOut>
              <SignInButton mode="modal">
                <button style={{
                  flex: 1, fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: '#555', background: 'none',
                  border: '1px solid #ccc', padding: '10px 0', cursor: 'pointer', minHeight: 44,
                }}>
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button style={{
                  flex: 1, fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em',
                  textTransform: 'uppercase', color: '#fff', background: '#111',
                  border: 'none', padding: '10px 0', cursor: 'pointer', minHeight: 44,
                }}>
                  Sign Up
                </button>
              </SignUpButton>
            </SignedOut>
            <SignedIn><UserButton /></SignedIn>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #F0EDE8',
          fontFamily: 'Lato, sans-serif', fontSize: 8,
          color: '#aaa', letterSpacing: '0.10em',
        }}>
          © 2026 Rosen Relations
        </div>
      </div>

      <style>{`
        .site-nav { padding-top: env(safe-area-inset-top); }
        @media (max-width: 768px) {
          .site-nav { height: 56px !important; padding: 0 16px !important; column-gap: 8px !important; }
          .hamburger { display: flex !important; }
          .nav-subscribe-mobile { display: inline-flex !important; }
          .nav-left, .nav-right { display: none !important; }
        }
      `}</style>
    </>
  )
}

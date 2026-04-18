'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/strapi'
import { useHeroStore } from '@/lib/heroStore'

const FADE_MS = 900
const PRE_END_S = 2.2

const SEQ = ['la-mode', 'la-vitesse', 'lhorlogerie', 'lequitation', 'lart-de-vivre']

function nextSrc(slug: string): string {
  const i = SEQ.indexOf(slug)
  return SEQ[(i < 0 ? 0 : i + 1) % SEQ.length]
}

const PLACEHOLDER: Article = {
  id: 0,
  title: 'The New Standard in <em>Luxury</em> Editorial',
  slug: '#',
  excerpt: "Fashion, motorsport, haute horlogerie, equestrian, and the art of living well. L'Échelon covers the five pillars of the luxury world.",
  is_premium: false, featured: true, read_time: 0,
  author: { id: 0, name: "L'Échelon" },
  category: undefined,
}

export default function Hero({ article }: { article: Article | null }) {
  const displayArticle = article ?? PLACEHOLDER
  const isMobile = useRef(false)
  const hoverSlug = useHeroStore(s => s.hoverSlug)

  // Fixed-slot: vid0/vid1 always reference the same DOM elements.
  // slots[0] is the src for element 0; slots[1] is the src for element 1.
  // Only the INACTIVE slot's src ever changes — the playing element is never touched.
  const slotsRef = useRef<[string, string]>(['la-mode', 'la-vitesse'])
  const [slots, setSlots] = useState<[string, string]>(['la-mode', 'la-vitesse'])
  const activeSlotRef = useRef(0)
  const [activeSlot, setActiveSlot] = useState(0)
  const [fading, setFading] = useState(false)
  const [videoStarted, setVideoStarted] = useState(false)
  const inFadeRef = useRef(false)
  const nearEndRef = useRef(false)
  const vid0 = useRef<HTMLVideoElement>(null)
  const vid1 = useRef<HTMLVideoElement>(null)
  const vidRefs = [vid0, vid1]

  useEffect(() => { isMobile.current = window.innerWidth <= 768 }, [])

  const getSrc = useCallback((slug: string) =>
    `/heroes/${slug}${isMobile.current ? '-mob' : ''}.mp4`
  , [])

  function setSlotsBoth(next: [string, string]) {
    slotsRef.current = next
    setSlots(next)
  }

  function setActiveBoth(next: number) {
    activeSlotRef.current = next
    setActiveSlot(next)
  }

  const doFade = useCallback(() => {
    if (inFadeRef.current) return
    inFadeRef.current = true
    nearEndRef.current = false

    const cur = activeSlotRef.current
    const nxt = cur === 0 ? 1 : 0

    // The inactive slot has been preloading — just play it, no seek needed
    const nv = vidRefs[nxt].current
    if (nv) nv.play().catch(() => {})

    setFading(true)
    setTimeout(() => {
      setActiveBoth(nxt)
      // Now update the old active slot's src to the next video in sequence.
      // It's invisible at opacity 0, so the src change causes no visual flash.
      const updated: [string, string] = [...slotsRef.current] as [string, string]
      updated[cur] = nextSrc(slotsRef.current[nxt])
      setSlotsBoth(updated)
      setFading(false)
      inFadeRef.current = false
    }, FADE_MS)
  }, []) // eslint-disable-line

  // Start the first video on mount
  useEffect(() => {
    const v = vid0.current
    if (!v) return
    v.play().catch(() => {})
    setVideoStarted(true)
  }, []) // eslint-disable-line

  // Handle hover override
  useEffect(() => {
    if (!hoverSlug || inFadeRef.current) return
    if (!videoStarted) setVideoStarted(true)
    const cur = activeSlotRef.current
    const nxt = cur === 0 ? 1 : 0
    const updated: [string, string] = [...slotsRef.current] as [string, string]
    updated[nxt] = hoverSlug
    setSlotsBoth(updated)
    requestAnimationFrame(() => {
      const nv = vidRefs[nxt].current
      if (nv) { nv.load(); setTimeout(() => { nv.play().catch(() => {}); doFade() }, 80) }
    })
  }, [hoverSlug, doFade, videoStarted]) // eslint-disable-line

  // When hover clears, restore next slot to the correct sequence video
  useEffect(() => {
    if (hoverSlug !== null) return
    const cur = activeSlotRef.current
    const nxt = cur === 0 ? 1 : 0
    const updated: [string, string] = [...slotsRef.current] as [string, string]
    updated[nxt] = nextSrc(slotsRef.current[cur])
    setSlotsBoth(updated)
  }, [hoverSlug]) // eslint-disable-line

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>, slotIdx: number) {
    if (slotIdx !== activeSlotRef.current || nearEndRef.current || inFadeRef.current || hoverSlug) return
    const v = e.currentTarget
    if (v.duration > 0 && v.currentTime >= v.duration - PRE_END_S) {
      nearEndRef.current = true
      doFade()
    }
  }

  // Opacity for each fixed element based on which is active and whether we're fading
  const op0 = !videoStarted ? 0 : (activeSlot === 0 ? (fading ? 0 : 1) : (fading ? 1 : 0))
  const op1 = !videoStarted ? 0 : (activeSlot === 1 ? (fading ? 0 : 1) : (fading ? 1 : 0))

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', background: '#0A0A0A' }}>
      {/* Element 0 — always ref=vid0, always src=slots[0] */}
      <video
        ref={vid0}
        src={getSrc(slots[0])}
        muted playsInline preload="auto"
        poster={`/heroes/${slots[0]}.jpg`}
        onTimeUpdate={(e) => handleTimeUpdate(e, 0)}
        onEnded={() => { if (activeSlotRef.current === 0 && !inFadeRef.current) doFade() }}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          zIndex: 1, opacity: op0,
          transition: `opacity ${FADE_MS}ms ease`, pointerEvents: 'none',
        }}
      />
      {/* Element 1 — always ref=vid1, always src=slots[1] */}
      <video
        ref={vid1}
        src={getSrc(slots[1])}
        muted playsInline preload="auto"
        poster={`/heroes/${slots[1]}.jpg`}
        onTimeUpdate={(e) => handleTimeUpdate(e, 1)}
        onEnded={() => { if (activeSlotRef.current === 1 && !inFadeRef.current) doFade() }}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          zIndex: 2, opacity: op1,
          transition: `opacity ${FADE_MS}ms ease`, pointerEvents: 'none',
        }}
      />

      {/* Gradient overlays */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        background: 'linear-gradient(to right, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.80) 40%, rgba(8,8,8,0.15) 70%, transparent 100%)',
      }} />
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, height: '35%',
        background: 'linear-gradient(to top, rgba(10,10,10,1) 0%, transparent 100%)',
      }} />

      {/* Hero text — bottom left */}
      <div style={{ position: 'absolute', bottom: 0, left: 0, zIndex: 20, padding: '0 56px 56px', maxWidth: 700 }} className="hero-text-pad">
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.80)', marginBottom: 14 }}>
          {displayArticle.category?.hero_label ?? "L'Échelon · Spring 2026"}
        </p>
        {displayArticle.category?.french_name && (
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 12, fontStyle: 'italic', color: 'rgba(255,255,255,0.65)', letterSpacing: '0.10em', marginBottom: 10 }}>
            {displayArticle.category.french_name}
          </p>
        )}
        <h1
          style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(56px, 7.5vw, 100px)', lineHeight: 0.95, color: '#fff', letterSpacing: '-0.01em', marginBottom: 20, maxWidth: 650 }}
          dangerouslySetInnerHTML={{ __html: displayArticle.title }}
        />
        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, maxWidth: 420, marginBottom: 24 }}>
          {displayArticle.excerpt}
        </p>
        {displayArticle.slug !== '#' && (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24 }}>
              <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)' }}>
                By <span style={{ color: 'rgba(255,255,255,0.90)' }}>{displayArticle.author?.name}</span>
              </span>
              <span style={{ color: 'rgba(255,255,255,0.40)' }}>·</span>
              <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.70)' }}>
                {displayArticle.read_time} min read
              </span>
              <span style={{ color: 'rgba(255,255,255,0.40)' }}>·</span>
              <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.16em', textTransform: 'uppercase', color: displayArticle.is_premium ? 'rgba(255,255,255,0.90)' : 'rgba(255,255,255,0.70)' }}>
                {displayArticle.is_premium ? 'Members' : 'Free'}
              </span>
            </div>
            <Link href={`/article/${displayArticle.slug}`} className="btn-hero">
              Read the story
            </Link>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .hero-text-pad { padding: 0 20px 44px !important; }
          .hero-text-pad h1 { font-size: clamp(44px, 9vw, 68px) !important; }
        }
        @media (max-width: 480px) {
          .hero-text-pad { padding: 0 16px 36px !important; }
          .hero-text-pad h1 { font-size: clamp(38px, 10vw, 56px) !important; }
        }
      `}</style>
    </section>
  )
}

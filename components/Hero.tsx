'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/strapi'
import { useHeroStore } from '@/lib/heroStore'

const FADE_MS = 900
const PRE_END_S = 2.2

const SEQ = ['default', 'la-mode', 'la-vitesse', 'lhorlogerie', 'lequitation', 'lart-de-vivre']

function nextSrc(slug: string): string {
  const i = SEQ.indexOf(slug)
  return i <= 0 ? 'la-mode' : SEQ[i >= SEQ.length - 1 ? 1 : i + 1]
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

  // Dual-buffer: slots[0] and slots[1] are always in DOM
  // activeSlot is the one currently visible; the other preloads the next video
  const slotsRef = useRef<[string, string]>(['default', 'la-mode'])
  const [slots, setSlots] = useState<[string, string]>(['default', 'la-mode'])
  const activeSlotRef = useRef(0)
  const [activeSlot, setActiveSlot] = useState(0)
  const [fading, setFading] = useState(false)
  const inFadeRef = useRef(false)
  const nearEndRef = useRef(false)
  const vidRefs = [useRef<HTMLVideoElement>(null), useRef<HTMLVideoElement>(null)]

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

  // Core crossfade: start playing the inactive slot, then swap opacities
  const doFade = useCallback(() => {
    if (inFadeRef.current) return
    inFadeRef.current = true
    nearEndRef.current = false

    const cur = activeSlotRef.current
    const nxt = cur === 0 ? 1 : 0

    // Start the preloaded next video from the beginning
    const nv = vidRefs[nxt].current
    if (nv) { nv.currentTime = 0; nv.play().catch(() => {}) }

    setFading(true)
    setTimeout(() => {
      // Swap active
      setActiveBoth(nxt)
      // Prepare new next: put the following video into the old active slot
      const updated: [string, string] = [...slotsRef.current] as [string, string]
      updated[cur] = nextSrc(slotsRef.current[nxt])
      setSlotsBoth(updated)
      setFading(false)
      inFadeRef.current = false
    }, FADE_MS)
  }, []) // eslint-disable-line

  // Handle hover override
  useEffect(() => {
    if (!hoverSlug || inFadeRef.current) return
    const cur = activeSlotRef.current
    const nxt = cur === 0 ? 1 : 0
    // Load hover slug into inactive slot
    const updated: [string, string] = [...slotsRef.current] as [string, string]
    updated[nxt] = hoverSlug
    setSlotsBoth(updated)
    // Give React one frame to update src, then fade
    requestAnimationFrame(() => {
      const nv = vidRefs[nxt].current
      if (nv) { nv.load(); setTimeout(() => { nv.play().catch(() => {}); doFade() }, 80) }
    })
  }, [hoverSlug, doFade]) // eslint-disable-line

  // When hover clears, fix next-slot to correct sequence position
  useEffect(() => {
    if (hoverSlug !== null) return
    const cur = activeSlotRef.current
    const nxt = cur === 0 ? 1 : 0
    const updated: [string, string] = [...slotsRef.current] as [string, string]
    updated[nxt] = nextSrc(slotsRef.current[cur])
    setSlotsBoth(updated)
  }, [hoverSlug]) // eslint-disable-line

  // Start active video on mount and on slot swap
  useEffect(() => {
    vidRefs[activeSlot].current?.play().catch(() => {})
  }, [activeSlot]) // eslint-disable-line

  // Preload inactive slot (don't autoplay, just buffer)
  useEffect(() => {
    const nxt = activeSlot === 0 ? 1 : 0
    vidRefs[nxt].current?.load()
  }, [activeSlot, slots]) // eslint-disable-line

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>, slotIdx: number) {
    if (slotIdx !== activeSlotRef.current || nearEndRef.current || inFadeRef.current || hoverSlug) return
    const v = e.currentTarget
    if (v.duration > 0 && v.currentTime >= v.duration - PRE_END_S) {
      nearEndRef.current = true
      doFade()
    }
  }

  const inactiveSlot = activeSlot === 0 ? 1 : 0
  // Opacity: active fades to 0, inactive fades to 1 when fading
  const opA = activeSlot === 0 ? (fading ? 0 : 1) : (fading ? 1 : 0)
  const opB = activeSlot === 1 ? (fading ? 0 : 1) : (fading ? 1 : 0)
  const ops = [opA, opB]

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', background: '#0A0A0A' }}>
      {/* Inactive video (below, preloading) */}
      <video
        ref={vidRefs[inactiveSlot]}
        src={getSrc(slots[inactiveSlot])}
        muted playsInline preload="auto"
        poster={`/heroes/${slots[inactiveSlot]}.jpg`}
        onTimeUpdate={(e) => handleTimeUpdate(e, inactiveSlot)}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          zIndex: 1, opacity: ops[inactiveSlot],
          transition: `opacity ${FADE_MS}ms ease`, pointerEvents: 'none',
        }}
      />
      {/* Active video (above, playing) */}
      <video
        ref={vidRefs[activeSlot]}
        src={getSrc(slots[activeSlot])}
        autoPlay muted playsInline preload="auto"
        poster={`/heroes/${slots[activeSlot]}.jpg`}
        onTimeUpdate={(e) => handleTimeUpdate(e, activeSlot)}
        style={{
          position: 'absolute', inset: 0, width: '100%', height: '100%',
          objectFit: 'cover', objectPosition: 'center',
          zIndex: 2, opacity: ops[activeSlot],
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

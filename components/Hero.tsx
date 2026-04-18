'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import type { Article } from '@/lib/strapi'
import { useHeroStore } from '@/lib/heroStore'

interface HeroProps {
  article: Article | null
  activeCategorySlug?: string
}

const FADE_DURATION = 600

const AUTO_SEQUENCE = ['default', 'la-mode', 'la-vitesse', 'lhorlogerie', 'lequitation', 'lart-de-vivre']

const PLACEHOLDER_ARTICLE: Article = {
  id: 0,
  title: 'The New Standard in <em>Luxury</em> Editorial',
  slug: '#',
  excerpt: "Fashion, motorsport, haute horlogerie, equestrian, and the art of living well. L'Échelon covers the five pillars of the luxury world.",
  is_premium: false,
  featured: true,
  read_time: 0,
  author: { id: 0, name: "L'Échelon" },
  category: undefined,
}

export default function Hero({ article, activeCategorySlug }: HeroProps) {
  const displayArticle = article ?? PLACEHOLDER_ARTICLE
  const isMobile = useRef(false)
  const defaultSlug = activeCategorySlug ?? displayArticle.category?.hero_video_slug ?? 'default'

  const [currentSlug, setCurrentSlug] = useState<string>(defaultSlug)
  const [pendingSlug, setPendingSlug] = useState<string | null>(null)
  const [isFading, setIsFading] = useState(false)
  const fadeRef = useRef(false)
  const rotationIndexRef = useRef(0)

  const hoverSlug = useHeroStore((s) => s.hoverSlug)

  useEffect(() => { isMobile.current = window.innerWidth <= 768 }, [])

  const getVideoSrc = useCallback((slug: string) => {
    const suffix = isMobile.current ? '-mob' : ''
    return `/heroes/${slug}${suffix}.mp4`
  }, [])

  const transitionTo = useCallback((newSlug: string) => {
    if (newSlug === currentSlug || fadeRef.current) return
    const idx = AUTO_SEQUENCE.indexOf(newSlug)
    if (idx !== -1) rotationIndexRef.current = idx
    fadeRef.current = true
    setIsFading(true)
    setPendingSlug(newSlug)
    setTimeout(() => {
      setCurrentSlug(newSlug)
      setPendingSlug(null)
      setIsFading(false)
      fadeRef.current = false
    }, FADE_DURATION)
  }, [currentSlug])

  const handleVideoEnded = useCallback(() => {
    if (activeCategorySlug || hoverSlug || fadeRef.current) return
    const cur = rotationIndexRef.current
    const nextIdx = cur === 0 ? 1 : cur >= AUTO_SEQUENCE.length - 1 ? 1 : cur + 1
    transitionTo(AUTO_SEQUENCE[nextIdx])
  }, [activeCategorySlug, hoverSlug, transitionTo])

  useEffect(() => {
    if (activeCategorySlug && activeCategorySlug !== currentSlug) transitionTo(activeCategorySlug)
  }, [activeCategorySlug]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (hoverSlug) {
      transitionTo(hoverSlug)
    } else {
      transitionTo(activeCategorySlug ?? displayArticle.category?.hero_video_slug ?? 'default')
    }
  }, [hoverSlug]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', background: '#0A0A0A' }}>
      <VideoBackground src={getVideoSrc(currentSlug)} fallbackSrc="/heroes/default.mp4" opacity={isFading ? 0 : 1} zIndex={1} onEnded={handleVideoEnded} />
      {pendingSlug && <VideoBackground src={getVideoSrc(pendingSlug)} fallbackSrc="/heroes/default.mp4" opacity={isFading ? 1 : 0} zIndex={2} onEnded={handleVideoEnded} />}

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

function VideoBackground({ src, fallbackSrc, opacity, zIndex, onEnded }: {
  src: string
  fallbackSrc: string
  opacity: number
  zIndex: number
  onEnded?: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null)

  const handleError = useCallback(() => {
    const video = videoRef.current
    if (video && !video.src.endsWith(fallbackSrc)) {
      video.src = fallbackSrc
      video.load()
      video.play().catch(() => {})
    }
  }, [fallbackSrc])

  useEffect(() => {
    videoRef.current?.play().catch(() => {})
  }, [src])

  return (
    <video
      ref={videoRef}
      src={src}
      autoPlay
      muted
      playsInline
      preload="none"
      poster={src.replace('.mp4', '.jpg').replace('-mob', '')}
      onError={handleError}
      onEnded={onEnded}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        zIndex, opacity, transition: `opacity ${FADE_DURATION}ms ease`, pointerEvents: 'none',
      }}
    />
  )
}

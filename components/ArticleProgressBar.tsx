'use client'

import { useEffect, useState, useRef } from 'react'

export default function ArticleProgressBar({ categoryName }: { categoryName?: string }) {
  const [progress, setProgress] = useState(0)
  const [showPill, setShowPill] = useState(false)
  const [isScrollingDown, setScrollingDown] = useState(true)
  const lastScrollY = useRef(0)

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY
      setScrollingDown(currentY > lastScrollY.current)
      lastScrollY.current = currentY

      const article = document.querySelector('.article-body')
      if (!article) return
      const rect = article.getBoundingClientRect()
      const articleHeight = (article as HTMLElement).offsetHeight
      const scrolled = Math.max(0, -rect.top)
      setProgress(Math.min(100, (scrolled / articleHeight) * 100))
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const hero = document.querySelector('.art-hero')
    if (!hero) return
    const obs = new IntersectionObserver(([e]) => setShowPill(!e.isIntersecting), { threshold: 0 })
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  return (
    <>
      {/* Reading progress bar — desktop + mobile */}
      <div style={{ position: 'fixed', top: 56, left: 0, right: 0, height: 2, zIndex: 100, background: '#E2DED8', pointerEvents: 'none' }}>
        <div style={{ height: '100%', background: '#111', width: `${progress}%`, transition: 'width 0.1s linear' }} />
      </div>

      {/* Floating category pill — mobile only, hides when scrolling down */}
      {categoryName && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          style={{
            position: 'fixed', top: 68, left: '50%',
            transform: `translateX(-50%) translateY(${showPill && !isScrollingDown ? '0' : '-60px'})`,
            zIndex: 90,
            background: 'rgba(8,8,8,0.82)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
            padding: '5px 14px', borderRadius: 999,
            fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#fff',
            letterSpacing: '0.18em', textTransform: 'uppercase',
            cursor: 'pointer', border: 'none',
            transition: 'transform 0.3s ease',
            whiteSpace: 'nowrap',
          } as React.CSSProperties}
          className="art-cat-pill"
        >
          {categoryName}
        </button>
      )}
      <style>{`
        @media (min-width: 769px) { .art-cat-pill { display: none !important; } }
      `}</style>
    </>
  )
}

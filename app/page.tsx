'use client'

import { useEffect, useState, useRef } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import type { Article, Category, IndexDataPoint, TickerItem } from '@/lib/strapi'
import Ticker from '@/components/Ticker'
import Hero from '@/components/Hero'

const homepageSchema = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://lechelon.com/#organization',
      'name': "L'Échelon",
      'url': 'https://lechelon.com',
      'logo': { '@type': 'ImageObject', 'url': 'https://lechelon.com/og/logo.png', 'width': 600, 'height': 60 },
      'foundingDate': '2026',
      'description': "L'Échelon is the luxury editorial intelligence platform covering haute couture, Formula One, watches, equestrian, and superyacht lifestyle.",
      'knowsAbout': ['Luxury Fashion', 'Formula One', 'Luxury Watches', 'Polo and Equestrian Sports', 'Superyacht Lifestyle'],
    },
    {
      '@type': 'WebSite',
      '@id': 'https://lechelon.com/#website',
      'url': 'https://lechelon.com',
      "name": "L'Échelon",
      'publisher': { '@id': 'https://lechelon.com/#organization' },
    },
  ],
}

const faqSchema = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  'mainEntity': [
    { '@type': 'Question', 'name': "What is L'Échelon?", 'acceptedAnswer': { '@type': 'Answer', 'text': "L'Échelon is a luxury editorial intelligence platform covering five pillars: haute couture fashion, Formula One motorsport, luxury watches, equestrian sports, and ultra-luxury lifestyle. Published twice monthly." } },
    { '@type': 'Question', 'name': "What does L'Échelon cover?", 'acceptedAnswer': { '@type': 'Answer', 'text': "L'Échelon covers five luxury verticals: La Mode (fashion and couture), La Vitesse (Formula One and motorsport), L'Horlogerie (luxury watches and haute horlogerie), L'Équitation (polo and equestrian), and L'Art de Vivre (superyacht lifestyle and ultra-luxury)." } },
    { '@type': 'Question', 'name': "How do I subscribe to L'Échelon?", 'acceptedAnswer': { '@type': 'Answer', 'text': "L'Échelon offers a free tier with newsletter access and a members tier at $12/month or $99/year. Members receive full site access, the complete L'Échelon Index analytics, and all premium articles." } },
    { '@type': 'Question', 'name': "What is the L'Échelon Index?", 'acceptedAnswer': { '@type': 'Answer', 'text': "The L'Échelon Index is a live intelligence dashboard tracking performance metrics across the five luxury pillars. Full access is available to members." } },
  ],
}

const CATEGORY_CONFIG = [
  { slug: 'la-mode',       french: 'LA MODE',        english: 'Fashion',    tagline: 'Where the atelier meets the algorithm.',       img: '/heroes/la-mode.jpg',       objPos: 'center' },
  { slug: 'la-vitesse',    french: 'LA VITESSE',      english: 'Motorsport', tagline: 'The pursuit of the perfect lap.',               img: '/heroes/la-vitesse.jpg',    objPos: 'center' },
  { slug: 'lhorlogerie',   french: "L'HORLOGERIE",    english: 'Watches',    tagline: 'Time, measured in masterpieces.',               img: '/heroes/lhorlogerie.jpg',   objPos: 'center' },
  { slug: 'lequitation',   french: "L'ÉQUITATION",    english: 'Equestrian', tagline: 'The oldest luxury sport, reimagined.',          img: '/heroes/lequitation.jpg',   objPos: 'center top' },
  { slug: 'lart-de-vivre', french: "L'ART DE VIVRE",  english: 'Lifestyle',  tagline: 'The art of living without compromise.',         img: '/heroes/lart-de-vivre.jpg', objPos: 'center' },
]

export default function HomePage() {
  const [featuredArticle, setFeaturedArticle] = useState<Article | null>(null)
  const [, setCategories] = useState<Category[]>([])
  const [tickerItems, setTickerItems] = useState<TickerItem[]>([])
  const [indexData, setIndexData] = useState<IndexDataPoint[]>([])
  const [articles, setArticles] = useState<Article[]>([])
  const [email, setEmail] = useState('')
  const [emailStatus, setEmailStatus] = useState<'idle' | 'sending' | 'done'>('idle')
  const [indexVisible, setIndexVisible] = useState(false)
  const indexRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    async function load() {
      try {
        const [catRes, tickerRes, indexRes, articlesRes] = await Promise.all([
          fetch(`${base}/api/categories?populate=*&sort=name:asc`).then((r) => r.json()).catch(() => ({ data: [] })),
          fetch(`${base}/api/ticker-items?filters[active][$eq]=true`).then((r) => r.json()).catch(() => ({ data: [] })),
          fetch(`${base}/api/index-data-points?sort=id:asc&pagination[limit]=6`).then((r) => r.json()).catch(() => ({ data: [] })),
          fetch(`${base}/api/articles?populate=cover_image,category,author,issue&sort=published_at:desc&pagination[limit]=10`).then((r) => r.json()).catch(() => ({ data: [] })),
        ])
        const flatten = (item: { id: number; attributes?: Record<string, unknown> }) => item.attributes ? { id: item.id, ...item.attributes } : item
        const flatList = (res: { data?: unknown[] }) => (res?.data ?? []).map((item) => flatten(item as { id: number; attributes?: Record<string, unknown> }))
        setCategories(flatList(catRes) as Category[])
        setTickerItems(flatList(tickerRes) as TickerItem[])
        setIndexData(flatList(indexRes) as IndexDataPoint[])
        const allArticles = flatList(articlesRes) as Article[]
        setArticles(allArticles)
        setFeaturedArticle(allArticles.find((a) => a.featured) ?? allArticles[0] ?? null)
      } catch { /* Strapi offline */ }
    }
    load()
  }, [])

  useEffect(() => {
    const el = indexRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setIndexVisible(true); obs.disconnect() } },
      { threshold: 0.15 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  async function handleNewsletter(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setEmailStatus('sending')
    try {
      await fetch('/api/subscribe', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
    } catch { /* ignore */ }
    setEmailStatus('done')
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(homepageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      {/* SECTION 1: HERO */}
      <Hero article={featuredArticle} />

      {/* SECTION 2: TICKER BAR */}
      <div style={{ background: '#111', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <div style={{ display: 'flex', alignItems: 'center', padding: '0 56px', height: 44 }} className="ticker-bar">
          <Ticker items={tickerItems} />
        </div>
      </div>

      {/* SECTION 3: CATEGORY GRID */}
      <section style={{ width: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', height: 420 }} className="cat-grid-hp">
          {CATEGORY_CONFIG.map((cat, i) => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} style={{ position: 'relative', overflow: 'hidden', display: 'block', borderRight: i < 4 ? '1px solid rgba(255,255,255,0.06)' : 'none', textDecoration: 'none' }}
              className="cat-cell">
              <Image
                src={cat.img}
                alt={cat.english}
                fill
                style={{ objectFit: 'cover', objectPosition: cat.objPos, transition: 'transform 0.6s ease' }}
                sizes="20vw"
                priority={i < 3}
              />
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.20) 60%, transparent 100%)', transition: 'background 0.3s ease' }} className="cat-overlay" />
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 24px 28px' }}>
                <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 11, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 6 }}>
                  {cat.french}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 22, color: '#ffffff', lineHeight: 1.1, marginBottom: 6 }} className="cat-english">
                  {cat.english}
                </div>
                <div style={{ width: 0, height: 1, background: '#fff', transition: 'width 0.3s ease', marginBottom: 8 }} className="cat-underline" />
                <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em' }}>
                  {cat.tagline}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION 4: FEATURED ARTICLE */}
      <section style={{ background: '#ffffff', padding: '80px 56px' }} className="featured-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#aaa', marginBottom: 28 }}>
            This week in L&apos;Échelon
          </p>
          {featuredArticle ? (
            <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', gap: 0 }} className="featured-grid">
              <div style={{ position: 'relative', height: 560, background: '#E8E5E0', overflow: 'hidden' }}>
                {featuredArticle.cover_image ? (
                  <Image src={featuredArticle.cover_image.url} alt={featuredArticle.title} fill style={{ objectFit: 'cover' }} priority />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#E8E5E0' }} />
                )}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 56 }}>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 16 }}>
                  Cover Story · {featuredArticle.category?.french_name ?? "L'Échelon"}
                </p>
                <h2
                  style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(32px, 3.5vw, 52px)', color: '#111', lineHeight: 1.05, maxWidth: 420, marginBottom: 20 }}
                  dangerouslySetInnerHTML={{ __html: featuredArticle.title }}
                />
                {featuredArticle.excerpt && (
                  <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 14, color: '#666', lineHeight: 1.75, maxWidth: 360, marginBottom: 20 }}>
                    {featuredArticle.excerpt}
                  </p>
                )}
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24 }}>
                  By {featuredArticle.author?.name ?? "L'Échelon"} · {featuredArticle.read_time ?? 5} min read · {featuredArticle.is_premium ? 'Members' : 'Free'}
                </p>
                <Link href={`/article/${featuredArticle.slug}`} style={{
                  fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 17, color: '#111',
                  borderBottom: '1px solid #333', paddingBottom: 3, width: 'fit-content',
                  textDecoration: 'none', transition: 'letter-spacing 0.2s',
                }}
                  onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.letterSpacing = '0.02em' }}
                  onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.letterSpacing = '0' }}
                >
                  Read the cover story
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ height: 380, background: '#F8F7F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#bbb', letterSpacing: '0.14em' }}>Cover story will appear here once connected to Strapi.</p>
            </div>
          )}
        </div>
      </section>

      {/* SECTION 5: LATEST ARTICLES GRID */}
      <section style={{ background: '#F8F7F5', padding: '64px 56px' }} className="articles-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#aaa', letterSpacing: '0.30em', textTransform: 'uppercase', marginBottom: 12 }}>
            Latest from L&apos;Échelon
          </h2>
          <div style={{ height: 1, background: '#E2DED8', marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="articles-grid">
            {(articles.length > 0 ? articles.slice(0, 6) : Array(3).fill(null)).map((article, i) => (
              <ArticleCardHP key={article?.id ?? i} article={article} />
            ))}
          </div>
          <div style={{ height: 1, background: '#E2DED8', margin: '48px 0 32px' }} />
          <div style={{ textAlign: 'center' }}>
            <Link href="/category/la-mode" style={{
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 16, color: '#444',
              borderBottom: '1px solid #ccc', paddingBottom: 3, textDecoration: 'none', transition: 'color 0.2s, border-color 0.2s',
            }}
              onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#111'; el.style.borderBottomColor = '#111' }}
              onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#444'; el.style.borderBottomColor = '#ccc' }}
            >
              View all articles
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: L'ÉCHELON INDEX — 3D scroll-reveal */}
      <section
        ref={indexRef}
        style={{ background: '#111111', padding: '64px 56px' }}
        className="index-section"
      >
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 48, color: '#ffffff', letterSpacing: '0.04em', marginBottom: 8 }}>
            L&apos;Échelon Index
          </h2>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.10em', marginBottom: 20 }}>
            Live intelligence across the five pillars of luxury
          </p>
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.15)', marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', perspective: '800px' }} className="index-grid">
            {(indexData.length > 0 ? indexData.slice(0, 5) : CATEGORY_CONFIG.map((c, i) => ({
              id: i, label: c.french, value: '· · ·', sub: c.english, change: '', is_premium: true, category: c.slug,
            }))).map((item, i) => (
              <div
                key={item.id}
                style={{
                  padding: '0 32px',
                  borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none',
                  opacity: indexVisible ? 1 : 0,
                  transform: indexVisible
                    ? 'none'
                    : `perspective(600px) rotateY(${i % 2 === 0 ? '-' : ''}18deg) translateY(32px) scale(0.93)`,
                  transition: `opacity 0.65s ease ${i * 0.13}s, transform 0.65s ease ${i * 0.13}s`,
                  transformOrigin: 'bottom center',
                }}
              >
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
                  {item.label}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 36, color: item.is_premium ? 'rgba(255,255,255,0.20)' : '#ffffff', lineHeight: 1, marginBottom: 6 }}>
                  {item.is_premium ? '· · ·' : item.value}
                </div>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.10em', marginBottom: 6 }}>
                  {item.sub}
                </div>
                {item.change && (
                  <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: item.change.startsWith('↑') ? '#6FCF97' : item.change.startsWith('↓') ? '#EB5757' : 'rgba(255,255,255,0.30)' }}>
                    {item.change}
                  </div>
                )}
              </div>
            ))}
          </div>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', margin: '40px 0 0' }} />
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: 32, flexWrap: 'wrap', gap: 20 }} className="index-footer">
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.40)' }}>
              Full intelligence access for members.
            </p>
            <Link href="/intelligence" style={{
              background: '#ffffff', color: '#111111',
              fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
              padding: '12px 28px', textDecoration: 'none', borderRadius: 0,
              transition: 'background 0.2s',
            }}
              onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8E5E0' }}
              onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#ffffff' }}
            >
              Unlock Intelligence
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 7: ABOUT STRIP */}
      <section style={{ background: '#ffffff', padding: '80px 56px' }} className="about-strip">
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'center' }} className="about-strip-grid">
          <div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 13, color: '#aaa', letterSpacing: '0.10em', marginBottom: 16 }}>
              About L&apos;Échelon
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(28px, 3vw, 44px)', color: '#111', lineHeight: 1.1, maxWidth: 400, marginBottom: 24 }}>
              A publication built on the belief that luxury is not a price point. It is a standard of attention.
            </h2>
            <div style={{ width: 40, height: 1, background: '#E2DED8', marginBottom: 24 }} />
            <Link href="/about" style={{
              fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 16, color: '#555',
              borderBottom: '1px solid #ccc', paddingBottom: 3, textDecoration: 'none', cursor: 'pointer',
              transition: 'color 0.2s, border-color 0.2s',
            }}
              onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#111'; el.style.borderBottomColor = '#333' }}
              onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#555'; el.style.borderBottomColor = '#ccc' }}
            >
              Read our story
            </Link>
          </div>
          <div>
            <blockquote style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(22px, 2.5vw, 36px)', color: '#111', lineHeight: 1.25, maxWidth: 480, margin: 0 }}>
              &ldquo;A publication for those who move between paddocks, polo fields, and Paris ateliers with equal fluency. Five pillars. One sensibility.&rdquo;
            </blockquote>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.20em', textTransform: 'uppercase', marginTop: 20 }}>
              L&apos;Échelon · Est. 2026
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 7.5: FAQ */}
      <section style={{ background: '#F8F7F5', padding: '64px 56px' }} className="faq-section">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 32 }}>
            Frequently Asked
          </p>
          {[
            { q: "What is L'Échelon?", a: "L'Échelon is a luxury editorial intelligence platform covering five pillars: haute couture fashion, Formula One motorsport, luxury watches, equestrian sports, and ultra-luxury lifestyle. Published twice monthly." },
            { q: "What does L'Échelon cover?", a: "La Mode (fashion and couture), La Vitesse (Formula One and motorsport), L'Horlogerie (luxury watches), L'Équitation (polo and equestrian), and L'Art de Vivre (superyacht lifestyle and ultra-luxury)." },
            { q: "How do I subscribe?", a: "L'Échelon offers a free tier with newsletter access and a members tier at $12/month or $99/year. Members receive full site access, the complete L'Échelon Index, and all premium articles." },
            { q: "What is the L'Échelon Index?", a: "A live intelligence dashboard tracking performance metrics across the five luxury pillars: fashion social reach, watch auction results, F1 sponsor spend, and more. Full access for members." },
          ].map((item, i) => (
            <div key={i} style={{ borderBottom: '1px solid #E2DED8', padding: '24px 0' }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 20, color: '#111', marginBottom: 10 }}>{item.q}</p>
              <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#666', lineHeight: 1.7 }}>{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 8: NEWSLETTER CAPTURE */}
      <section style={{ background: '#0A0A0A', padding: '80px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 600, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 11, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 20 }}>
            The Intelligence of Luxury
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(36px, 4vw, 56px)', color: '#ffffff', letterSpacing: '0.04em', marginBottom: 8 }}>
            L&apos;Échelon
          </h2>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', lineHeight: 1.65, marginBottom: 36 }}>
            Twice monthly. Five pillars. No noise.
          </p>
          {emailStatus === 'done' ? (
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 18, color: 'rgba(255,255,255,0.60)' }}>
              Thank you. You&apos;ll hear from us soon.
            </p>
          ) : (
            <form onSubmit={handleNewsletter} style={{ display: 'flex', alignItems: 'center', gap: 16 }} className="newsletter-form">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  flex: 1, background: 'transparent', border: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.25)',
                  color: '#fff', fontFamily: 'Lato, sans-serif', fontSize: 12,
                  padding: '12px 0', outline: 'none', borderRadius: 0,
                }}
                onFocus={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.70)' }}
                onBlur={(e) => { (e.currentTarget as HTMLElement).style.borderBottomColor = 'rgba(255,255,255,0.25)' }}
              />
              <button
                type="submit"
                disabled={emailStatus === 'sending'}
                style={{
                  background: '#fff', color: '#111', fontFamily: 'Lato, sans-serif', fontSize: 9,
                  letterSpacing: '0.22em', textTransform: 'uppercase', padding: '12px 24px',
                  border: 'none', borderRadius: 0, cursor: 'pointer', flexShrink: 0,
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = '#E8E5E0' }}
                onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = '#fff' }}
              >
                {emailStatus === 'sending' ? '...' : 'Subscribe'}
              </button>
            </form>
          )}
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.20)', marginTop: 16 }}>
            No spam. Unsubscribe at any time.
          </p>
        </div>
      </section>

      <style>{`
        .cat-grid-hp { height: 420px; }
        .cat-cell:hover .cat-overlay { background: linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.30) 60%, transparent 100%) !important; }
        .cat-cell:hover img { transform: scale(1.03); }
        .cat-cell:hover .cat-underline { width: 32px !important; }
        @media (max-width: 1024px) {
          .cat-grid-hp { grid-template-columns: repeat(3, 1fr) !important; height: auto !important; }
          .cat-cell { height: 280px; display: block; }
        }
        @media (max-width: 768px) {
          .cat-grid-hp { grid-template-columns: 1fr !important; }
          .cat-cell { height: 260px; display: block; }
          .featured-grid { grid-template-columns: 1fr !important; }
          .featured-section { padding: 48px 20px !important; }
          .articles-section { padding: 48px 20px !important; }
          .articles-grid { grid-template-columns: 1fr !important; }
          .index-section { padding: 48px 20px !important; }
          .index-grid { grid-template-columns: 1fr !important; }
          .index-grid > div { border-left: none !important; border-top: 1px solid rgba(255,255,255,0.08); padding: 20px 0 !important; }
          .about-strip { padding: 48px 20px !important; }
          .about-strip-grid { grid-template-columns: 1fr !important; }
          .faq-section { padding: 48px 20px !important; }
          .newsletter-form { flex-direction: column !important; }
          .ticker-bar { padding: 0 20px !important; }
        }
      `}</style>
    </>
  )
}

function ArticleCardHP({ article }: { article: Article | null }) {
  if (!article) {
    return (
      <div style={{ background: '#fff' }}>
        <div style={{ width: '100%', height: 220, background: '#E8E5E0' }} />
        <div style={{ padding: '20px 0 0' }}>
          <div style={{ width: 80, height: 8, background: '#E8E5E0', marginBottom: 10 }} />
          <div style={{ width: '90%', height: 12, background: '#F0EDE8', marginBottom: 6 }} />
          <div style={{ width: '70%', height: 12, background: '#F0EDE8' }} />
        </div>
      </div>
    )
  }
  return (
    <div style={{ background: '#fff' }}>
      <Link href={`/article/${article.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
        <div style={{ position: 'relative', width: '100%', height: 220, background: '#E8E5E0', overflow: 'hidden' }}>
          {article.cover_image && (
            <Image src={article.cover_image.url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
          )}
        </div>
        <div style={{ padding: '20px 0 0' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
            {article.category?.french_name ?? "L'Échelon"}
          </p>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 20, color: '#111', lineHeight: 1.15, marginBottom: 12, transition: 'color 0.2s', cursor: 'pointer' }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.color = '#333' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.color = '#111' }}
          >
            {article.title}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#bbb', letterSpacing: '0.12em' }}>
              By {article.author?.name ?? "L'Échelon"} · {article.read_time ?? 5} min
            </span>
            <span style={{
              fontFamily: 'Lato, sans-serif', fontSize: 7,
              ...(article.is_premium
                ? { background: '#111', color: '#fff', padding: '2px 8px' }
                : { border: '1px solid #ccc', color: '#aaa', padding: '2px 8px' }),
            }}>
              {article.is_premium ? 'Members' : 'Free'}
            </span>
          </div>
        </div>
      </Link>
    </div>
  )
}

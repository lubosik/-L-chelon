'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/strapi'
import { getCoverImage } from '@/lib/categoryImages'

const CATEGORIES = [
  { label: 'ALL', slug: '' },
  { label: 'LA MODE', slug: 'la-mode' },
  { label: 'LA VITESSE', slug: 'la-vitesse' },
  { label: "L'HORLOGERIE", slug: 'lhorlogerie' },
  { label: "L'ÉQUITATION", slug: 'lequitation' },
  { label: "L'ART DE VIVRE", slug: 'lart-de-vivre' },
]

function formatDate(str?: string) {
  if (!str) return ''
  try {
    return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  } catch { return '' }
}

export default function ArticlesPage() {
  const [activeCategory, setActiveCategory] = useState('')
  const [displayed, setDisplayed] = useState<Article[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [start, setStart] = useState(0)
  const LIMIT = 10

  async function load(category: string, offset: number, append = false) {
    const qs = new URLSearchParams()
    qs.set('limit', String(LIMIT))
    qs.set('start', String(offset))
    if (category) qs.set('category', category)
    try {
      const res = await fetch(`/api/articles?${qs}`)
      const data = await res.json()
      const strapiBase = process.env.NEXT_PUBLIC_STRAPI_URL || ''
      const normalise = (item: Record<string, unknown>): Article => {
        const out = { ...item }
        if (!out.published_at && out.publishedAt) out.published_at = out.publishedAt
        if (out.cover_image && typeof out.cover_image === 'object') {
          const img = out.cover_image as { url?: string }
          if (img.url && !img.url.startsWith('http') && strapiBase) {
            out.cover_image = { ...img, url: `${strapiBase}${img.url}` }
          }
        }
        return out as unknown as Article
      }
      const articles = (data?.data ?? []).map((a: Record<string, unknown>) => normalise(a)) as Article[]
      const tot = data?.meta?.pagination?.total ?? 0
      if (append) {
        setDisplayed(prev => [...prev, ...articles])
      } else {
        setDisplayed(articles)
      }
      setTotal(tot)
    } catch { /* Strapi offline */ }
  }

  useEffect(() => {
    setLoading(true)
    setStart(0)
    load(activeCategory, 0).finally(() => setLoading(false))
  }, [activeCategory]) // eslint-disable-line

  async function handleLoadMore() {
    const next = start + LIMIT
    setLoadingMore(true)
    await load(activeCategory, next, true)
    setStart(next)
    setLoadingMore(false)
  }

  const featured = displayed[0] ?? null
  const rest = displayed.slice(1)
  const hasMore = displayed.length < total

  return (
    <>
      {/* PAGE HEADER */}
      <div style={{ background: '#ffffff', paddingTop: 64, paddingBottom: 0, textAlign: 'center' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 56px' }} className="articles-header-pad">
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>
            The Archive
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 'clamp(40px, 7vw, 88px)', color: '#111',
            lineHeight: 0.92, letterSpacing: '0.02em', marginBottom: 20,
          }}>
            All Stories
          </h1>
          <div style={{ width: 60, height: 1, background: '#E2DED8', margin: '0 auto' }} />
        </div>
      </div>

      {/* CATEGORY FILTER STRIP */}
      <div style={{ background: '#ffffff', borderTop: '1px solid #E2DED8', borderBottom: '1px solid #E2DED8', position: 'sticky', top: 56, zIndex: 50 }}>
        <div style={{
          maxWidth: 1200, margin: '0 auto', padding: '0 56px',
          display: 'flex', overflowX: 'auto', scrollbarWidth: 'none',
          WebkitOverflowScrolling: 'touch',
        } as React.CSSProperties} className="filter-strip">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.slug}
              onClick={() => setActiveCategory(cat.slug)}
              style={{
                fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.20em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                color: activeCategory === cat.slug ? '#111' : '#888',
                background: 'transparent', border: 'none', cursor: 'pointer',
                padding: '16px 24px',
                borderBottom: `2px solid ${activeCategory === cat.slug ? '#111' : 'transparent'}`,
                transition: 'color 0.2s, border-color 0.2s',
                flexShrink: 0,
              }}
              onMouseEnter={(e) => { if (activeCategory !== cat.slug) (e.currentTarget as HTMLElement).style.color = '#555' }}
              onMouseLeave={(e) => { if (activeCategory !== cat.slug) (e.currentTarget as HTMLElement).style.color = '#888' }}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div style={{ background: '#ffffff', minHeight: '60vh' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 56px' }} className="articles-body-pad">

          {/* Article count */}
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#bbb', letterSpacing: '0.14em', padding: '24px 0', margin: 0 }}>
            {loading ? 'Loading...' : `Showing ${displayed.length} of ${total} ${total === 1 ? 'story' : 'stories'}`}
          </p>

          {!loading && displayed.length === 0 && (
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 18, color: '#bbb', padding: '40px 0' }}>
              No stories in this category yet.
            </p>
          )}

          {/* FEATURED ARTICLE */}
          {!loading && featured && (
            <div style={{ borderBottom: '1px solid #E2DED8', paddingBottom: 56, marginBottom: 56 }}>
              <Link href={`/article/${featured.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: 0 }} className="featured-art-grid">
                  {/* Image */}
                  <div className="featured-art-img" style={{ position: 'relative', height: 480, background: '#E8E5E0', overflow: 'hidden' }}>
                    {(() => { const src = getCoverImage(featured); return src ? (
                      <Image src={src} alt={featured.title} fill style={{ objectFit: 'cover' }} priority sizes="(max-width:768px) 100vw, 55vw" />
                    ) : (
                      <div style={{ position: 'absolute', inset: 0, background: '#E8E5E0' }} />
                    ); })()}
                  </div>
                  {/* Text */}
                  <div className="featured-art-body" style={{ padding: 48, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
                      / {featured.category?.french_name ?? "L'Échelon"}
                    </p>
                    <h2 style={{
                      fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
                      fontSize: 'clamp(24px, 3vw, 44px)', color: '#111',
                      lineHeight: 1.05, textTransform: 'uppercase', marginBottom: 12,
                    }}>
                      {featured.title}
                    </h2>
                    {featured.excerpt && (
                      <p style={{
                        fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 14, color: '#666',
                        lineHeight: 1.75, marginTop: 12, marginBottom: 0,
                        display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                      } as React.CSSProperties}>
                        {featured.excerpt}
                      </p>
                    )}
                    {/* Meta */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 20, flexWrap: 'wrap' }}>
                      <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa' }}>
                        {formatDate(featured.published_at)}
                      </span>
                      <span style={{ color: '#ddd' }}>·</span>
                      <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa' }}>
                        By {featured.author?.name ?? "L'Échelon"}
                      </span>
                      <span style={{ color: '#ddd' }}>·</span>
                      <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa' }}>
                        {featured.read_time ?? 5} min read
                      </span>
                    </div>
                    <div style={{ marginTop: 8 }}>
                      <span style={{
                        fontFamily: 'Lato, sans-serif', fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase',
                        ...(featured.is_premium
                          ? { background: '#111', color: '#fff', padding: '3px 9px', display: 'inline-block' }
                          : { border: '1px solid #ccc', color: '#aaa', padding: '3px 9px', display: 'inline-block' }),
                      }}>
                        {featured.is_premium ? 'Members' : 'Free'}
                      </span>
                    </div>
                    {/* CTA */}
                    <div style={{ marginTop: 24 }}>
                      <span style={{
                        display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                        background: '#111', color: '#fff',
                        fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase',
                        padding: '14px 28px', borderRadius: 0, minHeight: 48,
                      }} className="featured-cta">
                        Read the story
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          )}

          {/* ARTICLE LIST */}
          <div>
            {rest.map((article) => (
              <ArticleListItem key={article.id} article={article} />
            ))}
          </div>

          {/* LOAD MORE */}
          {hasMore && (
            <div style={{ textAlign: 'center', padding: '40px 0 64px' }}>
              <button
                onClick={handleLoadMore}
                disabled={loadingMore}
                style={{
                  fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 16, color: '#555',
                  paddingBottom: 3, background: 'none', border: 'none',
                  borderBottom: '1px solid #ccc', cursor: 'pointer', minHeight: 48,
                  display: 'inline-flex', alignItems: 'flex-end',
                } as React.CSSProperties}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = '#111' }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = '#555' }}
              >
                {loadingMore ? 'Loading...' : 'Load more stories'}
              </button>
            </div>
          )}

          {!hasMore && displayed.length > 0 && (
            <div style={{ padding: '40px 0 64px', textAlign: 'center' }}>
              <div style={{ width: 40, height: 1, background: '#E2DED8', margin: '0 auto' }} />
            </div>
          )}

        </div>
      </div>

      <style>{`
        .filter-strip::-webkit-scrollbar { display: none; }
        @media (max-width: 768px) {
          .articles-header-pad { padding: 0 24px !important; }
          .articles-body-pad { padding: 0 24px !important; }
          .filter-strip { padding: 0 24px !important; }
          .filter-strip button { padding: 14px 18px !important; font-size: 8px !important; }
          .featured-art-grid { grid-template-columns: 1fr !important; }
          .featured-art-img { height: 60vw !important; }
          .featured-art-body { padding: 24px 0 !important; }
          .featured-cta { width: 100% !important; }
        }
      `}</style>
    </>
  )
}

function ArticleListItem({ article }: { article: Article }) {
  function formatDate(str?: string) {
    if (!str) return ''
    try { return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
  }

  return (
    <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div
        style={{
          display: 'flex', flexDirection: 'row', alignItems: 'flex-start', gap: 0,
          borderBottom: '1px solid #F0EDE8', padding: '28px 0', cursor: 'pointer',
          transition: 'background 0.15s',
        }}
        className="art-list-item"
        onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = '#FAFAF9' }}
        onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
      >
        {/* Thumbnail */}
        <div className="art-list-thumb" style={{ position: 'relative', width: 280, height: 190, flexShrink: 0, background: '#E8E5E0', overflow: 'hidden' }}>
          {(() => { const src = getCoverImage(article); return src ? (
            <Image src={src} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 120px, 280px" />
          ) : (
            <div style={{ position: 'absolute', inset: 0, background: '#E8E5E0' }} />
          ); })()}
        </div>
        {/* Details */}
        <div className="art-list-body" style={{ paddingLeft: 28, flex: 1 }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
            / {article.category?.french_name ?? "L'Échelon"}
          </p>
          <h3 className="art-list-title" style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 22, color: '#111', lineHeight: 1.1, textTransform: 'uppercase',
            transition: 'color 0.2s', marginBottom: 8,
          }}>
            {article.title}
          </h3>
          {article.excerpt && (
            <p className="art-list-deck" style={{
              fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#888',
              lineHeight: 1.65, marginTop: 8,
              display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
            } as React.CSSProperties}>
              {article.excerpt}
            </p>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#bbb' }}>{formatDate(article.published_at)}</span>
            <span style={{ color: '#e0e0e0' }}>·</span>
            <span className="art-list-author" style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#bbb' }}>By {article.author?.name ?? "L'Échelon"}</span>
            <span style={{ color: '#e0e0e0' }}>·</span>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#bbb' }}>{article.read_time ?? 5} min</span>
            {article.is_premium && (
              <>
                <span style={{ color: '#e0e0e0' }}>·</span>
                <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, letterSpacing: '0.14em', textTransform: 'uppercase', background: '#111', color: '#fff', padding: '2px 8px' }}>
                  Members
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      <style>{`
        .art-list-item:hover .art-list-title { color: #333 !important; }
        @media (max-width: 768px) {
          .art-list-thumb { width: 120px !important; height: 90px !important; }
          .art-list-body { padding-left: 16px !important; }
          .art-list-title { font-size: 17px !important; }
          .art-list-deck { display: none !important; }
          .art-list-author { display: none !important; }
        }
      `}</style>
    </Link>
  )
}

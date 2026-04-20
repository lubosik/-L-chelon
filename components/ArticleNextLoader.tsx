'use client'

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import type { Article } from '@/lib/strapi'
import { getCoverImage } from '@/lib/categoryImages'
import { renderBody, clean } from '@/lib/richText'
import ArticleNewsletterForm from './ArticleNewsletterForm'

interface Props {
  seenSlugs: string[]
  categorySlug?: string
  categoryName?: string
  showNewsletter?: boolean
}

const STRAPI_BASE = process.env.NEXT_PUBLIC_STRAPI_URL || ''

function normalise(item: Record<string, unknown>): Article {
  const out = { ...item }
  if (!out.published_at && out.publishedAt) out.published_at = out.publishedAt
  if (out.cover_image && typeof out.cover_image === 'object') {
    const img = out.cover_image as { url?: string }
    if (img.url && !img.url.startsWith('http') && STRAPI_BASE) {
      out.cover_image = { ...img, url: `${STRAPI_BASE}${img.url}` }
    }
  }
  return out as unknown as Article
}

async function apiFetch(qs: URLSearchParams): Promise<Article[]> {
  try {
    const res = await fetch(`/api/articles?${qs}`)
    if (!res.ok) return []
    const data = await res.json()
    return ((data?.data ?? []) as Record<string, unknown>[]).map(normalise)
  } catch { return [] }
}

async function fetchNext(seenSlugs: string[], categorySlug?: string): Promise<Article | null> {
  if (categorySlug) {
    const articles = await apiFetch(new URLSearchParams({ limit: '10', category: categorySlug }))
    const found = articles.find(a => !seenSlugs.includes(a.slug))
    if (found) return found
  }
  const articles = await apiFetch(new URLSearchParams({ limit: '20' }))
  return articles.find(a => !seenSlugs.includes(a.slug)) ?? null
}

async function fetchSidebar(excludeSlugs: string[]): Promise<Article[]> {
  const articles = await apiFetch(new URLSearchParams({ limit: '20' }))
  return articles.filter(a => !excludeSlugs.includes(a.slug)).slice(0, 5)
}

async function fetchRelated(categorySlug: string, excludeSlugs: string[]): Promise<Article[]> {
  const articles = await apiFetch(new URLSearchParams({ limit: '10', category: categorySlug }))
  return articles.filter(a => !excludeSlugs.includes(a.slug)).slice(0, 5)
}

function formatDate(str?: string) {
  if (!str) return ''
  try { return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}

function SidebarCard({ article }: { article: Article }) {
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #F5F3F0', marginBottom: 16, textDecoration: 'none' }}>
      <div style={{ width: 72, height: 60, flexShrink: 0, background: '#E8E5E0', overflow: 'hidden', position: 'relative' }}>
        {imgSrc && <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="72px" />}
      </div>
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {article.category && (
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#bbb', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 3 }}>
            {article.category.french_name}
          </p>
        )}
        <p style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 13, color: '#333', lineHeight: 1.25,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>
          {clean(article.title)}
        </p>
        {article.published_at && (
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#bbb', marginTop: 4 }}>
            {formatDate(article.published_at)}
          </p>
        )}
      </div>
    </Link>
  )
}

function RelatedCard({ article }: { article: Article }) {
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ minWidth: 240, maxWidth: 240, flexShrink: 0, scrollSnapAlign: 'start', textDecoration: 'none', display: 'block' }} className="nxt-related-card-width">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/2', background: '#E8E5E0', overflow: 'hidden', marginBottom: 14 }}>
        {imgSrc && <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 70vw, 240px" />}
      </div>
      {article.category && (
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: 6 }}>
          {article.category.french_name}
        </p>
      )}
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 16, color: '#111', lineHeight: 1.2, textTransform: 'uppercase', marginBottom: 6 }}>
        {clean(article.title)}
      </h3>
      {article.read_time && (
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#bbb' }}>{article.read_time} min read</p>
      )}
    </Link>
  )
}

export default function ArticleNextLoader({ seenSlugs, categorySlug, categoryName, showNewsletter = true }: Props) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)
  const [triggered, setTriggered] = useState(false)
  const [sidebarArticles, setSidebarArticles] = useState<Article[]>([])
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([])
  const sentinelRef = useRef<HTMLDivElement>(null)
  const articleRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (triggered) return
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !triggered) {
        setTriggered(true)
        setLoading(true)
        fetchNext(seenSlugs, categorySlug)
          .then(a => { setArticle(a); setLoading(false) })
          .catch(() => setLoading(false))
      }
    }, { rootMargin: '300px' })
    obs.observe(el)
    return () => obs.disconnect()
  }, [triggered, seenSlugs, categorySlug])

  // Fetch sidebar + related once article is known
  useEffect(() => {
    if (!article) return
    const allSeen = [...seenSlugs, article.slug]
    fetchSidebar(allSeen).then(setSidebarArticles)
    if (article.category?.slug) {
      fetchRelated(article.category.slug, allSeen).then(setRelatedArticles)
    }
  }, [article]) // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!article) return
    const el = articleRef.current
    if (!el) return
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        window.history.replaceState(null, '', `/article/${article.slug}`)
        document.title = `${article.title} | L'Échelon`
      }
    }, { threshold: 0.3 })
    obs.observe(el)
    return () => obs.disconnect()
  }, [article])

  const imgSrc = article ? getCoverImage(article) : null
  const bodyBlocks = article ? renderBody(article.body, STRAPI_BASE) : []
  const nextSeenSlugs = article ? [...seenSlugs, article.slug] : seenSlugs

  // Detect category change
  const isCategoryChange = article && article.category?.slug && article.category.slug !== categorySlug

  return (
    <div>
      <div ref={sentinelRef} style={{ height: 1 }} />

      {loading && (
        <div style={{ padding: '48px', textAlign: 'center', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: '#bbb' }}>
          Loading next story...
        </div>
      )}

      {article && (
        <div ref={articleRef}>
          {/* Section separator — prominent if new category, subtle if same */}
          {isCategoryChange ? (
            <div style={{ background: '#0A0A0A', padding: '28px 56px', display: 'flex', alignItems: 'center', gap: 20 }} className="next-sep-pad">
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 6 }}>
                  Now entering
                </p>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 22, color: '#fff', letterSpacing: '0.08em', margin: 0 }}>
                  {article.category?.french_name}
                </p>
              </div>
              <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
            </div>
          ) : (
            <div style={{ background: '#F8F7F5', padding: '24px 56px', display: 'flex', alignItems: 'center', gap: 16 }} className="next-sep-pad">
              <div style={{ flex: 1, height: 1, background: '#E2DED8' }} />
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#aaa', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
                Next from {article.category?.french_name ?? categoryName ?? "L'Échelon"}
              </span>
              <div style={{ flex: 1, height: 1, background: '#E2DED8' }} />
            </div>
          )}

          {/* Mini-hero */}
          <div style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A' }} className="next-art-hero">
            {imgSrc && (
              <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover', objectPosition: 'center' }} sizes="100vw" />
            )}
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,0.95) 0%, rgba(8,8,8,0.45) 45%, rgba(8,8,8,0.15) 100%)' }} />
            <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block', position: 'absolute', inset: 0, zIndex: 10 }}>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 56px 32px' }} className="next-hero-text">
                {article.category && (
                  <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 10 }}>
                    {article.category.french_name}
                  </p>
                )}
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(24px, 3.5vw, 44px)', color: '#fff', lineHeight: 1.0, margin: '0 0 8px' }}>
                  {clean(article.title)}
                </h2>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.50)', margin: 0 }}>
                  Continue reading ↓
                </p>
              </div>
            </Link>
          </div>

          {/* Article body */}
          <div style={{ background: '#ffffff' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex' }} className="next-art-wrap">
              <div className="next-art-body" style={{ flex: 1, padding: '56px 56px 80px', minWidth: 0, borderRight: '1px solid #E2DED8' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
                  {article.category && (
                    <Link href={`/category/${article.category.slug}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#999', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none' }}>
                      {article.category.french_name}
                    </Link>
                  )}
                </div>
                <hr style={{ border: 'none', borderTop: '1px solid #E2DED8', marginBottom: 40 }} />

                <div className="article-body">
                  {article.is_premium ? (
                    <>
                      {article.excerpt && (
                        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400, fontSize: 18, color: '#222', lineHeight: 1.80, marginBottom: 24 }}>
                          {clean(article.excerpt)}
                        </p>
                      )}
                      <div style={{ paddingTop: 32, borderTop: '1px solid #E2DED8', textAlign: 'center' }}>
                        <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 24, color: '#111', marginBottom: 12 }}>
                          Continue reading with L&apos;Échelon
                        </h3>
                        <Link href={`/article/${article.slug}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#fff', background: '#111', padding: '12px 28px', textDecoration: 'none', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'inline-block' }}>
                          Read full article
                        </Link>
                      </div>
                    </>
                  ) : (
                    <>
                      {article.excerpt && (
                        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400, fontSize: 18, color: '#222', lineHeight: 1.80, marginBottom: 28 }}>
                          {article.excerpt}
                        </p>
                      )}
                      {bodyBlocks.length > 0 ? bodyBlocks : (
                        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 16, color: '#bbb', lineHeight: 1.8 }}>
                          Full article coming soon in Strapi.
                        </p>
                      )}
                    </>
                  )}
                </div>

                {!article.is_premium && (
                  <div style={{ marginTop: 48 }}>
                    <div style={{ width: 40, height: 1, background: '#E2DED8', margin: '0 auto 32px' }} />
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center', marginBottom: 6 }}>
                      Written by {article.author?.name ?? "L'Échelon"}
                    </p>
                    {article.published_at && (
                      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.16em', textTransform: 'uppercase', textAlign: 'center' }}>
                        Published {formatDate(article.published_at)}{article.category ? ` in ${article.category.french_name}` : ''}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {/* Desktop sidebar — latest stories */}
              <div className="next-art-sidebar" style={{ width: 280, flexShrink: 0, padding: '56px 0 0 40px', position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', alignSelf: 'flex-start' }}>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.24em', textTransform: 'uppercase', borderBottom: '1px solid #E2DED8', paddingBottom: 12, marginBottom: 20 }}>
                  Latest stories
                </p>
                {sidebarArticles.length > 0 ? (
                  sidebarArticles.map(a => <SidebarCard key={a.id} article={a} />)
                ) : (
                  Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #F5F3F0', marginBottom: 16 }}>
                      <div style={{ width: 72, height: 60, background: '#F0EDE8', flexShrink: 0 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ width: '60%', height: 8, background: '#F0EDE8', marginBottom: 6 }} />
                        <div style={{ width: '90%', height: 8, background: '#F0EDE8', marginBottom: 4 }} />
                        <div style={{ width: '70%', height: 8, background: '#F0EDE8' }} />
                      </div>
                    </div>
                  ))
                )}
                <ArticleNewsletterForm variant="sidebar" />
                <style>{`.next-art-sidebar::-webkit-scrollbar { width: 3px; } .next-art-sidebar::-webkit-scrollbar-thumb { background: #E2DED8; border-radius: 2px; }`}</style>
              </div>
            </div>
          </div>

          {/* Mobile newsletter — only first level */}
          {showNewsletter && (
            <div className="next-art-newsletter">
              <ArticleNewsletterForm variant="mobile" />
            </div>
          )}

          {/* Related articles strip */}
          {article.category && (
            <section style={{ background: '#F8F7F5', padding: '48px 56px' }} className="nxt-related-strip">
              <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 28 }}>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 24, color: '#111' }}>
                    More from {article.category.french_name}
                  </h2>
                  <Link href={`/category/${article.category.slug}`} style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#888', borderBottom: '1px solid #ddd', textDecoration: 'none', paddingBottom: 2 }}>
                    View all →
                  </Link>
                </div>
                <div style={{ display: 'flex', gap: 24, overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', paddingBottom: 8 } as React.CSSProperties} className="nxt-related-scroll">
                  {relatedArticles.length > 0 ? (
                    relatedArticles.map(a => <RelatedCard key={a.id} article={a} />)
                  ) : (
                    Array.from({ length: 4 }).map((_, i) => (
                      <div key={i} style={{ minWidth: 240, maxWidth: 240, flexShrink: 0 }} className="nxt-related-card-width">
                        <div style={{ width: '100%', aspectRatio: '3/2', background: '#E8E5E0', marginBottom: 14 }} />
                        <div style={{ width: '50%', height: 7, background: '#E8E5E0', marginBottom: 8 }} />
                        <div style={{ width: '90%', height: 12, background: '#E8E5E0', marginBottom: 5 }} />
                        <div style={{ width: '70%', height: 12, background: '#E8E5E0' }} />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </section>
          )}

          {/* Recurse */}
          <ArticleNextLoader
            seenSlugs={nextSeenSlugs}
            categorySlug={article.category?.slug}
            categoryName={article.category?.french_name}
            showNewsletter={false}
          />
        </div>
      )}

      <style>{`
        .next-art-hero { height: 42svh; min-height: 260px; }
        .next-sep-pad { padding-left: 56px !important; padding-right: 56px !important; }
        @media (max-width: 768px) {
          .next-sep-pad { padding-left: 20px !important; padding-right: 20px !important; }
          .next-art-hero { height: 42svh !important; }
          .next-hero-text { padding: 0 20px 28px !important; }
          .next-art-wrap { flex-direction: column !important; }
          .next-art-body { padding: 28px 20px 0 !important; border-right: none !important; }
          .next-art-sidebar { display: none !important; }
          .next-art-newsletter { display: block !important; }
          .nxt-related-strip { padding: 40px 24px !important; }
          .nxt-related-card-width { min-width: 70vw !important; max-width: 70vw !important; }
        }
        @media (min-width: 769px) {
          .next-art-newsletter { display: none !important; }
        }
        .nxt-related-scroll::-webkit-scrollbar { display: none; }
        .art-inline-img img { object-fit: cover; }
        @media (max-width: 768px) {
          .art-inline-img { margin-left: -20px !important; margin-right: -20px !important; width: calc(100% + 40px) !important; }
          .art-inline-img > div { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  )
}

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

async function fetchNext(seenSlugs: string[], categorySlug?: string): Promise<Article | null> {
  const tryFetch = async (qs: URLSearchParams): Promise<Article | null> => {
    try {
      const res = await fetch(`/api/articles?${qs}`)
      if (!res.ok) return null
      const data = await res.json()
      const articles = ((data?.data ?? []) as Record<string, unknown>[]).map(normalise)
      return articles.find(a => !seenSlugs.includes(a.slug)) ?? null
    } catch { return null }
  }
  if (categorySlug) {
    const found = await tryFetch(new URLSearchParams({ limit: '10', category: categorySlug }))
    if (found) return found
  }
  return tryFetch(new URLSearchParams({ limit: '20' }))
}

function formatDate(str?: string) {
  if (!str) return ''
  try { return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}

export default function ArticleNextLoader({ seenSlugs, categorySlug, categoryName, showNewsletter = true }: Props) {
  const [article, setArticle] = useState<Article | null>(null)
  const [loading, setLoading] = useState(false)
  const [triggered, setTriggered] = useState(false)
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
          {/* Section separator */}
          <div style={{ background: '#F8F7F5', padding: '24px 56px', display: 'flex', alignItems: 'center', gap: 16 }} className="next-sep-pad">
            <div style={{ flex: 1, height: 1, background: '#E2DED8' }} />
            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#aaa', letterSpacing: '0.08em', whiteSpace: 'nowrap' }}>
              Next from {article.category?.french_name ?? categoryName ?? "L'Échelon"}
            </span>
            <div style={{ flex: 1, height: 1, background: '#E2DED8' }} />
          </div>

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
              {/* Empty sidebar space to keep body column width consistent on desktop */}
              <div style={{ width: 280, flexShrink: 0 }} className="next-art-sidebar-spacer" />
            </div>
          </div>

          {/* Mobile newsletter — only first level */}
          {showNewsletter && (
            <div className="next-art-newsletter">
              <ArticleNewsletterForm variant="mobile" />
            </div>
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
          .next-art-sidebar-spacer { display: none !important; }
          .next-art-newsletter { display: block !important; }
        }
        @media (min-width: 769px) {
          .next-art-newsletter { display: none !important; }
        }
        .art-inline-img img { object-fit: cover; }
        @media (max-width: 768px) {
          .art-inline-img { margin-left: -20px !important; margin-right: -20px !important; width: calc(100% + 40px) !important; }
          .art-inline-img > div { border-radius: 0 !important; }
        }
      `}</style>
    </div>
  )
}

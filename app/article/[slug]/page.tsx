import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchArticleBySlug, fetchRelatedArticles, fetchRecentArticles } from '@/lib/strapi'
import type { Article } from '@/lib/strapi'
import { getCoverImage } from '@/lib/categoryImages'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)
  if (!article) return { title: "L'Échelon" }
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.cover_image ? [{ url: `/api/og?title=${encodeURIComponent(article.title)}&category=${encodeURIComponent(article.category?.french_name ?? '')}`, width: 1200, height: 630 }] : [],
    },
    alternates: { canonical: `https://lechelon.com/article/${slug}` },
  }
}

function formatDate(str?: string) {
  if (!str) return ''
  try { return new Date(str).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) } catch { return '' }
}

interface RichChild {
  type?: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  url?: string
  children?: RichChild[]
}

interface RichBlock {
  type: string
  level?: number
  format?: string
  image?: { url: string; alternativeText?: string; caption?: string; width?: number; height?: number }
  children?: RichChild[]
}

const STRAPI_URL_FOR_BODY = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || ''

function clean(s: string): string {
  return s.replace(/\s*—\s*/g, ' ').replace(/\s+/g, ' ').trim()
}

function resolveUrl(url: string) {
  if (!url) return url
  if (url.startsWith('http')) return url
  return `${STRAPI_URL_FOR_BODY}${url}`
}

function renderInline(children: RichChild[]): React.ReactNode {
  return children.map((child, ci) => {
    if (child.type === 'link') {
      return (
        <a key={ci} href={child.url} target="_blank" rel="noopener noreferrer"
          style={{ color: '#111', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {renderInline(child.children ?? [])}
        </a>
      )
    }
    let node: React.ReactNode = clean(child.text ?? '')
    if (child.bold) node = <strong key={`b${ci}`} style={{ fontWeight: 600 }}>{node}</strong>
    if (child.italic) node = <em key={`i${ci}`}>{node}</em>
    if (child.underline) node = <u key={`u${ci}`}>{node}</u>
    if (child.strikethrough) node = <s key={`s${ci}`}>{node}</s>
    if (child.code) node = <code key={`c${ci}`} style={{ fontFamily: 'monospace', background: '#F4F2EE', padding: '1px 5px', fontSize: 14, borderRadius: 2 }}>{node}</code>
    return <span key={ci}>{node}</span>
  })
}

function renderBody(body: unknown): React.ReactNode[] {
  if (!Array.isArray(body)) return []
  return (body as RichBlock[]).map((block, i) => {
    if (block.type === 'image' && block.image) {
      const src = resolveUrl(block.image.url)
      const credit = block.image.caption || block.image.alternativeText
      return (
        <figure key={i} style={{ margin: '40px 0', padding: 0 }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: block.image.width && block.image.height ? `${block.image.width}/${block.image.height}` : '16/9', background: '#E8E5E0', overflow: 'hidden' }}>
            <Image
              src={src}
              alt={block.image.alternativeText ?? ''}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 680px"
            />
          </div>
          {credit && (
            <figcaption style={{
              fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#aaa',
              letterSpacing: '0.10em', textTransform: 'uppercase',
              marginTop: 8, textAlign: 'right',
            }}>
              {credit}
            </figcaption>
          )}
        </figure>
      )
    }

    const children = block.children ?? []
    const text = children.map((c) => c.text ?? '').join('')

    if (block.type === 'heading') {
      const inline = renderInline(children)
      if (block.level === 1) return <h2 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#111', lineHeight: 1.1, margin: '44px 0 16px', textTransform: 'uppercase' }}>{inline}</h2>
      if (block.level === 2) return <h3 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#111', lineHeight: 1.1, margin: '36px 0 14px' }}>{inline}</h3>
      return <h4 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 20, color: '#333', lineHeight: 1.15, margin: '28px 0 12px' }}>{inline}</h4>
    }

    if (block.type === 'quote') {
      return (
        <blockquote key={i} style={{
          fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300,
          fontSize: 'clamp(20px, 2vw, 26px)', color: '#555', lineHeight: 1.45,
          borderLeft: '3px solid #E2DED8', paddingLeft: 24, margin: '36px 0',
        }}>
          {renderInline(children)}
        </blockquote>
      )
    }

    if (block.type === 'list') {
      const Tag = block.format === 'ordered' ? 'ol' : 'ul'
      return (
        <Tag key={i} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 17, color: '#444', lineHeight: 1.85, marginBottom: 22, paddingLeft: 24 }}>
          {children.map((item, li) => (
            <li key={li} style={{ marginBottom: 6 }}>{renderInline(item.children ?? [{ text: item.text }])}</li>
          ))}
        </Tag>
      )
    }

    if (block.type === 'code') {
      return (
        <pre key={i} style={{ fontFamily: 'monospace', background: '#F4F2EE', padding: '16px 20px', overflowX: 'auto', fontSize: 14, lineHeight: 1.6, margin: '28px 0', borderRadius: 2 }}>
          <code>{text}</code>
        </pre>
      )
    }

    if (!text.trim() && block.type === 'paragraph') return null

    return (
      <p key={i} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 17, color: '#444', lineHeight: 1.85, marginBottom: 22 }}>
        {renderInline(children)}
      </p>
    )
  }).filter(Boolean) as React.ReactNode[]
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)

  if (!article) {
    return (
      <div style={{ padding: '80px 56px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Lato, sans-serif', color: '#999', fontSize: 13 }}>Article not found.</p>
      </div>
    )
  }

  const related = article.category?.slug
    ? await fetchRelatedArticles(article.category.slug, slug)
    : await fetchRecentArticles({ limit: 3 }).then(a => a.filter(r => r.slug !== slug).slice(0, 3))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.cover_image?.url,
    'datePublished': article.published_at,
    'author': { '@type': 'Person', 'name': article.author?.name },
    'publisher': { '@type': 'NewsMediaOrganization', '@id': 'https://lechelon.com/#organization', 'name': "L'Échelon" },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://lechelon.com/article/${slug}` },
    'articleSection': article.category?.french_name,
    'isAccessibleForFree': !article.is_premium,
  }

  const bodyBlocks = renderBody(article.body)
  const hasBody = bodyBlocks.length > 0

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* ARTICLE HERO */}
      <div style={{ position: 'relative', height: '65vh', minHeight: 420, background: '#0A0A0A', overflow: 'hidden' }} className="art-hero">
        {article.cover_image ? (
          <Image src={article.cover_image.url} alt={article.title} fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
        ) : (
          <div style={{ position: 'absolute', inset: 0, background: '#1a1a1a' }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.5) 30%, rgba(8,8,8,0.15) 70%, transparent 100%)' }} />

        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 24, left: 56, zIndex: 20, display: 'flex', gap: 8, alignItems: 'center' }} className="art-breadcrumb">
          <Link href="/" style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
          <Link href="/articles" style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>Articles</Link>
          {article.category && (
            <>
              <span style={{ color: 'rgba(255,255,255,0.25)' }}>›</span>
              <Link href={`/category/${article.category.slug}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
                {article.category.french_name}
              </Link>
            </>
          )}
        </div>

        {/* Hero text */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 56px 48px', maxWidth: 860, zIndex: 10 }} className="art-hero-text">
          {article.category && (
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.28em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.50)', marginBottom: 12 }}>
              {article.category.french_name}{article.category.english_sub ? ` · ${article.category.english_sub}` : ''}
            </p>
          )}
          <h1
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(28px, 4vw, 60px)', color: '#fff', lineHeight: 0.95, marginBottom: 20, maxWidth: 720 }}
            dangerouslySetInnerHTML={{ __html: clean(article.title) }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>
              {formatDate(article.published_at)}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>
              By {article.author?.name ?? "L'Échelon"}
            </span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>
              {article.read_time ?? 5} min read
            </span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span style={{
              fontFamily: 'Lato, sans-serif', fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase',
              ...(article.is_premium
                ? { background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.80)', padding: '3px 8px' }
                : { color: 'rgba(255,255,255,0.45)' }),
            }}>
              {article.is_premium ? 'Members' : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* COVER IMAGE CREDIT */}
      {article.cover_image_credit && (
        <div style={{ background: '#ffffff', padding: '6px 56px 0' }} className="art-img-credit">
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#bbb', letterSpacing: '0.12em', textTransform: 'uppercase', textAlign: 'right', margin: 0 }}>
            Photo: {article.cover_image_credit}
          </p>
        </div>
      )}

      {/* ARTICLE LAYOUT: body + sidebar */}
      <div style={{ background: '#ffffff' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 280px' }} className="art-layout">

          {/* BODY */}
          <div className="art-body-col" style={{ padding: '56px 56px 80px 56px', borderRight: '1px solid #E2DED8' }}>
            {/* Kicker */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {article.category && (
                <Link href={`/category/${article.category.slug}`} style={{
                  fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#999', letterSpacing: '0.22em',
                  textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s',
                }}>
                  {article.category.french_name}
                </Link>
              )}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #E2DED8', marginBottom: 40 }} />

            {/* Article body */}
            <div className="article-body">
              {article.is_premium ? (
                <>
                  {/* Show excerpt as teaser, then gate */}
                  {article.excerpt && (
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400, fontSize: 18, color: '#222', lineHeight: 1.80, marginBottom: 24 }}>
                      {clean(article.excerpt)}
                    </p>
                  )}
                  {hasBody && (
                    <div style={{ position: 'relative' }}>
                      <div style={{ maxHeight: 260, overflow: 'hidden' }}>
                        {bodyBlocks.slice(0, 3)}
                      </div>
                      <div style={{ height: 200, marginTop: -200, position: 'relative', background: 'linear-gradient(to bottom, transparent 0%, #ffffff 80%)', zIndex: 1 }} />
                    </div>
                  )}
                  <PaywallSection />
                </>
              ) : (
                <>
                  {article.excerpt && (
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400, fontSize: 18, color: '#222', lineHeight: 1.80, marginBottom: 28 }}>
                      {article.excerpt}
                    </p>
                  )}
                  {hasBody ? bodyBlocks : (
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 16, color: '#bbb', lineHeight: 1.8 }}>
                      Full article body will appear here once Nani publishes the content in Strapi.
                    </p>
                  )}
                </>
              )}
            </div>

            {/* End divider + author credit */}
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

          {/* SIDEBAR — desktop only */}
          <div className="art-sidebar" style={{ padding: '56px 0 0 40px', position: 'sticky', top: 80, alignSelf: 'start', height: 'fit-content' }}>
            {related.length > 0 && (
              <>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 16 }}>
                  More from {article.category?.french_name ?? "L'Échelon"}
                </p>
                {related.map((a) => (
                  <SidebarCard key={a.id} article={a} />
                ))}
              </>
            )}
            {/* Sidebar newsletter */}
            <SidebarNewsletter />
          </div>

        </div>
      </div>

      {/* MOBILE RELATED ARTICLES */}
      {related.length > 0 && (
        <div style={{ background: '#F8F7F5', padding: '40px 24px' }} className="mobile-related">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 24, color: '#111', marginBottom: 12 }}>
            More stories
          </h2>
          <div style={{ height: 1, background: '#E2DED8', marginBottom: 24 }} />
          <div style={{ display: 'flex', gap: 16, overflowX: 'auto', scrollSnapType: 'x mandatory', WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', marginLeft: -24, paddingLeft: 24, paddingRight: 24 } as React.CSSProperties}>
            {related.map((a) => (
              <MobileRelatedCard key={a.id} article={a} />
            ))}
          </div>
        </div>
      )}

      {/* BOTTOM RELATED GRID — desktop */}
      {related.length > 0 && (
        <section style={{ background: '#F8F7F5', padding: '64px 56px' }} className="bottom-related">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>
              Continue reading
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 36, color: '#111', marginBottom: 8 }}>
              Related stories
            </h2>
            <div style={{ height: 1, background: '#E2DED8', marginBottom: 40 }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="related-grid">
              {related.map((a) => (
                <BottomRelatedCard key={a.id} article={a} />
              ))}
            </div>
            <div style={{ marginTop: 40, textAlign: 'center' }}>
              <Link href="/articles" style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 16, color: '#555',
                borderBottom: '1px solid #ccc', paddingBottom: 3, textDecoration: 'none',
                display: 'inline-flex', alignItems: 'flex-end', minHeight: 44,
              }}>
                View all articles →
              </Link>
            </div>
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          .art-hero { height: 50svh !important; min-height: 320px !important; }
          .art-breadcrumb { left: 20px !important; top: 16px !important; }
          .art-hero-text { padding: 0 24px 32px !important; max-width: 100% !important; }
          .art-hero-text h1 { font-size: clamp(24px, 7vw, 44px) !important; }
          .art-img-credit { padding: 6px 24px 0 !important; }
          .art-layout { grid-template-columns: 1fr !important; }
          .art-body-col { padding: 32px 24px 64px !important; border-right: none !important; }
          .art-sidebar { display: none !important; }
          .article-body p { font-size: 16px !important; }
          .mobile-related { display: block !important; }
          .bottom-related { display: none !important; }
        }
        @media (min-width: 769px) {
          .mobile-related { display: none !important; }
          .bottom-related { display: block !important; }
          .related-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        .mobile-related::-webkit-scrollbar { display: none; }
      `}</style>
    </>
  )
}

function PaywallSection() {
  return (
    <div style={{ paddingTop: 40, borderTop: '1px solid #E2DED8', textAlign: 'center' }}>
      {/* É crest */}
      <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, borderRadius: '50%', border: '1px solid #111', marginBottom: 20 }}>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: '#111', lineHeight: 1 }}>L</span>
      </div>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 28, color: '#111', marginBottom: 16 }}>
        Continue reading with L&apos;Échelon
      </h2>
      <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#666', lineHeight: 1.65, maxWidth: 360, margin: '0 auto 28px' }}>
        This story is available to members. Join L&apos;Échelon for full access to all articles, the L&apos;Échelon Index, and intelligence across the five pillars of luxury.
      </p>
      <Link href="/subscribe" className="btn-primary paywall-btn" style={{ fontSize: 9, padding: '14px 32px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
        Become a member
      </Link>
      <div style={{ marginTop: 16 }}>
        <Link href="/sign-in" style={{
          fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: '#555',
          borderBottom: '1px solid #ccc', paddingBottom: 2, textDecoration: 'none',
        }}>
          Sign in →
        </Link>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .paywall-btn { width: 100% !important; min-height: 48px !important; }
        }
      `}</style>
    </div>
  )
}

function SidebarCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ display: 'block', textDecoration: 'none', borderBottom: '1px solid #F0EDE8', paddingBottom: 16, marginBottom: 16 }}>
      {imgSrc && (
        <div style={{ position: 'relative', width: '100%', height: 140, background: '#E8E5E0', overflow: 'hidden', marginBottom: 8 }}>
          <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="240px" />
        </div>
      )}
      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#aaa', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '8px 0 4px' }}>
        {article.category?.french_name}
      </p>
      <p className="sidebar-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 15, color: '#333', lineHeight: 1.25, transition: 'color 0.2s' }}>
        {clean(article.title)}
      </p>
      {date && <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#bbb', marginTop: 4 }}>{date}</p>}
      <style>{`.sidebar-title:hover { color: #111 !important; }`}</style>
    </Link>
  )
}

function SidebarNewsletter() {
  return (
    <div style={{ marginTop: 24, paddingTop: 24, borderTop: '1px solid #E2DED8' }}>
      <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 18, color: '#111', marginBottom: 8 }}>
        Join L&apos;Échelon
      </p>
      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#888', lineHeight: 1.5, marginBottom: 14 }}>
        Twice monthly. Five pillars. No noise.
      </p>
      <Link href="/subscribe" className="btn-primary" style={{ display: 'block', textAlign: 'center', fontSize: 9, padding: '11px 0', letterSpacing: '0.16em' }}>
        Subscribe
      </Link>
    </div>
  )
}

function MobileRelatedCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block', minWidth: '72vw', scrollSnapAlign: 'start', flexShrink: 0 }}>
      <div style={{ position: 'relative', width: '100%', height: '50vw', background: '#E8E5E0', overflow: 'hidden' }}>
        {imgSrc && <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="72vw" />}
      </div>
      <div style={{ paddingTop: 12 }}>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 4 }}>
          {article.category?.french_name}
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 18, color: '#111', lineHeight: 1.15, marginBottom: 4 }}>
          {clean(article.title)}
        </p>
        {date && <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#bbb' }}>{date}</p>}
      </div>
    </Link>
  )
}

function BottomRelatedCard({ article }: { article: Article }) {
  const date = article.published_at
    ? new Date(article.published_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : ''
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
      <div style={{ position: 'relative', width: '100%', height: 220, background: '#E8E5E0', overflow: 'hidden', marginBottom: 16 }}>
        {imgSrc && <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover', transition: 'transform 0.4s ease' }} sizes="(max-width:768px) 100vw, 33vw" className="related-card-img" />}
      </div>
      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: 8 }}>
        {article.category?.french_name ?? "L'Échelon"}
      </p>
      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 20, color: '#111', lineHeight: 1.15, marginBottom: 8, transition: 'color 0.2s' }} className="related-card-title">
        {clean(article.title)}
      </h3>
      {article.excerpt && (
        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: '#888', lineHeight: 1.65, marginBottom: 8,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' } as React.CSSProperties}>
          {clean(article.excerpt)}
        </p>
      )}
      <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#bbb' }}>
        {date}{article.read_time ? ` · ${article.read_time} min read` : ''}
      </p>
      <style>{`
        .related-card-img:hover { transform: scale(1.03); }
        .related-card-title:hover { color: #444 !important; }
      `}</style>
    </Link>
  )
}

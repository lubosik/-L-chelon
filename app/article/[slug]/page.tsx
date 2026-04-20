import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchArticleBySlug, fetchRelatedArticles, fetchLatestArticles } from '@/lib/strapi'
import type { Article } from '@/lib/strapi'
import { getCoverImage } from '@/lib/categoryImages'
import { renderBody, clean } from '@/lib/richText'
import ArticleProgressBar from '@/components/ArticleProgressBar'
import ArticleNewsletterForm from '@/components/ArticleNewsletterForm'
import ArticleNextLoader from '@/components/ArticleNextLoader'

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

const STRAPI_URL_FOR_BODY = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || ''

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

  const [related, latestArticles] = await Promise.all([
    article.category?.slug
      ? fetchRelatedArticles(article.category.slug, slug, 5)
      : Promise.resolve([] as Article[]),
    fetchLatestArticles(5, slug),
  ])

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    headline: article.title,
    description: article.excerpt,
    image: article.cover_image?.url,
    datePublished: article.published_at,
    author: { '@type': 'Person', name: article.author?.name },
    publisher: { '@type': 'NewsMediaOrganization', '@id': 'https://lechelon.com/#organization', name: "L'Échelon" },
    mainEntityOfPage: { '@type': 'WebPage', '@id': `https://lechelon.com/article/${slug}` },
    articleSection: article.category?.french_name,
    isAccessibleForFree: !article.is_premium,
  }

  const bodyBlocks = renderBody(article.body, STRAPI_URL_FOR_BODY)
  const hasBody = bodyBlocks.length > 0

  // Mobile "more to read": 1 related + 2 latest from different category
  const moreToRead = (() => {
    const cards: Article[] = []
    if (related[0]) cards.push(related[0])
    const diff = latestArticles.filter(a => a.category?.slug !== article.category?.slug && a.slug !== related[0]?.slug).slice(0, 2)
    cards.push(...diff)
    if (cards.length < 3) {
      const extra = latestArticles.filter(a => !cards.find(c => c.slug === a.slug)).slice(0, 3 - cards.length)
      cards.push(...extra)
    }
    return cards.slice(0, 3)
  })()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* READING PROGRESS BAR + FLOATING CATEGORY PILL */}
      <ArticleProgressBar categoryName={article.category?.french_name} />

      {/* ARTICLE HERO */}
      <div style={{ position: 'relative', overflow: 'hidden', background: '#0A0A0A' }} className="art-hero">
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
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>{formatDate(article.published_at)}</span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>By {article.author?.name ?? "L'Échelon"}</span>
            <span style={{ color: 'rgba(255,255,255,0.20)' }}>·</span>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.12em' }}>{article.read_time ?? 5} min read</span>
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
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', alignItems: 'flex-start' }} className="art-layout">

          {/* BODY COLUMN */}
          <div className="art-body-col" style={{ flex: 1, minWidth: 0, padding: '56px 56px 80px', borderRight: '1px solid #E2DED8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24 }}>
              {article.category && (
                <Link href={`/category/${article.category.slug}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#999', letterSpacing: '0.22em', textTransform: 'uppercase', textDecoration: 'none', transition: 'color 0.2s' }}>
                  {article.category.french_name}
                </Link>
              )}
            </div>
            <hr style={{ border: 'none', borderTop: '1px solid #E2DED8', marginBottom: 40 }} />

            {/* Article body */}
            <div className="article-body">
              {article.is_premium ? (
                <>
                  {article.excerpt && (
                    <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 400, fontSize: 18, color: '#222', lineHeight: 1.80, marginBottom: 24 }}>
                      {clean(article.excerpt)}
                    </p>
                  )}
                  {hasBody && (
                    <div style={{ position: 'relative' }}>
                      <div style={{ maxHeight: 260, overflow: 'hidden' }}>{bodyBlocks.slice(0, 3)}</div>
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

            {/* MOBILE-ONLY: inline newsletter after article end */}
            <div className="art-mobile-newsletter">
              <div style={{ marginTop: 40 }}>
                <ArticleNewsletterForm variant="mobile" />
              </div>
            </div>

            {/* MOBILE-ONLY: "More to read" vertical list */}
            {moreToRead.length > 0 && (
              <div className="art-more-to-read">
                <div style={{ paddingTop: 32, borderTop: '1px solid #E2DED8' }}>
                  <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 22, color: '#111', padding: '0 0 16px' }}>
                    More to read
                  </h2>
                  {moreToRead.map((a) => (
                    <MobileMoreCard key={a.id} article={a} />
                  ))}
                  <div style={{ padding: '20px 0', textAlign: 'center', borderBottom: '1px solid #E2DED8' }}>
                    <Link href="/articles" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: '#555', borderBottom: '1px solid #ccc', paddingBottom: 3, textDecoration: 'none', display: 'inline-block' }}>
                      View all stories →
                    </Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIDEBAR — desktop only */}
          <div className="art-sidebar" style={{ width: 280, flexShrink: 0, position: 'sticky', top: 80, maxHeight: 'calc(100vh - 100px)', overflowY: 'auto', padding: '56px 0 0 40px' }}>
            {/* Latest stories */}
            <div>
              <p style={{
                fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.24em',
                textTransform: 'uppercase', borderBottom: '1px solid #E2DED8', paddingBottom: 12, marginBottom: 20,
              }}>
                Latest stories
              </p>

              {latestArticles.length > 0 ? (
                latestArticles.map((a) => <SidebarLatestCard key={a.id} article={a} />)
              ) : (
                /* Skeleton placeholders */
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
            </div>

            {/* Sidebar newsletter */}
            <ArticleNewsletterForm variant="sidebar" />

            <style>{`.art-sidebar::-webkit-scrollbar { width: 3px; } .art-sidebar::-webkit-scrollbar-track { background: transparent; } .art-sidebar::-webkit-scrollbar-thumb { background: #E2DED8; border-radius: 2px; }`}</style>
          </div>

        </div>
      </div>

      {/* RELATED ARTICLES STRIP — horizontal scroll, both desktop + mobile */}
      <section className="related-strip-section" style={{ background: '#F8F7F5', padding: '56px 56px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {/* Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 32 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 26, color: '#111' }}>
              More from {article.category?.french_name ?? "L'Échelon"}
            </h2>
            {article.category && (
              <Link href={`/category/${article.category.slug}`} className="view-all-link" style={{
                fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 14, color: '#888',
                borderBottom: '1px solid #ddd', textDecoration: 'none', paddingBottom: 2,
              }}>
                View all →
              </Link>
            )}
          </div>

          {/* Horizontal scroll container */}
          <div style={{
            display: 'flex', gap: 24,
            overflowX: 'auto', scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', paddingBottom: 8,
          } as React.CSSProperties} className="related-scroll">
            {related.length > 0 ? (
              related.map((a) => <RelatedCard key={a.id} article={a} />)
            ) : (
              <>
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} style={{ minWidth: 240, maxWidth: 240, flexShrink: 0 }} className="related-card-width">
                    <div style={{ width: '100%', aspectRatio: '3/2', background: '#E8E5E0', marginBottom: 14 }} />
                    <div style={{ width: '50%', height: 7, background: '#E8E5E0', marginBottom: 8 }} />
                    <div style={{ width: '90%', height: 12, background: '#E8E5E0', marginBottom: 5 }} />
                    <div style={{ width: '70%', height: 12, background: '#E8E5E0', marginBottom: 10 }} />
                    <div style={{ width: '60%', height: 8, background: '#E8E5E0' }} />
                  </div>
                ))}
                <p style={{ width: '100%', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#bbb', textAlign: 'center', marginTop: 8, flexShrink: 0 }}>
                  More stories from {article.category?.french_name ?? "L'Échelon"} coming soon.
                </p>
              </>
            )}
          </div>
        </div>
      </section>

      {/* INFINITE ARTICLE LOADER */}
      <ArticleNextLoader
        seenSlugs={[slug, ...related.map(a => a.slug)]}
        categorySlug={article.category?.slug}
        categoryName={article.category?.french_name}
        showNewsletter={true}
      />

      <style>{`
        /* Hero sizing */
        .art-hero { height: 65vh; min-height: 420px; }
        .view-all-link:hover { color: #111 !important; border-bottom-color: #111 !important; }
        @media (max-width: 768px) {
          .art-hero { height: 55svh !important; min-height: 320px !important; }
          .art-breadcrumb { left: 20px !important; top: 16px !important; }
          .art-hero-text { padding: 0 20px 32px !important; max-width: 100% !important; }
          .art-hero-text h1 { font-size: clamp(28px, 7vw, 44px) !important; line-height: 0.95 !important; }
          .art-img-credit { padding: 6px 24px 0 !important; }

          /* Layout */
          .art-layout { flex-direction: column !important; }
          .art-body-col { padding: 28px 20px 0 !important; border-right: none !important; width: 100% !important; }
          .art-sidebar { display: none !important; }

          /* Body text */
          .article-body p { font-size: 16px !important; line-height: 1.80 !important; }
          .article-body p:first-of-type { font-weight: 400 !important; color: #222 !important; }
          .article-body h2 { font-size: 24px !important; margin: 32px 0 12px !important; }
          .article-body blockquote { font-size: 20px !important; padding-left: 16px !important; }

          /* Inline images — full bleed on mobile */
          .art-inline-img { margin-left: -20px !important; margin-right: -20px !important; width: calc(100% + 40px) !important; }

          /* Mobile-only sections */
          .art-mobile-newsletter { display: block !important; }
          .art-more-to-read { display: block !important; }

          /* Related strip */
          .related-strip-section { padding: 40px 24px !important; }
          .related-strip-section h2 { font-size: 22px !important; }
          .related-card-width { min-width: 70vw !important; max-width: 70vw !important; }
        }

        /* Desktop: hide mobile-only sections */
        @media (min-width: 769px) {
          .art-mobile-newsletter { display: none !important; }
          .art-more-to-read { display: none !important; }
        }

        /* Related strip scrollbar */
        .related-scroll::-webkit-scrollbar { display: none; }

        @media (max-width: 480px) {
          .art-hero-text h1 { font-size: clamp(26px, 8vw, 36px) !important; }
          .article-body p { font-size: 16px !important; }
        }
      `}</style>
    </>
  )
}

function PaywallSection() {
  return (
    <div style={{ paddingTop: 40, borderTop: '1px solid #E2DED8', textAlign: 'center' }}>
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
        <Link href="/sign-in" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: '#555', borderBottom: '1px solid #ccc', paddingBottom: 2, textDecoration: 'none' }}>
          Sign in →
        </Link>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .paywall-btn { width: 100% !important; min-height: 52px !important; }
        }
      `}</style>
    </div>
  )
}

function SidebarLatestCard({ article }: { article: Article }) {
  const date = formatDate(article.published_at)
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ display: 'flex', gap: 12, paddingBottom: 16, borderBottom: '1px solid #F5F3F0', marginBottom: 16, textDecoration: 'none', cursor: 'pointer' }}>
      {/* Thumbnail */}
      <div style={{ width: 72, height: 60, flexShrink: 0, background: '#E8E5E0', overflow: 'hidden', position: 'relative' }}>
        {imgSrc && <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="72px" />}
      </div>
      {/* Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {article.category && (
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#bbb', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 3 }}>
            {article.category.french_name}
          </p>
        )}
        <p className="sb-latest-title" style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 13, color: '#333', lineHeight: 1.25,
          display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', transition: 'color 0.2s',
        } as React.CSSProperties}>
          {clean(article.title)}
        </p>
        {(date || article.read_time) && (
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#bbb', marginTop: 4 }}>
            {[date, article.read_time ? `${article.read_time} min` : null].filter(Boolean).join(' · ')}
          </p>
        )}
      </div>
      <style>{`.sb-latest-title:hover { color: #111 !important; }`}</style>
    </Link>
  )
}

function RelatedCard({ article }: { article: Article }) {
  const date = formatDate(article.published_at)
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ minWidth: 240, maxWidth: 240, flexShrink: 0, scrollSnapAlign: 'start', textDecoration: 'none', display: 'block', cursor: 'pointer' }} className="related-card-width">
      <div style={{ position: 'relative', width: '100%', aspectRatio: '3/2', background: '#E8E5E0', overflow: 'hidden', marginBottom: 14 }}>
        {imgSrc && <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 70vw, 240px" />}
      </div>
      {article.category && (
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#aaa', letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: 6 }}>
          {article.category.french_name}
        </p>
      )}
      <h3 className="rc-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 16, color: '#111', lineHeight: 1.2, textTransform: 'uppercase', transition: 'color 0.2s', marginBottom: 6 }}>
        {clean(article.title)}
      </h3>
      {(date || article.read_time) && (
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#bbb', marginBottom: 4 }}>
          {[date, article.read_time ? `${article.read_time} min` : null].filter(Boolean).join(' · ')}
        </p>
      )}
      <span style={{
        display: 'inline-block', fontFamily: 'Lato, sans-serif', fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase', padding: '3px 8px',
        ...(article.is_premium ? { background: '#111', color: '#fff' } : { border: '1px solid #ddd', color: '#aaa' }),
      }}>
        {article.is_premium ? 'Members' : 'Free'}
      </span>
      <style>{`.rc-title:hover { color: #555 !important; }`}</style>
    </Link>
  )
}

function MobileMoreCard({ article }: { article: Article }) {
  const date = formatDate(article.published_at)
  const imgSrc = getCoverImage(article)
  return (
    <Link href={`/article/${article.slug}`} style={{ display: 'flex', flexDirection: 'row', gap: 0, borderBottom: '1px solid #F0EDE8', padding: '16px 0', textDecoration: 'none', minHeight: 88 }}>
      {/* Thumbnail */}
      <div style={{ width: 96, height: 80, flexShrink: 0, background: '#E8E5E0', overflow: 'hidden', position: 'relative', marginRight: 14 }}>
        {imgSrc && <Image src={imgSrc} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="96px" />}
      </div>
      {/* Details */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {article.category && (
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#aaa', letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: 4 }}>
            {article.category.french_name}
          </p>
        )}
        <p style={{
          fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 15, color: '#111', lineHeight: 1.2,
          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
        } as React.CSSProperties}>
          {clean(article.title)}
        </p>
        {(date || article.read_time) && (
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#bbb', marginTop: 5 }}>
            {[date, article.read_time ? `${article.read_time} min` : null].filter(Boolean).join(' · ')}
            {article.is_premium && (
              <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 6.5, letterSpacing: '0.14em', textTransform: 'uppercase', background: '#111', color: '#fff', padding: '2px 6px', marginLeft: 6 }}>
                Members
              </span>
            )}
          </p>
        )}
      </div>
    </Link>
  )
}

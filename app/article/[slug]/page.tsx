import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchArticleBySlug, fetchRecentArticles } from '@/lib/strapi'
import PaywallGate from '@/components/PaywallGate'
import ArticleCard from '@/components/ArticleCard'

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

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params
  const article = await fetchArticleBySlug(slug)
  const related = await fetchRecentArticles({ limit: 6 })
  const relatedFiltered = related.filter((a) => a.slug !== slug).slice(0, 3)

  if (!article) {
    return (
      <div style={{ padding: '80px 56px', textAlign: 'center' }}>
        <p style={{ fontFamily: 'Lato, sans-serif', color: '#999', fontSize: 13 }}>Article not found.</p>
      </div>
    )
  }

  const wordCount = article.excerpt ? Math.ceil(article.excerpt.split(' ').length * 10) : 800

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'NewsArticle',
    'headline': article.title,
    'description': article.excerpt,
    'image': article.cover_image?.url,
    'datePublished': article.published_at,
    'dateModified': article.published_at,
    'author': { '@type': 'Person', 'name': article.author?.name },
    'publisher': {
      '@type': 'NewsMediaOrganization',
      '@id': 'https://lechelon.com/#organization',
      'name': "L'Échelon",
      'logo': { '@type': 'ImageObject', 'url': 'https://lechelon.com/og/logo.png' },
    },
    'mainEntityOfPage': { '@type': 'WebPage', '@id': `https://lechelon.com/article/${slug}` },
    'articleSection': article.category?.french_name,
    'wordCount': wordCount,
    'isAccessibleForFree': !article.is_premium,
    ...(article.is_premium ? {
      'hasPart': { '@type': 'WebPageElement', 'isAccessibleForFree': false, 'cssSelector': '.article-body' },
    } : {}),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Dark article hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: 400, background: '#0A0A0A', overflow: 'hidden' }}>
        {article.cover_image && (
          <Image src={article.cover_image.url} alt={article.title} fill style={{ objectFit: 'cover', objectPosition: 'center' }} priority />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,8,1) 0%, rgba(8,8,8,0.55) 50%, transparent 100%)' }} />
        {/* Breadcrumb */}
        <div style={{ position: 'absolute', top: 24, left: 56, zIndex: 20, display: 'flex', gap: 8, alignItems: 'center' }} className="breadcrumb-bar">
          <Link href="/" style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>Home</Link>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>›</span>
          {article.category && (
            <>
              <Link href={`/category/${article.category.slug}`} style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.18em', textTransform: 'uppercase', textDecoration: 'none' }}>
                {article.category.french_name}
              </Link>
              <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 10 }}>›</span>
            </>
          )}
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.60)', letterSpacing: '0.10em' }}>Article</span>
        </div>
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '0 56px 48px', maxWidth: 860 }} className="art-hero-text">
          {article.category && (
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', marginBottom: 12 }}>
              {article.category.french_name}
            </div>
          )}
          <h1
            style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(32px, 5vw, 64px)', color: '#fff', lineHeight: 1.05, marginBottom: 16 }}
            dangerouslySetInnerHTML={{ __html: article.title }}
          />
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.14em', textTransform: 'uppercase', display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
            <span>By <span style={{ color: 'rgba(255,255,255,0.75)' }}>{article.author?.name}</span></span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span>{article.read_time ?? 5} min read</span>
            <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
            <span style={{ color: article.is_premium ? 'rgba(255,255,255,0.75)' : 'rgba(255,255,255,0.45)' }}>
              {article.is_premium ? 'Members' : 'Free'}
            </span>
          </div>
        </div>
      </div>

      {/* Article body */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 240px', background: '#ffffff', maxWidth: 1100, margin: '0 auto' }} className="art-layout">
        <div className="article-body art-body-pad" style={{ padding: '64px 56px 80px' }}>
          {article.category && (
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#999', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 12 }}>
              {article.category.french_name}
            </p>
          )}
          <hr style={{ border: 'none', borderTop: '1px solid #E2DED8', marginBottom: 32 }} />
          {article.is_premium ? (
            <>
              <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 16, color: '#444', lineHeight: 1.85, marginBottom: 32 }}>
                {article.excerpt}
              </p>
              <PaywallGate locale="en" />
            </>
          ) : (
            <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 16, color: '#444', lineHeight: 1.85 }}>
              <p style={{ marginBottom: 24 }}>{article.excerpt}</p>
              <p style={{ color: '#bbb', fontSize: 13 }}>
                [Full article body renders from Strapi rich text blocks once connected.]
              </p>
            </div>
          )}
        </div>
        {relatedFiltered.length > 0 && (
          <div style={{ borderLeft: '1px solid #E2DED8', padding: '64px 24px 0', position: 'sticky', top: 56, alignSelf: 'start' }}>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#555', letterSpacing: '0.22em', textTransform: 'uppercase', borderBottom: '1px solid #E2DED8', paddingBottom: 10, marginBottom: 20 }}>
              Most popular
            </div>
            {relatedFiltered.map((a) => (
              <Link key={a.id} href={`/article/${a.slug}`} style={{ display: 'block', marginBottom: 20, textDecoration: 'none' }}>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#666', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {a.category?.french_name}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 13, color: '#333', lineHeight: 1.3 }}>
                  {a.title}
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Related articles */}
      {relatedFiltered.length > 0 && (
        <div style={{ background: '#F8F7F5', padding: '48px 56px', borderTop: '1px solid #E2DED8' }} className="related-pad">
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#999', marginBottom: 28 }}>
            Continue reading
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 0 }} className="related-grid">
            {relatedFiltered.map((a) => (
              <ArticleCard key={a.id} article={a} locale="en" />
            ))}
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .breadcrumb-bar { left: 20px !important; top: 16px !important; }
          .art-hero-text { padding: 0 20px 32px !important; }
          .art-layout { grid-template-columns: 1fr !important; }
          .art-body-pad { padding: 40px 20px 60px !important; }
          .related-pad { padding: 32px 20px !important; }
          .related-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  )
}

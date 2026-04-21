'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/strapi'
import Sidebar from './Sidebar'
import { getCoverImage } from '@/lib/categoryImages'

interface ArticleGridProps {
  articles: Article[]
  featuredArticle?: Article | null
  locale?: string
}

export default function ArticleGrid({ articles, featuredArticle, locale = 'en' }: ArticleGridProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`
  const listArticles = articles.length ? articles : []
  const sidebarEditorPick = articles[5] ?? featuredArticle ?? null
  const sidebarMini = articles.slice(6, 9)

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', background: 'var(--white)' }} className="article-layout">
      {/* MAIN FEED */}
      <div style={{ borderRight: '1px solid var(--light-border)' }}>
        <div style={{ padding: '0 56px' }} className="articles-pad">
          {listArticles.length === 0 ? (
            <div style={{ padding: '80px 0', textAlign: 'center', color: '#bbb', fontFamily: 'Lato, sans-serif', fontSize: 12, letterSpacing: '0.14em' }}>
              Articles will appear here once Strapi is connected.
            </div>
          ) : (
            listArticles.slice(0, 5).map((article) => (
              <ArticleItem key={article.id} article={article} prefix={prefix} />
            ))
          )}
        </div>
      </div>

      {/* SIDEBAR */}
      <Sidebar editorPick={sidebarEditorPick} alsoThisWeek={sidebarMini} locale={locale} />

      <style>{`
        @media (max-width: 768px) {
          .article-layout { grid-template-columns: 1fr !important; }
          .articles-pad { padding: 0 20px !important; }
        }
      `}</style>
    </div>
  )
}

function ArticleItem({ article, prefix }: { article: Article; prefix: string }) {
  const href = `${prefix}/article/${article.slug}`
  const coverSrc = getCoverImage(article)

  return (
    <article style={{
      display: 'grid',
      gridTemplateColumns: '420px 1fr',
      gap: 48,
      padding: '48px 0',
      borderBottom: '1px solid var(--light-border)',
      alignItems: 'start',
    }} className="article-item">
      {/* Image */}
      <Link href={href} style={{ display: 'block', flexShrink: 0 }}>
        <div style={{ width: '100%', height: 280, background: 'var(--img-placeholder)', overflow: 'hidden', position: 'relative' }}>
          {coverSrc && (
            <Image src={coverSrc} alt={article.title} fill style={{ objectFit: 'cover' }} />
          )}
        </div>
      </Link>

      {/* Body */}
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 280, padding: '8px 0' }}>
        <div>
          {article.category && (
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--mid)', marginBottom: 16 }}>
              {article.category.french_name}
              {article.category.english_sub ? ` · ${article.category.english_sub}` : ''}
            </p>
          )}
          <Link href={href} style={{ textDecoration: 'none' }}>
            <h2 style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(22px, 2.5vw, 32px)',
              fontWeight: 300,
              color: 'var(--black)',
              lineHeight: 1.1,
              textTransform: 'uppercase',
              letterSpacing: '0.02em',
              marginBottom: 16,
              transition: 'color 0.2s',
            }} className="article-item-title">
              {article.title}
            </h2>
          </Link>
          {article.excerpt && (
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 14, fontWeight: 300, color: 'var(--dark)', lineHeight: 1.7, marginBottom: 24 }}>
              {article.excerpt}
            </p>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--mid)' }}>
              By {article.author?.name ?? 'L\'Échelon'} · {article.read_time ?? 5} min read
            </span>
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', padding: '3px 10px', border: '1px solid #ccc', color: '#999', borderRadius: 999 }}>
              Free
            </span>
          </div>
          <Link href={href} className="btn-pill" style={{ fontSize: 9, padding: '8px 18px' }}>
            Read now ↗
          </Link>
        </div>
      </div>

      <style>{`
        .article-item-title:hover { color: #444 !important; }
        @media (max-width: 768px) {
          .article-item { grid-template-columns: 1fr !important; gap: 20px !important; padding: 32px 0 !important; }
          .article-item > a > div { height: 220px !important; }
        }
      `}</style>
    </article>
  )
}

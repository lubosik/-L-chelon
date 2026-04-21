'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/strapi'

export default function HorizontalBand({ articles, locale = 'en' }: { articles: Article[]; locale?: string }) {
  const prefix = locale === 'en' ? '' : `/${locale}`
  const items = articles.slice(0, 3)
  if (!items.length) return null

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', background: 'var(--white)', borderTop: '1px solid var(--light-border)', borderBottom: '1px solid var(--light-border)' }} className="h-band">
      {items.map((article, i) => (
        <Link
          key={article.id}
          href={`${prefix}/article/${article.slug}`}
          style={{ textDecoration: 'none', display: 'block', padding: 32, borderRight: i < items.length - 1 ? '1px solid var(--light-border)' : 'none', cursor: 'pointer' }}
          className="hb-card"
        >
          <div style={{ width: '100%', height: 120, background: 'var(--img-placeholder)', overflow: 'hidden', marginBottom: 16, position: 'relative' }}>
            {article.cover_image && (
              <Image src={article.cover_image.url} alt={article.title} fill style={{ objectFit: 'cover' }} />
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            {article.category && (
              <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--mid)' }}>
                {article.category.french_name}
              </span>
            )}
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, letterSpacing: '0.12em', textTransform: 'uppercase', padding: '2px 8px', background: 'transparent', border: '1px solid #ccc', color: '#999', borderRadius: 999 }}>
              Free
            </span>
          </div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 16, color: '#555', lineHeight: 1.3, transition: 'color 0.2s', marginBottom: 10 }} className="hb-title">
            {article.title}
          </h3>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#bbb', marginTop: 10 }}>
            {article.read_time ?? 5} min read
          </div>
        </Link>
      ))}

      <style>{`
        .hb-card:hover .hb-title { color: #111 !important; }
        @media (max-width: 768px) {
          .h-band { grid-template-columns: 1fr !important; }
          .h-band > a { border-right: none !important; border-bottom: 1px solid var(--light-border); }
        }
      `}</style>
    </div>
  )
}

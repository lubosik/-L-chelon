import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/strapi'
import { getCoverImage } from '@/lib/categoryImages'

export default function ArticleCard({ article, locale = 'en' }: { article: Article; locale?: string }) {
  const prefix = locale === 'en' ? '' : `/${locale}`
  const href = `${prefix}/article/${article.slug}`
  const coverSrc = getCoverImage(article)

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <article style={{ background: 'var(--white)', cursor: 'pointer', overflow: 'hidden' }}>
        <div style={{ position: 'relative', height: 200, background: '#C8C4BE', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          {coverSrc ? (
            <Image src={coverSrc} alt={article.cover_image?.alternativeText || article.title} fill style={{ objectFit: 'cover' }} />
          ) : (
            <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, letterSpacing: '0.20em', textTransform: 'uppercase', color: '#888' }}>
              Cover photo
            </span>
          )}
        </div>
        <div style={{ padding: '18px 20px 20px' }}>
          {article.category && (
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#555', marginBottom: 8 }}>
              {article.category.french_name}
            </div>
          )}
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 17, color: '#111', lineHeight: 1.3, marginBottom: 10, transition: 'color 0.2s' }} className="ac-title">
            {article.title}
          </h3>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#555', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
            Free · {article.read_time ?? 5} min
          </div>
        </div>
      </article>
      <style>{`.ac-title:hover { color: #555 !important; }`}</style>
    </Link>
  )
}

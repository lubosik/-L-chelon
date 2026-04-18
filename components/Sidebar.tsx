'use client'

import Link from 'next/link'
import Image from 'next/image'
import type { Article } from '@/lib/strapi'
import NewsletterSignup from './NewsletterSignup'

interface SidebarProps {
  editorPick?: Article | null
  alsoThisWeek?: Article[]
  locale?: string
}

export default function Sidebar({ editorPick, alsoThisWeek = [], locale = 'en' }: SidebarProps) {
  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <aside style={{ background: 'var(--white)', borderLeft: '1px solid var(--light-border)', padding: '32px 24px' }}>
      {/* Editor's Pick */}
      {editorPick && (
        <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--light-border)' }}>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#666', letterSpacing: '0.22em', textTransform: 'uppercase', borderBottom: '1px solid var(--light-border)', paddingBottom: 10, marginBottom: 16 }}>
            Editor&apos;s Pick
          </div>
          <Link href={`${prefix}/article/${editorPick.slug}`} style={{ textDecoration: 'none', display: 'block' }}>
            <div style={{ width: '100%', height: 140, background: 'var(--img-placeholder)', overflow: 'hidden', marginBottom: 12, position: 'relative' }}>
              {editorPick.cover_image && (
                <Image src={editorPick.cover_image.url} alt={editorPick.title} fill style={{ objectFit: 'cover' }} />
              )}
            </div>
            {editorPick.category && (
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#666', letterSpacing: '0.16em', textTransform: 'uppercase', marginBottom: 6 }}>
                {editorPick.category.french_name}
              </div>
            )}
            <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 15, color: '#111', lineHeight: 1.3, transition: 'color 0.2s' }} className="sidebar-pick-title">
              {editorPick.title}
            </h3>
          </Link>
        </div>
      )}

      {/* Most Popular / Also This Week */}
      {alsoThisWeek.length > 0 && (
        <div style={{ marginBottom: 32, paddingBottom: 32, borderBottom: '1px solid var(--light-border)' }}>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#666', letterSpacing: '0.22em', textTransform: 'uppercase', borderBottom: '1px solid var(--light-border)', paddingBottom: 10, marginBottom: 16 }}>
            Most popular articles
          </div>
          {alsoThisWeek.slice(0, 3).map((article) => (
            <Link key={article.id} href={`${prefix}/article/${article.slug}`} style={{ textDecoration: 'none', display: 'flex', gap: 12, marginBottom: 16, alignItems: 'flex-start' }}>
              <div style={{ width: 52, height: 44, flexShrink: 0, background: 'var(--img-placeholder)', overflow: 'hidden', position: 'relative' }}>
                {article.cover_image && (
                  <Image src={article.cover_image.url} alt={article.title} fill style={{ objectFit: 'cover' }} />
                )}
              </div>
              <div>
                {article.category && (
                  <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#666', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 3 }}>
                    {article.category.french_name}
                  </div>
                )}
                <h4 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 12, color: '#444', lineHeight: 1.3, transition: 'color 0.2s' }} className="sidebar-mini-title">
                  {article.title}
                </h4>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Newsletter */}
      <NewsletterSignup />

      <style>{`
        .sidebar-pick-title:hover { color: #111 !important; }
        .sidebar-mini-title:hover { color: #111 !important; }
      `}</style>
    </aside>
  )
}

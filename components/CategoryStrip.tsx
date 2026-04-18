'use client'

import { usePathname, useRouter } from 'next/navigation'
import type { Category } from '@/lib/strapi'
import { useHeroStore } from '@/lib/heroStore'

const FALLBACK_CATS: Category[] = [
  { id: 1, name: 'Fashion',    slug: 'la-mode',       french_name: 'La Mode',        english_sub: 'Fashion',    hero_video_slug: 'la-mode' },
  { id: 2, name: 'Motorsport', slug: 'la-vitesse',    french_name: 'La Vitesse',     english_sub: 'Motorsport', hero_video_slug: 'la-vitesse' },
  { id: 3, name: 'Watches',    slug: 'lhorlogerie',   french_name: "L'Horlogerie",   english_sub: 'Watches',    hero_video_slug: 'lhorlogerie' },
  { id: 4, name: 'Equestrian', slug: 'lequitation',   french_name: "L'Équitation",   english_sub: 'Equestrian', hero_video_slug: 'lequitation' },
  { id: 5, name: 'Lifestyle',  slug: 'lart-de-vivre', french_name: "L'Art de Vivre", english_sub: 'Lifestyle',  hero_video_slug: 'lart-de-vivre' },
]

export default function CategoryStrip({ categories, locale = 'en' }: { categories: Category[]; locale?: string }) {
  const data = categories.length ? categories : FALLBACK_CATS
  const pathname = usePathname()
  const router = useRouter()
  const setHoverSlug = useHeroStore((s) => s.setHoverSlug)
  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <div style={{ display: 'flex', background: 'var(--white)', borderBottom: '1px solid var(--light-border)', overflowX: 'auto' }} className="cat-strip">
      {data.map((cat, i) => {
        const active = pathname.includes(`/category/${cat.slug}`)
        return (
          <div
            key={cat.slug}
            onClick={() => router.push(`${prefix}/category/${cat.slug}`)}
            onMouseEnter={() => setHoverSlug(cat.hero_video_slug ?? null)}
            onMouseLeave={() => setHoverSlug(null)}
            style={{
              flex: 1, minWidth: 100, textAlign: 'center', padding: '13px 0',
              borderRight: i < data.length - 1 ? '1px solid var(--light-border)' : 'none',
              borderBottom: active ? '2px solid #111' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'background 0.15s',
              color: active ? '#111' : 'inherit',
            }}
            onMouseOver={(e) => { (e.currentTarget as HTMLElement).style.background = 'var(--cream)' }}
            onMouseOut={(e) => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
          >
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: active ? '#111' : '#555', marginBottom: 2 }}>
              {cat.french_name}
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 11, color: active ? '#111' : '#888', letterSpacing: '0.06em' }}>
              {cat.english_sub}
            </div>
          </div>
        )
      })}
      <style>{`
        @media (max-width: 768px) {
          .cat-strip { flex-wrap: nowrap !important; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
          .cat-strip::-webkit-scrollbar { display: none; }
        }
      `}</style>
    </div>
  )
}

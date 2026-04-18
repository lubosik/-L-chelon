'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

const LOCALES = [
  { code: 'en', label: 'English' },
  { code: 'fr', label: 'Français' },
  { code: 'zh', label: '中文' },
  { code: 'ko', label: '한국어' },
]

export default function ViewToggle({ locale = 'en' }: { locale?: string }) {
  const pathname = usePathname()
  const router = useRouter()

  function switchLocale(targetLocale: string) {
    const segments = pathname.split('/').filter(Boolean)
    const isLocaleSegment = LOCALES.some((l) => l.code === segments[0])
    const rest = isLocaleSegment ? segments.slice(1) : segments
    const newPath = targetLocale === 'en' ? `/${rest.join('/')}` : `/${targetLocale}/${rest.join('/')}`
    router.push(newPath || '/')
  }

  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <div style={{
      background: 'var(--white)',
      borderBottom: '1px solid var(--light-border)',
      height: 38,
      padding: '0 40px',
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      overflowX: 'auto',
    }}>
      <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, letterSpacing: '0.16em', color: '#aaa', flexShrink: 0, marginRight: 4 }}>
        View in
      </span>
      {LOCALES.map((l) => {
        const active = l.code === locale
        return (
          <button
            key={l.code}
            onClick={() => switchLocale(l.code)}
            style={{
              fontFamily: 'Lato, sans-serif',
              fontSize: 8,
              letterSpacing: '0.14em',
              padding: '4px 12px',
              border: active ? '1px solid #111' : '1px solid #ddd',
              color: active ? '#111' : '#555',
              background: 'transparent',
              cursor: 'pointer',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            {l.label}
          </button>
        )
      })}
      <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
        <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, color: '#aaa', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
          L&apos;Échelon Index
        </span>
        <Link href={`${prefix}/intelligence`} className="btn-pill" style={{ fontSize: 8, padding: '5px 14px' }}>
          Unlock Intelligence ↗
        </Link>
      </div>
    </div>
  )
}

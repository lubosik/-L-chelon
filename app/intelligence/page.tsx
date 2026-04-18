'use client'

import { useEffect, useState } from 'react'
import type { IndexDataPoint } from '@/lib/strapi'

const TABS = [
  { key: 'fashion',    label: 'La Mode' },
  { key: 'motorsport', label: 'La Vitesse' },
  { key: 'watches',    label: "L'Horlogerie" },
  { key: 'equestrian', label: "L'Équitation" },
  { key: 'lifestyle',  label: "L'Art de Vivre" },
]

export default function IntelligencePage() {
  const [activeTab, setActiveTab] = useState('fashion')
  const [data, setData] = useState<IndexDataPoint[]>([])

  useEffect(() => {
    const base = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
    fetch(`${base}/api/index-data-points?sort=id:asc&pagination[limit]=50`)
      .then((r) => r.json())
      .then((res) => {
        const items = (res?.data ?? []).map((item: { id: number; attributes?: Record<string, unknown> }) =>
          item.attributes ? { id: item.id, ...item.attributes } : item
        )
        setData(items as IndexDataPoint[])
      })
      .catch(() => {})
  }, [])

  const filtered = data.filter((d) => !d.category || d.category === activeTab)

  return (
    <div style={{ background: '#ffffff', minHeight: '80vh' }}>
      <div style={{ padding: '64px 56px 40px', borderBottom: '1px solid #E2DED8', textAlign: 'center' }} className="intel-head">
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>
          Members Only
        </p>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(36px, 5vw, 64px)', color: '#111', marginBottom: 12 }}>
          L&apos;Échelon Index
        </h1>
        <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: '#555', letterSpacing: '0.10em' }}>
          Live intelligence across the five pillars of luxury
        </p>
      </div>

      <div style={{ padding: '0 56px 80px' }} className="intel-pad">
        <div style={{ display: 'flex', borderBottom: '1px solid #E2DED8', marginBottom: 48, gap: 0, overflowX: 'auto' }}>
          {TABS.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{
              fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.20em', textTransform: 'uppercase',
              color: activeTab === tab.key ? '#111' : '#999',
              padding: '14px 28px',
              borderBottom: activeTab === tab.key ? '2px solid #111' : '2px solid transparent',
              background: 'transparent', cursor: 'pointer', whiteSpace: 'nowrap',
              transition: 'color 0.2s', marginBottom: -1,
            }}>
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', border: '1px solid #E2DED8' }}>
          {(filtered.length ? filtered : data).map((item) => (
            <div key={item.id} style={{ padding: '28px 24px', borderRight: '1px solid #E2DED8', borderBottom: '1px solid #E2DED8', background: '#fff' }}>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7.5, letterSpacing: '0.18em', textTransform: 'uppercase', color: '#666', marginBottom: 12 }}>
                {item.label}
              </div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 36, color: '#111', lineHeight: 1, marginBottom: 8 }}>
                {item.is_premium ? '·  ·  ·' : item.value}
              </div>
              {item.change && (
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: item.change.includes('↑') ? '#6FCF97' : '#EB5757', marginBottom: 4 }}>
                  {item.change}
                </div>
              )}
              {item.sub && <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#777' }}>{item.sub}</div>}
            </div>
          ))}
          {!filtered.length && !data.length && (
            <div style={{ gridColumn: '1/-1', padding: '60px 24px', textAlign: 'center', fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#777', letterSpacing: '0.14em' }}>
              Intelligence data will appear here once added via Strapi CMS.
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .intel-head { padding: 40px 20px 28px !important; }
          .intel-pad { padding: 0 20px 60px !important; }
        }
      `}</style>
    </div>
  )
}

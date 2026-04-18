'use client'

import type { TickerItem } from '@/lib/strapi'

interface TickerProps {
  items: TickerItem[]
}

const FALLBACK: TickerItem[] = [
  { id: 1, text: 'Chanel Spring 2026 Couture · The full review', is_live: false, active: true },
  { id: 2, text: 'Monaco Grand Prix · Season preview', is_live: true, active: true },
  { id: 3, text: "Patek Philippe Ref. 5726 · Auction record broken at Christie's", is_live: false, active: true },
  { id: 4, text: 'Royal Ascot 2026 · Our stable selections', is_live: false, active: true },
  { id: 5, text: "Bvlgari's private island resort opens · The Échelon review", is_live: false, active: true },
]

export default function Ticker({ items }: TickerProps) {
  const data = items.length ? items : FALLBACK

  const renderItem = (item: TickerItem, idx: number) => (
    <span
      key={idx}
      style={{ display: 'inline-flex', alignItems: 'center', paddingLeft: 28, paddingRight: 28, whiteSpace: 'nowrap' }}
    >
      {item.is_live && (
        <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#111', marginRight: 6 }}>
          ● Live:&nbsp;
        </span>
      )}
      {!item.is_live && (
        <span style={{ color: '#ccc', marginRight: 10, fontSize: 8 }}>|</span>
      )}
      <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#555' }}>
        {item.text}
      </span>
    </span>
  )

  return (
    <div style={{
      width: '100%',
      background: 'var(--cream)',
      borderBottom: '1px solid var(--light-border)',
      height: 32,
      overflow: 'hidden',
      display: 'flex',
      alignItems: 'center',
    }}>
      <div className="ticker-inner" style={{ display: 'flex', alignItems: 'center', width: 'max-content' }}>
        {data.map((item, i) => renderItem(item, i))}
        {data.map((item, i) => renderItem(item, data.length + i))}
      </div>
    </div>
  )
}

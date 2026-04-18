'use client'

import Link from 'next/link'
import type { IndexDataPoint } from '@/lib/strapi'

const FALLBACK: IndexDataPoint[] = [
  { id: 1, label: 'Fashion IG reach · week', value: '842M',   change: '↑ 12%', sub: 'vs last week',   is_premium: false },
  { id: 2, label: 'Monaco GP viewership',    value: '112M',   change: '↑ 8%',  sub: 'peak broadcast', is_premium: false },
  { id: 3, label: 'Patek auction avg · YTD', value: '$2.4M',  change: '↑ 19%', sub: 'CHF adjusted',   is_premium: true },
  { id: 4, label: 'Ascot attendance YoY',    value: '94K',    change: '↑ 3%',  sub: 'ticket sales',   is_premium: true },
  { id: 5, label: "Bvlgari ADR · Q1 '26",   value: '$1,840', change: '↑ 6%',  sub: 'luxury avg',     is_premium: true },
  { id: 6, label: 'LV revenue · Q1 2026',   value: '€22.1B', change: '↑ 9%',  sub: 'YoY growth',     is_premium: true },
]

export default function IndexStrip({ data, isMember = false, locale = 'en' }: { data: IndexDataPoint[]; isMember?: boolean; locale?: string }) {
  const items = (data.length ? data : FALLBACK).slice(0, 6)
  const prefix = locale === 'en' ? '' : `/${locale}`

  return (
    <div style={{ background: 'var(--cream)', borderBottom: '1px solid var(--light-border)', padding: '14px 40px', display: 'flex', alignItems: 'center', overflow: 'hidden' }} className="index-strip">
      {/* Label */}
      <div style={{ borderRight: '1px solid var(--light-border)', paddingRight: 24, marginRight: 24, flexShrink: 0 }}>
        <span style={{ display: 'block', fontFamily: 'Lato, sans-serif', fontSize: 7.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#111', marginBottom: 2 }}>
          L&apos;Échelon Index
        </span>
        <span style={{ display: 'block', fontFamily: 'Lato, sans-serif', fontSize: 7.5, letterSpacing: '0.22em', textTransform: 'uppercase', color: '#999' }}>
          Live intelligence
        </span>
      </div>

      {/* Data points */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {items.map((item, i) => {
          const blurred = item.is_premium && !isMember
          return (
            <div key={item.id} style={{ padding: '0 20px', borderRight: i < items.length - 1 ? '1px solid var(--light-border)' : 'none', flexShrink: 0 }}>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#999', marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 20, lineHeight: 1,
                color: blurred ? '#ccc' : '#111',
                filter: blurred ? 'blur(6px)' : 'none',
                userSelect: blurred ? 'none' : 'auto',
              }}>
                {blurred ? '••••' : item.value}
              </div>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#aaa', marginTop: 3 }}>
                {item.sub}
              </div>
            </div>
          )
        })}
      </div>

      {/* Paywall */}
      <div style={{ marginLeft: 'auto', borderLeft: '1px solid var(--light-border)', paddingLeft: 20, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#999', whiteSpace: 'nowrap' }}>
          🔒 Full index · members only
        </span>
        <Link href={`${prefix}/subscribe`} className="btn-pill" style={{ fontSize: 8, padding: '5px 14px' }}>
          Unlock →
        </Link>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .index-strip { overflow-x: auto !important; padding: 12px 20px !important; -webkit-overflow-scrolling: touch; }
        }
      `}</style>
    </div>
  )
}

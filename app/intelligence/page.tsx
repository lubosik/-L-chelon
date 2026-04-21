'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler } from 'chart.js'
import { Line } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler)

const PILLARS = [
  { label: 'LA MODE', sub: 'Fashion IG Reach · Week', value: '842M', chartData: [520, 610, 580, 720, 690, 810, 790, 842] },
  { label: 'LA VITESSE', sub: 'Monaco GP Viewership · Season', value: '112M', chartData: [80, 88, 92, 85, 97, 104, 109, 112] },
  { label: "L'HORLOGERIE", sub: 'Patek Auction Avg · YTD', value: 'CHF 5.8M', chartData: [3.1, 3.8, 4.2, 4.0, 4.9, 5.2, 5.5, 5.8] },
  { label: "L'ÉQUITATION", sub: 'Ascot Attendance · YoY', value: '+14K', chartData: [2, -1, 4, 7, 5, 9, 12, 14] },
  { label: "L'ART DE VIVRE", sub: 'Superyacht Charter Revenue · Q1', value: '$2.8B', chartData: [1.4, 1.6, 1.8, 1.9, 2.1, 2.3, 2.6, 2.8] },
]

const WEEKS = ['W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7', 'W8']

const BENEFITS = [
  { num: '5', label: 'LIVE DATA', desc: 'One index per pillar updated weekly' },
  { num: 'Weekly', label: 'FREQUENCY', desc: 'New intelligence every seven days, without fail' },
  { num: '50+', label: 'DATA POINTS', desc: 'Auction results, social reach, sponsorship, attendance, revenue' },
  { num: 'First', label: 'PRIORITY ACCESS', desc: 'Waitlist members receive the index before public release' },
]

function BlurredChart({ data }: { data: number[] }) {
  const chartData = {
    labels: WEEKS,
    datasets: [{
      data,
      borderColor: 'rgba(255,255,255,0.15)',
      backgroundColor: 'transparent',
      borderWidth: 1.5,
      pointRadius: 0,
      tension: 0.4,
    }],
  }
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false }, tooltip: { enabled: false } },
    scales: {
      x: { display: false },
      y: { display: false },
    },
    animation: { duration: 0 } as { duration: number },
  }
  return (
    <div style={{ height: 80, filter: 'blur(4px)', userSelect: 'none', pointerEvents: 'none' }}>
      <Line data={chartData} options={options} />
    </div>
  )
}

export default function IntelligencePage() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return
    setStatus('sending')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'index-waitlist' }),
      })
      if (res.ok) {
        setStatus('done')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <div style={{ background: '#080808' }}>

      {/* SECTION 1 — HERO */}
      <section style={{
        height: '100vh', minHeight: 600, position: 'relative',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        textAlign: 'center', padding: '0 40px',
        backgroundImage: 'url(/la-vitesse.jpg)',
        backgroundSize: 'cover', backgroundPosition: 'center',
      }}>
        {/* Dark overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(8,8,8,0.85) 0%, rgba(8,8,8,0.70) 40%, rgba(8,8,8,0.90) 80%, rgba(8,8,8,1.0) 100%)' }} />

        <div style={{ position: 'relative', zIndex: 1, maxWidth: 900, width: '100%' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.38em', textTransform: 'uppercase', marginBottom: 20 }}>
            L&apos;ÉCHELON — INTELLIGENCE
          </p>
          <h1 style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 'clamp(48px, 7vw, 96px)', color: '#ffffff',
            lineHeight: 0.90, letterSpacing: '0.02em', marginBottom: 0,
          }}>
            The Intelligence of Luxury.
            <br />
            Before Anyone Else Knows.
          </h1>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, maxWidth: 560, margin: '24px auto 0' }}>
            L&apos;Échelon Index tracks what actually moves the luxury world — auction results, social momentum, sponsorship spend, brand heat — across fashion, motorsport, watches, equestrian, and lifestyle. Five pillars. Live data. Exclusive insight.
          </p>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.22em', textTransform: 'uppercase', marginTop: 20 }}>
            Early access is limited. Join the waitlist.
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: 'absolute', bottom: 32, left: '50%', transform: 'translateX(-50%)', fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.12em' }}>
          ↓
        </div>
      </section>

      {/* SECTION 2 — BLURRED CHART PREVIEWS */}
      <section style={{ background: '#0A0A0A', padding: '80px 56px' }} className="intel-pillars">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(28px, 3vw, 44px)', color: '#ffffff', textAlign: 'center', marginBottom: 10 }}>
            Five pillars. Measured. Weekly.
          </h2>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 48 }}>
            The only publication that doesn&apos;t just cover luxury — it measures it.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16 }} className="intel-grid">
            {PILLARS.map((p) => (
              <div key={p.label} style={{ background: '#111111', border: '1px solid rgba(255,255,255,0.08)', padding: 24, position: 'relative' }}>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {p.label}
                </div>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: 'rgba(255,255,255,0.30)', marginBottom: 12 }}>
                  {p.sub}
                </div>
                <BlurredChart data={p.chartData} />
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 28, color: '#ffffff', filter: 'blur(8px)', userSelect: 'none', marginTop: 10 }}>
                  {p.value}
                </div>
                {/* Lock overlay */}
                <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(8,8,8,0.20)' }}>
                  <span style={{ fontSize: 20, opacity: 0.60, marginBottom: 6 }}>🔒</span>
                  <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.18em', textTransform: 'uppercase', textAlign: 'center', padding: '0 8px' }}>
                    Join waitlist to unlock
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 3 — PSYCHOLOGICAL DESIRE */}
      <section style={{ background: '#111111', padding: '80px 56px' }}>
        <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(20px, 2.5vw, 30px)', color: 'rgba(255,255,255,0.70)', lineHeight: 1.4, marginBottom: 40 }}>
            &ldquo;The brands, the buyers, and the collectors who move markets will have this data. Will you?&rdquo;
          </p>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 40 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(20px, 2.5vw, 30px)', color: 'rgba(255,255,255,0.70)', lineHeight: 1.4, marginBottom: 40 }}>
            &ldquo;Curated by Nani Rosen — the editorial eye behind L&apos;Échelon — who has been in the rooms where these numbers are made.&rdquo;
          </p>
          <div style={{ height: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 40 }} />
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontStyle: 'italic', fontSize: 'clamp(20px, 2.5vw, 30px)', color: 'rgba(255,255,255,0.70)', lineHeight: 1.4 }}>
            &ldquo;The first issue of L&apos;Échelon Index drops this season. Waitlist members are notified first.&rdquo;
          </p>
        </div>
      </section>

      {/* SECTION 4 — WHAT YOU GET */}
      <section style={{ background: '#0A0A0A', padding: '80px 56px' }}>
        <div style={{ maxWidth: 1000, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 12 }}>
              WHAT MEMBERS RECEIVE
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(28px, 3vw, 44px)', color: '#ffffff' }}>
              Everything the luxury world is tracking. Nothing it isn&apos;t.
            </h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 0 }} className="intel-benefits">
            {BENEFITS.map((b) => (
              <div key={b.label} style={{ padding: '24px 24px 24px 0', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 36, color: 'rgba(255,255,255,0.15)', lineHeight: 1, marginBottom: 8 }}>
                  {b.num}
                </div>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.50)', letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: 4 }}>
                  {b.label}
                </div>
                <div style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.30)', lineHeight: 1.6 }}>
                  {b.desc}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 5 — WAITLIST FORM */}
      <section style={{ background: '#080808', padding: '96px 56px' }} className="intel-form-section">
        <div style={{ maxWidth: 560, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.20em', textTransform: 'uppercase', marginBottom: 8 }}>
            Be among the first to join the waitlist
          </p>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 16, color: 'rgba(255,255,255,0.40)', marginBottom: 32 }}>
            Waitlist closes when we reach capacity. Secure your place.
          </p>

          {status === 'done' ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: 32, height: 32, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.40)', margin: '0 auto 16px' }}>
                <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 600, fontSize: 14, color: '#ffffff', lineHeight: 1 }}>É</span>
              </div>
              <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 22, color: '#ffffff', textAlign: 'center', marginBottom: 8 }}>
                You&apos;re on the list.
              </h3>
              <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: 'rgba(255,255,255,0.45)', textAlign: 'center' }}>
                We&apos;ll notify you the moment L&apos;Échelon Index goes live.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your email address"
                required
                style={{
                  width: '100%', height: 52,
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  borderRadius: 0, color: '#ffffff',
                  fontFamily: 'Lato, sans-serif', fontSize: 16,
                  padding: '0 20px', outline: 'none', display: 'block',
                }}
                onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.50)' }}
                onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)' }}
              />
              <button
                type="submit"
                disabled={status === 'sending'}
                style={{
                  width: '100%', height: 52, marginTop: 10,
                  background: status === 'sending' ? '#ccc' : '#ffffff',
                  color: '#111111', border: 'none', borderRadius: 0, cursor: 'pointer',
                  fontFamily: 'Lato, sans-serif', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase',
                  transition: 'background 0.2s',
                }}
                onMouseOver={(e) => { if (status !== 'sending') (e.currentTarget as HTMLElement).style.background = '#E8E5E0' }}
                onMouseOut={(e) => { if (status !== 'sending') (e.currentTarget as HTMLElement).style.background = '#ffffff' }}
              >
                {status === 'sending' ? '...' : 'Join the Waitlist'}
              </button>
              {status === 'error' && (
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#EB5757', marginTop: 8, textAlign: 'center' }}>
                  Something went wrong. Please try again.
                </p>
              )}
            </form>
          )}

          <Link href="/" style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: 'rgba(255,255,255,0.35)', marginTop: 24, display: 'inline-block', borderBottom: '1px solid rgba(255,255,255,0.20)', cursor: 'pointer', textDecoration: 'none' }}>
            Continue reading L&apos;Échelon →
          </Link>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: 'rgba(255,255,255,0.20)', marginTop: 8 }}>
            Joining the waitlist also creates your free L&apos;Échelon account
          </p>
        </div>
      </section>

      <style>{`
        @media (max-width: 1024px) {
          .intel-grid { grid-template-columns: repeat(3, 1fr) !important; }
          .intel-benefits { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 768px) {
          .intel-pillars { padding: 60px 24px !important; }
          .intel-grid { grid-template-columns: 1fr !important; }
          .intel-benefits { grid-template-columns: repeat(2, 1fr) !important; }
          .intel-form-section { padding: 60px 24px !important; }
        }
        @media (max-width: 480px) {
          .intel-benefits { grid-template-columns: 1fr !important; }
        }
        /* Placeholder color for dark input */
        input::placeholder { color: rgba(255,255,255,0.30); }
      `}</style>
    </div>
  )
}

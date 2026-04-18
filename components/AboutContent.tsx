'use client'

import Link from 'next/link'
import NewsletterCapture from '@/components/NewsletterCapture'

const PILLARS = [
  { french: 'LA MODE',        english: 'Fashion',    tagline: 'Where the atelier meets the algorithm.' },
  { french: 'LA VITESSE',     english: 'Motorsport', tagline: 'The pursuit of the perfect lap.' },
  { french: "L'HORLOGERIE",   english: 'Watches',    tagline: 'Time, measured in masterpieces.' },
  { french: "L'ÉQUITATION",   english: 'Equestrian', tagline: 'The oldest luxury sport, reimagined.' },
  { french: "L'ART DE VIVRE", english: 'Lifestyle',  tagline: 'The art of living without compromise.' },
]

const MANIFESTO = [
  {
    label: 'The Gap',
    heading: 'Something was missing.',
    body: [
      'For decades, luxury publishing has been fragmented. Fashion titles that never glance at the paddock. Watch magazines that forget the polo field exists. Lifestyle supplements written for a reader who apparently only does one thing.',
      "L'Échelon was founded to close that gap: to build a publication for the reader who moves between worlds. The one who has a trackday booked the same week as couture fittings. Who follows the Patek auction results and the Grand Prix schedule with equal attention.",
    ],
  },
  {
    label: 'The Standard',
    heading: 'Luxury is not a price point.',
    body: [
      'It is a standard of attention. Of craft. Of knowing precisely why something matters and refusing to be satisfied with anything less.',
      "That standard governs every issue of L'Échelon. We do not publish press releases dressed as journalism. We do not treat our readers as consumers to be sold to. We treat them as peers: people who already know the territory and want reporting that takes them deeper into it.",
    ],
  },
  {
    label: 'The Format',
    heading: 'Twice monthly. By design.',
    body: [
      'We publish twice a month, not twice a day. Because real intelligence requires time: time to report from the rooms where decisions are made, time to understand what something actually means before declaring it significant.',
      "In a media landscape addicted to velocity, L'Échelon is a deliberate choice to go slower and go deeper. Our readers are not chasing the feed. They are building their understanding.",
    ],
  },
]

export default function AboutContent() {
  return (
    <>
      {/* ── ABOUT HERO ── */}
      <section style={{ position: 'relative', height: '70vh', minHeight: 480, background: '#0A0A0A', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 16 }}>
            About
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(52px, 7vw, 88px)', color: '#ffffff', letterSpacing: '0.04em', marginBottom: 20 }}>
            L&apos;Échelon
          </h1>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: 'rgba(255,255,255,0.50)' }}>
            A publication for those who move between worlds.
          </p>
        </div>
      </section>

      {/* ── MANIFESTO SECTIONS ── */}
      {MANIFESTO.map((section, i) => (
        <section
          key={section.label}
          style={{ background: i % 2 === 0 ? '#ffffff' : '#F8F7F5', padding: '88px 56px' }}
          className="about-section"
        >
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20 }}>
              {section.label}
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#111', lineHeight: 1.1, marginBottom: 32 }}>
              {section.heading}
            </h2>
            {section.body.map((para, j) => (
              <p key={j} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: '#555', lineHeight: 1.85, marginBottom: j < section.body.length - 1 ? 20 : 0 }}>
                {para}
              </p>
            ))}
          </div>
        </section>
      ))}

      {/* ── THE FIVE PILLARS ── */}
      <section style={{ background: '#111111', padding: '80px 56px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 42, color: '#ffffff', textAlign: 'center', marginBottom: 8 }}>
            Five Pillars
          </h2>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 12, color: 'rgba(255,255,255,0.35)', textAlign: 'center', marginBottom: 20 }}>
            Five worlds. One sensibility.
          </p>
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.12)', margin: '0 auto 48px' }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 0 }} className="pillars-grid">
            {PILLARS.map((p, i) => (
              <div key={p.english} style={{ borderLeft: i > 0 ? '1px solid rgba(255,255,255,0.08)' : 'none', paddingLeft: i > 0 ? 24 : 0, borderTop: '1px solid rgba(255,255,255,0.10)', paddingTop: 24 }}>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 8 }}>
                  {p.french}
                </p>
                <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 26, color: '#ffffff', marginBottom: 8 }}>
                  {p.english}
                </p>
                <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 11, color: 'rgba(255,255,255,0.40)', lineHeight: 1.6 }}>
                  {p.tagline}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHAT WE STAND FOR ── */}
      <section style={{ background: '#ffffff', padding: '80px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16 }}>
            In Every Issue
          </p>
          {[
            'Reporting that goes inside, not around.',
            'Intelligence that belongs to our readers, not our advertisers.',
            'A standard of elegance that does not apologise for itself.',
          ].map((s) => (
            <p key={s} style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 24, color: '#333', lineHeight: 1.3, marginBottom: 32 }}>
              &ldquo;{s}&rdquo;
            </p>
          ))}
          <Link href="/subscribe" className="about-cta-link">
            Join the intelligence →
          </Link>
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <NewsletterCapture />

      <style>{`
        .about-cta-link {
          display: inline-block;
          margin-top: 8px;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 16px;
          color: #444;
          border-bottom: 1px solid #ccc;
          padding-bottom: 3px;
          text-decoration: none;
          transition: color 0.2s, border-color 0.2s;
        }
        .about-cta-link:hover { color: #111; border-bottom-color: #333; }
        @media (max-width: 768px) {
          .about-section { padding: 48px 20px !important; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .pillars-grid > div { border-left: none !important; padding-left: 0 !important; margin-bottom: 28px; }
        }
      `}</style>
    </>
  )
}

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

      {/* ── SECTION 1: THE MISSION ── */}
      <section style={{ background: '#ffffff', padding: '96px 56px' }} className="about-mission">
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 20 }}>
            Our Purpose
          </p>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(32px, 3.5vw, 48px)', color: '#111', lineHeight: 1.1, marginBottom: 32 }}>
            Luxury is not a price point. It is a standard of attention.
          </h2>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: '#555', lineHeight: 1.85, marginBottom: 20 }}>
            L&apos;Échelon was founded on a simple conviction: that the world&apos;s most discerning readers deserve a publication that speaks to the full breadth of their lives — not just their wardrobes, not just their garages, but the complete architecture of a life lived with intention.
          </p>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: '#555', lineHeight: 1.85 }}>
            We cover five pillars — fashion, motorsport, watches, equestrian, and lifestyle — not because they are separate categories, but because they are connected expressions of the same sensibility. The person who understands why a Patek Philippe movement takes three years to finish also understands why a polo pony is trained for five before its first match.
          </p>
        </div>
      </section>

      {/* ── SECTION 2: THE FOUNDER ── */}
      <section style={{ background: '#F8F7F5', padding: '80px 56px' }} className="founder-section">
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'grid', gridTemplateColumns: '40% 60%' }} className="founder-grid">
          <div>
            <div style={{ width: '100%', aspectRatio: '3/4', background: '#E8E5E0', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#bbb', letterSpacing: '0.10em' }}>Portrait</span>
            </div>
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.16em', textTransform: 'uppercase', marginTop: 16 }}>
              Nani Rosen · Founder &amp; Editor
            </p>
          </div>
          <div style={{ paddingLeft: 64 }} className="founder-copy">
            <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16 }}>
              The Founder
            </p>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 34, color: '#111', lineHeight: 1.1, marginBottom: 24 }}>
              From the paddock to the atelier, I cover the world I know.
            </h2>
            <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: '#555', lineHeight: 1.85, marginBottom: 16 }}>
              Nani Rosen has spent more than a decade inside the rooms where luxury is made — not reported from press releases, but witnessed at close range. From front-row access at Paris Couture to paddock credentials at Monaco, her editorial eye is trained on the moment before the moment the world sees.
            </p>
            <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: '#555', lineHeight: 1.85, marginBottom: 28 }}>
              L&apos;Échelon is her answer to a question she kept asking: where is the publication for the reader who is equally at home at Ascot and at Watches &amp; Wonders? It didn&apos;t exist. So she built it.
            </p>
            <Link href="/category/la-mode" className="about-cta-link">
              Read her latest →
            </Link>
          </div>
        </div>
      </section>

      {/* ── SECTION 3: THE FIVE PILLARS ── */}
      <section style={{ background: '#111111', padding: '80px 56px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 42, color: '#ffffff', textAlign: 'center', marginBottom: 8 }}>
            The Five Pillars
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

      {/* ── SECTION 4: WHAT WE STAND FOR ── */}
      <section style={{ background: '#ffffff', padding: '80px 56px', textAlign: 'center' }}>
        <div style={{ maxWidth: 760, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.28em', textTransform: 'uppercase', marginBottom: 16 }}>
            In Every Issue
          </p>
          {[
            'Reporting that goes inside — not around.',
            'Intelligence that belongs to our readers, not our advertisers.',
            'A standard of elegance that does not apologise for itself.',
          ].map((s) => (
            <p key={s} style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 24, color: '#333', lineHeight: 1.3, marginBottom: 32 }}>
              &ldquo;{s}&rdquo;
            </p>
          ))}
        </div>
      </section>

      {/* ── SECTION 5: NEWSLETTER ── */}
      <NewsletterCapture />

      <style>{`
        .about-cta-link {
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
          .about-mission { padding: 48px 20px !important; }
          .founder-section { padding: 48px 20px !important; }
          .founder-grid { grid-template-columns: 1fr !important; }
          .founder-copy { padding-left: 0 !important; padding-top: 32px; }
          .pillars-grid { grid-template-columns: 1fr !important; }
          .pillars-grid > div { border-left: none !important; padding-left: 0 !important; margin-bottom: 28px; }
        }
      `}</style>
    </>
  )
}

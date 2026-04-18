import Link from 'next/link'

export const metadata = {
  title: "L'Échelon Index",
  description: "Live intelligence across the five pillars of luxury. Coming soon.",
}

const PILLARS = [
  { french: 'LA MODE',        english: 'Fashion' },
  { french: 'LA VITESSE',     english: 'Motorsport' },
  { french: "L'HORLOGERIE",   english: 'Watches' },
  { french: "L'ÉQUITATION",   english: 'Equestrian' },
  { french: "L'ART DE VIVRE", english: 'Lifestyle' },
]

export default function IntelligencePage() {
  return (
    <div style={{ background: '#0A0A0A', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>

      {/* Hero */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '120px 56px 80px',
        textAlign: 'center',
        position: 'relative',
      }}>
        {/* Ambient line */}
        <div style={{ width: 1, height: 64, background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.15))', marginBottom: 48 }} />

        <p style={{
          fontFamily: 'Lato, sans-serif',
          fontSize: 9,
          letterSpacing: '0.30em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.35)',
          marginBottom: 28,
        }}>
          Coming Soon
        </p>

        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif',
          fontWeight: 300,
          fontStyle: 'italic',
          fontSize: 'clamp(48px, 7vw, 96px)',
          color: '#ffffff',
          lineHeight: 1,
          letterSpacing: '0.02em',
          marginBottom: 32,
        }}>
          L&apos;Échelon Index
        </h1>

        <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.18)', marginBottom: 36 }} />

        <p style={{
          fontFamily: 'Lato, sans-serif',
          fontWeight: 300,
          fontSize: 13,
          color: 'rgba(255,255,255,0.50)',
          letterSpacing: '0.12em',
          lineHeight: 1.9,
          maxWidth: 560,
          marginBottom: 64,
        }}>
          A living archive of refinement. L&apos;Échelon Index gathers the signals that define the season across
          fashion, horology, motorsport, equestrian, and the art of living well. Curated for those who
          require precision where others settle for opinion.
        </p>

        {/* Pillars */}
        <div style={{
          display: 'flex',
          gap: 0,
          borderTop: '1px solid rgba(255,255,255,0.08)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          marginBottom: 72,
          width: '100%',
          maxWidth: 800,
        }}
          className="pillars-grid"
        >
          {PILLARS.map((p) => (
            <div key={p.french} style={{
              flex: 1,
              padding: '28px 20px',
              borderRight: '1px solid rgba(255,255,255,0.08)',
              borderBottom: '1px solid rgba(255,255,255,0.08)',
              textAlign: 'center',
            }}>
              <div style={{
                fontFamily: 'Lato, sans-serif',
                fontSize: 7,
                letterSpacing: '0.24em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.25)',
                marginBottom: 10,
              }}>
                {p.french}
              </div>
              <div style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontStyle: 'italic',
                fontWeight: 300,
                fontSize: 15,
                color: 'rgba(255,255,255,0.45)',
              }}>
                {p.english}
              </div>
            </div>
          ))}
        </div>

        <Link href="/" style={{
          fontFamily: 'Lato, sans-serif',
          fontSize: 9,
          letterSpacing: '0.22em',
          textTransform: 'uppercase',
          color: 'rgba(255,255,255,0.40)',
          textDecoration: 'none',
          borderBottom: '1px solid rgba(255,255,255,0.15)',
          paddingBottom: 3,
          transition: 'color 0.2s, border-color 0.2s',
        }}
          onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#fff'; el.style.borderBottomColor = 'rgba(255,255,255,0.5)' }}
          onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = 'rgba(255,255,255,0.40)'; el.style.borderBottomColor = 'rgba(255,255,255,0.15)' }}
        >
          Return to L&apos;Échelon
        </Link>

        <div style={{ width: 1, height: 64, background: 'linear-gradient(to bottom, rgba(255,255,255,0.15), transparent)', marginTop: 48 }} />
      </div>

      <style>{`
        @media (max-width: 768px) {
          .pillars-grid { flex-wrap: wrap; }
          .pillars-grid > div { flex: 0 0 50% !important; }
        }
        @media (max-width: 480px) {
          .pillars-grid > div { flex: 0 0 100% !important; }
        }
      `}</style>
    </div>
  )
}

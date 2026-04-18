import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const title = searchParams.get('title') ?? "L'Échelon"
  const category = searchParams.get('category') ?? ''

  return new ImageResponse(
    (
      <div style={{
        background: '#0A0A0A',
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: '60px',
      }}>
        <div style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(to top right, rgba(0,0,0,0.8) 0%, rgba(20,20,20,0.6) 100%)',
        }} />
        {category && (
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.40)', letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: 16, fontFamily: 'serif' }}>
            {category}
          </div>
        )}
        <div style={{ fontSize: 52, color: '#ffffff', lineHeight: 1.05, maxWidth: 900, fontWeight: 300, fontFamily: 'serif', marginBottom: 32 }}>
          {title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 40, height: 1, background: 'rgba(255,255,255,0.30)' }} />
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'serif' }}>
            L&apos;ÉCHELON
          </div>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}

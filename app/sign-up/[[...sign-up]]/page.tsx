import { SignUp } from '@clerk/nextjs'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: "Create Account | L'Échelon",
  description: "Join L'Échelon. Access the full editorial intelligence platform across the five pillars of luxury.",
}

export default function SignUpPage() {
  return (
    <div style={{
      minHeight: '100vh',
      background: '#0A0A0A',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 24px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background texture */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 50% 30%, rgba(255,255,255,0.03) 0%, transparent 70%)',
        pointerEvents: 'none',
      }} />

      {/* Masthead */}
      <div style={{ textAlign: 'center', marginBottom: 40, position: 'relative', zIndex: 1 }}>
        <p style={{
          fontFamily: 'Lato, sans-serif', fontSize: 9, color: 'rgba(255,255,255,0.30)',
          letterSpacing: '0.32em', textTransform: 'uppercase', marginBottom: 16,
        }}>
          Join L&apos;Échelon
        </p>
        <h1 style={{
          fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          fontWeight: 300, fontSize: 'clamp(32px, 5vw, 44px)',
          color: '#ffffff', letterSpacing: '0.06em', lineHeight: 1,
          marginBottom: 8,
        }}>
          Create Your Account
        </h1>
        <div style={{ width: 36, height: '0.5px', background: 'rgba(255,255,255,0.20)', margin: '16px auto 0' }} />
        <p style={{
          fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic',
          fontSize: 15, color: 'rgba(255,255,255,0.40)', marginTop: 16,
        }}>
          Five pillars. One membership.
        </p>
      </div>

      {/* Clerk sign-up component */}
      <div style={{ position: 'relative', zIndex: 1, width: '100%', maxWidth: 480 }}>
        <SignUp
          appearance={{
            elements: {
              rootBox: { width: '100%' },
              card: {
                background: '#141414',
                border: '1px solid rgba(255,255,255,0.10)',
                borderRadius: 0,
                boxShadow: 'none',
                padding: '40px',
              },
              headerTitle: {
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                fontWeight: 300,
                color: '#ffffff',
                fontSize: '22px',
              },
              headerSubtitle: {
                fontFamily: "'Lato', sans-serif",
                color: 'rgba(255,255,255,0.40)',
                fontSize: '11px',
                letterSpacing: '0.08em',
              },
              formFieldLabel: {
                fontFamily: "'Lato', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                color: 'rgba(255,255,255,0.50)',
              },
              formFieldInput: {
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid rgba(255,255,255,0.20)',
                borderRadius: 0,
                color: '#ffffff',
                fontFamily: "'Lato', sans-serif",
                fontSize: '13px',
                padding: '10px 0',
              },
              formButtonPrimary: {
                background: '#ffffff',
                color: '#111111',
                fontFamily: "'Lato', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                borderRadius: 0,
                padding: '14px',
                boxShadow: 'none',
              },
              footerActionText: {
                fontFamily: "'Lato', sans-serif",
                color: 'rgba(255,255,255,0.35)',
                fontSize: '11px',
              },
              footerActionLink: {
                fontFamily: "'Cormorant Garamond', serif",
                fontStyle: 'italic',
                color: 'rgba(255,255,255,0.70)',
                fontSize: '14px',
              },
              identityPreviewText: { color: 'rgba(255,255,255,0.60)' },
              identityPreviewEditButton: { color: 'rgba(255,255,255,0.40)' },
              dividerLine: { background: 'rgba(255,255,255,0.08)' },
              dividerText: { color: 'rgba(255,255,255,0.25)', fontFamily: "'Lato', sans-serif", fontSize: '9px' },
              socialButtonsBlockButton: {
                background: 'transparent',
                border: '1px solid rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.60)',
                borderRadius: 0,
                fontFamily: "'Lato', sans-serif",
                fontSize: '9px',
                letterSpacing: '0.12em',
              },
              alertText: { fontFamily: "'Lato', sans-serif", fontSize: '11px' },
            },
            variables: {
              colorBackground: '#141414',
              colorText: '#ffffff',
              colorPrimary: '#ffffff',
              colorInputBackground: 'transparent',
              colorInputText: '#ffffff',
              borderRadius: '0px',
              fontFamily: "'Lato', sans-serif",
            },
          }}
        />
      </div>
    </div>
  )
}

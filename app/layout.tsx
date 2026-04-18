import type { Metadata } from 'next'
import { Cormorant_Garamond, Lato } from 'next/font/google'
import { ClerkProvider } from '@clerk/nextjs'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import SubscribePopup from '@/components/SubscribePopup'
import '@/styles/globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-lato',
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL('https://lechelon.com'),
  title: {
    default: "L'Échelon | Luxury Media Intelligence: Fashion, Watches, Motorsport and More",
    template: "%s | L'Échelon",
  },
  description: "L'Échelon is the luxury editorial intelligence platform covering haute couture, Formula One, watch auctions, equestrian, and superyacht lifestyle. Twice monthly. For those who move between worlds.",
  keywords: ['luxury media outlet', 'luxury lifestyle magazine', 'luxury fashion editorial', 'luxury watch news', 'F1 luxury lifestyle', 'polo luxury lifestyle', 'haute couture news', 'luxury intelligence platform'],
  openGraph: {
    siteName: "L'Échelon",
    type: 'website',
    locale: 'en_US',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
    <html lang="en" className={`${cormorant.variable} ${lato.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Nav />
        <SubscribePopup />
        <main style={{ paddingTop: 56 }}>
          {children}
        </main>
        <Footer />
      </body>
    </html>
    </ClerkProvider>
  )
}

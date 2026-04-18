import type { Metadata } from 'next'
import AboutContent from '@/components/AboutContent'

export const metadata: Metadata = {
  title: "About L'Échelon — Luxury Editorial Intelligence Platform",
  description: "L'Échelon was founded on the belief that luxury is not a price point — it is a standard of attention. A publication for those who move between paddocks, polo fields, and Paris ateliers.",
  openGraph: { title: "About L'Échelon", description: "A publication for those who move between worlds." },
  alternates: { canonical: 'https://lechelon.com/about' },
}

const aboutSchema = {
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  'name': "About L'Échelon",
  'url': 'https://lechelon.com/about',
  'description': "L'Échelon is the luxury editorial intelligence platform founded on the belief that luxury is not a price point — it is a standard of attention.",
  'mainEntity': { '@id': 'https://lechelon.com/#organization' },
}

export default function AboutPage() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(aboutSchema) }} />
      <AboutContent />
    </>
  )
}

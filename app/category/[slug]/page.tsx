import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchCategoryBySlug, fetchArticles } from '@/lib/strapi'
import type { Category, Article } from '@/lib/strapi'

const FALLBACK_CATEGORIES: Record<string, Category & { tagline: string; intro: string }> = {
  'la-mode': {
    id: 1, name: 'Fashion', slug: 'la-mode', french_name: 'La Mode', english_sub: 'Fashion', hero_video_slug: 'la-mode',
    tagline: 'Where the atelier meets the algorithm.',
    intro: "L'Échelon's fashion editorial covers haute couture from the ateliers of Paris to the streets of Milan, the runways of New York to the concept stores of Tokyo. We report on the creative decisions that define the season — not the season itself, but the thinking behind it. What a collection chooses to say about time, about the body, about culture. From Couture Week analysis to the secondary market movements that signal where fashion is actually going, La Mode is the intelligence layer that sits beneath the surface of fashion's most visible moments.",
  },
  'la-vitesse': {
    id: 2, name: 'Motorsport', slug: 'la-vitesse', french_name: 'La Vitesse', english_sub: 'Motorsport', hero_video_slug: 'la-vitesse',
    tagline: 'The pursuit of the perfect lap.',
    intro: "Formula One is the most commercially sophisticated sport on earth. A single race weekend involves more moving parts, more capital, and more brand strategy than most industries manage in a year. L'Échelon's motorsport editorial goes inside — into the paddock, into the hospitality suites, into the sponsorship agreements and the technical partnerships that determine which logos sit where on a car worth $20 million. La Vitesse covers the sport as luxury culture, not as a results service.",
  },
  'lhorlogerie': {
    id: 3, name: 'Watches', slug: 'lhorlogerie', french_name: "L'Horlogerie", english_sub: 'Watches', hero_video_slug: 'lhorlogerie',
    tagline: 'Time, measured in masterpieces.',
    intro: "The world's finest watches are not accessories. They are arguments. Each one makes a case for a particular understanding of time, craft, and value — a case that takes between three and forty years to build in a workshop somewhere in the Vallée de Joux. L'Échelon's watch editorial tracks the auction results, the manufacture releases, and the collector conversations that determine what the market believes right now. From Christie's Geneva to Watches & Wonders, L'Horlogerie is the intelligence platform for the serious collector.",
  },
  'lequitation': {
    id: 4, name: 'Equestrian', slug: 'lequitation', french_name: "L'Équitation", english_sub: 'Equestrian', hero_video_slug: 'lequitation',
    tagline: 'The oldest luxury sport, reimagined.',
    intro: "Polo is the oldest luxury sport still played at the highest level of international competition. It has been the backdrop of royal patronage, great wealth, and extraordinary horsemanship for more than a century. L'Échelon's equestrian editorial covers the season — from Royal Windsor to the Argentine Open — with the same editorial rigour we bring to Formula One and haute couture. The brands that align with equestrian sport understand something that most marketing strategies miss: that the audience in the stands is not watching the match. They are living inside it.",
  },
  'lart-de-vivre': {
    id: 5, name: 'Lifestyle', slug: 'lart-de-vivre', french_name: "L'Art de Vivre", english_sub: 'Lifestyle', hero_video_slug: 'lart-de-vivre',
    tagline: 'The art of living without compromise.',
    intro: "The art of living without compromise. L'Échelon's lifestyle editorial covers the decisions that define how the world's most discerning individuals choose to spend their time — the yacht they charter, the villa they rent, the restaurant they call ahead for. Not as aspiration. As intelligence. Charter season reviews, private aviation briefings, and the real conversations that happen when the cost of the decision has more zeros than most people's mortgages.",
  },
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'la-mode': { title: "La Mode — Luxury Fashion Editorial | L'Échelon", description: "Couture coverage, runway analysis, and fashion intelligence from Paris, Milan, and New York. L'Échelon's fashion editorial for the discerning reader." },
  'la-vitesse': { title: "La Vitesse — Formula One & Luxury Motorsport | L'Échelon", description: "Inside the paddock, inside the hospitality suites, inside the decisions that define Formula One's most exclusive season. Motorsport intelligence from L'Échelon." },
  'lhorlogerie': { title: "L'Horlogerie — Luxury Watch News & Auction Intelligence | L'Échelon", description: "Watch auction results, manufacture visits, and haute horlogerie editorial. From Patek Philippe to independent watchmakers — the L'Échelon watch intelligence." },
  'lequitation': { title: "L'Équitation — Polo & Equestrian Lifestyle | L'Échelon", description: "Royal Ascot, Royal Windsor Polo, and the world's most exclusive equestrian calendar. L'Échelon's equestrian intelligence for the serious polo and racing enthusiast." },
  'lart-de-vivre': { title: "L'Art de Vivre — Superyacht & Luxury Lifestyle | L'Échelon", description: "Superyacht charter intelligence, private aviation, and the art of living without compromise. L'Échelon's lifestyle editorial for the ultra-high-net-worth reader." },
}

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const meta = CATEGORY_META[slug]
  return {
    title: meta?.title ?? "L'Échelon",
    description: meta?.description ?? '',
    openGraph: { title: meta?.title, description: meta?.description, images: [`/og/${slug}.jpg`] },
    alternates: { canonical: `https://lechelon.com/category/${slug}` },
  }
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [strapiCategory, articles] = await Promise.all([
    fetchCategoryBySlug(slug),
    fetchArticles({ category: slug, limit: 20 }),
  ])
  const fallback = FALLBACK_CATEGORIES[slug]
  const category = strapiCategory ?? fallback ?? null
  const tagline = fallback?.tagline ?? ''
  const intro = fallback?.intro ?? ''

  const categorySchema = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    'name': `${category?.french_name} — ${category?.english_sub} | L'Échelon`,
    'url': `https://lechelon.com/category/${slug}`,
    'isPartOf': { '@id': 'https://lechelon.com/#website' },
    'breadcrumb': {
      '@type': 'BreadcrumbList',
      'itemListElement': [
        { '@type': 'ListItem', 'position': 1, 'name': 'Home', 'item': 'https://lechelon.com' },
        { '@type': 'ListItem', 'position': 2, 'name': category?.english_sub ?? slug, 'item': `https://lechelon.com/category/${slug}` },
      ],
    },
  }

  if (!category) {
    return <div style={{ padding: '80px 56px', textAlign: 'center' }}><p style={{ fontFamily: 'Lato, sans-serif', color: '#333', fontSize: 13 }}>Category not found.</p></div>
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />

      {/* ── CATEGORY HERO ── */}
      <section style={{ position: 'relative', height: '100vh', minHeight: 600, overflow: 'hidden', background: '#0A0A0A' }}>
        <video
          autoPlay muted loop playsInline preload="none"
          poster={`/heroes/${category.hero_video_slug}.jpg`}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 1 }}
        >
          <source src={`/heroes/${category.hero_video_slug}.mp4`} type="video/mp4" />
        </video>
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 2 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 12 }}>
            {category.french_name}
          </p>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(72px, 10vw, 128px)', color: '#ffffff', letterSpacing: '0.02em', lineHeight: 0.90, marginBottom: 20 }}>
            {category.english_sub ?? category.name}
          </h1>
          {tagline && (
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 18, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.06em', marginBottom: 32 }}>
              {tagline}
            </p>
          )}
          <div style={{ width: 48, height: 1, background: 'rgba(255,255,255,0.25)', marginBottom: 20 }} />
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 9, color: 'rgba(255,255,255,0.30)', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
            {articles.length} {articles.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
      </section>

      {/* ── CATEGORY INTRO (pillar content for SEO) ── */}
      {intro && (
        <section style={{ background: '#ffffff', padding: '64px 56px' }} className="cat-intro">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: '#555', lineHeight: 1.85 }}>
              {intro}
            </p>
          </div>
        </section>
      )}

      {/* ── ARTICLE FEED (alternating layout) ── */}
      <section style={{ background: '#ffffff', padding: '0 56px 80px' }} className="cat-feed">
        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          {articles.length > 0 ? articles.map((article, i) => (
            <AlternatingArticle key={article.id} article={article} reverse={i % 2 !== 0} />
          )) : (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#bbb', letterSpacing: '0.14em' }}>
                Articles will appear here once Strapi is connected.
              </p>
            </div>
          )}
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .cat-intro { padding: 40px 20px !important; }
          .cat-feed { padding: 0 20px 48px !important; }
        }
      `}</style>
    </>
  )
}

function AlternatingArticle({ article, reverse }: { article: Article; reverse: boolean }) {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 64,
      padding: '56px 0',
      borderBottom: '1px solid #E2DED8',
      direction: reverse ? 'rtl' : 'ltr',
    }} className="alt-article">
      <div style={{ position: 'relative', height: 380, background: '#E8E5E0', overflow: 'hidden', direction: 'ltr' }}>
        {article.cover_image && (
          <Image src={article.cover_image.url} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" />
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', direction: 'ltr' }}>
        <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 14 }}>
          {article.category?.french_name ?? "L'Échelon"}
        </p>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 28, color: '#111', lineHeight: 1.1, textTransform: 'uppercase', marginBottom: 16 }}>
          {article.title}
        </h2>
        {article.excerpt && (
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#666', lineHeight: 1.7, marginBottom: 20 }}>
            {article.excerpt}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#bbb' }}>
            By {article.author?.name ?? "L'Échelon"} · {article.read_time ?? 5} min read
          </span>
        </div>
        <Link href={`/article/${article.slug}`} style={{
          fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 15, color: '#333',
          borderBottom: '1px solid #ccc', paddingBottom: 3, width: 'fit-content', textDecoration: 'none',
          transition: 'color 0.2s, border-color 0.2s',
        }}
          onMouseOver={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#111'; el.style.borderBottomColor = '#333' }}
          onMouseOut={(e) => { const el = e.currentTarget as HTMLElement; el.style.color = '#333'; el.style.borderBottomColor = '#ccc' }}
        >
          Read now →
        </Link>
      </div>
      <style>{`
        @media (max-width: 768px) {
          .alt-article { grid-template-columns: 1fr !important; direction: ltr !important; gap: 24px !important; padding: 40px 0 !important; }
        }
      `}</style>
    </div>
  )
}

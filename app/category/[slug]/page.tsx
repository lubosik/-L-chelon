import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { fetchCategoryBySlug, fetchArticles } from '@/lib/strapi'
import type { Category, Article } from '@/lib/strapi'
import CategoryVideoLoop from '@/components/CategoryVideoLoop'
import { getCoverImage } from '@/lib/categoryImages'

const FALLBACK_CATEGORIES: Record<string, Category & { tagline: string; intro: string }> = {
  'la-mode': {
    id: 1, name: 'Fashion', slug: 'la-mode', french_name: 'La Mode', english_sub: 'Fashion', hero_video_slug: 'la-mode',
    tagline: 'Where the atelier meets the algorithm.',
    intro: "L'Échelon's fashion editorial covers haute couture from the ateliers of Paris to the streets of Milan, the runways of New York to the concept stores of Tokyo. We report on the creative decisions that define the season: not the season itself, but the thinking behind it. What a collection chooses to say about time, about the body, about culture. From Couture Week analysis to the secondary market movements that signal where fashion is actually going, La Mode is the intelligence layer that sits beneath the surface of fashion's most visible moments.",
  },
  'la-vitesse': {
    id: 2, name: 'Motorsport', slug: 'la-vitesse', french_name: 'La Vitesse', english_sub: 'Motorsport', hero_video_slug: 'la-vitesse',
    tagline: 'The pursuit of the perfect lap.',
    intro: "Formula One is the most commercially sophisticated sport on earth. A single race weekend involves more moving parts, more capital, and more brand strategy than most industries manage in a year. L'Échelon's motorsport editorial goes inside: into the paddock, into the hospitality suites, into the sponsorship agreements and the technical partnerships that determine which logos sit where on a car worth $20 million. La Vitesse covers the sport as luxury culture, not as a results service.",
  },
  'lhorlogerie': {
    id: 3, name: 'Watches', slug: 'lhorlogerie', french_name: "L'Horlogerie", english_sub: 'Watches', hero_video_slug: 'lhorlogerie',
    tagline: 'Time, measured in masterpieces.',
    intro: "The world's finest watches are not accessories. They are arguments. Each one makes a case for a particular understanding of time, craft, and value: a case that takes between three and forty years to build in a workshop somewhere in the Vallée de Joux. L'Échelon's watch editorial tracks the auction results, the manufacture releases, and the collector conversations that determine what the market believes right now. From Christie's Geneva to Watches and Wonders, L'Horlogerie is the intelligence platform for the serious collector.",
  },
  'lequitation': {
    id: 4, name: 'Equestrian', slug: 'lequitation', french_name: "L'Équitation", english_sub: 'Equestrian', hero_video_slug: 'lequitation',
    tagline: 'The oldest luxury sport, reimagined.',
    intro: "Polo is the oldest luxury sport still played at the highest level of international competition. It has been the backdrop of royal patronage, great wealth, and extraordinary horsemanship for more than a century. L'Échelon's equestrian editorial covers the season: from Royal Windsor to the Argentine Open, with the same editorial rigour we bring to Formula One and haute couture. The brands that align with equestrian sport understand something that most marketing strategies miss: that the audience in the stands is not watching the match. They are living inside it.",
  },
  'lart-de-vivre': {
    id: 5, name: 'Lifestyle', slug: 'lart-de-vivre', french_name: "L'Art de Vivre", english_sub: 'Lifestyle', hero_video_slug: 'lart-de-vivre',
    tagline: 'The art of living without compromise.',
    intro: "The art of living without compromise. L'Échelon's lifestyle editorial covers the decisions that define how the world's most discerning individuals choose to spend their time: the yacht they charter, the villa they rent, the restaurant they call ahead for. Not as aspiration. As intelligence. Charter season reviews, private aviation briefings, and the real conversations that happen when the cost of the decision has more zeros than most people's mortgages.",
  },
}

const CATEGORY_META: Record<string, { title: string; description: string }> = {
  'la-mode': { title: "La Mode: Luxury Fashion Editorial | L'Échelon", description: "Couture coverage, runway analysis, and fashion intelligence from Paris, Milan, and New York. L'Échelon's fashion editorial for the discerning reader." },
  'la-vitesse': { title: "La Vitesse: Formula One and Luxury Motorsport | L'Échelon", description: "Inside the paddock, inside the hospitality suites, inside the decisions that define Formula One's most exclusive season. Motorsport intelligence from L'Échelon." },
  'lhorlogerie': { title: "L'Horlogerie: Luxury Watch News and Auction Intelligence | L'Échelon", description: "Watch auction results, manufacture visits, and haute horlogerie editorial. From Patek Philippe to independent watchmakers, the L'Échelon watch intelligence." },
  'lequitation': { title: "L'Équitation: Polo and Equestrian Lifestyle | L'Échelon", description: "Royal Ascot, Royal Windsor Polo, and the world's most exclusive equestrian calendar. L'Échelon's equestrian intelligence for the serious polo and racing enthusiast." },
  'lart-de-vivre': { title: "L'Art de Vivre: Superyacht and Luxury Lifestyle | L'Échelon", description: "Superyacht charter intelligence, private aviation, and the art of living without compromise. L'Échelon's lifestyle editorial for the ultra-high-net-worth reader." },
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
    'name': `${category?.french_name}: ${category?.english_sub} | L'Échelon`,
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

  const featuredArticle = articles.find((a) => a.featured) ?? articles[0] ?? null
  const latestArticles = articles.slice(0, 6)

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(categorySchema) }} />

      {/* CATEGORY HERO */}
      <section style={{ position: 'relative', height: '100svh', minHeight: 600, overflow: 'hidden', background: '#0A0A0A' }}>
        <CategoryVideoLoop slug={category.hero_video_slug ?? slug} />
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 3 }} />
        <div style={{ position: 'absolute', inset: 0, zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '0 40px', pointerEvents: 'none' }}>
          <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 10, color: 'rgba(255,255,255,0.45)', letterSpacing: '0.35em', textTransform: 'uppercase', marginBottom: 12 }}>
            {category.french_name}
          </p>
          <h1 className="cat-hero-title" style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(72px, 10vw, 128px)', color: '#ffffff', letterSpacing: '0.02em', lineHeight: 0.90, marginBottom: 20 }}>
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

      {/* THIS WEEK IN [CATEGORY] — cover story placeholder */}
      <section style={{ background: '#ffffff', padding: '80px 56px' }} className="cat-cover-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 13, color: '#aaa', marginBottom: 28 }}>
            This week in {category.french_name}
          </p>
          {featuredArticle ? (
            <div style={{ display: 'grid', gridTemplateColumns: '58% 42%', gap: 0 }} className="cat-featured-grid">
              <div className="cat-featured-img" style={{ position: 'relative', height: 520, background: '#E8E5E0', overflow: 'hidden' }}>
                {(() => { const src = getCoverImage(featuredArticle); return src ? (
                  <Image src={src} alt={featuredArticle.title} fill style={{ objectFit: 'cover' }} priority />
                ) : (
                  <div style={{ position: 'absolute', inset: 0, background: '#E8E5E0' }} />
                ); })()}
              </div>
              <div className="cat-featured-body" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', paddingLeft: 56 }}>
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.24em', textTransform: 'uppercase', marginBottom: 16 }}>
                  Cover Story · {category.french_name}
                </p>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(28px, 3vw, 46px)', color: '#111', lineHeight: 1.05, maxWidth: 400, marginBottom: 20 }}>
                  {featuredArticle.title}
                </h2>
                {featuredArticle.excerpt && (
                  <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 14, color: '#666', lineHeight: 1.75, maxWidth: 360, marginBottom: 20 }}>
                    {featuredArticle.excerpt}
                  </p>
                )}
                <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.14em', textTransform: 'uppercase', marginBottom: 24 }}>
                  By {featuredArticle.author?.name ?? "L'Échelon"} · {featuredArticle.read_time ?? 5} min · Free
                </p>
                <Link href={`/article/${featuredArticle.slug}`} style={{
                  fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 17, color: '#111',
                  borderBottom: '1px solid #333', paddingBottom: 3, width: 'fit-content',
                  textDecoration: 'none', transition: 'letter-spacing 0.2s',
                }}>
                  Read the cover story
                </Link>
              </div>
            </div>
          ) : (
            <div style={{ height: 380, background: '#F8F7F5', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: 18, color: '#ccc' }}>
                Cover story will appear here once connected to Strapi.
              </p>
            </div>
          )}
        </div>
      </section>

      {/* LATEST FROM [CATEGORY] */}
      <section style={{ background: '#F8F7F5', padding: '64px 56px' }} className="cat-latest-section">
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <h2 style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 13, color: '#aaa', letterSpacing: '0.30em', textTransform: 'uppercase', marginBottom: 12 }}>
            Latest from {category.french_name}
          </h2>
          <div style={{ height: 1, background: '#E2DED8', marginBottom: 40 }} />
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 32 }} className="cat-latest-grid">
            {latestArticles.length > 0 ? latestArticles.slice(0, 3).map((article) => (
              <div key={article.id} style={{ background: '#fff' }}>
                <Link href={`/article/${article.slug}`} style={{ display: 'block', textDecoration: 'none' }}>
                  <div style={{ position: 'relative', width: '100%', height: 220, background: '#E8E5E0', overflow: 'hidden' }}>
                    {(() => { const src = getCoverImage(article); return src ? (
                      <Image src={src} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 33vw" />
                    ) : null; })()}
                  </div>
                  <div style={{ padding: '20px 0 0' }}>
                    <p style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#aaa', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
                      {category.french_name}
                    </p>
                    <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 20, color: '#111', lineHeight: 1.15, marginBottom: 8 }}>
                      {article.title}
                    </h3>
                    <span style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#bbb', letterSpacing: '0.12em' }}>
                      {article.read_time ?? 5} min read
                    </span>
                  </div>
                </Link>
              </div>
            )) : Array(3).fill(null).map((_, i) => (
              <div key={i} style={{ background: '#fff' }}>
                <div style={{ width: '100%', height: 220, background: '#E8E5E0' }} />
                <div style={{ padding: '20px 0 0' }}>
                  <div style={{ width: 80, height: 8, background: '#E8E5E0', marginBottom: 10 }} />
                  <div style={{ width: '90%', height: 12, background: '#F0EDE8', marginBottom: 6 }} />
                  <div style={{ width: '70%', height: 12, background: '#F0EDE8' }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CATEGORY INTRO (pillar content for SEO) */}
      {intro && (
        <section style={{ background: '#ffffff', padding: '64px 56px' }} className="cat-intro">
          <div style={{ maxWidth: 760, margin: '0 auto' }}>
            <p style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 15, color: '#555', lineHeight: 1.85 }}>
              {intro}
            </p>
          </div>
        </section>
      )}

      {/* ARTICLE FEED (alternating layout) */}
      {articles.length > 0 && (
        <section style={{ background: '#ffffff', padding: '0 56px 80px' }} className="cat-feed">
          <div style={{ maxWidth: 1100, margin: '0 auto' }}>
            {articles.map((article, i) => (
              <AlternatingArticle key={article.id} article={article} reverse={i % 2 !== 0} />
            ))}
          </div>
        </section>
      )}

      <style>{`
        @media (max-width: 768px) {
          .cat-hero-title { font-size: clamp(52px, 12vw, 80px) !important; }
          .cat-cover-section { padding: 48px 24px !important; }
          .cat-featured-grid { grid-template-columns: 1fr !important; }
          .cat-featured-img { height: 56vw !important; }
          .cat-featured-body { padding-left: 0 !important; padding-top: 24px !important; }
          .cat-latest-section { padding: 48px 24px !important; }
          .cat-latest-grid { grid-template-columns: 1fr !important; }
          .cat-intro { padding: 40px 24px !important; }
          .cat-feed { padding: 0 24px 48px !important; }
          .alt-article { grid-template-columns: 1fr !important; direction: ltr !important; gap: 24px !important; padding: 40px 0 !important; }
          .alt-article-img { height: 60vw !important; }
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
      <div className="alt-article-img" style={{ position: 'relative', height: 380, background: '#E8E5E0', overflow: 'hidden', direction: 'ltr' }}>
        {(() => { const src = getCoverImage(article); return src ? (
          <Image src={src} alt={article.title} fill style={{ objectFit: 'cover' }} sizes="(max-width:768px) 100vw, 50vw" />
        ) : null; })()}
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
        }}>
          Read now
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

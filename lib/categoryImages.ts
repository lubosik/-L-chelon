// Verified Unsplash CDN fallback images per category (used when article has no cover_image)
const BASE = 'https://images.unsplash.com'

const CATEGORY_IMAGES: Record<string, string> = {
  'la-vitesse':    `${BASE}/photo-1583121274602-3e2820c69888?auto=format&fit=crop&w=1200&q=80`,
  'la-mode':       `${BASE}/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80`,
  'lhorlogerie':   `${BASE}/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=1200&q=80`,
  'lequitation':   `${BASE}/photo-1553284965-83fd3e82fa5a?auto=format&fit=crop&w=1200&q=80`,
  'lart-de-vivre': `${BASE}/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80`,
}

const DEFAULT_IMAGE = `${BASE}/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1200&q=80`

export function getCoverImage(article: {
  cover_image?: { url: string } | null
  category?: { slug: string } | null
}): string | null {
  if (article.cover_image?.url) return article.cover_image.url
  const slug = article.category?.slug ?? ''
  return CATEGORY_IMAGES[slug] ?? DEFAULT_IMAGE
}

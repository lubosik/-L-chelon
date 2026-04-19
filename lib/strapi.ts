const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

function authHeaders(): Record<string, string> {
  return STRAPI_TOKEN ? { Authorization: `Bearer ${STRAPI_TOKEN}` } : {}
}

async function strapiGet(path: string, revalidate = 60) {
  try {
    const res = await fetch(`${STRAPI_URL}/api${path}`, {
      headers: authHeaders(),
      next: { revalidate },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

export interface StrapiImage {
  url: string
  width: number
  height: number
  alternativeText?: string
}

export interface Author {
  id: number
  name: string
  bio?: string
  avatar?: StrapiImage
  instagram?: string
}

export interface Category {
  id: number
  name: string
  slug: string
  french_name: string
  english_sub: string
  description?: string
  color?: string
  hero_video_slug?: string
  hero_label?: string
  grid_image?: StrapiImage
  grid_image_alt?: string
}

export interface Issue {
  id: number
  issue_number: number
  title?: string
  release_date?: string
  cover_image?: StrapiImage
}

export interface Article {
  id: number
  title: string
  slug: string
  excerpt?: string
  body?: unknown
  cover_image?: StrapiImage
  cover_image_credit?: string
  category?: Category
  author?: Author
  issue?: Issue
  is_premium: boolean
  read_time?: number
  published_at?: string
  featured: boolean
}

export interface IndexDataPoint {
  id: number
  label: string
  value: string
  change?: string
  sub?: string
  is_premium: boolean
  category?: string
}

export interface TickerItem {
  id: number
  text: string
  is_live: boolean
  active: boolean
}

export function getStrapiImageUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return `${STRAPI_URL}${url}`
}

// ── Strapi v5 returns flat objects (no .attributes wrapper).
// Normalise any remaining edge-cases and map publishedAt → published_at.
function normaliseItem<T>(item: unknown): T | null {
  if (!item || typeof item !== 'object') return null
  const raw = item as Record<string, unknown>

  // If still Strapi v4 shape (has .attributes), flatten it
  if (raw.attributes && typeof raw.attributes === 'object') {
    const attrs = raw.attributes as Record<string, unknown>
    const flat: Record<string, unknown> = { id: raw.id }
    for (const key of Object.keys(attrs)) {
      const val = attrs[key] as { data?: unknown } | null | undefined
      if (val && typeof val === 'object' && 'data' in val) {
        if (Array.isArray(val.data)) {
          flat[key] = val.data.map((i: unknown) => normaliseItem(i))
        } else if (val.data) {
          flat[key] = normaliseItem(val.data)
        } else {
          flat[key] = null
        }
      } else {
        flat[key] = val
      }
    }
    return normaliseItem<T>(flat)
  }

  // Strapi v5 flat shape — just fix the publishedAt → published_at alias
  const out: Record<string, unknown> = { ...raw }
  if (!out.published_at && raw.publishedAt) {
    out.published_at = raw.publishedAt
  }
  // Fix cover_image url prefix if relative
  if (out.cover_image && typeof out.cover_image === 'object') {
    const img = out.cover_image as { url?: string }
    if (img.url && !img.url.startsWith('http')) {
      out.cover_image = { ...img, url: `${STRAPI_URL}${img.url}` }
    }
  }
  return out as T
}

function flattenList<T>(res: { data?: unknown[] } | null): T[] {
  if (!res?.data) return []
  return res.data.map((item) => normaliseItem<T>(item)).filter(Boolean) as T[]
}

// ── ARTICLES ──────────────────────────────────────────────────────────────────

export async function fetchArticles(params: {
  limit?: number
  start?: number
  featured?: boolean
  category?: string
  premium?: boolean
} = {}): Promise<Article[]> {
  const qs = new URLSearchParams()
  // Strapi v5: use populate=* (comma-separated list is rejected as invalid)
  qs.set('populate', '*')
  qs.set('sort', 'publishedAt:desc')
  qs.set('pagination[limit]', String(params.limit ?? 10))
  if (params.start) qs.set('pagination[start]', String(params.start))
  if (params.featured !== undefined) qs.set('filters[featured][$eq]', String(params.featured))
  if (params.category) qs.set('filters[category][slug][$eq]', params.category)
  const data = await strapiGet(`/articles?${qs}`)
  return flattenList<Article>(data)
}

export async function fetchArticlesWithTotal(params: {
  limit?: number
  start?: number
  category?: string
} = {}): Promise<{ articles: Article[]; total: number }> {
  const qs = new URLSearchParams()
  qs.set('populate', '*')
  qs.set('sort', 'publishedAt:desc')
  qs.set('pagination[limit]', String(params.limit ?? 10))
  qs.set('pagination[start]', String(params.start ?? 0))
  if (params.category) qs.set('filters[category][slug][$eq]', params.category)
  const data = await strapiGet(`/articles?${qs}`)
  if (!data) return { articles: [], total: 0 }
  return {
    articles: flattenList<Article>(data),
    total: (data as { meta?: { pagination?: { total?: number } } }).meta?.pagination?.total ?? 0,
  }
}

export async function fetchFeaturedArticle(): Promise<Article | null> {
  const articles = await fetchArticles({ featured: true, limit: 1 })
  return articles[0] ?? null
}

export async function fetchArticleBySlug(slug: string): Promise<Article | null> {
  const data = await strapiGet(
    `/articles?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`
  )
  const list = flattenList<Article>(data)
  return list[0] ?? null
}

export async function fetchRelatedArticles(categorySlug: string, excludeSlug: string): Promise<Article[]> {
  const data = await strapiGet(
    `/articles?filters[category][slug][$eq]=${encodeURIComponent(categorySlug)}&filters[slug][$ne]=${encodeURIComponent(excludeSlug)}&populate=*&sort=publishedAt:desc&pagination[limit]=3`,
    300
  )
  return flattenList<Article>(data)
}

export async function fetchRecentArticles(params: { limit?: number } = {}): Promise<Article[]> {
  return fetchArticles({ limit: params.limit ?? 10 })
}

// ── CATEGORIES ────────────────────────────────────────────────────────────────

export async function fetchCategories(): Promise<Category[]> {
  const data = await strapiGet('/categories?populate=*&sort=name:asc')
  return flattenList<Category>(data)
}

export async function fetchCategoryBySlug(slug: string): Promise<Category | null> {
  const data = await strapiGet(`/categories?filters[slug][$eq]=${encodeURIComponent(slug)}&populate=*`)
  const list = flattenList<Category>(data)
  return list[0] ?? null
}

// ── OTHER ─────────────────────────────────────────────────────────────────────

export async function fetchIndexData(): Promise<IndexDataPoint[]> {
  const data = await strapiGet('/index-data-points?sort=id:asc&pagination[limit]=6')
  return flattenList<IndexDataPoint>(data)
}

export async function fetchTickerItems(): Promise<TickerItem[]> {
  const data = await strapiGet('/ticker-items?filters[active][$eq]=true&sort=id:asc')
  return flattenList<TickerItem>(data)
}

export async function fetchDefaultHeroSlug(): Promise<string> {
  try {
    const data = await strapiGet('/site-config?populate=*')
    return (data?.data?.attributes?.default_hero_slug as string) ?? 'default'
  } catch {
    return 'default'
  }
}

export async function fetchIssueByNumber(number: number): Promise<Issue | null> {
  const data = await strapiGet(
    `/issues?filters[issue_number][$eq]=${number}&populate=*`
  )
  const list = flattenList<Issue>(data)
  return list[0] ?? null
}

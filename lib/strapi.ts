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

function flattenStrapiData<T>(data: unknown): T | null {
  if (!data) return null
  const d = data as { id?: number; attributes?: Record<string, unknown> }
  if (d.attributes) {
    return { id: d.id, ...flattenAttributes(d.attributes) } as T
  }
  return data as T
}

function flattenAttributes(attrs: Record<string, unknown>): Record<string, unknown> {
  const result: Record<string, unknown> = {}
  for (const key of Object.keys(attrs)) {
    const val = attrs[key] as { data?: unknown } | null | undefined
    if (val && typeof val === 'object' && 'data' in val) {
      if (Array.isArray(val.data)) {
        result[key] = val.data.map((item: unknown) => flattenStrapiData(item))
      } else if (val.data) {
        result[key] = flattenStrapiData(val.data)
      } else {
        result[key] = null
      }
    } else if (val && typeof val === 'object' && 'url' in val) {
      result[key] = { ...(val as object), url: (val as { url: string }).url.startsWith('http') ? (val as { url: string }).url : `${STRAPI_URL}${(val as { url: string }).url}` }
    } else {
      result[key] = val
    }
  }
  return result
}

function flattenList<T>(res: { data?: unknown[] } | null): T[] {
  if (!res?.data) return []
  return res.data.map((item) => flattenStrapiData<T>(item)).filter(Boolean) as T[]
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
  qs.set('populate', 'cover_image,category,author,issue')
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
  qs.set('populate', 'cover_image,category,author,issue')
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
    `/articles?filters[slug][$eq]=${slug}&populate=cover_image,category,author,issue`
  )
  const list = flattenList<Article>(data)
  return list[0] ?? null
}

export async function fetchRelatedArticles(categorySlug: string, excludeSlug: string): Promise<Article[]> {
  const data = await strapiGet(
    `/articles?filters[category][slug][$eq]=${categorySlug}&filters[slug][$ne]=${excludeSlug}&populate=cover_image,category,author&sort=publishedAt:desc&pagination[limit]=3`,
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
  const data = await strapiGet(`/categories?filters[slug][$eq]=${slug}&populate=*`)
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
    `/issues?filters[issue_number][$eq]=${number}&populate=cover_image,articles.cover_image,articles.category,articles.author`
  )
  const list = flattenList<Issue>(data)
  return list[0] ?? null
}

import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl
  const limit = searchParams.get('limit') ?? '10'
  const start = searchParams.get('start') ?? '0'
  const category = searchParams.get('category') ?? ''

  const qs = new URLSearchParams()
  qs.set('populate', '*')
  qs.set('sort', 'publishedAt:desc')
  qs.set('pagination[limit]', limit)
  qs.set('pagination[start]', start)
  if (category) qs.set('filters[category][slug][$eq]', category)

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`

  try {
    const url = `${STRAPI_URL}/api/articles?${qs}`
    console.log('[api/articles] fetching:', url, 'has_token:', !!STRAPI_TOKEN)
    const res = await fetch(url, { headers, cache: 'no-store' })
    if (!res.ok) {
      const body = await res.text()
      console.error('[api/articles] strapi error', res.status, body)
      return NextResponse.json({ data: [], meta: { pagination: { total: 0 } }, _error: `strapi ${res.status}` }, { status: 200 })
    }
    const data = await res.json()
    return NextResponse.json(data)
  } catch (e) {
    console.error('[api/articles] fetch failed:', e)
    return NextResponse.json({ data: [], meta: { pagination: { total: 0 } }, _error: String(e) }, { status: 200 })
  }
}

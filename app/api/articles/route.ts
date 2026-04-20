import { NextRequest, NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

async function fetchStrapi(url: string): Promise<Response> {
  if (STRAPI_TOKEN) {
    const res = await fetch(url, {
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
    })
    if (res.status !== 401) return res
  }
  // No token, or token was rejected — fall back to public (permissions set in bootstrap)
  return fetch(url, { headers: { 'Content-Type': 'application/json' }, cache: 'no-store' })
}

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

  try {
    const res = await fetchStrapi(`${STRAPI_URL}/api/articles?${qs}`)
    if (!res.ok) {
      return NextResponse.json({ data: [], meta: { pagination: { total: 0 } }, _error: `strapi ${res.status}` }, { status: 200 })
    }
    return NextResponse.json(await res.json())
  } catch (e) {
    return NextResponse.json({ data: [], meta: { pagination: { total: 0 } }, _error: String(e) }, { status: 200 })
  }
}

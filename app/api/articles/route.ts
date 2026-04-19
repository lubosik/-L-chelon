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
    const res = await fetch(`${STRAPI_URL}/api/articles?${qs}`, { headers, next: { revalidate: 30 } })
    if (!res.ok) return NextResponse.json({ data: [], meta: { pagination: { total: 0 } } }, { status: res.status })
    const data = await res.json()
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ data: [], meta: { pagination: { total: 0 } } }, { status: 500 })
  }
}

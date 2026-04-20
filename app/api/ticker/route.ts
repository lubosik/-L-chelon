import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

async function fetchStrapi(url: string): Promise<Response> {
  if (STRAPI_TOKEN) {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${STRAPI_TOKEN}` },
      cache: 'no-store',
    })
    if (res.status !== 401) return res
  }
  return fetch(url, { cache: 'no-store' })
}

export async function GET() {
  try {
    const res = await fetchStrapi(`${STRAPI_URL}/api/ticker-items?filters[active][$eq]=true&sort=id:asc`)
    if (!res.ok) return NextResponse.json({ data: [] })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ data: [] })
  }
}

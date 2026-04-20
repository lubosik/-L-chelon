import { NextResponse } from 'next/server'

const STRAPI_URL = process.env.STRAPI_INTERNAL_URL || process.env.NEXT_PUBLIC_STRAPI_URL || 'http://localhost:1337'
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN || ''

export async function GET() {
  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (STRAPI_TOKEN) headers['Authorization'] = `Bearer ${STRAPI_TOKEN}`

  try {
    const res = await fetch(`${STRAPI_URL}/api/categories?populate=*&sort=name:asc`, { headers, cache: 'no-store' })
    if (!res.ok) return NextResponse.json({ data: [] })
    return NextResponse.json(await res.json())
  } catch {
    return NextResponse.json({ data: [] })
  }
}

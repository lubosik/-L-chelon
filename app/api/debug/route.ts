import { NextResponse } from 'next/server'

export async function GET() {
  const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'NOT SET'
  const HAS_TOKEN = !!process.env.STRAPI_API_TOKEN

  let strapiStatus = 'unreachable'
  let strapiError = ''
  let articleCount = 0

  try {
    const headers: Record<string, string> = {}
    if (process.env.STRAPI_API_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.STRAPI_API_TOKEN}`
    }
    const res = await fetch(`${STRAPI_URL}/api/articles?pagination[limit]=1&populate=*`, {
      headers,
      signal: AbortSignal.timeout(8000),
    })
    strapiStatus = `${res.status} ${res.statusText}`
    if (res.ok) {
      const data = await res.json()
      articleCount = data?.meta?.pagination?.total ?? 0
    } else {
      strapiError = await res.text()
    }
  } catch (e) {
    strapiError = String(e)
  }

  return NextResponse.json({
    strapi_url: STRAPI_URL,
    has_token: HAS_TOKEN,
    strapi_status: strapiStatus,
    article_count: articleCount,
    error: strapiError || undefined,
  })
}

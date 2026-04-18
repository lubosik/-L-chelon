#!/usr/bin/env node
// DataForSEO keyword research for L'Échelon
const fs = require('fs')
const path = require('path')

const AUTH = 'ZHBAYml6emF1dG9tYXRlLmlvOjYxYjU4ZjRhNTMwYTBmNWI='
const API_URL = 'https://api.dataforseo.com/v3/keywords_data/google_ads/search_volume/live'

async function fetchKeywords(keywords, tag) {
  console.log(`Fetching: ${tag}`)
  const body = keywords.map(kw => ({
    keywords: [kw],
    language_code: 'en',
    location_code: 2840,
  }))
  try {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${AUTH}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    })
    const json = await res.json()
    if (!json.tasks) return []
    return json.tasks.flatMap(task => {
      if (!task.result) return []
      return task.result.map(r => ({
        keyword: r.keyword,
        search_volume: r.search_volume ?? 0,
        competition: r.competition ?? 0,
        competition_level: r.competition_level ?? 'UNKNOWN',
        cpc: r.cpc ?? 0,
        tag,
      }))
    })
  } catch (e) {
    console.error(`Error fetching ${tag}:`, e.message)
    return []
  }
}

async function main() {
  const calls = [
    { tag: 'core', keywords: ['luxury media outlet','luxury lifestyle magazine','luxury editorial','luxury news','luxury intelligence platform','high end lifestyle content','premium lifestyle publication','luxury industry insights','luxury market intelligence','luxury brand news'] },
    { tag: 'fashion', keywords: ['luxury fashion editorial','couture fashion news','paris fashion week coverage','high fashion magazine online','luxury fashion news','vogue alternative magazine','fashion industry intelligence','luxury streetwear news','haute couture news 2025'] },
    { tag: 'motorsport', keywords: ['F1 luxury lifestyle','formula one paddock access','monaco grand prix experience','F1 hospitality news','luxury motorsport magazine','formula one news editorial','racing lifestyle publication','F1 paddock club coverage'] },
    { tag: 'watches', keywords: ['luxury watch news','watch auction results 2025','haute horlogerie news','patek philippe news','rolex market news','watch collecting magazine','independent watchmaker news','watches and wonders coverage','luxury timepiece editorial'] },
    { tag: 'equestrian', keywords: ['polo luxury lifestyle','equestrian magazine luxury','royal ascot coverage','polo news editorial','luxury equestrian news','horse polo lifestyle','equestrian world news'] },
    { tag: 'lifestyle', keywords: ['superyacht news','luxury yacht lifestyle','luxury travel editorial','private aviation news','luxury real estate news','high net worth lifestyle','luxury concierge news','ultra luxury lifestyle magazine'] },
    { tag: 'longtail', keywords: ['luxury magazine subscription online','luxury industry analytics','luxury brand performance data','luxury market trends 2025','exclusive luxury content platform'] },
  ]

  const allResults = []
  for (const call of calls) {
    const results = await fetchKeywords(call.keywords, call.tag)
    allResults.push(...results)
    await new Promise(r => setTimeout(r, 500))
  }

  const outPath = path.join(__dirname, '../seo-docs/keywords.json')
  fs.writeFileSync(outPath, JSON.stringify(allResults, null, 2))
  console.log(`Saved ${allResults.length} keywords to keywords.json`)

  // Analysis
  const sorted = [...allResults].sort((a, b) => b.search_volume - a.search_volume)
  const primary = sorted.filter(k => k.search_volume > 1000)
  const quickWins = sorted.filter(k => k.search_volume > 500 && k.competition_level === 'LOW')
  const byTag = {}
  for (const k of allResults) {
    if (!byTag[k.tag]) byTag[k.tag] = []
    byTag[k.tag].push(k)
  }

  let md = `# L'Échelon — Keyword Analysis\n\nGenerated: ${new Date().toISOString()}\n\n`
  md += `## Primary Keywords (target on homepage, volume > 1000)\n\n`
  md += '| Keyword | Volume | Competition |\n|---|---|---|\n'
  for (const k of primary.slice(0, 20)) {
    md += `| ${k.keyword} | ${k.search_volume} | ${k.competition_level} |\n`
  }
  md += `\n## Quick Win Keywords (volume > 500, LOW competition)\n\n`
  if (quickWins.length) {
    md += '| Keyword | Volume | Tag |\n|---|---|---|\n'
    for (const k of quickWins) {
      md += `| ${k.keyword} | ${k.search_volume} | ${k.tag} |\n`
    }
  } else {
    md += '_No quick wins found — all competitive keywords require authority building._\n'
  }
  md += `\n## By Category\n\n`
  for (const [tag, kws] of Object.entries(byTag)) {
    const sorted2 = [...kws].sort((a, b) => b.search_volume - a.search_volume)
    md += `### ${tag}\n\n`
    md += '| Keyword | Volume | Competition |\n|---|---|---|\n'
    for (const k of sorted2) {
      md += `| ${k.keyword} | ${k.search_volume} | ${k.competition_level} |\n`
    }
    md += '\n'
  }
  fs.writeFileSync(path.join(__dirname, '../seo-docs/keyword-analysis.md'), md)
  console.log('Saved keyword-analysis.md')

  // Return top keywords for use in metadata
  console.log('\nTop 10 keywords by volume:')
  sorted.slice(0, 10).forEach(k => console.log(`  ${k.search_volume} - ${k.keyword}`))
}

main().catch(console.error)

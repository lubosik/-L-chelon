#!/usr/bin/env node
// Seed 5 placeholder articles into Strapi (one per category)

const STRAPI_URL = 'http://localhost:1337'
const STRAPI_TOKEN = 'c6b73da964d16b51aabab43ec9b50f6138ddb4c27e4aa0b9bc2360b6ee90fa2d38abd6b2566005e039d2dfcbf3b5d08ea59e1480c6efecaa4a937a77d23851a511a55e48bfffe4905f7535982537e6c767949c6b2bf353d7f003ee489e6693425a432669e9bea3a4f53ee8c9e5adc9ea4b9a4fa0e0501d4eac184aa370e5961b'

// Strapi v5 documentIds for each category
const CATEGORIES = {
  'la-mode':       't9iy6ifpmm6jfi4a8ychmji1',
  'la-vitesse':    'q5qkxixotbgiu95u1xtfyyzh',
  'lhorlogerie':   'o9ltug9zd9ionfvnl2in0is2',
  'lequitation':   'gctwali7tiuncvpacubn4ij1',
  'lart-de-vivre': 'kw1nbise69t4jer5g6ato8il',
}

function textToBlocks(text) {
  const lines = text.trim().split('\n')
  const blocks = []
  for (const line of lines) {
    const t = line.trim()
    if (!t) continue
    if (t.startsWith('### ')) {
      blocks.push({ type: 'heading', level: 3, children: [{ type: 'text', text: t.slice(4) }] })
    } else if (t.startsWith('## ')) {
      blocks.push({ type: 'heading', level: 2, children: [{ type: 'text', text: t.slice(3) }] })
    } else if (t.startsWith('# ')) {
      blocks.push({ type: 'heading', level: 1, children: [{ type: 'text', text: t.slice(2) }] })
    } else {
      blocks.push({ type: 'paragraph', children: [{ type: 'text', text: t }] })
    }
  }
  return blocks
}

const ARTICLES = [
  {
    category: 'la-vitesse',
    featured: true,
    is_premium: false,
    read_time: 6,
    title: 'THE SEASON THAT REDEFINED WHAT IT MEANS TO BE SEEN AT MONACO',
    slug: 'the-season-that-redefined-monaco',
    excerpt: 'Inside the paddock experiences that cost more than most cars — and why every luxury house on earth wants a seat at the starting grid.',
    body: `# The Season That Redefined What It Means to Be Seen at Monaco

There is a moment at Monaco — it happens at approximately 14:07 on race day, when the grid walk is ending and the pit lane is clearing and the last of the hospitality guests are making their way to the rooftop terraces that hang above the harbour — when the entire event reveals itself not as a sporting occasion but as something closer to a theatre production. The cars are almost incidental.

## The Paddock Economy

This year, a full Monaco Grand Prix Paddock Club package for two people — two days, full hospitality access, grid walk, pit lane tour — was priced at 48,000 euros. That number increased by 22% from the previous season. It sold out in eleven days.

The brands that understand Monaco understand this: the race is the backdrop. The event is the foreground. And the foreground is a carefully constructed environment in which a certain kind of person expects to see another certain kind of person while being seen themselves.

## What the Luxury Houses Are Really Buying

When Richard Mille spent what is estimated at 12 million euros on its Monaco activation this season — the hospitality suite that cantilevers out over the pit lane, the private dinner on the port on Saturday evening, the watch launches timed to the race weekend — it was not buying access to motorsport fans. It was buying a room in which the right 200 people in the world were guaranteed to be present.

This is the sophistication of Formula One hospitality at the top level: it is not a sponsorship. It is a curation service.

## The New Architecture of Presence

What has changed in the last three seasons is the verticality of the investment. The brands that used to be satisfied with a logo on a barrier or a suite at the circuit have begun to understand that the circuit itself is only one of five or six venues that constitute the Monaco weekend. The dinner at the private villa. The morning on the water, before the crowds arrive, on a boat that belongs to someone whose name you will not read in any press release.

L'Échelon was inside all of it this season. This is the first dispatch.`,
  },
  {
    category: 'la-mode',
    featured: false,
    is_premium: false,
    read_time: 7,
    title: "THE TWELVE LOOKS THAT DEFINED COUTURE WEEK — AND WHY THREE WILL NEVER BE SOLD",
    slug: 'twelve-looks-couture-week-2026',
    excerpt: 'Inside the ateliers where scarcity is engineered, presence is currency, and the waiting list is the entire point of the exercise.',
    body: `# The Twelve Looks That Defined Couture Week

Couture Week is not a trade show. It is a ritual. The guests who fill the front rows of the six or seven shows that actually matter have, in many cases, been attending the same show in the same season for twenty years. They know what it means when a house opens with white. They notice when the music changes mid-collection.

## The Edit

Of the hundreds of looks shown across Paris in January, twelve will define how the season is discussed when, in six months, the ready-to-wear collections attempt to translate couture language into commercial reality.

### Look 01 — The Architecture of Restraint

The first look from the morning show that stopped three separate conversations in the atelier anteroom before it had even reached the end of the runway. A single piece: a coat. Charcoal, structured, the shoulder line doing something that required three different pattern cutters and eleven weeks of toile work to achieve. The waist defined not by seaming but by the precise placement of weight.

The designer, speaking afterwards in the brief window before the salon filled with journalists who had not been in the room, said only: "I wanted it to look like the right answer."

It did.

## Why Three Looks Will Never Be Sold

Three of the most important pieces from this season's couture will not be sold to any client. They will be archived. The houses that have made this decision have done so for a reason that is rarely discussed publicly: the most significant couture work of a season is not the work that finds a buyer. It is the work that defines what the house believes it is capable of.

The archive is the argument.`,
  },
  {
    category: 'lhorlogerie',
    featured: false,
    is_premium: true,
    read_time: 8,
    title: "THE PATEK THAT BROKE RECORDS AT CHRISTIE'S — AND THE COLLECTOR WHO LET IT GO",
    slug: 'patek-christies-record-auction-2026',
    excerpt: "The Ref. 5270 achieved $6.4 million at Christie's Geneva. We spoke to the collector who decided, after fourteen years, that it was time.",
    body: `# The Patek That Broke Records at Christie's

The lot came up at 11:23 in the morning, Geneva time. By 11:31 it was over. The hammer fell at CHF 5,800,000 — a figure that, with buyer's premium, cleared six million US dollars with room to spare. The room, which had been professionally quiet in the way that auction rooms have learned to manage anticipation, did something it rarely does: it made a sound.

## The Watch

The Patek Philippe Reference 5270G-014 is, on paper, a perpetual calendar chronograph in white gold with a deep blue dial and a manufacture calibre 29-535 PS Q movement. In practice, it describes a singular object. The blue of the dial is not a colour so much as a decision — a specific instruction given to a specific craftsman about a specific quantity of light.

The subsidiary dials are perfectly balanced. The moonphase at six o'clock is, technically speaking, the most accurate representation of the moon's cycle available on a commercially produced timepiece — it will require a one-day correction every 122 years.

## The Collector

He asked not to be named. He has been collecting for thirty-one years, beginning with a Calatrava bought for approximately what the service cost today, and has owned, at various points, fourteen Patek Philippe references.

He bought the 5270 at a private sale in 2012. He wore it twice.

"The first time at my daughter's wedding. The second time I can't tell you." A pause. "Not because it's secret. Because I don't remember."

He decided to sell in October. His reasoning was precise: "I understood that I was holding it for someone else. That is the correct relationship with a watch of this quality."

The someone else, as of 11:31 on a Tuesday morning in Geneva, now has a watch.`,
  },
  {
    category: 'lequitation',
    featured: false,
    is_premium: false,
    read_time: 6,
    title: 'ROYAL WINDSOR POLO: THE BRANDS THAT UNDERSTOOD THE PITCH IN 2026',
    slug: 'royal-windsor-polo-brands-2026',
    excerpt: 'The 2026 season saw three new brand activations and one very significant withdrawal. We were on the pitch for all of it.',
    body: `# Royal Windsor Polo: The Brands That Understood the Pitch

The thing about polo that brands consistently fail to understand — until the ones that succeed teach them through their results — is that the audience is not watching the match.

The match is extraordinarily difficult, technically demanding, and genuinely beautiful when played at the level on display at Guards or at Windsor. But the 14,000 people who attended the Royal Windsor Polo on the third Sunday of the 2026 season were not, in the main, there for the chukkas. They were there for the event.

## The Brands That Got It Right

Three activations at Windsor this season deserve particular attention — not because they spent the most, but because they understood this dynamic most completely.

### The Watch House

Without naming the brand: the decision to create a small salon in the members' enclosure, staffed by one watchmaker and one representative, showing three references and serving nothing except still water and a single very good coffee, was the most intelligent activation of the season. No music. No branding on the exterior. A handwritten sign with the house name only.

The waiting list for appointments ran to forty-seven people by mid-afternoon.

## The Withdrawal That Everyone Noticed

One brand that had been a fixture of the Windsor hospitality tent for six consecutive seasons was absent this year. No announcement was made. No explanation was offered.

In the conversations that followed — at the lunch tables, in the car park, at the private dinner that evening — the withdrawal was discussed at length. Absence, when it belongs to a name that was previously present, is its own form of presence.`,
  },
  {
    category: 'lart-de-vivre',
    featured: false,
    is_premium: true,
    read_time: 7,
    title: 'CHARTER SEASON OPENS: THE SUPERYACHTS ALREADY FULLY BOOKED FOR SUMMER',
    slug: 'charter-season-superyachts-booked-2026',
    excerpt: 'The 2026 Mediterranean charter season is the most over-subscribed in a decade. We spoke to three brokers about what is happening, and why.',
    body: `# Charter Season Opens: The Superyachts Already Fully Booked for Summer

By the time the Monaco Yacht Show concluded last September, the leading charter brokers had already closed their books for the following July and August. Not provisionally. Not subject to contract. Closed.

This had happened before — in 2021, when the pandemic-suppressed demand of two years collapsed into a single summer season and the charter market experienced something its veterans described as unlike anything in living memory. But 2021 was an anomaly. A correction. What is happening in 2026 is structural.

## The Numbers

The Superyacht Group's annual market analysis documents a 34% increase in advance bookings for Mediterranean charters over 200,000 euros per week compared to the same period in the previous year. For yachts in the 500,000-plus weekly bracket, the increase is 51%.

The supply side of this equation has not moved at a comparable rate. The lead time for a new build from a serious yard remains between four and seven years depending on specification.

## What Is Actually Happening

Three structural factors are converging. The first is generational: the clients driving this demand are younger than the traditional charter demographic by approximately fifteen years, have different expectations about service and customisation, and book earlier and with greater certainty.

The second is geographical: the traditional Mediterranean is being supplemented by alternative destinations — the Adriatic, the Greek islands, Montenegro.

The third is experiential: the yacht is no longer the destination. It is the vehicle. What clients are specifying in their briefs is not a boat. It is a sequence of experiences that the boat enables.

This distinction, simple as it sounds, changes everything about how a charter is planned, what it costs, and what it means to the people aboard it.`,
  },
]

async function createArticle(article) {
  const body = textToBlocks(article.body)
  const payload = {
    data: {
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt.slice(0, 199),
      body: body,
      is_premium: article.is_premium,
      read_time: article.read_time,
      featured: article.featured,
      category: { connect: [CATEGORIES[article.category]] },
    }
  }

  const res = await fetch(`${STRAPI_URL}/api/articles?status=published`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_TOKEN}`,
    },
    body: JSON.stringify(payload),
  })

  const data = await res.json()
  if (res.ok) {
    console.log(`✓ Created: "${article.title.slice(0, 60)}..." (id: ${data.data?.id})`)
  } else {
    console.error(`✗ Failed: "${article.title.slice(0, 60)}..."`)
    console.error('  Status:', res.status)
    console.error('  Error:', JSON.stringify(data?.error || data, null, 2))
  }
}

async function main() {
  console.log('Seeding articles into Strapi...\n')
  for (const article of ARTICLES) {
    await createArticle(article)
  }
  console.log('\nDone.')
}

main().catch(console.error)

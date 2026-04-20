import Image from 'next/image'

export interface RichChild {
  type?: string
  text?: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
  code?: boolean
  url?: string
  children?: RichChild[]
}

export interface RichBlock {
  type: string
  level?: number
  format?: string
  image?: { url: string; alternativeText?: string; caption?: string; width?: number; height?: number }
  children?: RichChild[]
}

export function clean(s: string): string {
  return s.replace(/\s*—\s*/g, ' ').replace(/\s+/g, ' ').trim()
}

export function resolveUrl(url: string, strapiUrl: string): string {
  if (!url) return url
  if (url.startsWith('http')) return url
  return `${strapiUrl}${url}`
}

export function renderInline(children: RichChild[]): React.ReactNode {
  return children.map((child, ci) => {
    if (child.type === 'link') {
      return (
        <a key={ci} href={child.url} target="_blank" rel="noopener noreferrer"
          style={{ color: '#111', textDecoration: 'underline', textUnderlineOffset: 3 }}>
          {renderInline(child.children ?? [])}
        </a>
      )
    }
    let node: React.ReactNode = clean(child.text ?? '')
    if (child.bold) node = <strong key={`b${ci}`} style={{ fontWeight: 600 }}>{node}</strong>
    if (child.italic) node = <em key={`i${ci}`}>{node}</em>
    if (child.underline) node = <u key={`u${ci}`}>{node}</u>
    if (child.strikethrough) node = <s key={`s${ci}`}>{node}</s>
    if (child.code) node = <code key={`c${ci}`} style={{ fontFamily: 'monospace', background: '#F4F2EE', padding: '1px 5px', fontSize: 14, borderRadius: 2 }}>{node}</code>
    return <span key={ci}>{node}</span>
  })
}

export function renderBody(body: unknown, strapiUrl = ''): React.ReactNode[] {
  if (!Array.isArray(body)) return []
  return (body as RichBlock[]).map((block, i) => {
    if (block.type === 'image' && block.image) {
      const src = resolveUrl(block.image.url, strapiUrl)
      const credit = block.image.caption || block.image.alternativeText
      return (
        <figure key={i} style={{ margin: '40px 0', padding: 0 }} className="art-inline-img">
          <div style={{ position: 'relative', width: '100%', aspectRatio: block.image.width && block.image.height ? `${block.image.width}/${block.image.height}` : '16/9', background: '#E8E5E0', overflow: 'hidden' }}>
            <Image
              src={src}
              alt={block.image.alternativeText ?? ''}
              fill
              style={{ objectFit: 'cover' }}
              sizes="(max-width: 768px) 100vw, 680px"
            />
          </div>
          {credit && (
            <figcaption style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#aaa', letterSpacing: '0.10em', textTransform: 'uppercase', marginTop: 8, textAlign: 'right' }}>
              {credit}
            </figcaption>
          )}
        </figure>
      )
    }

    const children = block.children ?? []
    const text = children.map((c) => c.text ?? '').join('')

    if (block.type === 'heading') {
      const inline = renderInline(children)
      if (block.level === 1) return <h2 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(26px, 3.5vw, 38px)', color: '#111', lineHeight: 1.1, margin: '44px 0 16px', textTransform: 'uppercase' }}>{inline}</h2>
      if (block.level === 2) return <h3 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 300, fontSize: 'clamp(20px, 2.5vw, 26px)', color: '#111', lineHeight: 1.1, margin: '36px 0 14px' }}>{inline}</h3>
      return <h4 key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 20, color: '#333', lineHeight: 1.15, margin: '28px 0 12px' }}>{inline}</h4>
    }

    if (block.type === 'quote') {
      return (
        <blockquote key={i} style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: 'clamp(20px, 2vw, 26px)', color: '#555', lineHeight: 1.45, borderLeft: '3px solid #E2DED8', paddingLeft: 24, margin: '36px 0' }}>
          {renderInline(children)}
        </blockquote>
      )
    }

    if (block.type === 'list') {
      const Tag = block.format === 'ordered' ? 'ol' : 'ul'
      return (
        <Tag key={i} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 17, color: '#444', lineHeight: 1.85, marginBottom: 22, paddingLeft: 24 }}>
          {children.map((item, li) => (
            <li key={li} style={{ marginBottom: 6 }}>{renderInline(item.children ?? [{ text: item.text }])}</li>
          ))}
        </Tag>
      )
    }

    if (block.type === 'code') {
      return (
        <pre key={i} style={{ fontFamily: 'monospace', background: '#F4F2EE', padding: '16px 20px', overflowX: 'auto', fontSize: 14, lineHeight: 1.6, margin: '28px 0', borderRadius: 2 }}>
          <code>{text}</code>
        </pre>
      )
    }

    if (!text.trim() && block.type === 'paragraph') return null

    return (
      <p key={i} style={{ fontFamily: 'Lato, sans-serif', fontWeight: 300, fontSize: 17, color: '#444', lineHeight: 1.85, marginBottom: 22 }}>
        {renderInline(children)}
      </p>
    )
  }).filter(Boolean) as React.ReactNode[]
}

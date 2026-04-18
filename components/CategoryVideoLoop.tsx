export default function CategoryVideoLoop({ slug }: { slug: string }) {
  return (
    <video
      src={`/heroes/${slug}.mp4`}
      autoPlay muted loop playsInline preload="auto"
      poster={`/heroes/${slug}.jpg`}
      style={{
        position: 'absolute', inset: 0, width: '100%', height: '100%',
        objectFit: 'cover', objectPosition: 'center',
        zIndex: 1, pointerEvents: 'none',
      }}
    />
  )
}

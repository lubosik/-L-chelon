'use client'

import { useRef, useState, useEffect } from 'react'

const FADE_MS = 900
const PRE_END_S = 2.2

export default function CategoryVideoLoop({ slug }: { slug: string }) {
  const src = `/heroes/${slug}.mp4`
  const poster = `/heroes/${slug}.jpg`

  // Slot A and B hold the same video source but alternate playback
  // so the loop is seamless (one starts from 0 as the other nears end)
  const refA = useRef<HTMLVideoElement>(null)
  const refB = useRef<HTMLVideoElement>(null)
  const activeRef = useRef<'a' | 'b'>('a')
  const [active, setActive] = useState<'a' | 'b'>('a')
  const [fading, setFading] = useState(false)
  const inFadeRef = useRef(false)
  const nearEndRef = useRef(false)

  useEffect(() => {
    refA.current?.play().catch(() => {})
    if (refB.current) {
      refB.current.load() // preload slot B
    }
  }, [])

  function doFade() {
    if (inFadeRef.current) return
    inFadeRef.current = true
    nearEndRef.current = false
    const next = activeRef.current === 'a' ? refB.current : refA.current
    if (next) { next.currentTime = 0; next.play().catch(() => {}) }
    setFading(true)
    setTimeout(() => {
      const newActive: 'a' | 'b' = activeRef.current === 'a' ? 'b' : 'a'
      activeRef.current = newActive
      setActive(newActive)
      setFading(false)
      inFadeRef.current = false
    }, FADE_MS)
  }

  function handleTimeUpdate(e: React.SyntheticEvent<HTMLVideoElement>, slot: 'a' | 'b') {
    if (slot !== activeRef.current || nearEndRef.current || inFadeRef.current) return
    const v = e.currentTarget
    if (v.duration > 0 && v.currentTime >= v.duration - PRE_END_S) {
      nearEndRef.current = true
      doFade()
    }
  }

  const aOp = active === 'a' ? (fading ? 0 : 1) : (fading ? 1 : 0)
  const bOp = active === 'b' ? (fading ? 0 : 1) : (fading ? 1 : 0)
  const inactiveSlot = active === 'a' ? 'b' : 'a'

  const vidStyle = (opacity: number, zIdx: number): React.CSSProperties => ({
    position: 'absolute', inset: 0, width: '100%', height: '100%',
    objectFit: 'cover', objectPosition: 'center',
    zIndex: zIdx, opacity,
    transition: `opacity ${FADE_MS}ms ease`,
    pointerEvents: 'none',
  })

  return (
    <>
      {/* Inactive slot — below, preloaded */}
      <video
        ref={inactiveSlot === 'a' ? refA : refB}
        src={src} muted playsInline preload="auto" poster={poster}
        onTimeUpdate={(e) => handleTimeUpdate(e, inactiveSlot)}
        style={vidStyle(inactiveSlot === 'a' ? aOp : bOp, 1)}
      />
      {/* Active slot — above, playing */}
      <video
        ref={active === 'a' ? refA : refB}
        src={src} muted playsInline preload="auto" poster={poster}
        onTimeUpdate={(e) => handleTimeUpdate(e, active)}
        style={vidStyle(active === 'a' ? aOp : bOp, 2)}
      />
    </>
  )
}

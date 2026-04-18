import { create } from 'zustand'

interface HeroStore {
  hoverSlug: string | null
  setHoverSlug: (slug: string | null) => void
}

export const useHeroStore = create<HeroStore>((set) => ({
  hoverSlug: null,
  setHoverSlug: (slug) => set({ hoverSlug: slug }),
}))

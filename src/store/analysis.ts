import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type AnalysisMeta = {
  id: string
  title?: string
  fileName?: string
  email?: string
  createdAt: number
  mimeType?: string
  size?: number
  storagePath?: string
  publicUrl?: string
}

type Store = {
  metas: Record<string, AnalysisMeta>
  startAnalysis: (meta: AnalysisMeta) => void
  getMeta: (id: string) => AnalysisMeta | undefined
}

export const useAnalysisStore = create<Store>()(
  persist(
    (set, get) => ({
      metas: {},
      startAnalysis: (meta) => {
        const metas = { ...get().metas, [meta.id]: meta }
        set({ metas })
      },
      getMeta: (id) => get().metas[id]
    }),
    { name: 'analysis-store' }
  )
)

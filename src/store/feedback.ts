import { create } from 'zustand'
import { persist } from 'zustand/middleware'

type Feedback = { id: string; analysisId: string; message: string; response?: string; createdAt: number }

type Store = {
  feedbacks: Record<string, Feedback[]>
  addFeedback: (analysisId: string, message: string) => boolean
  addFeedbackWithResponse: (analysisId: string, message: string, response: string) => boolean
  getFeedbacks: (analysisId: string) => Feedback[]
  remaining: (analysisId: string) => number
}

export const useFeedbackStore = create<Store>()(
  persist(
    (set, get) => ({
      feedbacks: {},
      addFeedback: (analysisId, message) => {
        const list = get().feedbacks[analysisId] || []
        if (list.length >= 10) return false
        const next: Feedback = { id: `FB-${Date.now()}`, analysisId, message, createdAt: Date.now() }
        const updated = { ...get().feedbacks, [analysisId]: [next, ...list] }
        set({ feedbacks: updated })
        return true
      },
      addFeedbackWithResponse: (analysisId, message, response) => {
        const list = get().feedbacks[analysisId] || []
        if (list.length >= 10) return false
        const next: Feedback = { id: `FB-${Date.now()}`, analysisId, message, response, createdAt: Date.now() }
        const updated = { ...get().feedbacks, [analysisId]: [next, ...list] }
        set({ feedbacks: updated })
        return true
      },
      getFeedbacks: (analysisId) => {
        return get().feedbacks[analysisId] || []
      },
      remaining: (analysisId) => {
        const list = get().feedbacks[analysisId] || []
        return Math.max(0, 10 - list.length)
      }
    }),
    { name: 'feedback-store' }
  )
)

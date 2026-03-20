export type 记忆反馈 = '不认识' | '模糊' | '认识'

export type 复习状态 = {
  intervalDay: number
  ease: number
  dueAt: Date
  reviewedAt?: Date
  streak: number
  reviews: number
}

export function 初始化复习状态(now = new Date()): 复习状态 {
  return {
    intervalDay: 0,
    ease: 2.3,
    dueAt: now,
    reviewedAt: undefined,
    streak: 0,
    reviews: 0,
  }
}

export function 计算下一次复习(
  current: 复习状态,
  rating: 记忆反馈,
  now = new Date(),
): 复习状态 {
  const baseEase = current.ease
  const reviews = current.reviews + 1

  if (rating === '不认识') {
    const dueAt = new Date(now.getTime() + 10 * 60 * 1000)
    return {
      ...current,
      reviewedAt: now,
      dueAt,
      intervalDay: 0,
      ease: Math.max(1.3, baseEase - 0.2),
      streak: 0,
      reviews,
    }
  }

  if (rating === '模糊') {
    const nextInterval = Math.max(1, Math.round((current.intervalDay || 1) * 1.2))
    const dueAt = new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000)
    return {
      ...current,
      reviewedAt: now,
      dueAt,
      intervalDay: nextInterval,
      ease: Math.max(1.3, baseEase - 0.05),
      streak: 0,
      reviews,
    }
  }

  const nextInterval =
    current.intervalDay <= 0
      ? 1
      : Math.max(1, Math.round(current.intervalDay * baseEase))
  const dueAt = new Date(now.getTime() + nextInterval * 24 * 60 * 60 * 1000)
  return {
    ...current,
    reviewedAt: now,
    dueAt,
    intervalDay: nextInterval,
    ease: Math.min(2.8, baseEase + 0.05),
    streak: current.streak + 1,
    reviews,
  }
}

export function dayKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}


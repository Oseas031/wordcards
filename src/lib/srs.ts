export type 记忆反馈 = '不认识' | '模糊' | '认识'

export type 复习状态 = {
  单词ID: string
  间隔天数: number
  易度: number
  到期时间戳: number
  最近复习时间戳?: number
  连续正确?: number
  复习次数?: number
}

export function 初始化复习状态(单词ID: string, now = Date.now()): 复习状态 {
  return {
    单词ID,
    间隔天数: 0,
    易度: 2.3,
    到期时间戳: now,
    复习次数: 0,
    连续正确: 0,
  }
}

export function 计算下一次复习(
  当前: 复习状态,
  反馈: 记忆反馈,
  now = Date.now(),
): 复习状态 {
  const 基础易度 = 当前.易度
  const 次数 = (当前.复习次数 ?? 0) + 1
  const 连续正确 = 当前.连续正确 ?? 0

  if (反馈 === '不认识') {
    const nextDue = now + 10 * 60 * 1000
    return {
      ...当前,
      最近复习时间戳: now,
      到期时间戳: nextDue,
      间隔天数: 0,
      易度: Math.max(1.3, 基础易度 - 0.2),
      连续正确: 0,
      复习次数: 次数,
    }
  }

  if (反馈 === '模糊') {
    const nextInterval = Math.max(1, Math.round((当前.间隔天数 || 1) * 1.2))
    const nextDue = now + nextInterval * 24 * 60 * 60 * 1000
    return {
      ...当前,
      最近复习时间戳: now,
      到期时间戳: nextDue,
      间隔天数: nextInterval,
      易度: Math.max(1.3, 基础易度 - 0.05),
      连续正确: 0,
      复习次数: 次数,
    }
  }

  const nextInterval =
    当前.间隔天数 <= 0
      ? 1
      : Math.max(1, Math.round(当前.间隔天数 * 基础易度))
  const nextDue = now + nextInterval * 24 * 60 * 60 * 1000
  return {
    ...当前,
    最近复习时间戳: now,
    到期时间戳: nextDue,
    间隔天数: nextInterval,
    易度: Math.min(2.8, 基础易度 + 0.05),
    连续正确: 连续正确 + 1,
    复习次数: 次数,
  }
}


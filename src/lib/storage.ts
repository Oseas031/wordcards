export function safeJsonParse<T>(text: string | null): T | undefined {
  if (!text) return undefined
  try {
    return JSON.parse(text) as T
  } catch {
    return undefined
  }
}

export function readLocal<T>(key: string): T | undefined {
  return safeJsonParse<T>(localStorage.getItem(key))
}

export function writeLocal<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function todayKey(now = new Date()): string {
  const y = now.getFullYear()
  const m = String(now.getMonth() + 1).padStart(2, '0')
  const d = String(now.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}


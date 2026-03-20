const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3100'

const DEVICE_ID_KEY = 'wordcards.deviceId.v1'

const pendingRequests = new Map<string, Promise<unknown>>()

function getDeviceId(): string {
  let deviceId = localStorage.getItem(DEVICE_ID_KEY)
  if (!deviceId) {
    deviceId = generateDeviceId()
    localStorage.setItem(DEVICE_ID_KEY, deviceId)
  }
  return deviceId
}

function generateDeviceId(): string {
  return `dev_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
}

function extractErrorMessage(data: unknown): string {
  if (!data || typeof data !== 'object') return '请求失败'
  
  const obj = data as Record<string, unknown>
  
  if (typeof obj.message === 'string') return obj.message
  
  if (Array.isArray(obj.message)) {
    return obj.message
      .map((item: unknown) => {
        if (typeof item === 'string') return item
        if (item && typeof item === 'object') {
          const msg = (item as Record<string, unknown>).message
          return typeof msg === 'string' ? msg : JSON.stringify(item)
        }
        return String(item)
      })
      .join('; ')
  }
  
  return '请求失败'
}

function getRequestKey(endpoint: string, options: RequestInit): string {
  const body = options.body ? JSON.stringify(options.body) : ''
  return `${options.method || 'GET'}:${endpoint}:${body}`
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const requestKey = getRequestKey(endpoint, options)
  
  const pendingRequest = pendingRequests.get(requestKey)
  if (pendingRequest) {
    return pendingRequest as Promise<T>
  }
  
  const requestPromise = executeRequest<T>(endpoint, options)
  pendingRequests.set(requestKey, requestPromise)
  
  try {
    const result = await requestPromise
    return result
  } finally {
    pendingRequests.delete(requestKey)
  }
}

async function executeRequest<T>(
  endpoint: string,
  options: RequestInit
): Promise<T> {
  const deviceId = getDeviceId()
  const url = `${API_BASE_URL}${endpoint}`

  const controller = new AbortController()
  const timeoutId = setTimeout(() => controller.abort(), 30000)

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        'x-device-id': deviceId,
        ...options.headers,
      },
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      const errorMessage = extractErrorMessage(errorData)
      throw new ApiError(response.status, errorMessage, errorData)
    }

    const newDeviceId = response.headers.get('x-device-id')
    if (newDeviceId) {
      localStorage.setItem(DEVICE_ID_KEY, newDeviceId)
    }

    return response.json()
  } catch (error) {
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, '请求超时', { timeout: true })
    }
    throw error
  } finally {
    clearTimeout(timeoutId)
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public data?: unknown
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

export const api = {
  get: <T>(endpoint: string) => apiRequest<T>(endpoint, { method: 'GET' }),
  post: <T>(endpoint: string, body: unknown) =>
    apiRequest<T>(endpoint, { method: 'POST', body: JSON.stringify(body) }),
}

export type Book = {
  id: string
  code: string
  name: string
  wordCount: number
}

export type Word = {
  id: string
  word: string
  phonetic: string | null
  meaning: string
  example: string | null
}

export type WordState = {
  intervalDay: number
  ease: number
  dueAt: string
  reviews: number
  streak: number
}

export type NextWordResponse = {
  deviceId: string
  mode: 'study' | 'review'
  word: Word
  state: WordState
}

export type FeedbackRequest = {
  bookId: string
  wordId: string
  rating: '不认识' | '模糊' | '认识'
}

export type FeedbackResponse = {
  deviceId: string
  saved: {
    wordId: string
    dueAt: string
    intervalDay: number
    ease: number
    streak: number
    reviews: number
  }
}

export type StatsResponse = {
  deviceId: string
  todayKey: string
  learnedToday: number
  totalTracked: number
  dueCount: number
}

export type WordsListResponse = {
  total: number
  limit: number
  offset: number
  items: Word[]
}

export const booksApi = {
  list: () => api.get<Book[]>('/api/books'),
}

export const wordsApi = {
  list: (bookId: string, params?: { q?: string; limit?: number; offset?: number }) => {
    const searchParams = new URLSearchParams()
    if (params?.q) searchParams.append('q', params.q)
    if (params?.limit) searchParams.append('limit', params.limit.toString())
    if (params?.offset) searchParams.append('offset', params.offset.toString())
    const query = searchParams.toString()
    return api.get<WordsListResponse>(`/api/books/${bookId}/words${query ? `?${query}` : ''}`)
  },
}

export const studyApi = {
  next: (bookId: string, mode?: 'study' | 'review') => {
    const searchParams = new URLSearchParams()
    searchParams.append('bookId', bookId)
    if (mode) searchParams.append('mode', mode)
    return api.get<NextWordResponse>(`/api/study/next?${searchParams.toString()}`)
  },
  feedback: (data: FeedbackRequest) => api.post<FeedbackResponse>('/api/study/feedback', data),
}

export const statsApi = {
  get: (bookId: string) => api.get<StatsResponse>(`/api/stats?bookId=${bookId}`),
}

export { getDeviceId }

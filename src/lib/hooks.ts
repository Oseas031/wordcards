import { useState, useEffect, useCallback, useRef } from 'react'
import { STORAGE_KEYS } from './constants'

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((prev: T) => T)) => {
    setStoredValue((prev) => {
      const newValue = value instanceof Function ? value(prev) : value
      try {
        localStorage.setItem(key, JSON.stringify(newValue))
      } catch (error) {
        console.error('Failed to save to localStorage:', error)
      }
      return newValue
    })
  }, [key])

  return [storedValue, setValue]
}

export function useDeviceId(): string {
  const [deviceId, setDeviceId] = useLocalStorage<string>(STORAGE_KEYS.DEVICE_ID, '')

  useEffect(() => {
    if (!deviceId) {
      const newId = `dev_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`
      setDeviceId(newId)
    }
  }, [deviceId, setDeviceId])

  return deviceId
}

export function useSelectedBook(): [string | null, (bookId: string | null) => void] {
  return useLocalStorage<string | null>(STORAGE_KEYS.SELECTED_BOOK, null)
}

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])

  return debouncedValue
}

export function useIsVisible(initialDelay = 50): [boolean, () => void] {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), initialDelay)
    return () => clearTimeout(timer)
  }, [initialDelay])

  const hide = useCallback(() => setIsVisible(false), [])

  return [isVisible, hide]
}

export function useAsyncCallback<T, Args extends unknown[]>(
  callback: (...args: Args) => Promise<T>,
  deps: React.DependencyList = []
): {
  execute: (...args: Args) => Promise<void>
  loading: boolean
  error: string | null
  data: T | null
} {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<T | null>(null)

  const execute = useCallback(async (...args: Args) => {
    setLoading(true)
    setError(null)
    try {
      const result = await callback(...args)
      setData(result)
    } catch (err) {
      const message = err instanceof Error ? err.message : '请求失败'
      setError(message)
      console.error('Async callback error:', err)
    } finally {
      setLoading(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return { execute, loading, error, data }
}

export function useClickOutside(
  ref: React.RefObject<HTMLElement | null>,
  callback: () => void,
  additionalRefs: React.RefObject<HTMLElement | null>[] = []
): void {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node
      
      const isInsideMain = ref.current?.contains(target)
      const isInsideAdditional = additionalRefs.some(r => r.current?.contains(target))
      
      if (!isInsideMain && !isInsideAdditional) {
        callback()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, callback, additionalRefs])
}

export function useAnimationKey(deps: React.DependencyList = []): [number, () => void] {
  const [key, setKey] = useState(0)
  const incrementKey = useCallback(() => setKey(k => k + 1), [])
  
  useEffect(() => {
    incrementKey()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  return [key, incrementKey]
}

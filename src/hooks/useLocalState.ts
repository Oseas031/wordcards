import { useEffect, useState } from 'react'
import { readLocal, writeLocal } from '../lib/storage'

export function useLocalState<T>(key: string, initial: () => T) {
  const [value, setValue] = useState<T>(() => {
    const saved = readLocal<T>(key)
    return saved ?? initial()
  })

  useEffect(() => {
    writeLocal(key, value)
  }, [key, value])

  return [value, setValue] as const
}


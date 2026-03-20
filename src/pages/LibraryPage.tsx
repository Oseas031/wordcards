import { useEffect, useState, useRef, useCallback } from 'react'
import { booksApi, wordsApi, type Book, type Word } from '../lib/api'
import { BookSelector } from '../components/BookSelector'
import { WordVirtualList } from '../components/WordVirtualList'
import { useDebounce, useIsVisible } from '../lib/hooks'
import { inputStyle, errorBoxStyle, fadeInUpStyle } from '../lib/styles'

export function LibraryPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [q, setQ] = useState('')
  const [words, setWords] = useState<Word[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible] = useIsVisible(50)
  const [contentKey, setContentKey] = useState(0)
  
  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedQuery = useDebounce(q, 300)

  useEffect(() => {
    loadBooks()
  }, [])

  useEffect(() => {
    if (selectedBookId) {
      loadWords()
    }
  }, [selectedBookId, debouncedQuery])

  const loadBooks = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await booksApi.list()
      setBooks(data)
      if (data.length > 0 && !selectedBookId) {
        setSelectedBookId(data[0].id)
      }
    } catch (err) {
      setError('加载词库失败')
      console.error('Failed to load books:', err)
    } finally {
      setLoading(false)
    }
  }, [selectedBookId])

  const loadWords = useCallback(async () => {
    if (!selectedBookId) return

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    const controller = new AbortController()
    abortControllerRef.current = controller

    try {
      setLoading(true)
      setError(null)
      const data = await wordsApi.list(selectedBookId, { q: debouncedQuery, limit: 1000 })
      if (!controller.signal.aborted) {
        setWords(data.items)
        setTotal(data.total)
        setContentKey(k => k + 1)
      }
    } catch (err) {
      if (!controller.signal.aborted) {
        setError('搜索单词失败')
        console.error('Failed to load words:', err)
      }
    } finally {
      if (!controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [selectedBookId, debouncedQuery])

  const handleQueryChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQ(e.target.value)
  }, [])

  const handleBookChange = useCallback((bookId: string | null) => {
    setSelectedBookId(bookId)
  }, [])

  const selectedBook = books.find((b) => b.id === selectedBookId)

  return (
    <div className="tabshell">
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .library-fade-in { animation: fadeInUp 0.4s ease-out forwards; }
        .library-content-fade { animation: fadeIn 0.35s ease-out forwards; }
      `}</style>

      <section className="card" style={fadeInUpStyle(isVisible)}>
        <div className="card__body">
          <h1 className="h1">词库</h1>
          <div className="muted" style={{ marginTop: 6 }}>
            选择词库并搜索单词
          </div>
        </div>
      </section>

      <section className="card" style={fadeInUpStyle(isVisible, 0.1)}>
        <div className="card__body">
          <BookSelector
            books={books}
            selectedBookId={selectedBookId}
            onBookChange={handleBookChange}
            disabled={loading}
          />

          {selectedBook && (
            <div key={selectedBookId} className="library-fade-in">
              <input
                value={q}
                onChange={handleQueryChange}
                placeholder="搜索：单词 / 中文释义 / 例句"
                style={{ ...inputStyle, marginTop: 12 }}
              />
              <div className="muted-2" style={{ marginTop: 10 }}>
                共 {total} 条
              </div>

              {error && (
                <div style={{ ...errorBoxStyle, marginTop: 12 }}>
                  {error}
                </div>
              )}

              {loading ? (
                <div className="muted" style={{ padding: 20, textAlign: 'center', opacity: 0.7 }}>
                  加载中...
                </div>
              ) : words.length === 0 ? (
                <div className="muted" style={{ padding: 20, textAlign: 'center' }}>
                  没有找到匹配的单词
                </div>
              ) : (
                <div
                  key={contentKey}
                  className="library-content-fade"
                  style={{ marginTop: 12, height: 'calc(100vh - 340px)', minHeight: 300 }}
                >
                  <WordVirtualList words={words} />
                </div>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}

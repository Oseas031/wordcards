import { useEffect, useState } from 'react'
import { booksApi, studyApi, type Book, type NextWordResponse } from '../lib/api'
import { BookSelector } from '../components/BookSelector'

const SELECTED_BOOK_KEY = 'wordcards.selectedBook.v1'

export function StudyPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [currentWord, setCurrentWord] = useState<NextWordResponse | null>(null)
  const [revealed, setRevealed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [wordKey, setWordKey] = useState(0)

  useEffect(() => {
    loadBooks()
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  useEffect(() => {
    if (selectedBookId) {
      loadNextWord()
      localStorage.setItem(SELECTED_BOOK_KEY, selectedBookId)
    }
  }, [selectedBookId])

  async function loadBooks() {
    try {
      setLoading(true)
      setError(null)
      const data = await booksApi.list()
      setBooks(data)
      
      const savedBookId = localStorage.getItem(SELECTED_BOOK_KEY)
      if (savedBookId && data.find((b) => b.id === savedBookId)) {
        setSelectedBookId(savedBookId)
      } else if (data.length > 0) {
        setSelectedBookId(data[0].id)
      }
    } catch (err) {
      setError('加载词库失败')
      console.error('Failed to load books:', err)
    } finally {
      setLoading(false)
    }
  }

  async function loadNextWord() {
    if (!selectedBookId) return

    try {
      setLoading(true)
      setError(null)
      const data = await studyApi.next(selectedBookId)
      setCurrentWord(data)
      setRevealed(false)
      setWordKey((k) => k + 1)
    } catch (err) {
      setError('加载单词失败')
      console.error('Failed to load next word:', err)
    } finally {
      setLoading(false)
    }
  }

  async function submitFeedback(rating: '不认识' | '模糊' | '认识') {
    if (!currentWord || !selectedBookId) return

    try {
      setLoading(true)
      setError(null)
      await studyApi.feedback({
        bookId: selectedBookId,
        wordId: currentWord.word.id,
        rating,
      })
      await loadNextWord()
    } catch (err) {
      setError('提交反馈失败')
      console.error('Failed to submit feedback:', err)
    } finally {
      setLoading(false)
    }
  }

  const selectedBook = books.find((b) => b.id === selectedBookId)

  return (
    <div className="tabshell">
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes wordSlideIn {
          from {
            opacity: 0;
            transform: translateX(20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        @keyframes revealExpand {
          from {
            opacity: 0;
            max-height: 0;
          }
          to {
            opacity: 1;
            max-height: 200px;
          }
        }
        .study-fade-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        .study-word-slide {
          animation: wordSlideIn 0.35s ease-out forwards;
        }
        .study-reveal {
          animation: revealExpand 0.3s ease-out forwards;
        }
      `}</style>

      <section
        className="card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.35s ease-out, transform 0.35s ease-out',
        }}
      >
        <div className="card__body">
          <BookSelector
            books={books}
            selectedBookId={selectedBookId}
            onBookChange={setSelectedBookId}
            disabled={loading}
          />

          <div className="row" style={{ alignItems: 'baseline', marginTop: 12 }}>
            <h1 className="h1" style={{ marginRight: 12 }}>
              学习
            </h1>
            <div className="muted-2">
              {selectedBook ? `${selectedBook.name} · ${selectedBook.wordCount} 个` : ''}
            </div>
          </div>
        </div>
      </section>

      {error && (
        <section className="card study-fade-up">
          <div
            className="card__body"
            style={{
              padding: '10px 14px',
              background: 'rgba(255, 59, 48, 0.1)',
              borderRadius: 12,
              color: '#ff3b30',
              fontSize: 14,
            }}
          >
            {error}
          </div>
        </section>
      )}

      {loading && !currentWord ? (
        <section
          className="card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease-out 0.1s, transform 0.4s ease-out 0.1s',
          }}
        >
          <div className="card__body">
            <div className="muted" style={{ padding: 20, textAlign: 'center' }}>
              加载中...
            </div>
          </div>
        </section>
      ) : currentWord ? (
        <>
          <section
            key={wordKey}
            className="card study-word-slide"
          >
            <div className="card__body">
              <button
                type="button"
                className="btn btn--ghost"
                style={{ width: '100%', textAlign: 'left' }}
                onClick={() => setRevealed((v) => !v)}
                disabled={loading}
              >
                {revealed ? '收起释义' : '显示释义'}
              </button>

              <div style={{ marginTop: 14 }}>
                <div style={{ fontSize: 34, fontWeight: 900, letterSpacing: -0.02 }}>
                  {currentWord.word.word}
                </div>
                {currentWord.word.phonetic ? (
                  <div className="muted" style={{ marginTop: 6 }}>
                    {currentWord.word.phonetic}
                  </div>
                ) : null}

                {revealed ? (
                  <div className="study-reveal" style={{ marginTop: 14, overflow: 'hidden' }}>
                    <div style={{ fontWeight: 800 }}>{currentWord.word.meaning}</div>
                    {currentWord.word.example ? (
                      <div className="muted" style={{ marginTop: 8 }}>
                        例句：{currentWord.word.example}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="muted" style={{ marginTop: 14 }}>
                    点击"显示释义"或卡片上方按钮查看
                  </div>
                )}
              </div>

              <div className="muted-2" style={{ marginTop: 14 }}>
                下次复习：{new Date(currentWord.state.dueAt).toLocaleString()}
              </div>
            </div>
          </section>

          <section
            className="card"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
              transition: 'opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s',
            }}
          >
            <div className="card__body">
              <div className="row">
                <button
                  className="btn btn--ghost"
                  type="button"
                  onClick={() => submitFeedback('不认识')}
                  disabled={loading}
                >
                  不认识
                </button>
                <button
                  className="btn"
                  type="button"
                  onClick={() => submitFeedback('模糊')}
                  disabled={loading}
                >
                  模糊
                </button>
                <button
                  className="btn btn--primary"
                  type="button"
                  onClick={() => submitFeedback('认识')}
                  disabled={loading}
                >
                  认识
                </button>
              </div>
            </div>
          </section>
        </>
      ) : (
        <section
          className="card"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
            transition: 'opacity 0.4s ease-out 0.1s, transform 0.4s ease-out 0.1s',
          }}
        >
          <div className="card__body">
            <div className="muted" style={{ padding: 20, textAlign: 'center' }}>
              请选择词库开始学习
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

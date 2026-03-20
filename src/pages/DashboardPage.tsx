import { useEffect, useState } from 'react'
import { booksApi, statsApi, type Book } from '../lib/api'
import { BookSelector } from '../components/BookSelector'

const SELECTED_BOOK_KEY = 'wordcards.selectedBook.v1'

export function DashboardPage() {
  const [books, setBooks] = useState<Book[]>([])
  const [selectedBookId, setSelectedBookId] = useState<string | null>(null)
  const [stats, setStats] = useState<{
    learnedToday: number
    totalTracked: number
    dueCount: number
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    loadBooks()
    setTimeout(() => setIsVisible(true), 50)
  }, [])

  useEffect(() => {
    if (selectedBookId) {
      loadStats()
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

  async function loadStats() {
    if (!selectedBookId) return

    try {
      setLoading(true)
      setError(null)
      const data = await statsApi.get(selectedBookId)
      setStats({
        learnedToday: data.learnedToday,
        totalTracked: data.totalTracked,
        dueCount: data.dueCount,
      })
    } catch (err) {
      setError('加载统计失败')
      console.error('Failed to load stats:', err)
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
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .dashboard-fade-up {
          animation: fadeInUp 0.4s ease-out forwards;
        }
        .dashboard-scale-in {
          animation: scaleIn 0.35s ease-out forwards;
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
          <div className="row">
            <div>
              <h1 className="h1">今日计划</h1>
              <div className="muted" style={{ marginTop: 6 }}>
                {selectedBook
                  ? `正在学习：${selectedBook.name}`
                  : '请选择词库开始学习'}
              </div>
            </div>
            <div className="muted-2">
              {selectedBook ? `${selectedBook.wordCount} 个单词` : ''}
            </div>
          </div>
        </div>
      </section>

      <section
        className="card"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease-out 0.1s, transform 0.4s ease-out 0.1s',
        }}
      >
        <div className="card__body">
          <BookSelector
            books={books}
            selectedBookId={selectedBookId}
            onBookChange={setSelectedBookId}
            disabled={loading}
          />
        </div>
      </section>

      {error && (
        <section
          className="card dashboard-fade-up"
        >
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

      <section
        className="grid grid--2"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? 'translateY(0)' : 'translateY(8px)',
          transition: 'opacity 0.4s ease-out 0.2s, transform 0.4s ease-out 0.2s',
        }}
      >
        <div className="card dashboard-scale-in" style={{ animationDelay: '0.2s' }}>
          <div className="card__body">
            <h2 className="h2">已学</h2>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
              {loading ? '...' : stats?.learnedToday ?? 0}
            </div>
            <div className="muted-2" style={{ marginTop: 6 }}>
              今日已完成的学习数
            </div>
          </div>
        </div>
        <div className="card dashboard-scale-in" style={{ animationDelay: '0.3s' }}>
          <div className="card__body">
            <h2 className="h2">待复习</h2>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>
              {loading ? '...' : stats?.dueCount ?? 0}
            </div>
            <div className="muted-2" style={{ marginTop: 6 }}>
              根据间隔重复生成
            </div>
          </div>
        </div>
      </section>

      {stats && stats.totalTracked > 0 && (
        <section
          className="card dashboard-fade-up"
        >
          <div className="card__body">
            <div className="muted-2">
              累计已学习 {stats.totalTracked} 个单词
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

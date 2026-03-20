import { memo, useMemo, useCallback, useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { Book } from '../lib/api'
import { useClickOutside } from '../lib/hooks'

interface BookSelectorProps {
  books: Book[]
  selectedBookId: string | null
  onBookChange: (bookId: string | null) => void
  disabled?: boolean
  label?: string
}

interface DropdownItemProps {
  children: React.ReactNode
  onClick: () => void
  isSelected?: boolean
  subText?: string
}

const DropdownItem = memo(function DropdownItem({
  children,
  onClick,
  isSelected = false,
  subText,
}: DropdownItemProps) {
  const [isHovered, setIsHovered] = useState(false)

  const handleMouseEnter = useCallback(() => setIsHovered(true), [])
  const handleMouseLeave = useCallback(() => setIsHovered(false), [])

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        padding: '12px 14px',
        cursor: 'pointer',
        color: '#1a1a1a',
        fontWeight: isSelected ? 700 : 500,
        background: isSelected
          ? 'rgba(59, 130, 246, 0.18)'
          : isHovered
            ? 'rgba(59, 130, 246, 0.1)'
            : 'transparent',
        borderBottom: '1px solid rgba(0,0,0,0.06)',
        transition: 'background 0.15s ease',
      }}
    >
      <div style={{ color: '#1a1a1a' }}>{children}</div>
      {subText && (
        <div style={{ fontSize: 12, color: '#666666', marginTop: 2 }}>
          {subText}
        </div>
      )}
    </div>
  )
})

export const BookSelector = memo(function BookSelector({
  books,
  selectedBookId,
  onBookChange,
  disabled = false,
  label = '选择词库',
}: BookSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 })

  const selectedBook = useMemo(
    () => books.find((b) => b.id === selectedBookId),
    [books, selectedBookId]
  )

  const updatePosition = useCallback(() => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect()
      setDropdownPosition({
        top: rect.bottom + 4,
        left: rect.left,
        width: rect.width,
      })
    }
  }, [])

  useEffect(() => {
    if (isOpen) {
      updatePosition()
      const handleScroll = () => setIsOpen(false)
      const handleResize = () => updatePosition()
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', handleResize)
      return () => {
        window.removeEventListener('scroll', handleScroll, true)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [isOpen, updatePosition])

  useClickOutside(containerRef, () => setIsOpen(false), [dropdownRef])

  const handleSelectBook = useCallback((bookId: string | null) => {
    onBookChange(bookId)
    setIsOpen(false)
  }, [onBookChange])

  const handleToggle = useCallback(() => {
    if (!disabled) setIsOpen(v => !v)
  }, [disabled])

  const dropdown = useMemo(() => {
    if (!isOpen) return null

    return (
      <div
        ref={dropdownRef}
        style={{
          position: 'fixed',
          top: dropdownPosition.top,
          left: dropdownPosition.left,
          width: dropdownPosition.width,
          borderRadius: 14,
          border: '1px solid rgba(0,0,0,0.15)',
          background: '#ffffff',
          boxShadow: '0 12px 40px rgba(0,0,0,0.2), 0 4px 16px rgba(0,0,0,0.12)',
          zIndex: 99999,
          maxHeight: 280,
          overflowY: 'auto',
          animation: 'dropdownSlideIn 0.2s ease-out',
        }}
      >
        <style>{`
          @keyframes dropdownSlideIn {
            from { opacity: 0; transform: translateY(-6px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
        
        <DropdownItem
          onClick={() => handleSelectBook(null)}
          isSelected={selectedBookId === null}
        >
          请选择词库
        </DropdownItem>
        
        {books.map((book) => (
          <DropdownItem
            key={book.id}
            onClick={() => handleSelectBook(book.id)}
            isSelected={selectedBookId === book.id}
            subText={`${book.wordCount} 个单词`}
          >
            {book.name}
          </DropdownItem>
        ))}
      </div>
    )
  }, [isOpen, dropdownPosition, books, selectedBookId, handleSelectBook])

  return (
    <div ref={containerRef}>
      <label style={{ display: 'block', marginBottom: 6, fontWeight: 700 }}>
        {label}
      </label>
      <button
        type="button"
        onClick={handleToggle}
        disabled={disabled}
        style={{
          width: '100%',
          padding: '10px 12px',
          borderRadius: 14,
          border: '1px solid var(--line)',
          background: 'rgba(255,255,255,0.66)',
          color: 'var(--text)',
          fontWeight: 650,
          outline: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          transition: 'all 0.2s ease',
          opacity: disabled ? 0.6 : 1,
        }}
      >
        <span>
          {selectedBook
            ? `${selectedBook.name} (${selectedBook.wordCount} 个单词)`
            : '请选择词库'}
        </span>
        <span
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s ease',
            fontSize: 12,
          }}
        >
          ▼
        </span>
      </button>
      {createPortal(dropdown, document.body)}
    </div>
  )
})

import { memo, useRef, useCallback } from 'react'
import { useVirtualizer } from '@tanstack/react-virtual'
import type { Word } from '../lib/api'

interface WordVirtualListProps {
  words: Word[]
}

const ITEM_HEIGHT = 100

const WordCard = memo(function WordCard({ word }: { word: Word }) {
  return (
    <div
      style={{
        border: '1px solid var(--line)',
        borderRadius: 16,
        padding: 14,
        margin: '0 0 12px 0',
        background: 'rgba(255,255,255,0.45)',
      }}
    >
      <div className="row" style={{ alignItems: 'baseline' }}>
        <div style={{ fontSize: 16, fontWeight: 900 }}>{word.word}</div>
        {word.phonetic && (
          <div className="muted-2" style={{ fontSize: 12, marginLeft: 8 }}>
            {word.phonetic}
          </div>
        )}
      </div>
      <div className="muted" style={{ marginTop: 6 }}>
        {word.meaning}
      </div>
      {word.example && (
        <div className="muted-2" style={{ marginTop: 8, fontSize: 12 }}>
          例句：{word.example}
        </div>
      )}
    </div>
  )
})

export function WordVirtualList({ words }: WordVirtualListProps) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: words.length,
    getScrollElement: useCallback(() => parentRef.current, []),
    estimateSize: useCallback(() => ITEM_HEIGHT, []),
    overscan: 10,
  })

  if (words.length === 0) return null

  const virtualItems = virtualizer.getVirtualItems()

  return (
    <div
      ref={parentRef}
      style={{
        height: '100%',
        overflow: 'auto',
      }}
    >
      <div
        style={{
          height: virtualizer.getTotalSize(),
          width: '100%',
          position: 'relative',
        }}
      >
        {virtualItems.map((virtualItem) => {
          const word = words[virtualItem.index]
          return (
            <div
              key={word.id}
              data-index={virtualItem.index}
              ref={virtualizer.measureElement}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualItem.start}px)`,
              }}
            >
              <WordCard word={word} />
            </div>
          )
        })}
      </div>
    </div>
  )
}

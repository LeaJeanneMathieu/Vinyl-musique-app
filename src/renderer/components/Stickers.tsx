import React, { useEffect, useRef, useState } from 'react'
import '../styles/Stickers.css'

type StickerType = 'star' | 'heart' | 'note' | 'tape'

interface Sticker {
  id: string
  type: StickerType
  x: number // percent of width
  y: number // percent of height
  r?: number // rotation
  s?: number // scale
}

const DEFAULT_STICKERS: Sticker[] = [
  { id: 's1', type: 'star', x: 15, y: 20, r: -10, s: 1 },
  { id: 's2', type: 'heart', x: 80, y: 28, r: 8, s: 1 },
  { id: 's3', type: 'note', x: 25, y: 78, r: -5, s: 1 },
  { id: 's4', type: 'tape', x: 70, y: 70, r: 12, s: 1 },
]

const STORAGE_KEY = 'cute_stickers_v1'

function loadStickers(): Sticker[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return DEFAULT_STICKERS
    const parsed = JSON.parse(raw) as Sticker[]
    return parsed && parsed.length ? parsed : DEFAULT_STICKERS
  } catch {
    return DEFAULT_STICKERS
  }
}

function saveStickers(stickers: Sticker[]): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(stickers)) } catch {}
}

const Stickers: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [stickers, setStickers] = useState<Sticker[]>(loadStickers())
  const [dragId, setDragId] = useState<string | null>(null)

  useEffect(() => { saveStickers(stickers) }, [stickers])

  const startDrag = (id: string) => (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation()
    setDragId(id)
  }

  const onMove = (clientX: number, clientY: number) => {
    if (!dragId || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const xPct = Math.min(100, Math.max(0, ((clientX - rect.left) / rect.width) * 100))
    const yPct = Math.min(100, Math.max(0, ((clientY - rect.top) / rect.height) * 100))
    setStickers(prev => prev.map(s => s.id === dragId ? { ...s, x: xPct, y: yPct } : s))
  }

  // Global listeners to improve drag reliability
  useEffect(() => {
    if (!dragId) return
    const onMouseMove = (e: MouseEvent) => onMove(e.clientX, e.clientY)
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches[0]) onMove(e.touches[0].clientX, e.touches[0].clientY)
    }
    const onUp = () => setDragId(null)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onUp)
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('touchend', onUp)
    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onUp)
      window.removeEventListener('touchmove', onTouchMove as any)
      window.removeEventListener('touchend', onUp)
    }
  }, [dragId])

  const endDrag = () => setDragId(null)

  const addSticker = (type: StickerType) => () => {
    const id = Math.random().toString(36).slice(2)
    setStickers(prev => [...prev, { id, type, x: 50, y: 50, r: 0, s: 1 }])
  }

  const removeSticker = (id: string) => (e: React.MouseEvent) => {
    e.stopPropagation()
    setStickers(prev => prev.filter(s => s.id !== id))
  }

  return (
    <div
      className="stickers-layer"
      ref={containerRef}
      onMouseUp={endDrag}
      onMouseLeave={endDrag}
      onTouchEnd={endDrag}
    >
      <div className="sticker-toolbar">
        <button className="sticker-btn" title="Add star" onClick={addSticker('star')}>⭐</button>
        <button className="sticker-btn" title="Add heart" onClick={addSticker('heart')}>💖</button>
        <button className="sticker-btn" title="Add note" onClick={addSticker('note')}>🎵</button>
        <button className="sticker-btn" title="Add tape" onClick={addSticker('tape')}>🩹</button>
      </div>

      {stickers.map(s => (
        <div
          key={s.id}
          className={`sticker sticker-${s.type}`}
          style={{ left: `${s.x}%`, top: `${s.y}%`, transform: `translate(-50%, -50%) rotate(${s.r || 0}deg) scale(${s.s || 1})` }}
          onMouseDown={startDrag(s.id)}
          onTouchStart={startDrag(s.id)}
        >
          <button className="sticker-delete" onClick={removeSticker(s.id)} aria-label="Delete sticker">✕</button>
          {s.type === 'star' && <span>⭐</span>}
          {s.type === 'heart' && <span>💖</span>}
          {s.type === 'note' && <span>🎵</span>}
          {s.type === 'tape' && (
            <div className="tape">
              <span/>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default Stickers



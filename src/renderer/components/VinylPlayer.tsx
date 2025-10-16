import React, { useCallback, useMemo, useRef, useState } from 'react'
import { SpotifyTrack } from '../types/spotify'
import '../styles/VinylPlayer.css'

interface VinylPlayerProps {
  track: SpotifyTrack | null
  isPlaying: boolean
  progress: number
  onSeek?: (positionMs: number) => void
}

const VinylPlayer: React.FC<VinylPlayerProps> = ({ track, isPlaying, progress, onSeek }) => {
  const coverUrl = track?.album.images[0]?.url || ''
  const artistNames = track?.artists.map(a => a.name).join(', ') || ''

  // Format time in mm:ss
  const formatTime = (ms: number): string => {
    const totalSeconds = Math.floor(ms / 1000)
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const currentTime = formatTime(progress)
  const totalTime = track ? formatTime(track.duration_ms) : '0:00'
  const progressPercentage = useMemo(() => track ? (progress / track.duration_ms) * 100 : 0, [track, progress])

  const barRef = useRef<HTMLDivElement | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const positionFromEvent = useCallback((clientX: number): number => {
    if (!track || !barRef.current) return 0
    const rect = barRef.current.getBoundingClientRect()
    const x = Math.min(Math.max(clientX - rect.left, 0), rect.width)
    const ratio = x / rect.width
    return Math.floor(track.duration_ms * ratio)
  }, [track])

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!onSeek) return
    const pos = positionFromEvent(e.clientX)
    onSeek(pos)
  }, [onSeek, positionFromEvent])

  const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true)
    e.preventDefault()
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !onSeek) return
    const pos = positionFromEvent(e.clientX)
    onSeek(pos)
  }, [isDragging, onSeek, positionFromEvent])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleTouchStart = useCallback(() => setIsDragging(true), [])
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!isDragging || !onSeek) return
    const touch = e.touches[0]
    const pos = positionFromEvent(touch.clientX)
    onSeek(pos)
  }, [isDragging, onSeek, positionFromEvent])
  const handleTouchEnd = useCallback(() => setIsDragging(false), [])

  return (
    <div className="vinyl-player">
      <div className="vinyl-container">
        {/* Vinyl disc */}
        <div className={`vinyl-disc ${isPlaying ? 'spinning' : ''}`}>
          <svg viewBox="0 0 300 300" className="vinyl-svg">
            {/* Outer black vinyl */}
            <circle cx="150" cy="150" r="145" fill="#1a1a1a" />
            
            {/* Grooves */}
            {[...Array(15)].map((_, i) => (
              <circle
                key={i}
                cx="150"
                cy="150"
                r={140 - i * 8}
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="2"
              />
            ))}
            
            {/* Center label area - tinted by dynamic accent */}
            <circle cx="150" cy="150" r="50" fill="rgba(255,255,255,0.85)" />
            <circle cx="150" cy="150" r="48" fill="rgba(var(--accent-dynamic-rgb), 0.85)" />
            
            {/* Center hole */}
            <circle cx="150" cy="150" r="8" fill="#1a1a1a" />
          </svg>
        </div>

        {/* Album cover */}
        <div className={`album-cover ${isPlaying ? 'spinning' : ''}`}>
          {coverUrl ? (
            <img src={coverUrl} alt={track?.album.name || 'Album cover'} />
          ) : (
            <div className="no-cover">
              <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="50" cy="50" r="40" stroke="#FFB5C5" strokeWidth="3" fill="none" />
                <path d="M35 40 L35 60 L55 50 Z" fill="#FFB5C5" />
              </svg>
            </div>
          )}
        </div>
      </div>

      {/* Track info */}
      <div className="track-info">
        {/* actions removed per request */}
        <h2 className="track-title">{track?.name || 'No track playing'}</h2>
        <p className="track-artist">{artistNames || 'Play a song on Spotify'}</p>
        <p className="track-album">{track?.album.name || ''}</p>
        
        {track && (
          <div className="progress-section">
            <div
              className={`progress-bar ${isDragging ? 'dragging' : ''}`}
              ref={barRef}
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
            >
              <div
                className="progress-fill"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
            <div className="time-display">
              <span className="current-time">{currentTime}</span>
              <span className="total-time">{totalTime}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default VinylPlayer


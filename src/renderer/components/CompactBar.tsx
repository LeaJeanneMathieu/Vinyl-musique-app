import React from 'react'
import '../styles/CompactBar.css'

interface CompactBarProps {
  title: string
  artist: string
  isPlaying: boolean
  coverUrl?: string
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
  onToggleMode?: () => void
}

const CompactBar: React.FC<CompactBarProps> = ({
  title,
  artist,
  isPlaying,
  coverUrl,
  onPlayPause,
  onPrevious,
  onNext,
  onToggleMode,
}) => {
  return (
    <div className="compact-bar" role="region" aria-label="Compact player" id="compact-bar">
      <div className="compact-center">
        <div className={`compact-vinyl ${isPlaying ? 'spinning' : ''}`} aria-hidden="true">
          <svg viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" className="compact-vinyl-svg">
            <defs>
              <linearGradient id="vinylShine" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="rgba(255,255,255,0.2)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <clipPath id="labelClip">
                <circle cx="30" cy="30" r="12" />
              </clipPath>
            </defs>
            <circle cx="30" cy="30" r="29" fill="#1a1a1a" />
            {Array.from({ length: 8 }).map((_, i) => (
              <circle key={i} cx="30" cy="30" r={26 - i * 3} fill="none" stroke="#2a2a2a" strokeWidth="1" />
            ))}
            <circle cx="30" cy="30" r="16" fill="rgba(var(--accent-dynamic-rgb), 0.15)" />
            <circle cx="30" cy="30" r="12.5" fill="url(#vinylShine)" />
            <circle cx="30" cy="30" r="12" fill="rgba(255,255,255,0.9)" />
            {coverUrl ? (
              <image href={coverUrl} x="18" y="18" width="24" height="24" clipPath="url(#labelClip)" preserveAspectRatio="xMidYMid slice" />
            ) : (
              <circle cx="30" cy="30" r="12" fill="rgba(var(--accent-dynamic-rgb), 0.85)" />
            )}
            <circle cx="30" cy="30" r="2" fill="#1a1a1a" />
          </svg>
        </div>
        <div className="compact-info">
          <div className="compact-title" title={title}>{title || 'Aucune lecture'}</div>
          <div className="compact-artist" title={artist}>{artist || ''}</div>
        </div>
      </div>
      <div className="compact-controls">
        {onToggleMode && (
          <button className="compact-btn" onClick={onToggleMode} aria-label="Basculer l'affichage">
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 7h16v2H4V7zm0 8h16v2H4v-2z" fill="currentColor" />
            </svg>
          </button>
        )}
        <button className="compact-btn" onClick={onPrevious} aria-label="Musique précédente">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 5L7 12L19 19V5Z" fill="currentColor" />
            <rect x="5" y="5" width="2" height="14" fill="currentColor" />
          </svg>
        </button>
        <button className="compact-btn play" onClick={onPlayPause} aria-label={isPlaying ? 'Pause' : 'Lecture'}>
          {isPlaying ? (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
              <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 5L19 12L8 19V5Z" fill="currentColor" />
            </svg>
          )}
        </button>
        <button className="compact-btn" onClick={onNext} aria-label="Musique suivante">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 5L17 12L5 19V5Z" fill="currentColor" />
            <rect x="17" y="5" width="2" height="14" fill="currentColor" />
          </svg>
        </button>
      </div>
    </div>
  )
}

export default CompactBar



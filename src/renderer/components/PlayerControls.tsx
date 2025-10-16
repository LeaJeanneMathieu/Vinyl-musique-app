import React from 'react'
import '../styles/PlayerControls.css'

interface PlayerControlsProps {
  isPlaying: boolean
  isShuffle: boolean
  repeatMode?: 'off' | 'track' | 'context'
  onPlayPause: () => void
  onPrevious: () => void
  onNext: () => void
  onToggleShuffle: () => void
  onCycleRepeat?: () => void
  volume?: number
  muted?: boolean
  onChangeVolume?: (value: number) => void
  onToggleMute?: () => void
}

const PlayerControls: React.FC<PlayerControlsProps> = ({
  isPlaying,
  isShuffle,
  repeatMode = 'off',
  onPlayPause,
  onPrevious,
  onNext,
  onToggleShuffle,
  onCycleRepeat,
  volume = 100,
  muted = false,
  onChangeVolume,
  onToggleMute,
}) => {
  return (
    <div className="player-controls">
      <div className="controls-left">
      <button
        className={`control-btn repeat-btn ${repeatMode !== 'off' ? 'active' : ''} ${repeatMode === 'track' ? 'single' : ''}`}
        onClick={onCycleRepeat}
        aria-label="Repeat"
        title={`Repeat: ${repeatMode}`}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M7 7h7v2H7a3 3 0 0 0 0 6h2v2H7a5 5 0 0 1 0-10zm10 0h-2v2h2a3 3 0 0 1 0 6h-7v2h7a5 5 0 0 0 0-10z" fill="currentColor"/>
          {repeatMode === 'track' && (
            <circle cx="18" cy="6" r="3" fill="currentColor" />
          )}
        </svg>
      </button>
      <button
        className={`control-btn shuffle-btn ${isShuffle ? 'active' : ''}`}
        onClick={onToggleShuffle}
        aria-label="Shuffle"
        title={isShuffle ? 'Désactiver aléatoire' : 'Activer aléatoire'}
      >
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z" fill="currentColor"/>
        </svg>
      </button>
      </div>

      <div className="controls-center">
      <button className="control-btn" onClick={onPrevious} aria-label="Previous">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M19 5L7 12L19 19V5Z" fill="currentColor" />
          <rect x="5" y="5" width="2" height="14" fill="currentColor" />
        </svg>
      </button>

      <button
        className="control-btn play-pause-btn"
        onClick={onPlayPause}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="6" y="5" width="4" height="14" rx="1" fill="currentColor" />
            <rect x="14" y="5" width="4" height="14" rx="1" fill="currentColor" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 5L19 12L8 19V5Z" fill="currentColor" />
          </svg>
        )}
      </button>

      <button className="control-btn" onClick={onNext} aria-label="Next">
        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M5 5L17 12L5 19V5Z" fill="currentColor" />
          <rect x="17" y="5" width="2" height="14" fill="currentColor" />
        </svg>
      </button>
      </div>

      <div className="controls-right">
      <div className="volume-controls" aria-label="Volume">
        <button className={`control-btn mute-btn ${muted ? 'active' : ''}`} onClick={onToggleMute} aria-label="Mute">
          {muted || volume === 0 ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7L8 13H4V11H7L15 5V19L11 16" stroke="currentColor" strokeWidth="2"/>
              <path d="M19 9L21 11M21 13L19 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : volume < 50 ? (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7L8 13H4V11H7L15 5V19L11 16" stroke="currentColor" strokeWidth="2"/>
              <path d="M18 12a3 3 0 0 0-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M16 7L8 13H4V11H7L15 5V19L11 16" stroke="currentColor" strokeWidth="2"/>
              <path d="M18 12a3 3 0 0 0-3-3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <path d="M21 12a6 6 0 0 0-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          )}
        </button>
        <input
          className="volume-slider"
          type="range"
          min={0}
          max={100}
          value={muted ? 0 : volume}
          onChange={(e) => onChangeVolume && onChangeVolume(Number(e.target.value))}
        />
      </div>
      </div>
    </div>
  )
}

export default PlayerControls


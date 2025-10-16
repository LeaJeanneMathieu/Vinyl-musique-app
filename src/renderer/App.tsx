import React, { useEffect, useState, useCallback } from 'react'
import VinylPlayer from './components/VinylPlayer'
import PlayerControls from './components/PlayerControls'
import SpotifyAuth from './components/SpotifyAuth'
import CompactBar from './components/CompactBar'
import { getAccessToken, handleCallback, logout } from './utils/spotify-auth'
import {
  getCurrentPlayback,
  play,
  pause,
  skipToNext,
  skipToPrevious,
  setShuffle,
  seek,
  setRepeat,
} from './utils/spotify-api'
import { SpotifyPlaybackState } from './types/spotify'
import './styles/App.css'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [playbackState, setPlaybackState] = useState<SpotifyPlaybackState | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Check for authentication on mount
  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      setIsAuthenticated(true)
    }

    // Check for OAuth callback
    const params = new URLSearchParams(window.location.search)
    const code = params.get('code')

    if (code) {
      handleCallback(code)
        .then(() => {
          setIsAuthenticated(true)
          // Clean up URL
          window.history.replaceState({}, document.title, '/')
        })
        .catch((err) => {
          console.error('Auth error:', err)
          setError('Failed to authenticate with Spotify')
        })
        .finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsLoading(false)
    }
  }, [])

  // Poll for playback state
  useEffect(() => {
    if (!isAuthenticated) return

    const fetchPlayback = async () => {
      try {
        const state = await getCurrentPlayback()
        setPlaybackState(state)
        setError(null)
      } catch (err) {
        console.error('Failed to get playback:', err)
        setError('Failed to get playback state')
      }
    }

    fetchPlayback()
    const interval = setInterval(fetchPlayback, 2000)

    return () => clearInterval(interval)
  }, [isAuthenticated])

  const [liked, setLiked] = useState<boolean>(false)
  const [compactMode, setCompactMode] = useState<boolean>(false)
  const toggleCompactMode = useCallback(() => setCompactMode((v) => !v), [])

  // Resize Electron window when compact mode changes
  useEffect(() => {
    const apply = async () => {
      try {
        if (window.electronAPI?.setCompactMode) {
          let targetHeight: number | undefined
          if (compactMode) {
            const el = document.getElementById('compact-bar')
            if (el) {
              // include slight padding/margins
              targetHeight = Math.ceil(el.getBoundingClientRect().height + 8)
            }
          }
          await window.electronAPI.setCompactMode(compactMode, targetHeight)
        }
      } catch {
        // ignore if not in Electron
      }
    }
    apply()

    // Toggle compact class on #root so CSS can shrink height
    const root = document.getElementById('root')
    if (root) {
      if (compactMode) root.classList.add('compact')
      else root.classList.remove('compact')
    }
  }, [compactMode])

  // Dynamic palette from cover
  useEffect(() => {
    const imgUrl = playbackState?.item?.album.images[0]?.url
    if (!imgUrl) return
    const img = new Image()
    img.crossOrigin = 'anonymous'
    img.src = imgUrl
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        if (!ctx) return
        canvas.width = 32
        canvas.height = 32
        ctx.drawImage(img, 0, 0, 32, 32)
        const { data } = ctx.getImageData(0, 0, 32, 32)
        let r = 0, g = 0, b = 0, count = 0
        for (let i = 0; i < data.length; i += 4 * 4) { // sample every 4 pixels
          r += data[i]
          g += data[i + 1]
          b += data[i + 2]
          count++
        }
        if (count > 0) {
          r = Math.round(r / count)
          g = Math.round(g / count)
          b = Math.round(b / count)
          const color = `rgb(${r}, ${g}, ${b})`
          document.documentElement.style.setProperty('--accent-dynamic', color)
          document.documentElement.style.setProperty('--accent-dynamic-rgb', `${r}, ${g}, ${b}`)
        }
      } catch {
        // ignore
      }
    }
  }, [playbackState?.item?.album.images])

  // Keep liked state in sync when track changes
  useEffect(() => {
    const syncLiked = async () => {
      try {
        const trackId = playbackState?.item?.id
        if (!trackId) { setLiked(false); return }
        const { getSavedStateForTracks } = await import('./utils/spotify-api')
        const [isSaved] = await getSavedStateForTracks([trackId])
        setLiked(!!isSaved)
      } catch {
        setLiked(false)
      }
    }
    syncLiked()
  }, [playbackState?.item?.id])

  const handleToggleLike = useCallback(async () => {
    try {
      const trackId = playbackState?.item?.id
      if (!trackId) return
      if (liked) {
        const { removeSavedTracks } = await import('./utils/spotify-api')
        await removeSavedTracks([trackId])
        setLiked(false)
      } else {
        const { saveTracks } = await import('./utils/spotify-api')
        await saveTracks([trackId])
        setLiked(true)
      }
    } catch (err) {
      console.error('Failed to toggle like:', err)
      setError('Failed to update liked state')
    }
  }, [liked, playbackState?.item?.id])

  const handlePlayPause = useCallback(async () => {
    try {
      if (playbackState?.is_playing) {
        await pause()
      } else {
        await play()
      }
      // Refresh state immediately
      const state = await getCurrentPlayback()
      setPlaybackState(state)
    } catch (err) {
      console.error('Failed to toggle playback:', err)
      setError('Failed to control playback')
    }
  }, [playbackState])

  const handlePrevious = useCallback(async () => {
    try {
      await skipToPrevious()
      // Refresh state after a short delay
      setTimeout(async () => {
        const state = await getCurrentPlayback()
        setPlaybackState(state)
      }, 500)
    } catch (err) {
      console.error('Failed to skip to previous:', err)
      setError('Failed to skip track')
    }
  }, [])

  const handleNext = useCallback(async () => {
    try {
      await skipToNext()
      // Refresh state after a short delay
      setTimeout(async () => {
        const state = await getCurrentPlayback()
        setPlaybackState(state)
      }, 500)
    } catch (err) {
      console.error('Failed to skip to next:', err)
      setError('Failed to skip track')
    }
  }, [])

  const handleToggleShuffle = useCallback(async () => {
    try {
      const newShuffleState = !playbackState?.shuffle_state
      await setShuffle(newShuffleState)
      // Refresh state immediately
      setTimeout(async () => {
        const state = await getCurrentPlayback()
        setPlaybackState(state)
      }, 300)
    } catch (err) {
      console.error('Failed to toggle shuffle:', err)
      setError('Failed to toggle shuffle')
    }
  }, [playbackState])

  const handleCycleRepeat = useCallback(async () => {
    try {
      const current = playbackState?.repeat_state || 'off'
      const next = current === 'off' ? 'context' : current === 'context' ? 'track' : 'off'
      await setRepeat(next)
      setTimeout(async () => {
        const state = await getCurrentPlayback()
        setPlaybackState(state)
      }, 300)
    } catch (err) {
      console.error('Failed to toggle repeat:', err)
      setError('Failed to toggle repeat')
    }
  }, [playbackState])

  const handleLogout = () => {
    logout()
    setIsAuthenticated(false)
    setPlaybackState(null)
  }

  const [volume, setVolumeState] = useState<number>(100)
  const [muted, setMuted] = useState<boolean>(false)

  const applyVolume = useCallback(async (value: number) => {
    try {
      const v = Math.max(0, Math.min(100, Math.round(value)))
      setVolumeState(v)
      if (v === 0) setMuted(true)
      // Lazy-load to avoid import cycle at top
      const { setVolume } = await import('./utils/spotify-api')
      await setVolume(v)
    } catch (err) {
      console.error('Failed to set volume:', err)
      setError('Failed to set volume')
    }
  }, [])

  const handleChangeVolume = useCallback(async (value: number) => {
    if (muted && value > 0) setMuted(false)
    await applyVolume(value)
  }, [muted, applyVolume])

  const handleToggleMute = useCallback(async () => {
    const newMuted = !muted
    setMuted(newMuted)
    const target = newMuted ? 0 : (volume || 50)
    await applyVolume(target)
  }, [muted, volume, applyVolume])

  const handleSeek = useCallback(async (positionMs: number) => {
    try {
      await seek(positionMs)
      const state = await getCurrentPlayback()
      setPlaybackState(state)
    } catch (err) {
      console.error('Failed to seek:', err)
      setError('Failed to seek position')
    }
  }, [])

  const handleAddToPlaylist = useCallback(async () => {
    try {
      const trackId = playbackState?.item?.id
      if (!trackId) return
      const { findOrCreatePlaylist, isTrackInPlaylist, addTrackToPlaylist } = await import('./utils/spotify-api')
      const playlistId = await findOrCreatePlaylist('Vinyl Player')
      const exists = await isTrackInPlaylist(playlistId, trackId)
      if (!exists) {
        await addTrackToPlaylist(playlistId, trackId)
      }
    } catch (err) {
      console.error('Failed to add to playlist:', err)
      setError('Failed to add to playlist')
    }
  }, [playbackState?.item?.id])


  if (isLoading) {
    return (
      <div className={`app loading`}>
        <div className="spinner"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className={`app`}>
        <SpotifyAuth />
      </div>
    )
  }

  return (
    <div className={`app ${compactMode ? 'compact' : ''}`}>
      {/* Compact sticky bar */}
      {compactMode && (
        <CompactBar
          title={playbackState?.item?.name || ''}
          artist={playbackState?.item?.artists?.map(a => a.name).join(', ') || ''}
          isPlaying={playbackState?.is_playing || false}
          coverUrl={playbackState?.item?.album.images[0]?.url || ''}
          onPlayPause={handlePlayPause}
          onPrevious={handlePrevious}
          onNext={handleNext}
          onToggleMode={toggleCompactMode}
        />
      )}

      {!compactMode && (
        <>
          <div className="app-header">
            <h1 className="app-title">Spotify Vinyl Player</h1>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="logout-btn" onClick={toggleCompactMode}>
                Mode compact
              </button>
              <button className="logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>

          {error && (
            <div className="error-banner">
              <span>{error}</span>
              <button onClick={() => setError(null)}>✕</button>
            </div>
          )}

          <div className="main-content" style={{ position: 'relative' }}>
            <VinylPlayer
              track={playbackState?.item || null}
              isPlaying={playbackState?.is_playing || false}
              progress={playbackState?.progress_ms || 0}
              onSeek={handleSeek}
            />

            <PlayerControls
              isPlaying={playbackState?.is_playing || false}
              isShuffle={playbackState?.shuffle_state || false}
              repeatMode={playbackState?.repeat_state || 'off'}
              onPlayPause={handlePlayPause}
              onPrevious={handlePrevious}
              onNext={handleNext}
              onToggleShuffle={handleToggleShuffle}
              onCycleRepeat={handleCycleRepeat}
              volume={volume}
              muted={muted}
              onChangeVolume={handleChangeVolume}
              onToggleMute={handleToggleMute}
            />

            {!playbackState?.item && (
              <div className="no-playback-message">
                <p>No music playing</p>
                <p className="hint">Start playing a song on any Spotify device</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  )
}

export default App


import { SpotifyPlaybackState } from '../types/spotify'
import { getAccessToken, isTokenExpired, refreshAccessToken } from './spotify-auth'

async function getValidToken(): Promise<string> {
  let token = getAccessToken()
  
  if (!token || isTokenExpired()) {
    token = await refreshAccessToken()
  }
  
  return token
}

export async function getCurrentPlayback(): Promise<SpotifyPlaybackState | null> {
  const token = await getValidToken()

  const response = await fetch('https://api.spotify.com/v1/me/player', {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (response.status === 204 || response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error('Failed to get current playback')
  }

  return await response.json()
}

export async function play(): Promise<void> {
  const token = await getValidToken()

  await fetch('https://api.spotify.com/v1/me/player/play', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function pause(): Promise<void> {
  const token = await getValidToken()

  await fetch('https://api.spotify.com/v1/me/player/pause', {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function skipToNext(): Promise<void> {
  const token = await getValidToken()

  await fetch('https://api.spotify.com/v1/me/player/next', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function skipToPrevious(): Promise<void> {
  const token = await getValidToken()

  await fetch('https://api.spotify.com/v1/me/player/previous', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function setShuffle(state: boolean): Promise<void> {
  const token = await getValidToken()

  await fetch(`https://api.spotify.com/v1/me/player/shuffle?state=${state}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function seek(positionMs: number): Promise<void> {
  const token = await getValidToken()

  // Clamp to non-negative values
  const clamped = Math.max(0, Math.floor(positionMs))

  await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${clamped}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export type RepeatMode = 'off' | 'track' | 'context'

export async function setRepeat(mode: RepeatMode): Promise<void> {
  const token = await getValidToken()

  await fetch(`https://api.spotify.com/v1/me/player/repeat?state=${mode}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function setVolume(percent: number): Promise<void> {
  const token = await getValidToken()
  const clamped = Math.max(0, Math.min(100, Math.round(percent)))
  await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${clamped}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getSavedStateForTracks(trackIds: string[]): Promise<boolean[]> {
  const token = await getValidToken()
  const ids = trackIds.join(',')
  const response = await fetch(`https://api.spotify.com/v1/me/tracks/contains?ids=${ids}`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!response.ok) throw new Error('Failed to get saved state')
  return await response.json()
}

export async function saveTracks(trackIds: string[]): Promise<void> {
  const token = await getValidToken()
  await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackIds.join(',')}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function removeSavedTracks(trackIds: string[]): Promise<void> {
  const token = await getValidToken()
  await fetch(`https://api.spotify.com/v1/me/tracks?ids=${trackIds.join(',')}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  })
}

export async function getCurrentUserId(): Promise<string> {
  const token = await getValidToken()
  const res = await fetch('https://api.spotify.com/v1/me', {
    headers: { Authorization: `Bearer ${token}` },
  })
  if (!res.ok) throw new Error('Failed to get current user')
  const data = await res.json()
  return data.id as string
}

export async function findOrCreatePlaylist(name: string): Promise<string> {
  const token = await getValidToken()
  const userId = await getCurrentUserId()
  // Try to find existing
  let next: string | null = `https://api.spotify.com/v1/me/playlists?limit=50`
  while (next) {
    const res = await fetch(next, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) break
    const data = await res.json()
    const found = (data.items as any[]).find(p => (p.name as string).toLowerCase() === name.toLowerCase())
    if (found) return found.id as string
    next = data.next
  }
  // Create
  const createRes = await fetch(`https://api.spotify.com/v1/users/${encodeURIComponent(userId)}/playlists`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, public: false, description: 'Added via Spotify Vinyl Player' }),
  })
  if (!createRes.ok) throw new Error('Failed to create playlist')
  const created = await createRes.json()
  return created.id as string
}

export async function isTrackInPlaylist(playlistId: string, trackId: string): Promise<boolean> {
  const token = await getValidToken()
  let next: string | null = `https://api.spotify.com/v1/playlists/${playlistId}/tracks?fields=items(track(id)),next&limit=100`
  while (next) {
    const res = await fetch(next, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) return false
    const data = await res.json()
    const items = data.items as any[]
    if (items.some(it => it.track && it.track.id === trackId)) return true
    next = data.next
  }
  return false
}

export async function addTrackToPlaylist(playlistId: string, trackId: string): Promise<void> {
  const token = await getValidToken()
  const uri = `spotify:track:${trackId}`
  const res = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uris: [uri] }),
  })
  if (!res.ok) throw new Error('Failed to add track to playlist')
}


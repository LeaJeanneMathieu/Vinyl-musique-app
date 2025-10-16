export interface SpotifyTrack {
  id: string
  name: string
  artists: Array<{ name: string }>
  album: {
    name: string
    images: Array<{ url: string; height: number; width: number }>
  }
  duration_ms: number
}

export interface SpotifyPlaybackState {
  is_playing: boolean
  item: SpotifyTrack | null
  progress_ms: number
  shuffle_state: boolean
  repeat_state?: 'off' | 'track' | 'context'
  context?: {
    uri?: string | null
  } | null
}

export interface SpotifyTokenResponse {
  access_token: string
  token_type: string
  expires_in: number
  refresh_token?: string
  scope: string
}


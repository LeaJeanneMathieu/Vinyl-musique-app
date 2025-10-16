import React from 'react'
import { redirectToSpotifyAuth } from '../utils/spotify-auth'
import '../styles/SpotifyAuth.css'

const SpotifyAuth: React.FC = () => {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="vinyl-icon">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
            <circle cx="100" cy="100" r="95" fill="#1a1a1a" />
            {[...Array(8)].map((_, i) => (
              <circle
                key={i}
                cx="100"
                cy="100"
                r={90 - i * 10}
                fill="none"
                stroke="#2a2a2a"
                strokeWidth="2"
              />
            ))}
            <circle cx="100" cy="100" r="30" fill="#FFB5C5" />
            <circle cx="100" cy="100" r="5" fill="#1a1a1a" />
          </svg>
        </div>
        
        <h1>Spotify Vinyl Player</h1>
        <p className="subtitle">Connect your Spotify account to get started</p>
        
        <button className="spotify-login-btn" onClick={redirectToSpotifyAuth}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
          </svg>
          Connect with Spotify
        </button>
        
        <div className="info-box">
          <p className="info-text">
            You'll need an active Spotify Premium account to control playback
          </p>
        </div>
      </div>
    </div>
  )
}

export default SpotifyAuth


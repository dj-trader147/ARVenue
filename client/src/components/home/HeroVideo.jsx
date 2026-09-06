import { useState } from 'react'

function HeroVideo() {
  var [videoError, setVideoError] = useState(false)

  var testVideoUrl = 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4'

  if (videoError) {
    return (
      <section className="hero-video-section">
        <div className="hero-video-fallback">
          <div className="hero-video-text">
            <h2>AR VENUE</h2>
            <p>Curated Luxury Fashion</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero-video-section">
      <video
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        onError={function() { setVideoError(true) }}
      >
        <source src={testVideoUrl} type="video/mp4" />
      </video>
      <div className="hero-video-overlay">
        <div className="hero-video-text">
          <h2>New Collection</h2>
          <p>Autumn / Winter 2025</p>
        </div>
      </div>
    </section>
  )
}

export default HeroVideo

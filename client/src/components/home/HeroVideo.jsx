import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../utils/api'

function HeroVideo() {
  var defaultVideo = 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4'
  var [videoUrl, setVideoUrl] = useState(defaultVideo)
  var [videoError, setVideoError] = useState(false)

  useEffect(function() {
    fetch(API_BASE_URL + '/api/videos/landing')
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success && data.video && data.video.videoUrl) {
          var url = data.video.videoUrl
          if (url.startsWith('/uploads')) {
            url = API_BASE_URL + url
          }
          setVideoUrl(url)
          setVideoError(false) // Reset error if backend provides a valid video
        }
      })
      .catch(function() {})
  }, [])

  if (videoError) {
    return (
      <section className="hero-video-section">
        <div className="hero-video-fallback">
          <div className="hero-video-text">
            <h2>AR VENUE</h2>
            <p>Curated Luxury Fashion Atelier</p>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="hero-video-section">
      <video
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        onError={function() { setVideoError(true) }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      <div className="hero-video-overlay">
        <div className="hero-video-text">
          <h2>New Collection</h2>
          <p>Autumn / Winter 2026</p>
        </div>
      </div>
    </section>
  )
}

export default HeroVideo

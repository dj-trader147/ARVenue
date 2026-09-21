import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../utils/api'

function HeroVideo() {
  // Ultra-crisp luxury fashion demo video
  var defaultVideo = 'https://assets.mixkit.co/videos/40893/40893-720.mp4'
  var [videoUrl, setVideoUrl] = useState(defaultVideo)

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
        }
      })
      .catch(function() {})
  }, [])

  return (
    <section className="hero-video-section" style={{ background: '#0a0a0a', width: '100%', overflow: 'hidden' }}>
      <video
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </section>
  )
}

export default HeroVideo;
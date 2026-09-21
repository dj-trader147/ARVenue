import { useState, useEffect } from 'react'
import { API_BASE_URL } from '../../utils/api'

function HeroVideo() {
  var defaultVideo = 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4'
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
    <section className="hero-video-section" style={{ background: '#0a0a0a' }}>
      <video
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </section>
  )
}

export default HeroVideo;
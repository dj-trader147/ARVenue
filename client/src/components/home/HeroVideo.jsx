import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../utils/api'

function HeroVideo() {
  var reliableFallback = 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4'
  var [videoUrl, setVideoUrl] = useState(reliableFallback)
  var videoRef = useRef(null)

  useEffect(function() {
    var isMounted = true
    fetch(API_BASE_URL + '/api/videos/landing')
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (isMounted && data.success && data.video && data.video.videoUrl) {
          var url = data.video.videoUrl
          if (url.startsWith('/uploads')) {
            url = API_BASE_URL + url
          }
          if (url && url.trim() !== '') {
            setVideoUrl(url)
          }
        }
      })
      .catch(function() {
        // Safe silent fallback
      })
    return function() { isMounted = false }
  }, [])

  // Smart Self-Healing: Agar uploaded URL dead/404 nikle to foran reliable video par switch ho jaye
  function handleVideoError() {
    console.warn('Uploaded video link failed or expired. Reverting to fallback video instantly.')
    if (videoUrl !== reliableFallback) {
      setVideoUrl(reliableFallback)
    }
  }

  return (
    <section className="hero-video-section" style={{ background: '#0a0a0a', width: '100%', overflow: 'hidden' }}>
      <video
        ref={videoRef}
        key={videoUrl}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onError={handleVideoError}
        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center center' }}
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
    </section>
  )
}

export default HeroVideo;
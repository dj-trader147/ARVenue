import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../utils/api'

// 24/7 Direct High-Speed Cloud CDN Luxury Video (Zero Render Dependency)
var FALLBACK_CDN_VIDEO = 'https://assets.mixkit.co/videos/41551/41551-720.mp4'

function HeroVideo() {
  var [videoSrc, setVideoSrc] = useState(FALLBACK_CDN_VIDEO)
  var videoRef = useRef(null)

  useEffect(function() {
    var isMounted = true

    async function fetchCdnVideo() {
      try {
        var res = await fetch(API_BASE_URL + '/api/videos/landing')
        if (!res.ok) return
        var data = await res.json()

        if (isMounted && data.success && data.video && data.video.videoUrl) {
          var url = data.video.videoUrl.trim()
          // STRICT RULE: Only accept direct Cloud CDN links (http/https). Ignore local Render uploads.
          if (url.startsWith('http://') || url.startsWith('https://')) {
            setVideoSrc(url)
          }
        }
      } catch (err) {
        // Render sleep/offline - smoothly continue on direct CDN
      }
    }

    fetchCdnVideo()

    return function() {
      isMounted = false
    }
  }, [])

  function handleVideoError() {
    if (videoSrc !== FALLBACK_CDN_VIDEO) {
      setVideoSrc(FALLBACK_CDN_VIDEO)
    }
  }

  function handleCanPlay() {
    if (videoRef.current) {
      var playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(function() {})
      }
    }
  }

  return (
    <section className="hero-video-section">
      <video
        ref={videoRef}
        key={videoSrc}
        autoPlay
        muted
        loop
        playsInline
        webkit-playsinline="true"
        preload="auto"
        onCanPlay={handleCanPlay}
        onError={handleVideoError}
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </section>
  )
}

export default HeroVideo

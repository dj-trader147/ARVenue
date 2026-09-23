import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../utils/api'

// Verified Pure Luxury Fashion Editorial Videos
var FALLBACK_DESKTOP = 'https://assets.mixkit.co/videos/28434/28434-720.mp4'
var FALLBACK_MOBILE = 'https://assets.mixkit.co/videos/51765/51765-720.mp4'

function HeroVideo() {
  var [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  var [videoSrc, setVideoSrc] = useState(window.innerWidth < 768 ? FALLBACK_MOBILE : FALLBACK_DESKTOP)
  var videoRef = useRef(null)

  useEffect(function() {
    function handleResize() {
      var mobileState = window.innerWidth < 768
      if (mobileState !== isMobile) {
        setIsMobile(mobileState)
        setVideoSrc(mobileState ? FALLBACK_MOBILE : FALLBACK_DESKTOP)
      }
    }
    window.addEventListener('resize', handleResize)
    return function() {
      window.removeEventListener('resize', handleResize)
    }
  }, [isMobile])

  useEffect(function() {
    var isMounted = true
    var targetLocation = isMobile ? 'landing-mobile' : 'landing'

    async function fetchCdnVideo() {
      try {
        var res = await fetch(API_BASE_URL + '/api/videos/' + targetLocation)
        if (!res.ok) return
        var data = await res.json()

        if (isMounted && data.success && data.video && data.video.videoUrl) {
          var url = data.video.videoUrl.trim()
          if (url.startsWith('http://') || url.startsWith('https://')) {
            setVideoSrc(url)
          }
        }
      } catch (err) {
        // Safe continuation on CDN fallback
      }
    }

    fetchCdnVideo()

    return function() {
      isMounted = false
    }
  }, [isMobile])

  function handleVideoError() {
    var defaultVideo = isMobile ? FALLBACK_MOBILE : FALLBACK_DESKTOP
    if (videoSrc !== defaultVideo) {
      setVideoSrc(defaultVideo)
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

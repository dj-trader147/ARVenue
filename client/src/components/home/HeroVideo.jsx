import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../utils/api'

// Premium Fallbacks (Widescreen for Desktop, Vertical Editorial for Mobile)
var FALLBACK_DESKTOP = 'https://assets.mixkit.co/videos/41551/41551-720.mp4'
var FALLBACK_MOBILE = 'https://assets.mixkit.co/videos/43034/43034-720.mp4' // Verified vertical portrait fashion loop

function HeroVideo() {
  var [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  var [videoSrc, setVideoSrc] = useState(window.innerWidth < 768 ? FALLBACK_MOBILE : FALLBACK_DESKTOP)
  var videoRef = useRef(null)

  // Listen to viewport changes
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

  // Fetch from MongoDB
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
          // Enforce direct cloud CDN URL policy to bypass sleep modes
          if (url.startsWith('http://') || url.startsWith('https://')) {
            setVideoSrc(url)
          }
        }
      } catch (err) {
        // Safe silent continuation with CDN fallback
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

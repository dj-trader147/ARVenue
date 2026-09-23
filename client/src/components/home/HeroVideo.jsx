import { useState, useEffect, useRef } from 'react'
import { API_BASE_URL } from '../../utils/api'

function HeroVideo() {
  var [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  var [videoSrc, setVideoSrc] = useState('')
  var [loading, setLoading] = useState(true)
  var videoRef = useRef(null)

  useEffect(function() {
    function handleResize() {
      var mobileState = window.innerWidth < 768
      if (mobileState !== isMobile) {
        setIsMobile(mobileState)
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
    setLoading(true)

    async function fetchDynamicVideo() {
      try {
        var res = await fetch(API_BASE_URL + '/api/videos/' + targetLocation)
        var data = await res.json()

        if (isMounted && data.success && data.video && data.video.videoUrl) {
          var url = data.video.videoUrl.trim()
          if (url.startsWith('/')) {
            url = API_BASE_URL + url
          }
          setVideoSrc(url)
        } else {
          if (isMounted) setVideoSrc('')
        }
      } catch (err) {
        if (isMounted) setVideoSrc('')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchDynamicVideo()

    return function() {
      isMounted = false
    }
  }, [isMobile])

  function handleCanPlay() {
    if (videoRef.current) {
      var playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(function() {})
      }
    }
  }

  // Clean Luxury State when no custom video has been set by Admin yet
  if (!videoSrc) {
    return (
      <section className="hero-video-section" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
        <div className="hero-video-fallback" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <div className="hero-video-text">
            <h2 style={{ fontSize: '1.4rem', letterSpacing: '0.4em', marginBottom: '12px' }}>AR VENUE</h2>
            <p style={{ fontSize: '0.8rem', color: '#c5a880', letterSpacing: '0.2em' }}>LUXURY FASHION EDITORIAL</p>
            <div style={{ marginTop: '20px', padding: '10px 20px', border: '1px dashed rgba(197,168,128,0.4)', borderRadius: '4px', display: 'inline-block', color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>
              Waiting for video upload from Admin Panel ({isMobile ? 'Mobile' : 'Desktop'})
            </div>
          </div>
        </div>
      </section>
    )
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
      >
        <source src={videoSrc} type="video/mp4" />
      </video>
    </section>
  )
}

export default HeroVideo

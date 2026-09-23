import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../utils/api'
import './shop.css'
import '../category/category.css'

var departmentCats = {
  'mens': [
    'Slippers',
    'Fabrics',
    'Bags',
    'Perfumes',
    'Jeans',
    'Trousers',
    'Shirts'
  ],
  'womens': [
    'Slippers',
    'Fabrics',
    'Bags',
    'Perfumes',
    'Jeans',
    'Trousers',
    'Shirts'
  ],
  'kids': [
    'Slippers',
    'Jeans',
    'Trousers',
    'Shirts'
  ],
  'premium-lounge': [
    'Exclusive Suits',
    'Luxury Perfumes',
    'Premium Slippers',
    'Limited Edition Bags'
  ]
}

function DepartmentPage() {
  var params = useParams()
  var dept = params.department || 'mens'
  var categories = departmentCats[dept] || ['All Items']
  
  var deptName = dept.replace('-', ' ').toUpperCase()
  var isPremium = dept === 'premium-lounge'
  
  var [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  var [videoUrl, setVideoUrl] = useState('')
  var videoRef = useRef(null)

  // 1. Detect screen size changes
  useEffect(function() {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return function() {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 2. Fetch specific Desktop vs Mobile video URL from MongoDB
  useEffect(function() {
    var isMounted = true
    var targetLocation = isMobile ? (dept + '-mobile') : dept

    fetch(API_BASE_URL + '/api/videos/' + targetLocation)
      .then(function(res) { 
        if (!res.ok) throw new Error('API down')
        return res.json() 
      })
      .then(function(data) {
        if (isMounted && data.success && data.video && data.video.videoUrl) {
          var url = data.video.videoUrl.trim()
          if (url.startsWith('/')) url = API_BASE_URL + url
          setVideoUrl(url)
        } else {
          if (isMounted) setVideoUrl('')
        }
      })
      .catch(function() {
        if (isMounted) setVideoUrl('')
      })

    return function() {
      isMounted = false
    }
  }, [dept, isMobile])

  function handleCanPlay() {
    if (videoRef.current) {
      var playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(function() {})
      }
    }
  }

  return (
    <div style={isPremium ? { background: '#0a0a0a', color: '#FFF', minHeight: '100vh' } : {}}>
      {/* Dynamic Top Hero Video Banner */}
      {videoUrl ? (
        <section className="category-hero-video">
          <video 
            ref={videoRef}
            key={videoUrl} 
            autoPlay 
            muted 
            loop 
            playsInline 
            webkit-playsinline="true"
            preload="auto"
            onCanPlay={handleCanPlay}
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
        </section>
      ) : (
        <section className="category-hero-video" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
          <div className="hero-video-text" style={{ textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.4rem', letterSpacing: '0.4em', marginBottom: '8px', color: '#FFF' }}>{deptName}</h2>
            <p style={{ fontSize: '0.75rem', color: '#c5a880', letterSpacing: '0.2em' }}>AR VENUE COLLECTION</p>
            <div style={{ marginTop: '16px', padding: '8px 16px', border: '1px dashed rgba(197,168,128,0.4)', borderRadius: '4px', display: 'inline-block', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
              Waiting for department video ({isMobile ? 'Mobile' : 'Desktop'})
            </div>
          </div>
        </section>
      )}

      <div className="breadcrumbs" style={isPremium ? { borderBottomColor: '#333', color: '#AAA' } : {}}>
        Home <span>&gt;</span> Shop <span>&gt;</span> <strong style={isPremium ? { color: '#D4AF37' } : {}}>{deptName}</strong>
      </div>

      <div className="department-categories">
        <h2 style={isPremium ? { color: '#D4AF37' } : {}}>Select Category</h2>
        <div className="dept-cat-grid">
          {categories.map(function(cat, index) {
            var catSlug = cat.toLowerCase().replace(/ /g, '-')
            return (
              <Link 
                key={index} 
                to={'/shop/' + dept + '/' + catSlug} 
                className="dept-cat-btn"
                style={isPremium ? { background: '#111', color: '#D4AF37', borderColor: '#D4AF37' } : {}}
              >
                {cat}
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default DepartmentPage

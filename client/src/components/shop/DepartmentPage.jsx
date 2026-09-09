import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { API_BASE_URL } from '../../utils/api'
import './shop.css'
import '../category/category.css'

var defaultVideo = 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4'

var departmentCats = {
  'mens': ['Jeans', 'Casual Shirts', 'Tank Tops', 'Trousers', 'Jackets', 'Shoes', 'Belts', 'Studs', 'Ties'],
  'womens': ['Dresses', 'Tops', 'Jeans', 'Cosmetics', 'Jewelry', 'Shoes', 'Bags', 'Accessories'],
  'kids': ['Shirts', 'Jeans', 'Shoes', 'Sandals', 'Slippers', 'Jackets', 'Accessories'],
  'premium-lounge': ['Exclusive Suits', 'Luxury Watches', 'Designer Shoes', 'Limited Edition Bags']
}

function DepartmentPage() {
  var params = useParams()
  var dept = params.department || 'mens'
  var categories = departmentCats[dept] || ['All Items']
  
  var deptName = dept.replace('-', ' ').toUpperCase()
  var isPremium = dept === 'premium-lounge'
  
  var [videoUrl, setVideoUrl] = useState(defaultVideo)

  useEffect(function() {
    fetch(API_BASE_URL + '/api/videos/' + dept)
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success && data.video && data.video.videoUrl) {
          var url = data.video.videoUrl
          if (url.startsWith('/uploads')) url = API_BASE_URL + url
          setVideoUrl(url)
        }
      })
      .catch(function() {})
  }, [dept])

  return (
    <div style={isPremium ? { background: '#0a0a0a', color: '#FFF', minHeight: '100vh' } : {}}>
      <section className="category-hero-video">
        <video key={videoUrl} autoPlay muted loop playsInline preload="auto">
          <source src={videoUrl} type="video/mp4" />
        </video>
      </section>

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

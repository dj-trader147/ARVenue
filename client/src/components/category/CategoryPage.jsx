import { useState, useEffect, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { API_BASE_URL } from '../../utils/api'
import ProductCard from '../product/ProductCard'
import './category.css'

var sizeConfig = {
  'mens': {
    'slippers': ['40', '41', '42', '43', '44', '45'],
    'fabrics': [],
    'bags': [],
    'perfumes': [],
    'jeans': ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
    'trousers': ['28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40', '41', '42', '43', '44'],
    'shirts': ['S', 'M', 'L', 'XL', 'XXL']
  },
  'womens': {
    'slippers': ['36', '37', '38', '39', '40', '41'],
    'fabrics': [],
    'bags': [],
    'perfumes': [],
    'jeans': ['26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'],
    'trousers': ['26', '27', '28', '29', '30', '31', '32', '33', '34', '35', '36', '37', '38', '39', '40'],
    'shirts': ['S', 'M', 'L', 'XL']
  },
  'kids': {
    'slippers': ['6', '7', '8', '9', '10', '11', '12', '13', '1', '2', '3', '4', '5'],
    'jeans': ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    'trousers': ['20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'],
    'shirts': ['S', 'M', 'L', 'XL']
  },
  'premium-lounge': {
    'exclusive-suits': ['S', 'M', 'L', 'XL', 'XXL'],
    'luxury-perfumes': [],
    'premium-slippers': ['40', '41', '42', '43', '44', '45'],
    'limited-edition-bags': []
  }
}

function CategoryPage() {
  var params = useParams()
  var dept = params.department ? params.department.replace('-', ' ') : 'Shop'
  var catName = params.category ? params.category.replace('-', ' ') : 'All Items'
  
  var [productsList, setProductsList] = useState([])
  var [isLoadingProducts, setIsLoadingProducts] = useState(true)
  var [activeStyle, setActiveStyle] = useState('All')
  var [sortOrder, setSortOrder] = useState('popular')
  var [currentPage, setCurrentPage] = useState(1)
  var [isMobile, setIsMobile] = useState(window.innerWidth < 768)
  var [videoUrl, setVideoUrl] = useState('')
  var videoRef = useRef(null)
  
  var itemsPerPage = 6

  // 1. Screen size detection
  useEffect(function() {
    function handleResize() {
      setIsMobile(window.innerWidth < 768)
    }
    window.addEventListener('resize', handleResize)
    return function() {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  // 2. Fetch Desktop vs Mobile video for this specific category
  useEffect(function() {
    var isMounted = true
    var deptKey = params.department || 'mens'
    var catKey = params.category || 'slippers'
    var locationKey = isMobile ? (deptKey + '-' + catKey + '-mobile') : (deptKey + '-' + catKey)

    fetch(API_BASE_URL + '/api/videos/' + locationKey)
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
  }, [params.department, params.category, isMobile])

  // 3. Fetch Real Products from MongoDB Atlas
  useEffect(function() {
    var deptKey = params.department || 'mens'
    var catKey = params.category || 'slippers'
    setIsLoadingProducts(true)

    fetch(API_BASE_URL + '/api/products?department=' + deptKey + '&category=' + catKey)
      .then(function(res) { return res.json() })
      .then(function(data) {
        setIsLoadingProducts(false)
        if (data.success && Array.isArray(data.products)) {
          setProductsList(data.products)
        } else {
          setProductsList([])
        }
      })
      .catch(function() {
        setIsLoadingProducts(false)
        setProductsList([])
      })
  }, [params.department, params.category])

  useEffect(function() {
    setCurrentPage(1)
  }, [activeStyle, sortOrder])

  function handleCanPlay() {
    if (videoRef.current) {
      var playPromise = videoRef.current.play()
      if (playPromise !== undefined) {
        playPromise.catch(function() {})
      }
    }
  }

  var filteredProducts = productsList.filter(function(product) {
    if (activeStyle === 'All') return true
    return product.style === activeStyle
  })

  var sortedProducts = [...filteredProducts].sort(function(a, b) {
    if (sortOrder === 'price-low') return a.price - b.price
    if (sortOrder === 'price-high') return b.price - a.price
    return 0
  })

  var totalItems = sortedProducts.length
  var totalPages = Math.ceil(totalItems / itemsPerPage)
  var startIndex = (currentPage - 1) * itemsPerPage
  var currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  var deptLabel = params.department ? params.department.replace('-', ' ') : 'Shop'
  var catLabel = params.category ? params.category.replace('-', ' ') : 'All Items'

  return (
    <>
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
            <h2 style={{ fontSize: '1.4rem', letterSpacing: '0.4em', marginBottom: '8px', color: '#FFF', textTransform: 'capitalize' }}>{catLabel}</h2>
            <p style={{ fontSize: '0.75rem', color: '#c5a880', letterSpacing: '0.2em' }}>AR VENUE {deptLabel.toUpperCase()} COLLECTION</p>
            <div style={{ marginTop: '16px', padding: '8px 16px', border: '1px dashed rgba(197,168,128,0.4)', borderRadius: '4px', display: 'inline-block', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>
              Waiting for category video ({isMobile ? 'Mobile' : 'Desktop'})
            </div>
          </div>
        </section>
      )}

      <div className="breadcrumbs">
        Home <span>&gt;</span> Shop <span>&gt;</span> <strong style={{textTransform: 'capitalize'}}>{dept}</strong> <span>&gt;</span> <strong style={{textTransform: 'capitalize'}}>{catName}</strong>
      </div>

      <div className="category-layout">
        <aside className="category-sidebar">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '24px' }}>FILTERS</h3>

          <div className="filter-section">
            <h4>Style</h4>
            <div className="filter-list">
              <label className="filter-item">
                <input type="radio" name="style" checked={activeStyle === 'All'} onChange={function() { setActiveStyle('All') }} /> All
              </label>
              <label className="filter-item">
                <input type="radio" name="style" checked={activeStyle === 'Casual'} onChange={function() { setActiveStyle('Casual') }} /> Casual
              </label>
              <label className="filter-item">
                <input type="radio" name="style" checked={activeStyle === 'Formal'} onChange={function() { setActiveStyle('Formal') }} /> Formal
              </label>
              <label className="filter-item">
                <input type="radio" name="style" checked={activeStyle === 'Exclusive'} onChange={function() { setActiveStyle('Exclusive') }} /> Exclusive
              </label>
            </div>
          </div>

          {(function() {
            var deptKey = params.department || 'mens';
            var catKey = params.category || '';
            var sizes = (sizeConfig[deptKey] && sizeConfig[deptKey][catKey]) ? sizeConfig[deptKey][catKey] : [];
            if (sizes.length === 0) return null;
            return (
              <div className="filter-section">
                <h4>Size</h4>
                <div className="size-grid">
                  {sizes.map(function(s) {
                    return <div key={s} className="size-box">{s}</div>
                  })}
                </div>
              </div>
            );
          })()}
        </aside>

        <div className="category-content">
          <div className="content-top-bar">
            <span>
              Showing {totalItems > 0 ? startIndex + 1 : 0}-
              {Math.min(startIndex + itemsPerPage, totalItems)} of {totalItems} products
            </span>
            <select 
              className="sort-dropdown" 
              value={sortOrder} 
              onChange={function(e) { setSortOrder(e.target.value) }}
            >
              <option value="popular">Sort by: Popular</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {isLoadingProducts ? (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <p style={{ fontSize: '0.9rem', letterSpacing: '0.1em' }}>Loading luxury collection...</p>
            </div>
          ) : currentProducts.length > 0 ? (
            <div className="products-grid">
              {currentProducts.map(function(product) {
                return <ProductCard key={product.slug || product._id} product={product} />
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '80px 0', color: '#888' }}>
              <p style={{ fontSize: '1.1rem', fontWeight: '500', color: '#111', marginBottom: '8px' }}>No products available in this category yet.</p>
              <p style={{ fontSize: '0.85rem', color: '#8C6D46', letterSpacing: '0.05em' }}>New arrivals coming soon to AR VENUE.</p>
            </div>
          )}

          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn" 
                disabled={currentPage === 1}
                onClick={function() { setCurrentPage(currentPage - 1) }}
              >&lt;</button>
              
              {Array.from({ length: totalPages }).map(function(_, index) {
                var pageNum = index + 1
                return (
                  <button 
                    key={pageNum}
                    className={'page-btn' + (currentPage === pageNum ? ' active' : '')}
                    onClick={function() { setCurrentPage(pageNum) }}
                  >
                    {pageNum}
                  </button>
                )
              })}
              
              <button 
                className="page-btn"
                disabled={currentPage === totalPages}
                onClick={function() { setCurrentPage(currentPage + 1) }}
              >&gt;</button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default CategoryPage;

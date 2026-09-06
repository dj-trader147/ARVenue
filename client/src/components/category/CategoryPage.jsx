import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ProductCard from '../product/ProductCard'
import './category.css'

var testVideo = 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4'

// 12 Products banaye hain taake Pagination (Page 1, 2) check ho sake
var allDummyProducts = [
  { slug: 'prod-1', name: 'Classic Urban Article 1', price: 1200, style: 'Casual', colors: ['#111', '#CCC'] },
  { slug: 'prod-2', name: 'Premium Edition Article 2', price: 4500, style: 'Exclusive', colors: ['#333'] },
  { slug: 'prod-3', name: 'Standard Formal Article 3', price: 2100, style: 'Formal', colors: ['#000', '#555'] },
  { slug: 'prod-4', name: 'Urban Casual Article 4', price: 1500, style: 'Casual', colors: ['#999'] },
  { slug: 'prod-5', name: 'Signature Series Article 5', price: 3200, style: 'Exclusive', colors: ['#111', '#D4AF37'] },
  { slug: 'prod-6', name: 'Basic Everyday Article 6', price: 800, style: 'Casual', colors: ['#FFF', '#000'] },
  { slug: 'prod-7', name: 'Formal Elite Article 7', price: 2800, style: 'Formal', colors: ['#222'] },
  { slug: 'prod-8', name: 'Casual Weekend Article 8', price: 1100, style: 'Casual', colors: ['#777', '#333'] },
  { slug: 'prod-9', name: 'Limited Gold Article 9', price: 5500, style: 'Exclusive', colors: ['#D4AF37'] },
  { slug: 'prod-10', name: 'Smart Formal Article 10', price: 2400, style: 'Formal', colors: ['#111'] },
  { slug: 'prod-11', name: 'Streetwear Article 11', price: 1600, style: 'Casual', colors: ['#444', '#888'] },
  { slug: 'prod-12', name: 'Supreme VIP Article 12', price: 6000, style: 'Exclusive', colors: ['#000', '#D4AF37', '#FFF'] }
]

function CategoryPage() {
  var params = useParams()
  var dept = params.department ? params.department.replace('-', ' ') : 'Shop'
  var catName = params.category ? params.category.replace('-', ' ') : 'All Items'
  
  // State for Filters, Sorting, and Pagination
  var [activeStyle, setActiveStyle] = useState('All')
  var [sortOrder, setSortOrder] = useState('popular')
  var [currentPage, setCurrentPage] = useState(1)
  
  var itemsPerPage = 6

  // Reset page to 1 if filter or sort changes
  useEffect(function() {
    setCurrentPage(1)
  }, [activeStyle, sortOrder])

  // 1. FILTERING LOGIC
  var filteredProducts = allDummyProducts.filter(function(product) {
    if (activeStyle === 'All') return true
    return product.style === activeStyle
  })

  // 2. SORTING LOGIC
  var sortedProducts = [...filteredProducts].sort(function(a, b) {
    if (sortOrder === 'price-low') return a.price - b.price
    if (sortOrder === 'price-high') return b.price - a.price
    return 0 // popular (default array order)
  })

  // 3. PAGINATION LOGIC
  var totalItems = sortedProducts.length
  var totalPages = Math.ceil(totalItems / itemsPerPage)
  var startIndex = (currentPage - 1) * itemsPerPage
  var currentProducts = sortedProducts.slice(startIndex, startIndex + itemsPerPage)

  return (
    <>
      <section className="category-hero-video">
        <video autoPlay muted loop playsInline preload="metadata">
          <source src={testVideo} type="video/mp4" />
        </video>
      </section>

      <div className="breadcrumbs">
        Home <span>&gt;</span> Shop <span>&gt;</span> <strong style={{textTransform: 'capitalize'}}>{dept}</strong> <span>&gt;</span> <strong style={{textTransform: 'capitalize'}}>{catName}</strong>
      </div>

      <div className="category-layout">
        <aside className="category-sidebar">
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '24px' }}>FILTERS</h3>

          <div className="filter-section">
            <h4>Style </h4>
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

          <div className="filter-section">
            <h4>Size</h4>
            <div className="size-grid">
              <div className="size-box">S</div>
              <div className="size-box">M</div>
              <div className="size-box">L</div>
              <div className="size-box">XL</div>
            </div>
          </div>
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

          {currentProducts.length > 0 ? (
            <div className="products-grid">
              {currentProducts.map(function(product) {
                return <ProductCard key={product.slug} product={product} />
              })}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px 0', color: '#888' }}>
              No products found in this style.
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

export default CategoryPage

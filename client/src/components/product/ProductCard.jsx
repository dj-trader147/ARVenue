import { Link } from 'react-router-dom'
import './productcard.css'

function HeartIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
    </svg>
  )
}

function ProductCard(props) {
  var product = props.product

  return (
    <Link to={'/product/' + product.slug} className="product-card">
      <div className="product-image-wrap" style={{ background: '#EAEAEA', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {/* Placeholder Coming Soon - Admin will replace this */}
        <div style={{ color: '#888', fontSize: '0.75rem', letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', padding: '20px' }}>
          Image<br/>Coming<br/>Soon
        </div>
        
        <button 
          className="wishlist-btn" 
          aria-label="Add to wishlist"
          onClick={function(e) { e.preventDefault(); }}
        >
          <HeartIcon />
        </button>
      </div>
      <div className="product-info">
        <h3 className="product-title">{product.name}</h3>
        <div className="product-price">Rs. {product.price.toLocaleString()}</div>
        
        <div className="product-rating">
          <span className="stars">☆☆☆☆☆</span>
          <span className="count">(0)</span>
        </div>

        {product.colors && (
          <div className="product-colors-info">
            <span>{product.colors.length} Colors</span>
            <div className="color-dots">
              {product.colors.map(function(c, i) {
                return <span className="color-dot" key={i} style={{ background: c }} />
              })}
            </div>
          </div>
        )}
      </div>
    </Link>
  )
}

export default ProductCard

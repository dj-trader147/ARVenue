import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './productpage.css'

function PlayIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
      <path d="M8 5v14l11-7z"/>
    </svg>
  )
}

function ProductPage() {
  var params = useParams()
  var slug = params.slug || 'product'
  var navigate = useNavigate()
  var cart = useCart()

  var product = {
    slug: slug,
    name: 'Premium ' + slug.replace(/-/g, ' ').toUpperCase(),
    price: 4500,
    rating: 0,
    reviews: 0,
    sales: 0,
    description: 'Elevate your style with this premium article. Crafted with meticulous attention to detail and high-quality materials to ensure durability and comfort.',
    media: [
      { type: 'image', url: 'https://images.unsplash.com/photo-1620806956627-2c9c7f66a203?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1620806956627-2c9c7f66a203?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1620806956627-2c9c7f66a203?w=800&q=80' },
      { type: 'image', url: 'https://images.unsplash.com/photo-1620806956627-2c9c7f66a203?w=800&q=80' },
      { type: 'video', url: 'https://videos.pexels.com/video-files/4434241/4434241-hd_1920_1080_30fps.mp4' }
    ],
    colors: ['#111111', '#D4AF37', '#8B4513'],
    sizes: [
      { name: 'S', inStock: true },
      { name: 'M', inStock: true },
      { name: 'L', inStock: true },
      { name: 'XL', inStock: true }
    ]
  }

  var [activeMedia, setActiveMedia] = useState(product.media[0])
  var [activeColor, setActiveColor] = useState(product.colors[0])
  var [activeSize, setActiveSize] = useState('M')
  var [isFullScreen, setIsFullScreen] = useState(false)

  function handleAddToCart() {
    cart.addToCart(product, activeSize, activeColor)
    alert('Added to Cart!')
  }

  function handleBuyNow() {
    cart.addToCart(product, activeSize, activeColor)
    navigate('/checkout')
  }

  return (
    <>
      <div className="product-page">
        <div className="product-breadcrumbs">
          Home <span>&gt;</span> Shop <span>&gt;</span> <strong>{product.name}</strong>
        </div>

        <div className="product-container">
          <div className="product-media">
            <div className="main-media-box" onClick={function() { setIsFullScreen(true) }}>
              {activeMedia.type === 'video' ? (
                <video src={activeMedia.url} autoPlay muted loop playsInline />
              ) : (
                <img src={activeMedia.url} alt={product.name} />
              )}
            </div>

            <div className="thumbnails-strip">
              {product.media.map(function(item, index) {
                return (
                  <div
                    key={index}
                    className={'thumbnail-box' + (activeMedia.url === item.url ? ' active' : '')}
                    onClick={function() { setActiveMedia(item) }}
                  >
                    {item.type === 'video' ? (
                      <>
                        <video src={item.url} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <div className="video-icon-badge"><PlayIcon /></div>
                      </>
                    ) : (
                      <img src={item.url} alt="thumb" />
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          <div className="product-details">
            <h1>{product.name}</h1>
            <div className="product-meta-row">
              <span><span className="stars">☆☆☆☆☆</span> 0 Rating</span>
              <span>•</span>
              <span>0 Sold</span>
            </div>
            <div className="price">Rs. {product.price.toLocaleString()}</div>

            <div className="option-group">
              <div className="option-title">Color</div>
              <div className="color-options">
                {product.colors.map(function(color, index) {
                  return (
                    <button
                      key={index}
                      className={'color-btn' + (activeColor === color ? ' active' : '')}
                      style={{ backgroundColor: color }}
                      onClick={function() { setActiveColor(color) }}
                      aria-label="Select color"
                    />
                  )
                })}
              </div>
            </div>

            <div className="option-group">
              <div className="option-title">Size</div>
              <div className="size-options">
                {product.sizes.map(function(size, index) {
                  return (
                    <button
                      key={index}
                      className={'size-btn' + (activeSize === size.name ? ' active' : '')}
                      disabled={!size.inStock}
                      onClick={function() { setActiveSize(size.name) }}
                    >
                      {size.name}
                    </button>
                  )
                })}
              </div>
            </div>

            <button className="add-to-cart-btn" onClick={handleAddToCart}>Add To Cart</button>
            <button className="buy-now-btn" onClick={handleBuyNow}>Buy Now (Cash on Delivery)</button>

            <div className="product-description">
              <strong>About the product:</strong>
              <br /><br />
              {product.description}
            </div>
          </div>
        </div>
      </div>

      {isFullScreen && (
        <div className="fullscreen-modal" onClick={function() { setIsFullScreen(false) }}>
          <button className="modal-close-btn" onClick={function() { setIsFullScreen(false) }}>&times;</button>
          <div className="fullscreen-content" onClick={function(e) { e.stopPropagation() }}>
            {activeMedia.type === 'video' ? (
              <video src={activeMedia.url} autoPlay controls playsInline />
            ) : (
              <img src={activeMedia.url} alt="Fullscreen" />
            )}
          </div>
        </div>
      )}
    </>
  )
}

export default ProductPage

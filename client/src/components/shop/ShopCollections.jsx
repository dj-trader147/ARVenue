import { Link } from 'react-router-dom'
import './shop.css'

function ShopCollections() {
  return (
    <div className="shop-collections-page">
      <h1>Select Collection</h1>
      <div className="collections-grid">
        <Link to="/shop/mens" className="collection-card">
          <h2>Men's Collection</h2>
        </Link>
        <Link to="/shop/womens" className="collection-card">
          <h2>Women's Collection</h2>
        </Link>
        <Link to="/shop/kids" className="collection-card">
          <h2>Kids Collection</h2>
        </Link>
        <Link to="/shop/premium-lounge" className="collection-card premium-lounge">
          <h2>Premium Lounge</h2>
        </Link>
      </div>
    </div>
  )
}

export default ShopCollections

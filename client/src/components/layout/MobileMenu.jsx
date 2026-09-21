import { Link } from 'react-router-dom'

function MobileMenu(props) {
  var isOpen = props.isOpen
  var onClose = props.onClose

  return (
    <>
      <div
        className={'mobile-overlay' + (isOpen ? ' active' : '')}
        onClick={onClose}
      />
      <div className={'mobile-menu' + (isOpen ? ' active' : '')}>
        <div className="mobile-menu-header">
          <img src="/logo.png" alt="AR VENUE" style={{ height: '36px', objectFit: 'contain' }} />
          <button className="mobile-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <nav className="mobile-nav">
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/shop" onClick={onClose}>Shop All Collections</Link>
          <Link to="/shop/mens" onClick={onClose}>Men's Collection</Link>
          <Link to="/shop/womens" onClick={onClose}>Women's Collection</Link>
          <Link to="/shop/kids" onClick={onClose}>Kids Collection</Link>
          <Link to="/shop/premium-lounge" onClick={onClose}>Premium Lounge</Link>
          <Link to="/about" onClick={onClose}>About Us</Link>
          <Link to="/contact" onClick={onClose}>Contact Us</Link>
          <Link to="/cart" onClick={onClose}>My Bag</Link>
        </nav>
        <div className="mobile-menu-footer">
          <p>AR VENUE &mdash; Curated Luxury Atelier</p>
        </div>
      </div>
    </>
  )
}

export default MobileMenu;
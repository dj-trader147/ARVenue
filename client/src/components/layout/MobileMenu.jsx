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
          <img src="/images/logo/logo.png" alt="AR VENUE" />
          <button className="mobile-close-btn" onClick={onClose}>
            &times;
          </button>
        </div>
        <nav className="mobile-nav">
          <Link to="/" onClick={onClose}>Home</Link>
          <Link to="/category/shoes" onClick={onClose}>Shoes</Link>
          <Link to="/category/jackets" onClick={onClose}>Jackets</Link>
          <Link to="/category/shirts" onClick={onClose}>Shirts</Link>
          <Link to="/category/jeans" onClick={onClose}>Jeans</Link>
          <Link to="/about" onClick={onClose}>About</Link>
          <Link to="/contact" onClick={onClose}>Contact</Link>
          <Link to="/cart" onClick={onClose}>Cart</Link>
        </nav>
        <div className="mobile-menu-footer">
          <p>AR VENUE &mdash; Premium Fashion</p>
        </div>
      </div>
    </>
  )
}

export default MobileMenu

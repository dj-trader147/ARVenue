import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import MobileMenu from './MobileMenu'
import './mobilemenu.css'

function Header() {
  var [menuOpen, setMenuOpen] = useState(false)
  var cart = useCart()

  return (
    <>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="header-logo">
            <img src="/images/logo/logo.png" alt="AR VENUE" />
          </Link>
          <nav className="header-nav">
            <Link to="/">Home</Link>
            <Link to="/shop">Shop</Link>
            <Link to="/about">About</Link>
            <Link to="/contact">Contact</Link>
          </nav>
          <div className="header-actions">
            <Link to="/cart" className="header-cart">Cart ({cart.cartCount})</Link>
            <button className="header-hamburger" onClick={function() { setMenuOpen(true) }}>
              <span></span><span></span><span></span>
            </button>
          </div>
        </div>
      </header>
      <MobileMenu isOpen={menuOpen} onClose={function() { setMenuOpen(false) }} />
    </>
  )
}

export default Header

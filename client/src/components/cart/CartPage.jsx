import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import './cart.css'

function CartPage() {
  var cart = useCart()

  if (cart.cartItems.length === 0) {
    return (
      <div className="cart-page">
        <h1>Your Cart</h1>
        <div className="empty-cart">
          <p>Your shopping cart is currently empty.</p>
          <Link to="/shop" className="continue-shopping">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="cart-page">
      <h1>Your Cart</h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.cartItems.map(function(item, index) {
            return (
              <div className="cart-item" key={index}>
                <img src={item.image} alt={item.name} className="cart-item-img" />
                <div className="cart-item-details">
                  <h3 className="cart-item-title">{item.name}</h3>
                  <div className="cart-item-meta">
                    <span>Size: {item.size}</span>
                    <span>Color: <span className="color-swatch" style={{background: item.color}}></span></span>
                  </div>
                  <div className="cart-item-price">Rs. {item.price.toLocaleString()}</div>
                  <div className="quantity-controls">
                    <button className="qty-btn" onClick={function() { cart.updateQuantity(item.slug, item.size, item.color, item.quantity - 1) }}>-</button>
                    <div className="qty-val">{item.quantity}</div>
                    <button className="qty-btn" onClick={function() { cart.updateQuantity(item.slug, item.size, item.color, item.quantity + 1) }}>+</button>
                  </div>
                </div>
                <button className="remove-btn" onClick={function() { cart.removeFromCart(item.slug, item.size, item.color) }}>Remove</button>
              </div>
            )
          })}
        </div>

        <div className="cart-summary">
          <h2>Order Summary</h2>
          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {cart.cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>Calculated at checkout</span>
          </div>
          <div className="summary-total">
            <span>Total</span>
            <span>Rs. {cart.cartTotal.toLocaleString()}</span>
          </div>
          <Link to="/checkout" className="checkout-btn">Proceed to Checkout</Link>
        </div>
      </div>
    </div>
  )
}

export default CartPage

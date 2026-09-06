import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { API_BASE_URL } from '../../utils/api'
import './checkout.css'

function CheckoutPage() {
  var cart = useCart()
  var [isPlacing, setIsPlacing] = useState(false)
  var [isSuccess, setIsSuccess] = useState(false)
  var [orderNumber, setOrderNumber] = useState('')

  var [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: ''
  })

  var shippingFee = cart.cartTotal >= 10000 ? 0 : 250
  var finalTotal = cart.cartTotal + shippingFee

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsPlacing(true)

    var payload = {
      customer: formData,
      items: cart.cartItems,
      subTotal: cart.cartTotal,
      shippingFee: shippingFee,
      totalAmount: finalTotal,
      paymentMethod: 'Cash on Delivery'
    }

    try {
      var response = await fetch(API_BASE_URL + '/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      var data = await response.json()

      if (data.success) {
        setOrderNumber(data.orderNumber || 'AR' + Math.floor(1000 + Math.random() * 9000))
        setIsSuccess(true)
        cart.clearCart()
      } else {
        alert('Order submission failed: ' + (data.message || 'Please check details.'))
      }
    } catch (err) {
      alert('Network error. Please try again.')
    } finally {
      setIsPlacing(false)
    }
  }

  if (isSuccess) {
    return (
      <div className="order-success">
        <h1>Order Confirmed!</h1>
        <p style={{ fontWeight: 600, color: '#111', fontSize: '1.2rem', margin: '16px 0' }}>
          Order Reference #: {orderNumber}
        </p>
        <p>Thank you for shopping with AR VENUE. Your order will be delivered soon via Cash on Delivery.</p>
        <Link to="/shop" className="place-order-btn" style={{display: 'inline-block', width: 'auto', padding: '16px 32px', marginTop: '24px'}}>
          Continue Shopping
        </Link>
      </div>
    )
  }

  if (cart.cartItems.length === 0) {
    return <div style={{textAlign: 'center', padding: '100px'}}><p>Your cart is empty.</p><Link to="/shop">Go to Shop</Link></div>
  }

  return (
    <div className="checkout-page">
      <div className="checkout-layout">
        <div className="checkout-form-section">
          <form onSubmit={handleSubmit}>
            <h2>Contact & Delivery</h2>
            <div className="form-grid">
              <div className="form-group">
                <label>First Name</label>
                <input type="text" name="firstName" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input type="text" name="lastName" required onChange={handleChange} />
              </div>
              <div className="form-group full-width">
                <label>Phone Number (For Delivery Rider)</label>
                <input type="tel" name="phone" required onChange={handleChange} placeholder="03xx-xxxxxxx" />
              </div>
              <div className="form-group full-width">
                <label>Complete Address</label>
                <input type="text" name="address" required onChange={handleChange} placeholder="House #, Street, Area..." />
              </div>
              <div className="form-group">
                <label>City</label>
                <input type="text" name="city" required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Postal Code (Optional)</label>
                <input type="text" name="postalCode" onChange={handleChange} />
              </div>
            </div>

            <h2>Payment Method</h2>
            <div className="payment-method">
              <input type="radio" checked readOnly />
              <label>Cash on Delivery (COD)</label>
            </div>

            <button type="submit" className="place-order-btn" disabled={isPlacing}>
              {isPlacing ? 'Processing Order...' : 'Confirm Order & Pay on Delivery'}
            </button>
          </form>
        </div>

        <div className="cart-summary" style={{position: 'sticky', top: '100px'}}>
          <h2 style={{fontSize: '1rem', borderBottom: '1px solid #E0E0E0', paddingBottom: '16px'}}>Order Summary ({cart.cartCount} items)</h2>
          <div style={{margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px'}}>
            {cart.cartItems.map(function(item, i) {
              return (
                <div key={i} style={{display: 'flex', gap: '12px', alignItems: 'center'}}>
                  <img src={item.image} alt={item.name} style={{width: '50px', height: '60px', objectFit: 'cover'}} />
                  <div style={{flex: 1, fontSize: '0.8rem'}}>
                    <div style={{fontWeight: 500}}>{item.name}</div>
                    <div style={{color: '#666'}}>Qty: {item.quantity} | Size: {item.size}</div>
                  </div>
                  <div style={{fontSize: '0.85rem', fontWeight: 600}}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                </div>
              )
            })}
          </div>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {cart.cartTotal.toLocaleString()}</span>
          </div>
          <div className="summary-row">
            <span>Shipping</span>
            <span>{shippingFee === 0 ? <span style={{color:'#2E7D32'}}>FREE</span> : 'Rs. ' + shippingFee}</span>
          </div>
          <div className="summary-total" style={{fontSize: '1.2rem'}}>
            <span>Total to Pay</span>
            <span>Rs. {finalTotal.toLocaleString()}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage

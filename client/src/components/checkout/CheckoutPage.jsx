import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../../context/CartContext'
import { API_BASE_URL } from '../../utils/api'
import './checkout.css'

function CheckoutPage() {
  var cart = useCart()
  var [isPlacing, setIsPlacing] = useState(false)
  var [isSuccess, setIsSuccess] = useState(false)
  var [orderNumber, setOrderNumber] = useState('')

  // Promo Code States
  var [promoSettings, setPromoSettings] = useState({
    enabled: true,
    code: 'GRANDOPENING',
    percentage: 20
  })
  var [promoInput, setPromoInput] = useState('')
  var [appliedPromo, setAppliedPromo] = useState(null)
  var [promoError, setPromoError] = useState('')
  var [promoSuccessMsg, setPromoSuccessMsg] = useState('')

  var [formData, setFormData] = useState({
    firstName: '', lastName: '', phone: '', address: '', city: '', postalCode: ''
  })

  // Load promo settings from backend, or fallback to localStorage / Defaults
  useEffect(function() {
    fetch(API_BASE_URL + '/api/settings/promo')
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success && data.settings) {
          setPromoSettings(data.settings)
        }
      })
      .catch(function() {
        var local = localStorage.getItem('ar_venue_promo_settings')
        if (local) {
          try {
            setPromoSettings(JSON.parse(local))
          } catch (e) {}
        }
      })
  }, [])

  var shippingFee = cart.cartTotal >= 10000 ? 0 : 250
  
  // Calculate discount if applied
  var discountAmount = 0
  if (appliedPromo && promoSettings.enabled) {
    discountAmount = Math.round((cart.cartTotal * promoSettings.percentage) / 100)
  }

  var finalTotal = cart.cartTotal - discountAmount + shippingFee

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  function handleApplyPromo(e) {
    e.preventDefault()
    setPromoError('')
    setPromoSuccessMsg('')

    if (!promoSettings.enabled) {
      setPromoError('Promo codes are currently disabled.')
      return
    }

    if (promoInput.trim().toUpperCase() === promoSettings.code.toUpperCase()) {
      setAppliedPromo(promoSettings.code)
      setPromoSuccessMsg('Promo applied! You saved ' + promoSettings.percentage + '% on your order.')
    } else {
      setPromoError('Invalid promo code. Please check spelling.')
    }
  }

  function handleRemovePromo() {
    setAppliedPromo(null)
    setPromoInput('')
    setPromoSuccessMsg('')
    setPromoError('')
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setIsPlacing(true)

    var payload = {
      customer: formData,
      items: cart.cartItems,
      subTotal: cart.cartTotal,
      shippingFee: shippingFee,
      discountCode: appliedPromo ? promoSettings.code : '',
      discountAmount: discountAmount,
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
          <div style={{margin: '24px 0', display: 'flex', flexDirection: 'column', gap: '16px', maxHeight: '200px', overflowY: 'auto'}}>
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

          {/* Luxury Promo Code Box */}
          {promoSettings.enabled && (
            <div style={{ borderTop: '1px solid #E5E5E5', borderBottom: '1px solid #E5E5E5', padding: '16px 0', margin: '16px 0' }}>
              {!appliedPromo ? (
                <form onSubmit={handleApplyPromo} style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    placeholder="Discount / Promo Code" 
                    value={promoInput}
                    onChange={function(e) { setPromoInput(e.target.value) }}
                    style={{ 
                      flex: 1, 
                      padding: '10px 12px', 
                      fontSize: '0.85rem', 
                      border: '1px solid #CCCCCC', 
                      borderRadius: '0', 
                      outline: 'none',
                      background: '#FAFAFA' 
                    }}
                  />
                  <button 
                    type="submit" 
                    style={{ 
                      background: '#171717', 
                      color: '#FFFFFF', 
                      border: 'none', 
                      padding: '10px 20px', 
                      fontSize: '0.8rem', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      letterSpacing: '0.5px' 
                    }}
                  >
                    APPLY
                  </button>
                </form>
              ) : (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F4F4F4', padding: '10px 12px' }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', color: '#171717' }}>
                    Code Applied: <span style={{ color: '#8C6D46', letterSpacing: '1px' }}>{appliedPromo}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={handleRemovePromo}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: '#FF3333', 
                      fontSize: '0.75rem', 
                      fontWeight: '600', 
                      cursor: 'pointer',
                      textDecoration: 'underline' 
                    }}
                  >
                    Remove
                  </button>
                </div>
              )}
              {promoError && <p style={{ color: '#FF3333', fontSize: '0.75rem', marginTop: '8px', marginBottom: '0' }}>{promoError}</p>}
              {promoSuccessMsg && <p style={{ color: '#2E7D32', fontSize: '0.75rem', marginTop: '8px', marginBottom: '0' }}>{promoSuccessMsg}</p>}
            </div>
          )}

          <div className="summary-row">
            <span>Subtotal</span>
            <span>Rs. {cart.cartTotal.toLocaleString()}</span>
          </div>
          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: '#2E7D32', fontWeight: 500 }}>
              <span>Promo Discount ({promoSettings.percentage}%)</span>
              <span>- Rs. {discountAmount.toLocaleString()}</span>
            </div>
          )}
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

export default CheckoutPage;
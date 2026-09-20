import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'

function Settings() {
  var auth = useAuth()
  
  // Password Reset states
  var [currentPass, setCurrentPass] = useState('')
  var [newPass, setNewPass] = useState('')
  var [confirmPass, setConfirmPass] = useState('')
  var [passSuccess, setPassSuccess] = useState('')
  var [passError, setPassError] = useState('')

  // Promo Code Manager states
  var [promoEnabled, setPromoEnabled] = useState(true)
  var [promoCode, setPromoCode] = useState('GRANDOPENING')
  var [promoPercentage, setPromoPercentage] = useState(20)
  var [promoSuccess, setPromoSuccess] = useState('')

  useEffect(function() {
    var localPromo = localStorage.getItem('ar_venue_promo_settings')
    if (localPromo) {
      try {
        var parsed = JSON.parse(localPromo)
        setPromoEnabled(parsed.enabled)
        setPromoCode(parsed.code)
        setPromoPercentage(parsed.percentage)
      } catch (e) {}
    }
  }, [])

  function handlePasswordChange(e) {
    e.preventDefault()
    setPassSuccess('')
    setPassError('')

    if (newPass !== confirmPass) {
      setPassError('New passwords do not match')
      return
    }

    var res = auth.changePassword(currentPass, newPass)
    if (res.success) {
      setPassSuccess('Password updated successfully!')
      setCurrentPass('')
      setNewPass('')
      setConfirmPass('')
    } else {
      setPassError(res.message)
    }
  }

  function handlePromoSave(e) {
    e.preventDefault()
    setPromoSuccess('')

    var settings = {
      enabled: promoEnabled,
      code: promoCode.trim().toUpperCase(),
      percentage: parseInt(promoPercentage) || 0
    }

    localStorage.setItem('ar_venue_promo_settings', JSON.stringify(settings))
    setPromoSuccess('Promo code settings saved successfully!')
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '32px', color: '#111' }}>Control Center Settings</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', alignItems: 'start' }}>
        
        {/* Promo Settings Block */}
        <div className="admin-card" style={{ background: '#FFF', padding: '24px', border: '1px solid #E5E5E5' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid #E5E5E5', paddingBottom: '12px', marginTop: 0, marginBottom: '20px' }}>🏷️ PROMO / DISCOUNT CONTROL</h3>
          {promoSuccess && <div style={{ background: '#D1E7DD', color: '#0F5132', padding: '12px', fontSize: '0.85rem', marginBottom: '20px', borderRadius: '4px' }}>{promoSuccess}</div>}

          <form onSubmit={handlePromoSave} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <input 
                type="checkbox" 
                id="promoEnabled" 
                checked={promoEnabled} 
                onChange={function(e) { setPromoEnabled(e.target.checked) }}
                style={{ width: '18px', height: '18px', cursor: 'pointer' }}
              />
              <label htmlFor="promoEnabled" style={{ fontSize: '0.85rem', color: '#374151', cursor: 'pointer', fontWeight: 600 }}>
                Enable Promo Code on Storefront Checkout
              </label>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Promo Code Name</label>
              <input 
                type="text" 
                value={promoCode} 
                onChange={function(e) { setPromoCode(e.target.value) }} 
                required 
                disabled={!promoEnabled}
                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px', outline: 'none', background: promoEnabled ? '#FFF' : '#F3F4F6' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Discount Percentage (%)</label>
              <input 
                type="number" 
                min="1" 
                max="100"
                value={promoPercentage} 
                onChange={function(e) { setPromoPercentage(e.target.value) }} 
                required 
                disabled={!promoEnabled}
                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px', outline: 'none', background: promoEnabled ? '#FFF' : '#F3F4F6' }} 
              />
            </div>

            <button type="submit" style={{ padding: '12px 24px', background: '#111', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              Save Settings
            </button>
          </form>
        </div>

        {/* Password Reset Block */}
        <div className="admin-card" style={{ background: '#FFF', padding: '24px', border: '1px solid #E5E5E5' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, borderBottom: '1px solid #E5E5E5', paddingBottom: '12px', marginTop: 0, marginBottom: '20px' }}>🔐 SECURITY & PASSWORD RESET</h3>
          {passSuccess && <div style={{ background: '#D1E7DD', color: '#0F5132', padding: '12px', fontSize: '0.85rem', marginBottom: '20px', borderRadius: '4px' }}>{passSuccess}</div>}
          {passError && <div style={{ background: '#FEE2E2', color: '#B91C1C', padding: '12px', fontSize: '0.85rem', marginBottom: '20px', borderRadius: '4px' }}>{passError}</div>}

          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Current Password</label>
              <input 
                type="password" 
                value={currentPass} 
                onChange={function(e) { setCurrentPass(e.target.value) }} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px', outline: 'none' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>New Password</label>
              <input 
                type="password" 
                value={newPass} 
                onChange={function(e) { setNewPass(e.target.value) }} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px', outline: 'none' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPass} 
                onChange={function(e) { setConfirmPass(e.target.value) }} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid #D1D5DB', borderRadius: '4px', outline: 'none' }} 
              />
            </div>

            <button type="submit" style={{ padding: '12px 24px', background: '#111', color: '#FFF', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 600, textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '0.5px' }}>
              Update Password
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default Settings;
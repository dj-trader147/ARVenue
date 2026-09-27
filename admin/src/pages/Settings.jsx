import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { API_BASE_URL } from '../utils/api'

function Settings() {
  var auth = useAuth()
  
  // Password Reset states
  var [currentPass, setCurrentPass] = useState('')
  var [newPass, setNewPass] = useState('')
  var [confirmPass, setConfirmPass] = useState('')
  var [passSuccess, setPassSuccess] = useState('')
  var [passError, setPassError] = useState('')

  // Promo Code Manager states (Connected to MongoDB)
  var [promoEnabled, setPromoEnabled] = useState(true)
  var [promoCode, setPromoCode] = useState('GRANDOPENING')
  var [promoPercentage, setPromoPercentage] = useState(20)
  var [promoSuccess, setPromoSuccess] = useState('')
  var [promoLoading, setPromoLoading] = useState(false)

  // Fetch Live Promo Settings from MongoDB
  useEffect(function() {
    fetch(API_BASE_URL + '/api/settings/promo')
      .then(function(res) { return res.json() })
      .then(function(data) {
        if (data.success && data.settings) {
          setPromoEnabled(data.settings.enabled)
          setPromoCode(data.settings.code)
          setPromoPercentage(data.settings.percentage)
        }
      })
      .catch(function(err) {
        console.error('Failed to load promo settings:', err)
      })
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
    setPromoLoading(true)

    fetch(API_BASE_URL + '/api/settings/promo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        enabled: promoEnabled,
        code: promoCode,
        percentage: Number(promoPercentage)
      })
    })
      .then(function(res) { return res.json() })
      .then(function(data) {
        setPromoLoading(false)
        if (data.success) {
          setPromoSuccess('Promo Code settings saved to Cloud Database successfully!')
          setPromoEnabled(data.settings.enabled)
          setPromoCode(data.settings.code)
          setPromoPercentage(data.settings.percentage)
        } else {
          alert('Failed to save settings: ' + data.message)
        }
      })
      .catch(function(err) {
        setPromoLoading(false)
        alert('Error connecting to backend server.')
      })
  }

  return (
    <div style={{ maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '8px' }}>Store Settings</h1>
        <p style={{ color: '#666', fontSize: '0.85rem' }}>Manage security and store-wide discount promo codes.</p>
      </div>

      {/* Section 1: Promo Code Manager */}
      <div className="admin-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: '#111' }}>
          Discount Promo Code System
        </h2>

        {promoSuccess && (
          <div style={{ padding: '12px', background: '#D1FAE5', color: '#065F46', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {promoSuccess}
          </div>
        )}

        <form onSubmit={handlePromoSave} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600 }}>
            <input 
              type="checkbox" 
              checked={promoEnabled} 
              onChange={function(e) { setPromoEnabled(e.target.checked) }} 
            />
            Enable Promo Code Feature on Customer Checkout Page
          </label>

          {promoEnabled && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginTop: '8px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Promo Code</label>
                <input 
                  type="text" 
                  value={promoCode} 
                  onChange={function(e) { setPromoCode(e.target.value.toUpperCase()) }} 
                  placeholder="e.g. GRANDOPENING" 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px', textTransform: 'uppercase' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Discount Percentage (%)</label>
                <input 
                  type="number" 
                  min="1" 
                  max="100" 
                  value={promoPercentage} 
                  onChange={function(e) { setPromoPercentage(e.target.value) }} 
                  required 
                  style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} 
                />
              </div>
            </div>
          )}

          <button 
            type="submit" 
            disabled={promoLoading}
            style={{ alignSelf: 'flex-start', padding: '12px 24px', background: '#111', color: '#FFF', borderRadius: '4px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            {promoLoading ? 'Saving...' : 'Save Promo Settings'}
          </button>
        </form>
      </div>

      {/* Section 2: Change Admin Password */}
      <div className="admin-card">
        <h2 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '16px', color: '#111' }}>
          Change Admin Password
        </h2>

        {passSuccess && (
          <div style={{ padding: '12px', background: '#D1FAE5', color: '#065F46', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {passSuccess}
          </div>
        )}

        {passError && (
          <div style={{ padding: '12px', background: '#FEE2E2', color: '#991B1B', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '16px' }}>
            {passError}
          </div>
        )}

        <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Current Password</label>
            <input 
              type="password" 
              value={currentPass} 
              onChange={function(e) { setCurrentPass(e.target.value) }} 
              required 
              style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} 
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>New Password</label>
              <input 
                type="password" 
                value={newPass} 
                onChange={function(e) { setNewPass(e.target.value) }} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} 
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 600, marginBottom: '6px' }}>Confirm New Password</label>
              <input 
                type="password" 
                value={confirmPass} 
                onChange={function(e) { setConfirmPass(e.target.value) }} 
                required 
                style={{ width: '100%', padding: '10px', border: '1px solid #CCC', borderRadius: '4px' }} 
              />
            </div>
          </div>

          <button type="submit" style={{ alignSelf: 'flex-start', padding: '12px 24px', background: '#111', color: '#FFF', borderRadius: '4px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
            Update Password
          </button>
        </form>
      </div>
    </div>
  )
}

export default Settings;

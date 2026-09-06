import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Login() {
  var [email, setEmail] = useState('arvenue0300@gmail.com')
  var [password, setPassword] = useState('')
  var [error, setError] = useState('')
  var auth = useAuth()
  var navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    setError('')
    var res = auth.login(email, password)
    if (res.success) navigate('/')
    else setError(res.message)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F3F4F6' }}>
      <div className="admin-card" style={{ width: '100%', maxWidth: '400px', padding: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <img src="/logo.png" alt="AR VENUE" style={{ height: '48px', marginBottom: '16px' }} />
          <h2 style={{ fontSize: '1rem', fontWeight: 500, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#666' }}>Private Control Panel</h2>
        </div>

        {error && <div style={{ background: '#FEE2E2', border: '1px solid #EF4444', color: '#B91C1C', padding: '12px', borderRadius: '4px', fontSize: '0.85rem', marginBottom: '20px' }}>{error}</div>}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Email Address</label>
            <input type="email" value={email} onChange={function(e) { setEmail(e.target.value) }} required style={{ width: '100%', padding: '12px', background: '#FFF', border: '1px solid #D1D5DB', color: '#111', borderRadius: '4px', outline: 'none' }} />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 600 }}>Password</label>
            <input type="password" value={password} onChange={function(e) { setPassword(e.target.value) }} placeholder="Enter password..." required style={{ width: '100%', padding: '12px', background: '#FFF', border: '1px solid #D1D5DB', color: '#111', borderRadius: '4px', outline: 'none' }} />
          </div>

          <button type="submit" style={{ padding: '14px', background: '#111', color: '#FFF', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em', borderRadius: '4px', marginTop: '8px' }}>
            Login Securely
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login

import { createContext, useState, useContext, useEffect } from 'react'

var AuthContext = createContext()

export function AuthProvider(props) {
  var [admin, setAdmin] = useState(null)
  var [token, setToken] = useState(localStorage.getItem('arvenue_admin_token') || '')
  var [loading, setLoading] = useState(true)

  useEffect(function() {
    if (token) {
      setAdmin({
        name: 'Ahsan Rajpoot',
        email: 'arvenue0300@gmail.com',
        role: 'admin'
      })
    }
    setLoading(false)
  }, [token])

  function login(email, password) {
    var savedPassword = localStorage.getItem('ar_venue_admin_pass') || 'admin123456';
    
    if (email.toLowerCase() === 'arvenue0300@gmail.com' && password === savedPassword) {
      var fakeToken = 'arvenue_jwt_token_demo_2026'
      localStorage.setItem('arvenue_admin_token', fakeToken)
      setToken(fakeToken)
      setAdmin({
        name: 'Ahsan Rajpoot',
        email: 'arvenue0300@gmail.com',
        role: 'admin'
      })
      return { success: true }
    } else {
      return { success: false, message: 'Invalid Admin Credentials' }
    }
  }

  function changePassword(currentPass, newPass) {
    var savedPassword = localStorage.getItem('ar_venue_admin_pass') || 'admin123456';
    if (currentPass !== savedPassword) {
      return { success: false, message: 'Current password is incorrect' };
    }
    localStorage.setItem('ar_venue_admin_pass', newPass);
    return { success: true };
  }

  function logout() {
    localStorage.removeItem('arvenue_admin_token')
    setToken('')
    setAdmin(null)
  }

  return (
    <AuthContext.Provider value={{ admin, token, loading, login, changePassword, logout }}>
      {props.children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
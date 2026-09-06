import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import './adminlayout.css'

function AdminLayout() {
  var auth = useAuth()
  var navigate = useNavigate()

  function handleLogout() {
    auth.logout()
    navigate('/login')
  }

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-header">
          <img src="/logo.png" alt="AR VENUE" />
          <span>Control Center</span>
        </div>
        <nav className="sidebar-nav">
          <NavLink to="/" end className={function(nav) { return 'sidebar-link' + (nav.isActive ? ' active' : '') }}>Dashboard</NavLink>
          <NavLink to="/orders" className={function(nav) { return 'sidebar-link' + (nav.isActive ? ' active' : '') }}>Orders</NavLink>
          <NavLink to="/products" className={function(nav) { return 'sidebar-link' + (nav.isActive ? ' active' : '') }}>Products Upload</NavLink>
          <NavLink to="/videos" className={function(nav) { return 'sidebar-link' + (nav.isActive ? ' active' : '') }}>Video Manager</NavLink>
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-topbar">
          <h2>AR VENUE Management</h2>
          <div className="topbar-user">
            <div className="user-info">
              <strong>{auth.admin ? auth.admin.name : 'Ahsan Rajpoot'}</strong>
              <span>Owner & Admin</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        </header>
        <div className="admin-content">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default AdminLayout

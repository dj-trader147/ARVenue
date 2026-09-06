function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '32px', color: '#111' }}>Dashboard Overview</h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '40px' }}>
        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Total Revenue</span>
          <h2 style={{ fontSize: '1.8rem', color: '#111', marginTop: '8px' }}>Rs. 0</h2>
        </div>
        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Total Orders</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '8px' }}>0</h2>
        </div>
        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Pending Orders</span>
          <h2 style={{ fontSize: '1.8rem', color: '#F59E0B', marginTop: '8px' }}>0</h2>
        </div>
        <div className="admin-card">
          <span style={{ fontSize: '0.75rem', color: '#6B7280', textTransform: 'uppercase' }}>Active Products</span>
          <h2 style={{ fontSize: '1.8rem', marginTop: '8px' }}>0</h2>
        </div>
      </div>

      <div className="admin-card">
        <h3 style={{ fontSize: '1rem', fontWeight: 500, marginBottom: '12px' }}>Welcome, Ahsan Rajpoot</h3>
        <p style={{ color: '#6B7280', fontSize: '0.9rem', lineHeight: 1.6 }}>
          Your AR VENUE control panel is ready. When customers place orders, they will show here.
          Use <strong>Products Upload</strong> and <strong>Video Manager</strong> to add your real catalog.
        </p>
      </div>
    </div>
  )
}

export default Dashboard

import { useState } from 'react'

function Orders() {
  var [orders, setOrders] = useState([])

  function handleStatusChange(orderId, newStatus) {
    setOrders(function(prev) {
      return prev.map(function(ord) {
        return ord.id === orderId ? { ...ord, status: newStatus } : ord
      })
    })
  }

  if (orders.length === 0) {
    return (
      <div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px', color: '#111' }}>Manage Orders</h1>
        <div className="admin-card" style={{ textAlign: 'center', padding: '60px 24px' }}>
          <p style={{ fontSize: '1rem', color: '#666', marginBottom: '8px' }}>No orders yet</p>
          <p style={{ fontSize: '0.85rem', color: '#999' }}>
            When customers place Cash on Delivery orders on the website, they will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 400, marginBottom: '24px', color: '#111' }}>Manage Orders</h1>
      <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Info</th>
              <th>Items</th>
              <th>Total Amount</th>
              <th>Status</th>
              <th>Action (Dispatch)</th>
            </tr>
          </thead>
          <tbody>
            {orders.map(function(order) {
              return (
                <tr key={order.id}>
                  <td style={{ fontWeight: 600, color: '#111' }}>{order.id}</td>
                  <td>
                    <div style={{ fontWeight: 600 }}>{order.customer.name}</div>
                    <div style={{ fontSize: '0.78rem', color: '#666' }}>{order.customer.phone}</div>
                    <div style={{ fontSize: '0.75rem', color: '#888' }}>{order.customer.address}, {order.customer.city}</div>
                  </td>
                  <td>
                    {order.items.map(function(item, idx) {
                      return <div key={idx} style={{ fontSize: '0.8rem' }}>{item.qty}x {item.name}</div>
                    })}
                  </td>
                  <td style={{ fontWeight: 600 }}>Rs. {order.total.toLocaleString()}</td>
                  <td><span className={'admin-badge badge-' + order.status}>{order.status}</span></td>
                  <td>
                    <select
                      value={order.status}
                      onChange={function(e) { handleStatusChange(order.id, e.target.value) }}
                      style={{ background: '#FFF', border: '1px solid #CCC', padding: '6px 10px', borderRadius: '4px', fontSize: '0.8rem', outline: 'none' }}
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Orders

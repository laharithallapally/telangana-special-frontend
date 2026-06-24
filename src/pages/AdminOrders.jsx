import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/admin/all')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (orderId, status) => {
    setUpdating(orderId)
    try {
      await api.put(`/orders/${orderId}/status?status=${status}`)
      fetchOrders()
    } catch (err) {
      alert('Failed to update status!')
    } finally {
      setUpdating(null)
    }
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f39c12',
      CONFIRMED: '#3498db',
      PREPARING: '#9b59b6',
      OUT_FOR_DELIVERY: '#1abc9c',
      DELIVERED: '#2ecc71',
      CANCELLED: '#e74c3c'
    }
    return colors[status] || '#888'
  }

  if (loading) return <div className="loading"><div className="loading-spinner"></div></div>

  return (
    <div className="admin-container">
      <h2>📦 Manage Orders</h2>

      {orders.length === 0 ? (
        <div className="empty-cart">
          <h2>No orders yet!</h2>
        </div>
      ) : (
        orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div className="order-id-section">
                <span className="order-id">Order #{order.id}</span>
                <span className="order-date">{order.deliveryAddress}</span>
              </div>
              <span className="order-status"
                style={{ background: getStatusColor(order.status) }}>
                {order.status.replace('_', ' ')}
              </span>
            </div>

            <div className="order-items">
              {order.items.map((item, index) => (
                <div key={index} className="order-item-row">
                  <span>{item.productName}</span>
                  <span>x{item.quantity}</span>
                  <span>₹{item.totalPrice}</span>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <strong style={{ color: 'var(--primary)' }}>
                Total: ₹{order.totalAmount}
              </strong>

              {/* Status Update Buttons */}
              <div className="status-buttons">
                {['CONFIRMED', 'PREPARING', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED']
                  .filter(s => s !== order.status)
                  .map(status => (
                    <button
                      key={status}
                      className="status-btn"
                      style={{ borderColor: getStatusColor(status), color: getStatusColor(status) }}
                      onClick={() => updateStatus(order.id, status)}
                      disabled={updating === order.id}
                    >
                      {status.replace('_', ' ')}
                    </button>
                  ))}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  )
}

export default AdminOrders
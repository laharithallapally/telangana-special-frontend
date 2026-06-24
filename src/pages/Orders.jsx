import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'

function Orders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders')
      setOrders(res.data)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
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

  const getStatusEmoji = (status) => {
    const emojis = {
      PENDING: '🕐',
      CONFIRMED: '✅',
      PREPARING: '👨‍🍳',
      OUT_FOR_DELIVERY: '🛵',
      DELIVERED: '🎉',
      CANCELLED: '❌'
    }
    return emojis[status] || '📦'
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your orders...</p>
      </div>
    )
  }

  if (orders.length === 0) {
    return (
      <div className="empty-cart">
        <div style={{ fontSize: '64px', marginBottom: '16px' }}>📦</div>
        <h2>No orders yet!</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '20px' }}>
          You haven't placed any orders yet.
        </p>
        <button onClick={() => window.location.href = '/products'}>
          Browse Products
        </button>
      </div>
    )
  }

  return (
    <div className="orders-container">
      <div className="orders-header">
        <h2>My Orders 📦</h2>
        <span className="orders-count">{orders.length} orders</span>
      </div>

      {orders.map(order => (
        <div key={order.id} className="order-card">

          {/* Order Header */}
          <div className="order-header">
            <div className="order-id-section">
              <span className="order-id">Order #{order.id}</span>
              {order.createdAt && (
                <span className="order-date">{formatDate(order.createdAt)}</span>
              )}
            </div>
            <span
              className="order-status"
              style={{ background: getStatusColor(order.status) }}
            >
              {getStatusEmoji(order.status)} {order.status.replace('_', ' ')}
            </span>
          </div>

          {/* Order Items */}
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="order-item-row">
                <div className="order-item-name">
                  <span className="order-item-dot">•</span>
                  {item.productName}
                </div>
                <div className="order-item-right">
                  <span className="order-item-qty">x{item.quantity}</span>
                  <span className="order-item-price">₹{item.totalPrice}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Order Footer */}
          <div className="order-footer">
            <div className="order-address">
              <span>📍</span>
              <span>{order.deliveryAddress}</span>
            </div>
            <div className="order-total">
              <span style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>
                Total
              </span>
              <strong>₹{order.totalAmount}</strong>
            </div>
          </div>

        </div>
      ))}
    </div>
  )
}

export default Orders
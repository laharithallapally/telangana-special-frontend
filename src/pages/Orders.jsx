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

  const STATUS_STEPS = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED']

  const getStatusIndex = (status) => {
    if (status === 'CANCELLED') return -1
    return STATUS_STEPS.indexOf(status)
  }

  const getStatusColor = (status) => {
    const colors = {
      PENDING: '#f39c12',
      PROCESSING: '#3498db',
      SHIPPED: '#9b59b6',
      DELIVERED: '#2ecc71',
      CANCELLED: '#e74c3c'
    }
    return colors[status] || '#888'
  }

  const getStatusEmoji = (status) => {
    const emojis = {
      PENDING: '🕐',
      PROCESSING: '⚙️',
      SHIPPED: '🚚',
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

          {/* Status Timeline */}
          {order.status !== 'CANCELLED' ? (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              margin: '20px 0',
              padding: '0 8px',
              position: 'relative'
            }}>
              {/* Progress line behind steps */}
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '24px',
                right: '24px',
                height: '3px',
                background: '#2a2a2a',
                zIndex: 0
              }} />
              <div style={{
                position: 'absolute',
                top: '18px',
                left: '24px',
                height: '3px',
                width: `${(getStatusIndex(order.status) / (STATUS_STEPS.length - 1)) * 100}%`,
                background: getStatusColor(order.status),
                zIndex: 1,
                transition: 'width 0.4s ease'
              }} />

              {STATUS_STEPS.map((step, index) => {
                const currentIndex = getStatusIndex(order.status)
                const isCompleted = index <= currentIndex
                const isActive = index === currentIndex
                return (
                  <div key={step} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '8px',
                    zIndex: 2,
                    flex: 1
                  }}>
                    <div style={{
                      width: '36px',
                      height: '36px',
                      borderRadius: '50%',
                      background: isCompleted ? getStatusColor(order.status) : '#2a2a2a',
                      border: isActive ? `3px solid ${getStatusColor(order.status)}` : '3px solid #2a2a2a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '16px',
                      boxShadow: isActive ? `0 0 12px ${getStatusColor(order.status)}88` : 'none',
                      transition: 'all 0.3s ease'
                    }}>
                      {isCompleted ? '✓' : index + 1}
                    </div>
                    <span style={{
                      fontSize: '11px',
                      color: isCompleted ? getStatusColor(order.status) : 'var(--text-secondary)',
                      fontWeight: isActive ? '600' : '400',
                      textAlign: 'center',
                      lineHeight: '1.3'
                    }}>
                      {step === 'PENDING' ? '🕐 Pending' :
                       step === 'PROCESSING' ? '⚙️ Processing' :
                       step === 'SHIPPED' ? '🚚 Shipped' :
                       '🎉 Delivered'}
                    </span>
                  </div>
                )
              })}
            </div>
          ) : (
            <div style={{
              background: 'rgba(231,76,60,0.1)',
              border: '1px solid #e74c3c',
              borderRadius: '10px',
              padding: '12px 16px',
              margin: '16px 0',
              color: '#e74c3c',
              fontSize: '14px',
              textAlign: 'center'
            }}>
              ❌ This order has been cancelled
            </div>
          )}

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
import { useEffect, useState } from 'react'
import api from '../api/axiosConfig'

const HIDDEN_KEY = 'ts_admin_hidden_orders'

function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(null)
  const [hiddenIds, setHiddenIds] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(HIDDEN_KEY) || '[]')
    } catch {
      return []
    }
  })
  const [showHidden, setShowHidden] = useState(false)

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

  const hideOrder = (orderId) => {
    setHiddenIds((prev) => {
      const updated = [...prev, orderId]
      localStorage.setItem(HIDDEN_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const unhideOrder = (orderId) => {
    setHiddenIds((prev) => {
      const updated = prev.filter((id) => id !== orderId)
      localStorage.setItem(HIDDEN_KEY, JSON.stringify(updated))
      return updated
    })
  }

  const clearAllHidden = () => {
    setHiddenIds([])
    localStorage.setItem(HIDDEN_KEY, JSON.stringify([]))
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

  const visibleOrders = showHidden ? orders : orders.filter(o => !hiddenIds.includes(o.id))
  const hiddenCount = orders.filter(o => hiddenIds.includes(o.id)).length

  return (
    <div className="admin-container">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
        <h2>📦 Manage Orders</h2>

        {hiddenCount > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              onClick={() => setShowHidden(!showHidden)}
              style={{
                background: 'none', border: '1.5px solid var(--primary)', color: 'var(--primary)',
                borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
              }}
            >
              {showHidden ? `Hide dismissed (${hiddenCount})` : `Show hidden (${hiddenCount})`}
            </button>

            {showHidden && (
              <button
                onClick={clearAllHidden}
                style={{
                  background: 'none', border: '1.5px solid #999', color: '#666',
                  borderRadius: '6px', padding: '6px 14px', fontSize: '13px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                Restore all
              </button>
            )}
          </div>
        )}
      </div>

      {visibleOrders.length === 0 ? (
        <div className="empty-cart">
          <h2>{orders.length === 0 ? 'No orders yet!' : 'No orders to show'}</h2>
        </div>
      ) : (
        visibleOrders.map(order => {
          const isHidden = hiddenIds.includes(order.id)
          return (
            <div key={order.id} className="order-card" style={isHidden ? { opacity: 0.55 } : undefined}>
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

                  {isHidden ? (
                    <button
                      className="status-btn"
                      style={{ borderColor: '#666', color: '#666' }}
                      onClick={() => unhideOrder(order.id)}
                    >
                      Restore
                    </button>
                  ) : (
                    <button
                      className="status-btn"
                      style={{ borderColor: '#999', color: '#999' }}
                      onClick={() => hideOrder(order.id)}
                    >
                      Remove from list
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}

export default AdminOrders
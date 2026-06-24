import { useEffect, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import api from '../api/axiosConfig'

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0
  })
  const navigate = useNavigate()

  useEffect(() => {
    // check if admin
    const user = JSON.parse(localStorage.getItem('user') || '{}')
    if (user.role !== 'ADMIN') {
      alert('Access denied!')
      navigate('/')
      return
    }
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const [products, orders] = await Promise.all([
        api.get('/products'),
        api.get('/orders/admin/all')
      ])
      setStats({
        totalProducts: products.data.length,
        totalOrders: orders.data.length
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="admin-container">
      <h2>Admin Dashboard 👨‍💼</h2>

      <div className="admin-stats">
        <div className="stat-card">
          <div className="stat-number">{stats.totalProducts}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalOrders}</div>
          <div className="stat-label">Total Orders</div>
        </div>
      </div>

      <div className="admin-menu">
        <Link to="/admin/products" className="admin-menu-item">
          <span className="admin-menu-icon">🛍️</span>
          <div>
            <div className="admin-menu-title">Manage Products</div>
            <div className="admin-menu-sub">Add, edit, delete products</div>
          </div>
          <span>→</span>
        </Link>

        <Link to="/admin/orders" className="admin-menu-item">
          <span className="admin-menu-icon">📦</span>
          <div>
            <div className="admin-menu-title">Manage Orders</div>
            <div className="admin-menu-sub">View and update order status</div>
          </div>
          <span>→</span>
        </Link>
      </div>
    </div>
  )
}

export default AdminDashboard
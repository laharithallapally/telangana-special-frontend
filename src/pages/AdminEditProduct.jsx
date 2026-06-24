import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axiosConfig'

function AdminEditProduct() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    image: '', category: '', stock: '', available: true
  })

  useEffect(() => {
    fetchProduct()
  }, [])

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/products/${id}`)
      setForm({
        name: res.data.name || '',
        description: res.data.description || '',
        price: res.data.price || '',
        image: res.data.image || '',
        category: res.data.category || '',
        stock: res.data.stock || '',
        available: res.data.available ?? true
      })
    } catch (err) {
      alert('Failed to load product!')
      navigate('/admin/products')
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await api.put(`/products/${id}`, {
        ...form,
        price: parseFloat(form.price),
        stock: parseInt(form.stock)
      })
      alert('✅ Product updated!')
      navigate('/admin/products')
    } catch (err) {
      if (err.response?.status === 403) {
        alert('❌ Access denied! Login as Admin.')
      } else {
        alert('❌ Failed to update!')
      }
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    )
  }

  return (
    <div className="admin-container">
      <div className="admin-page-header">
        <h2>✏️ Edit Product</h2>
        <button
          className="admin-cancel-btn"
          onClick={() => navigate('/admin/products')}
        >
          ← Back
        </button>
      </div>

      <div className="admin-form-card">
        <form onSubmit={handleSubmit}>
          <div className="admin-form-grid">
            <div className="form-group">
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Product Name *
              </label>
              <input name="name" placeholder="Product Name"
                value={form.name} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Category *
              </label>
              <input name="category" placeholder="e.g. Snacks, Sweets"
                value={form.category} onChange={handleChange} required />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Price (₹) *
              </label>
              <input name="price" type="number" placeholder="Price"
                value={form.price} onChange={handleChange} required min="1" />
            </div>

            <div className="form-group">
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Stock *
              </label>
              <input name="stock" type="number" placeholder="Stock quantity"
                value={form.stock} onChange={handleChange} required min="0" />
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Image URL
              </label>
              <input name="image" placeholder="https://example.com/image.jpg"
                value={form.image} onChange={handleChange} />
              {form.image && form.image.trim() !== '' && (
                <img src={form.image} alt="preview"
                  style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px', marginTop: '8px' }}
                  onError={(e) => e.target.style.display = 'none'}
                />
              )}
            </div>

            <div className="form-group" style={{ gridColumn: 'span 2' }}>
              <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>
                Description *
              </label>
              <textarea name="description" placeholder="Describe the product..."
                value={form.description} onChange={handleChange} rows={3} required />
            </div>

            <div className="form-group admin-checkbox">
              <label>
                <input type="checkbox" name="available"
                  checked={form.available} onChange={handleChange} />
                &nbsp; Available for purchase
              </label>
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-cancel-btn"
              onClick={() => navigate('/admin/products')}>
              Cancel
            </button>
            <button type="submit" className="admin-save-btn" disabled={submitting}>
              {submitting ? '⏳ Saving...' : '✅ Update Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AdminEditProduct
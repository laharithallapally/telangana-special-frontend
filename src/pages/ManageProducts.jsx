import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editProduct, setEditProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: '', description: '', price: '',
    image: '', category: '', stock: '', available: true
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm({ ...form, [e.target.name]: value })
  }

  const openAddForm = () => {
    setEditProduct(null)
    setForm({ name: '', description: '', price: '', image: '', category: '', stock: '', available: true })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const openEditForm = (product) => {
    setEditProduct(product)
    setForm({
      name: product.name,
      description: product.description || '',
      price: product.price,
      image: product.image || '',
      category: product.category || '',
      stock: product.stock,
      available: product.available ?? true
    })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      if (editProduct) {
        await api.put(`/products/${editProduct.id}`, {
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock)
        })
        alert('✅ Product updated!')
      } else {
        await api.post('/products', {
          ...form,
          price: parseFloat(form.price),
          stock: parseInt(form.stock)
        })
        alert('✅ Product added!')
      }
      setShowForm(false)
      setEditProduct(null)
      loadProducts()
    } catch (err) {
      if (err.response?.status === 403) {
        alert('❌ Access denied! Login as Admin.')
      } else {
        alert('❌ Failed! ' + (err.response?.data?.message || 'Something went wrong'))
      }
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete "${name}"?`)) return;
    try {
      await api.delete(`/products/${id}`);
      alert('✅ Product deleted!')
      loadProducts();
    } catch (error) {
      console.error(error);
      alert("❌ Failed to delete product");
    }
  };

  return (
    <div className="admin-container">

      {/* Header */}
      <div className="admin-page-header">
        <h2>🛍️ Manage Products</h2>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <span style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>
            {products.length} products
          </span>
          <button className="admin-add-btn" onClick={openAddForm}>
            + Add Product
          </button>
        </div>
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <div className="admin-form-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <h3 style={{ margin: 0 }}>
              {editProduct ? `✏️ Edit: ${editProduct.name}` : '➕ Add New Product'}
            </h3>
            <button
              onClick={() => { setShowForm(false); setEditProduct(null) }}
              style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: '20px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="admin-form-grid">
              <div className="form-group">
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Product Name *</label>
                <input name="name" placeholder="e.g. Sarvapindi"
                  value={form.name} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Category *</label>
                <input name="category" placeholder="e.g. Snacks, Sweets"
                  value={form.category} onChange={handleChange} required />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Price (₹) *</label>
                <input name="price" type="number" placeholder="e.g. 50"
                  value={form.price} onChange={handleChange} required min="1" />
              </div>

              <div className="form-group">
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Stock *</label>
                <input name="stock" type="number" placeholder="e.g. 100"
                  value={form.stock} onChange={handleChange} required min="0" />
              </div>

              <div className="form-group" style={{ gridColumn: 'span 2' }}>
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Image URL</label>
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
                <label style={{ fontSize: '13px', color: 'var(--text-secondary)', marginBottom: '6px', display: 'block' }}>Description *</label>
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
                onClick={() => { setShowForm(false); setEditProduct(null) }}>
                Cancel
              </button>
              <button type="submit" className="admin-save-btn" disabled={submitting}>
                {submitting ? '⏳ Saving...' : editProduct ? '✅ Update Product' : '➕ Add Product'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-grid">
        {products.map((product) => (
          <div className="admin-product-card" key={product.id}>
            {product.image && product.image.trim() !== '' ? (
              <img
                src={product.image}
                alt={product.name}
                className="admin-product-image"
                onError={(e) => {
                  e.target.style.display = 'none'
                  e.target.nextSibling.style.display = 'flex'
                }}
              />
            ) : null}
            <div
              style={{
                display: product.image && product.image.trim() !== '' ? 'none' : 'flex',
                height: '200px', alignItems: 'center', justifyContent: 'center',
                fontSize: '64px', background: '#1e1e1e'
              }}
            >
              🍘
            </div>

            <div className="admin-product-info">
              <h3>{product.name}</h3>
              <p>{product.description}</p>
              <h4>₹{product.price}</h4>
              <span className={`status ${product.available ? "available" : "unavailable"}`}>
                {product.available ? "✅ Available" : "❌ Out Of Stock"}
              </span>

              <div className="admin-buttons">
                <button className="edit-btn" onClick={() => openEditForm(product)}>
                  ✏️ Edit
                </button>
                <button className="delete-btn" onClick={() => handleDelete(product.id, product.name)}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ManageProducts;
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";
import "./Products.css";

function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [addedItems, setAddedItems] = useState({});

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products");
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (productId, productName) => {
    const token = localStorage.getItem('token')
    if (!token) {
      alert('Please login first!')
      return
    }
    try {
      await api.post('/cart', { productId, quantity: 1 })
      // show added state on button
      setAddedItems(prev => ({ ...prev, [productId]: true }))
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [productId]: false }))
      }, 2000)
    } catch (error) {
      console.error('Add to cart error:', error)
      alert('Failed to add to cart!')
    }
  }

  // get unique categories
  const categories = ['All', ...new Set(products.map(p => p.category).filter(Boolean))]

  // filter products
  const filteredProducts = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase())
    const matchCategory = selectedCategory === 'All' || p.category === selectedCategory
    return matchSearch && matchCategory
  })

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading products...</p>
      </div>
    )
  }

  return (
    <div className="products-page">

      {/* Page Header */}
      <div className="products-header">
        <h1 className="page-title">🌶️ Telangana Special Products</h1>
        <p className="page-subtitle">Authentic homemade Telangana food products</p>
      </div>

      {/* Search and Filter */}
      <div className="products-toolbar">
        <div className="search-box">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="category-filters">
          {categories.map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="results-count">
        {filteredProducts.length} products found
      </div>

      {/* Products Grid */}
      {filteredProducts.length === 0 ? (
        <div className="empty-cart">
          <div style={{ fontSize: '48px' }}>😕</div>
          <h2>No products found!</h2>
          <p style={{ color: 'var(--text-secondary)' }}>
            Try searching with different keywords
          </p>
        </div>
      ) : (
        <div className="products-grid">
          {filteredProducts.map((product) => (
            <div className="product-card" key={product.id}>

              {/* Product Image */}
              <div className="product-img-wrapper">
                {product.image && product.image.trim() !== '' && !product.image.includes('example.com') ? (
                  <img
                    className="product-image"
                    src={product.image}
                    alt={product.name}
                    onError={(e) => {
                      e.target.style.display = 'none'
                      e.target.nextSibling.style.display = 'flex'
                    }}
                  />
                ) : null}
                <div
                  className="product-image-emoji"
                  style={{
                    display: product.image && product.image.trim() !== '' && !product.image.includes('example.com')
                      ? 'none' : 'flex'
                  }}
                >
                  🍘
                </div>

                {/* Category Badge on image */}
                <div className="img-category-badge">{product.category}</div>

                {/* Out of stock overlay */}
                {product.available === false && (
                  <div className="out-of-stock-overlay">Out of Stock</div>
                )}
              </div>

              {/* Product Content */}
              <div className="product-content">
                <h2 className="product-name">
                  <Link to={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                </h2>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-meta">
                  <span className="stock-info">📦 {product.stock} left</span>
                  <span className={product.available ? 'available-badge' : 'unavailable-badge'}>
                    {product.available ? '✅ Available' : '❌ Out of Stock'}
                  </span>
                </div>

                <div className="product-footer">
                  <span className="price">₹{product.price}</span>
                  <div className="product-actions">
                    <Link className="view-btn" to={`/products/${product.id}`}>
                      Details
                    </Link>
                    <button
                      className={`cart-btn ${addedItems[product.id] ? 'added' : ''}`}
                      onClick={() => addToCart(product.id, product.name)}
                      disabled={product.available === false}
                    >
                      {addedItems[product.id] ? '✅ Added!' : '🛒 Add'}
                    </button>
                  </div>
                </div>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Products;
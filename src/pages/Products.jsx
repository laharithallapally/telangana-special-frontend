import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import api from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";
import { buildWhatsAppLink, whatsAppOrderMessage } from "../utils/whatsapp";
import { flyToCart } from "../utils/flyToCart";
import "./Products.css";

function Products() {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All");
  const [addedItems, setAddedItems] = useState({});
  const [wishlistIds, setWishlistIds] = useState(new Set());
  const { showToast } = useToast();

  useEffect(() => {
    fetchProducts();
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    const token = localStorage.getItem('token')
    if (!token) return
    try {
      const res = await api.get('/wishlist')
      setWishlistIds(new Set(res.data.map(i => i.productId)))
    } catch (error) {
      console.error('Error fetching wishlist:', error)
    }
  }

  const toggleWishlist = async (productId) => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Please login first!', 'error')
      return
    }
    const isSaved = wishlistIds.has(productId)
    try {
      if (isSaved) {
        await api.delete(`/wishlist/${productId}`)
        setWishlistIds(prev => {
          const next = new Set(prev)
          next.delete(productId)
          return next
        })
        showToast('Removed from wishlist', 'info')
      } else {
        await api.post(`/wishlist/${productId}`)
        setWishlistIds(prev => new Set(prev).add(productId))
        showToast('Added to wishlist', 'success')
      }
    } catch (error) {
      console.error('Wishlist toggle error:', error)
      showToast('Failed to update wishlist', 'error')
    }
  }

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

  const addToCart = async (productId, productName, sourceEl) => {
    const token = localStorage.getItem('token')
    if (!token) {
      showToast('Please login first!', 'error')
      return
    }
    try {
      await api.post('/cart', { productId, quantity: 1 })
      flyToCart(sourceEl)
      // show added state on button
      setAddedItems(prev => ({ ...prev, [productId]: true }))
      showToast(`${productName} added to cart`, 'success')
      setTimeout(() => {
        setAddedItems(prev => ({ ...prev, [productId]: false }))
      }, 2000)
    } catch (error) {
      console.error('Add to cart error:', error)
      showToast('Failed to add to cart!', 'error')
    }
  }
const orderOnWhatsApp = (product) => {
    const link = buildWhatsAppLink(whatsAppOrderMessage(product, 1))
    window.open(link, '_blank', 'noopener,noreferrer')
  }

  // get unique categories

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

                {/* Wishlist heart toggle */}
                <button
                  onClick={(e) => { e.preventDefault(); toggleWishlist(product.id); }}
                  title={wishlistIds.has(product.id) ? "Remove from wishlist" : "Save to wishlist"}
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    border: "none",
                    background: "#fff",
                    boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "15px",
                    zIndex: 2,
                  }}
                >
                  {wishlistIds.has(product.id) ? "❤️" : "🤍"}
                </button>

                {/* Out of stock overlay */}
                {product.available === false && (
                  <div className="out-of-stock-overlay">Out of Stock</div>
                )}
              </div>

              {/* Product Content */}
              <div className="product-content">
                <h2 className="product-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span
                    className={`veg-indicator ${product.isVeg === false ? 'non-veg' : ''}`}
                    title={product.isVeg === false ? 'Non-Veg' : 'Veg'}
                  ></span>
                  <Link to={`/products/${product.id}`}>
                    {product.name}
                  </Link>
                </h2>

                <p className="product-description">
                  {product.description}
                </p>

                <div className="product-meta">
                  <span className={product.available ? 'available-badge' : 'unavailable-badge'}>
                    {product.available ? '✅ Available' : '❌ Out of Stock'}
                  </span>
                </div>

                {product.reviewCount > 0 ? (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    <span style={{ color: '#f5a623' }}>★</span> {product.averageRating.toFixed(1)} ({product.reviewCount})
                  </div>
                ) : (
                  <div style={{ fontSize: '13px', color: 'var(--text-secondary)', marginTop: '4px', opacity: 0.6 }}>
                    No reviews yet
                  </div>
                )}

                              </div>
                    <div className="product-footer">
                  <span className="price">₹{product.price}</span>
                  <div className="product-actions">
                    <Link className="view-btn" to={`/products/${product.id}`}>
                      Details
                    </Link>
                    <button
                      className={`cart-btn ${addedItems[product.id] ? 'added' : ''}`}
                      onClick={(e) => addToCart(product.id, product.name, e.currentTarget)}
                      disabled={product.available === false}
                    >
                      {addedItems[product.id] ? '✅ Added!' : '🛒 Add'}
                    </button>
                    <button
                      className="whatsapp-btn"
                      onClick={() => orderOnWhatsApp(product)}
                      disabled={product.available === false}
                      title={`Order ${product.name} on WhatsApp`}
                    >
                      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
                        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.67.79 1.96.93.29.14.48.21.55.33.07.12.07.68-.17 1.36z"/>
                      </svg>
                    </button>
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
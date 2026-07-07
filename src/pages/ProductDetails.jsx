import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);
  const [wishlistBusy, setWishlistBusy] = useState(false);

  useEffect(() => {
    fetchProduct();
    checkWishlist();
  }, [id]);

  const checkWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await api.get("/wishlist");
      setWishlisted(res.data.some((i) => String(i.productId) === String(id)));
    } catch (error) {
      console.error(error);
    }
  };

  const toggleWishlist = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first!", "error");
      return;
    }
    setWishlistBusy(true);
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${id}`);
        setWishlisted(false);
        showToast("Removed from wishlist", "info");
      } else {
        await api.post(`/wishlist/${id}`);
        setWishlisted(true);
        showToast("Added to wishlist", "success");
      }
    } catch (error) {
      console.error(error);
      showToast("Failed to update wishlist", "error");
    } finally {
      setWishlistBusy(false);
    }
  };

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setQuantity(1);
      setImageFailed(false);
    } catch (error) {
      console.error(error);
      showToast("Product not found", "error");
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first!", "error");
      navigate("/");
      return;
    }

    setAdding(true);
    try {
      await api.post("/cart", { productId: product.id, quantity });
      showToast(`${product.name} added to cart`, "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add to cart!", "error");
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading product...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="empty-cart">
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔍</div>
        <h2>Product not found</h2>
        <button onClick={() => navigate("/products")}>Browse Products</button>
      </div>
    );
  }

  const hasImage = product.image && product.image.trim() !== "" && !product.image.includes("example.com") && !imageFailed;
  const outOfStock = product.available === false;

  return (
    <div className="products-page" style={{ maxWidth: "1000px" }}>
      <p style={{ marginBottom: "20px" }}>
        <Link to="/products">← Back to Products</Link>
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 420px) 1fr",
          gap: "36px",
          alignItems: "flex-start",
        }}
        className="product-details-grid"
      >
        {/* Image */}
        <div className="product-card" style={{ overflow: "hidden" }}>
          {hasImage ? (
            <img
              className="product-image"
              src={product.image}
              alt={product.name}
              style={{ height: "340px" }}
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div className="product-image-emoji" style={{ height: "340px" }}>
              🍘
            </div>
          )}
        </div>

        {/* Info */}
        <div>
          <span className="category-badge">{product.category}</span>

          <h1 style={{ display: "flex", alignItems: "center", gap: "10px", margin: "10px 0" }}>
            <span
              className={`veg-indicator ${product.isVeg === false ? "non-veg" : ""}`}
              title={product.isVeg === false ? "Non-Veg" : "Veg"}
            ></span>
            {product.name}
          </h1>

          <p className="product-description" style={{ fontSize: "15px", marginBottom: "20px" }}>
            {product.description}
          </p>

          <div className="price" style={{ fontSize: "28px", marginBottom: "10px" }}>
            ₹{product.price}
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
            <span className={`status ${outOfStock ? "unavailable" : "available"}`}>
              {outOfStock ? "❌ Out of Stock" : "✅ Available"}
            </span>
          </div>

          {!outOfStock && (
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "24px" }}>
              <div className="quantity-control">
                <button onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <span>{quantity}</span>
                <button onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}>+</button>
              </div>
              <span style={{ color: "var(--text-secondary)", fontSize: "14px" }}>
                Total: ₹{(product.price * quantity).toFixed(2)}
              </span>
            </div>
          )}

          <div style={{ display: "flex", gap: "10px", maxWidth: "280px" }}>
            <button
              className="cart-btn"
              style={{ flex: 1, padding: "13px 0", fontSize: "15px" }}
              onClick={addToCart}
              disabled={adding || outOfStock}
            >
              {outOfStock ? "Out of Stock" : adding ? "Adding..." : "🛒 Add to Cart"}
            </button>

            <button
              onClick={toggleWishlist}
              disabled={wishlistBusy}
              title={wishlisted ? "Remove from wishlist" : "Save to wishlist"}
              style={{
                width: "48px",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                background: "var(--bg-card)",
                fontSize: "18px",
                cursor: "pointer",
              }}
            >
              {wishlisted ? "❤️" : "🤍"}
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          .product-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductDetails;
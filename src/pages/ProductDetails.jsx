import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";
import { buildWhatsAppLink, whatsAppOrderMessage } from "../utils/whatsapp";
import { flyToCart } from "../utils/flyToCart";

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

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [myRating, setMyRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [myComment, setMyComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);

  // WhatsApp button micro-interaction
  const [waBounce, setWaBounce] = useState(false);
  const waBtnRef = useRef(null);

  useEffect(() => {
    fetchProduct();
    checkWishlist();
    fetchReviews();
  }, [id]);

  const fetchReviews = async () => {
    setReviewsLoading(true);
    try {
      const res = await api.get(`/products/${id}/reviews`);
      setReviews(res.data);
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const myName = JSON.parse(storedUser).name;
        const mine = res.data.find((r) => r.userName === myName);
        if (mine) {
          setMyRating(mine.rating);
          setMyComment(mine.comment || "");
        }
      }
    } catch (error) {
      console.error("Error fetching reviews:", error);
    } finally {
      setReviewsLoading(false);
    }
  };

  const submitReview = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login to leave a review", "error");
      return;
    }
    if (myRating < 1) {
      showToast("Please select a star rating", "error");
      return;
    }
    setSubmittingReview(true);
    try {
      await api.post(`/products/${id}/reviews`, { rating: myRating, comment: myComment });
      showToast("Thanks for your review!", "success");
      await Promise.all([fetchReviews(), fetchProduct()]);
    } catch (error) {
      console.error("Error submitting review:", error);
      showToast("Failed to submit review", "error");
    } finally {
      setSubmittingReview(false);
    }
  };

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

  const addToCart = async (e) => {
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first!", "error");
      navigate("/");
      return;
    }

    setAdding(true);
    try {
      await api.post("/cart", { productId: product.id, quantity });
      flyToCart(e.currentTarget);
      showToast(`${product.name} added to cart`, "success");
    } catch (error) {
      console.error(error);
      showToast("Failed to add to cart!", "error");
    } finally {
      setAdding(false);
    }
  };

  const handleWhatsAppClick = async (e) => {
    e.preventDefault(); // hold off navigation so the animation is visible first

    setWaBounce(true);
    setTimeout(() => setWaBounce(false), 500);

    try {
      const confetti = (await import("canvas-confetti")).default;
      const rect = waBtnRef.current.getBoundingClientRect();
      confetti({
        particleCount: 60,
        spread: 55,
        startVelocity: 35,
        origin: {
          x: (rect.left + rect.width / 2) / window.innerWidth,
          y: (rect.top + rect.height / 2) / window.innerHeight,
        },
        colors: ["#25D366", "#E3A008", "#4A161A", "#F5EBD6"],
        scalar: 0.9,
        ticks: 120,
      });
    } catch (err) {
      console.error("Confetti failed to load:", err);
    }

    const link = buildWhatsAppLink(whatsAppOrderMessage(product, quantity));
    setTimeout(() => window.open(link, "_blank", "noopener,noreferrer"), 250);
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

          {product.reviewCount > 0 ? (
            <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", fontSize: "14px" }}>
              <span style={{ color: "#f5a623" }}>{"★".repeat(Math.round(product.averageRating))}</span>
              <span style={{ opacity: 0.35 }}>{"★".repeat(5 - Math.round(product.averageRating))}</span>
              {" "}{product.averageRating.toFixed(1)} · {product.reviewCount} review{product.reviewCount === 1 ? "" : "s"}
            </p>
          ) : (
            <p style={{ margin: "0 0 14px", color: "var(--text-secondary)", fontSize: "14px" }}>
              No reviews yet — be the first!
            </p>
          )}

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

          {!outOfStock && (
            <a
              ref={waBtnRef}
              href={buildWhatsAppLink(whatsAppOrderMessage(product, quantity))}
              onClick={handleWhatsAppClick}
              target="_blank"
              rel="noopener noreferrer"
              className={waBounce ? "wa-bounce" : ""}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                maxWidth: "280px",
                marginTop: "10px",
                padding: "12px 0",
                background: "#25D366",
                color: "#fff",
                borderRadius: "8px",
                fontSize: "15px",
                fontWeight: "600",
                textDecoration: "none",
              }}
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.67.79 1.96.93.29.14.48.21.55.33.07.12.07.68-.17 1.36z"/>
              </svg>
              Order {quantity > 1 ? `${quantity} ` : ''}on WhatsApp
            </a>
          )}
        </div>
      </div>

      {/* Ratings & Reviews */}
      <div style={{ marginTop: "48px", maxWidth: "700px" }}>
        <h2 style={{ marginBottom: "18px" }}>Ratings &amp; Reviews</h2>

        {/* Write a review */}
        <div className="product-card" style={{ padding: "20px", marginBottom: "24px" }}>
          <p style={{ marginBottom: "10px", fontWeight: 600 }}>
            {myRating > 0 ? "Update your review" : "Write a review"}
          </p>
          <div style={{ marginBottom: "12px" }}>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setMyRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                style={{
                  cursor: "pointer",
                  fontSize: "26px",
                  color: (hoverRating || myRating) >= star ? "#f5a623" : "var(--border)",
                  marginRight: "4px",
                }}
              >
                ★
              </span>
            ))}
          </div>
          <textarea
            placeholder="Share what you thought (optional)"
            value={myComment}
            onChange={(e) => setMyComment(e.target.value)}
            rows={3}
            style={{ width: "100%", marginBottom: "12px" }}
          />
          <button
            className="cart-btn"
            style={{ padding: "10px 20px" }}
            onClick={submitReview}
            disabled={submittingReview}
          >
            {submittingReview ? "Submitting..." : "Submit Review"}
          </button>
        </div>

        {/* Existing reviews */}
        {reviewsLoading ? (
          <p style={{ color: "var(--text-secondary)" }}>Loading reviews...</p>
        ) : reviews.length === 0 ? (
          <p style={{ color: "var(--text-secondary)" }}>No reviews yet for this product.</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {reviews.map((r) => (
              <div key={r.id} className="product-card" style={{ padding: "16px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <strong>{r.userName}</strong>
                  <span style={{ color: "#f5a623", fontSize: "14px" }}>
                    {"★".repeat(r.rating)}
                    <span style={{ opacity: 0.35 }}>{"★".repeat(5 - r.rating)}</span>
                  </span>
                </div>
                {r.comment && (
                  <p style={{ margin: 0, color: "var(--text-secondary)", fontSize: "14px" }}>{r.comment}</p>
                )}
                <p style={{ margin: "6px 0 0", fontSize: "12px", color: "var(--text-secondary)", opacity: 0.7 }}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 640px) {
          .product-details-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @keyframes wa-bounce {
          0%   { transform: scale(1); }
          30%  { transform: scale(0.92); }
          55%  { transform: scale(1.08); }
          80%  { transform: scale(0.98); }
          100% { transform: scale(1); }
        }
        .wa-bounce {
          animation: wa-bounce 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
      `}</style>
    </div>
  );
}

export default ProductDetails;
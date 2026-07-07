import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";

function Wishlist() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addedItems, setAddedItems] = useState({});
  const navigate = useNavigate();
  const { showToast } = useToast();

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const res = await api.get("/wishlist");
      setItems(res.data);
    } catch (error) {
      console.error("Error fetching wishlist:", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFromWishlist = async (productId) => {
    try {
      await api.delete(`/wishlist/${productId}`);
      setItems((prev) => prev.filter((i) => i.productId !== productId));
      showToast("Removed from wishlist", "info");
    } catch (error) {
      console.error(error);
      showToast("Failed to remove item", "error");
    }
  };

  const addToCart = async (productId, productName) => {
    try {
      await api.post("/cart", { productId, quantity: 1 });
      setAddedItems((prev) => ({ ...prev, [productId]: true }));
      showToast(`${productName} added to cart`, "success");
      setTimeout(() => {
        setAddedItems((prev) => ({ ...prev, [productId]: false }));
      }, 2000);
    } catch (error) {
      console.error(error);
      showToast("Failed to add to cart!", "error");
    }
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>Loading your wishlist...</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="empty-cart">
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>💔</div>
        <h2>Your wishlist is empty!</h2>
        <p style={{ color: "var(--text-secondary)", marginBottom: "20px" }}>
          Tap the heart on any item to save it here for later.
        </p>
        <button onClick={() => navigate("/products")}>Browse Products</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <div className="cart-header">
        <h2>My Wishlist ❤️</h2>
        <span className="orders-count">{items.length} items</span>
      </div>

      <div className="cart-items">
        {items.map((item) => {
          const outOfStock = item.available === false;
          return (
            <div key={item.id} className="cart-item">
              {item.image && item.image.trim() !== "" ? (
                <img src={item.productImage} alt={item.productName} />
              ) : (
                <div className="cart-item-emoji">🍘</div>
              )}

              <div className="cart-item-info">
                <h4 style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <span
                    className={`veg-indicator ${item.isVeg === false ? "non-veg" : ""}`}
                    title={item.isVeg === false ? "Non-Veg" : "Veg"}
                  ></span>
                  <Link to={`/products/${item.productId}`} style={{ color: "inherit" }}>
                    {item.productName}
                  </Link>
                </h4>
                <span>₹{item.price}</span>
                {outOfStock && (
                  <div style={{ color: "var(--danger)", fontSize: "12px", marginTop: "4px" }}>
                    Currently unavailable
                  </div>
                )}
              </div>

              <button
                className="cart-btn"
                style={{ minWidth: "110px" }}
                onClick={() => addToCart(item.productId, item.productName)}
                disabled={outOfStock}
              >
                {addedItems[item.productId] ? "✅ Added" : outOfStock ? "Unavailable" : "🛒 Add to Cart"}
              </button>

              <button
                className="remove-btn"
                onClick={() => removeFromWishlist(item.productId)}
                title="Remove from wishlist"
              >
                ✕
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Wishlist;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";
import { buildWhatsAppLink, whatsAppComboMessage } from "../utils/whatsapp";
import "./Combobuilder.css";

function ComboBuilder() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [plate, setPlate] = useState({}); // { [productId]: quantity }
  const [addingToCart, setAddingToCart] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  const categories = ["All", ...new Set(products.map((p) => p.category).filter(Boolean))];
  const visibleProducts = products.filter(
    (p) => selectedCategory === "All" || p.category === selectedCategory
  );

  const plateEntries = Object.entries(plate)
    .filter(([, qty]) => qty > 0)
    .map(([id, qty]) => {
      const product = products.find((p) => String(p.id) === String(id));
      return product ? { ...product, quantity: qty } : null;
    })
    .filter(Boolean);

  const totalItems = plateEntries.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = plateEntries.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const addOne = (product) => {
    if (product.available === false) return;
    setPlate((prev) => ({ ...prev, [product.id]: (prev[product.id] || 0) + 1 }));
  };

  const removeOne = (productId) => {
    setPlate((prev) => {
      const current = prev[productId] || 0;
      if (current <= 1) {
        const next = { ...prev };
        delete next[productId];
        return next;
      }
      return { ...prev, [productId]: current - 1 };
    });
  };

  const clearPlate = () => setPlate({});

  const encouragement =
    totalItems === 0
      ? "Tap items below to start building your plate"
      : totalItems < 3
      ? "Nice start! Add a couple more for a full plate 🍽️"
      : totalItems < 6
      ? "That's a proper Telangana spread! 🌶️"
      : "Now that's a feast! Perfect for sharing 🎉";

  const addPlateToCart = async () => {
    if (plateEntries.length === 0) return;
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first!", "error");
      navigate("/");
      return;
    }
    setAddingToCart(true);
    try {
      // The cart API takes one product at a time, so add each plate item in sequence.
      for (const item of plateEntries) {
        await api.post("/cart", { productId: item.id, quantity: item.quantity });
      }
      showToast("Your plate was added to cart!", "success");
      clearPlate();
      navigate("/cart");
    } catch (err) {
      console.error("Add combo to cart error:", err);
      showToast("Failed to add your plate to cart!", "error");
    } finally {
      setAddingToCart(false);
    }
  };

  const orderPlateOnWhatsApp = () => {
    if (plateEntries.length === 0) return;
    const message = whatsAppComboMessage(plateEntries, totalPrice);
    window.open(buildWhatsAppLink(message), "_blank", "noopener,noreferrer");
  };

  if (loading) {
    return (
      <div className="combo-page">
        <div className="combo-header">
          <h1 className="combo-title">🍽️ Build Your Own Plate</h1>
          <p className="combo-subtitle">Mix and match your favourites into one perfect combo</p>
        </div>
        <div className="combo-loading">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="combo-page">
      <div className="combo-header">
        <h1 className="combo-title">🍽️ Build Your Own Plate</h1>
        <p className="combo-subtitle">Mix and match your favourites into one perfect combo</p>
      </div>

      <div className="combo-layout">

        {/* ── Item picker ── */}
        <div className="combo-picker">
          <div className="combo-category-filters">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`combo-filter-btn ${selectedCategory === cat ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="combo-picker-grid">
            {visibleProducts.map((product) => {
              const qty = plate[product.id] || 0;
              const outOfStock = product.available === false;
              return (
                <div
                  key={product.id}
                  className={`combo-pick-card ${qty > 0 ? "in-plate" : ""} ${outOfStock ? "disabled" : ""}`}
                >
                  <div className="combo-pick-img-wrap">
                    {product.image && product.image.trim() !== "" && !product.image.includes("example.com") ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="combo-pick-emoji"
                      style={{
                        display:
                          product.image && product.image.trim() !== "" && !product.image.includes("example.com")
                            ? "none"
                            : "flex",
                      }}
                    >
                      🍘
                    </div>
                    {outOfStock && <div className="combo-pick-oos">Out of Stock</div>}
                  </div>

                  <div className="combo-pick-body">
                    <div className="combo-pick-name">{product.name}</div>
                    <div className="combo-pick-price">₹{product.price}</div>

                    {qty > 0 ? (
                      <div className="combo-pick-stepper">
                        <button onClick={() => removeOne(product.id)}>−</button>
                        <span>{qty}</span>
                        <button onClick={() => addOne(product)} disabled={outOfStock}>+</button>
                      </div>
                    ) : (
                      <button
                        className="combo-pick-add"
                        onClick={() => addOne(product)}
                        disabled={outOfStock}
                      >
                        + Add to Plate
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Plate summary ── */}
        <aside className="combo-plate-panel">
          <div className="combo-plate-visual">
            <div className={`combo-plate-circle ${totalItems > 0 ? "has-items" : ""}`}>
              {plateEntries.length === 0 ? (
                <span className="combo-plate-empty-icon">🍽️</span>
              ) : (
                <div className="combo-plate-chips">
                  {plateEntries.map((item) => (
                    <div className="combo-plate-chip" key={item.id} title={item.name}>
                      <span className="combo-plate-chip-emoji">🍘</span>
                      {item.quantity > 1 && <span className="combo-plate-chip-qty">{item.quantity}</span>}
                    </div>
                  ))}
                </div>
              )}
            </div>
            <p className="combo-encouragement">{encouragement}</p>
          </div>

          {plateEntries.length > 0 && (
            <div className="combo-plate-list">
              {plateEntries.map((item) => (
                <div className="combo-plate-list-row" key={item.id}>
                  <span className="combo-plate-list-name">{item.name}</span>
                  <div className="combo-plate-list-stepper">
                    <button onClick={() => removeOne(item.id)}>−</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => addOne(item)} disabled={item.available === false}>+</button>
                  </div>
                  <span className="combo-plate-list-price">₹{item.price * item.quantity}</span>
                </div>
              ))}
            </div>
          )}

          <div className="combo-plate-total">
            <span>Total ({totalItems} item{totalItems === 1 ? "" : "s"})</span>
            <strong>₹{totalPrice}</strong>
          </div>

          <button
            className="combo-cta-cart"
            onClick={addPlateToCart}
            disabled={plateEntries.length === 0 || addingToCart}
          >
            {addingToCart ? "Adding…" : "🛒 Add Plate to Cart"}
          </button>

          <button
            className="combo-cta-whatsapp"
            onClick={orderPlateOnWhatsApp}
            disabled={plateEntries.length === 0}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true">
              <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38a9.9 9.9 0 0 0 4.74 1.21h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.81-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.13-4.9-4.32-.14-.19-1.17-1.56-1.17-2.98 0-1.41.74-2.11 1-2.4.26-.29.57-.36.76-.36.19 0 .38 0 .55.01.18.01.41-.07.64.49.24.58.81 2 .88 2.14.07.15.12.32.02.51-.09.19-.14.31-.28.48-.14.17-.29.37-.42.5-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.29.14.46.12.63-.07.17-.19.72-.84.91-1.13.19-.29.38-.24.64-.14.26.09 1.67.79 1.96.93.29.14.48.21.55.33.07.12.07.68-.17 1.36z" />
            </svg>
            Order on WhatsApp
          </button>

          {plateEntries.length > 0 && (
            <button className="combo-clear-btn" onClick={clearPlate}>
              Clear plate
            </button>
          )}
        </aside>
      </div>
    </div>
  );
}

export default ComboBuilder;
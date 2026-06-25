import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const categories = [
    { emoji: "🍘", name: "Traditional Snacks", desc: "Sarvapindi, Vadalu & more" },
    { emoji: "🍬", name: "Sweets", desc: "Bobbatlu & Telangana sweets" },
    { emoji: "🌶️", name: "Pickles", desc: "Traditional homemade pickles" },
    { emoji: "🎨", name: "Handicrafts", desc: "Local artisan products" },
  ];

  return (
    <div className="home-page">

      {/* Welcome Banner */}
      {user ? (
        <div style={{
          background: "linear-gradient(135deg, #1a0050, #4a0080, #1a0050)",
          borderBottom: "2px solid #ff4500",
          padding: "18px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(255,69,0,0.2)"
        }}>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff" }}>
              🎉 Welcome back, <span style={{ color: "#ff4500" }}>{user.name}</span>!
            </div>
            <div style={{ fontSize: "14px", color: "#ccaaff", marginTop: "4px" }}>
              ✨ Explore today's fresh Telangana specials just for you
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: "linear-gradient(135deg, #0d0d0d, #1a0a00, #0d0d0d)",
          borderBottom: "2px solid #ff4500",
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          boxShadow: "0 4px 20px rgba(255,69,0,0.2)"
        }}>
          <div>
            <div style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginBottom: "6px" }}>
              🛍️ Taste the Soul of Telangana!
            </div>
            <div style={{ fontSize: "14px", color: "#ffaa80", marginTop: "4px" }}>
              🌟 Handpicked authentic products delivered to your door —{" "}
              <Link to="/register" style={{ color: "#ff4500", fontWeight: "700", textDecoration: "underline" }}>
                Create Free Account
              </Link>{" "}
              or{" "}
              <Link to="/" style={{ color: "#ff4500", fontWeight: "700", textDecoration: "underline" }}>
                Sign In
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">🌶️ Telangana Special</h1>
          <p className="hero-subtitle">Authentic Telangana Foods & Traditional Products</p>
          <div className="hero-buttons">
            <Link to="/products" className="hero-btn-primary">Shop Now →</Link>
            <Link to="/register" className="hero-btn-secondary">Join Us</Link>
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="features-strip">
        <div className="feature-item">🚚 <span>Free Delivery</span></div>
        <div className="feature-item">✅ <span>100% Authentic</span></div>
        <div className="feature-item">🔒 <span>Secure Payment</span></div>
        <div className="feature-item">↩️ <span>Easy Returns</span></div>
      </div>

      {/* Categories */}
      <div className="home-section">
        <h2 className="section-title">Popular Categories</h2>
        <p className="section-subtitle">Explore our wide range of authentic Telangana products</p>
        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link to="/products" key={index} className="category-card">
              <div className="category-emoji">{cat.emoji}</div>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Us */}
      <div className="home-section why-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🏡</div>
            <h3>Homemade Quality</h3>
            <p>Every product is made with traditional recipes passed down generations</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🌿</div>
            <h3>Natural Ingredients</h3>
            <p>No preservatives, no artificial colors — just pure natural goodness</p>
          </div>
          <div className="why-card">
            <div className="why-icon">❤️</div>
            <h3>Made with Love</h3>
            <p>Supporting local Telangana artisans and home chefs</p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="cta-section">
        <h2>Ready to taste authentic Telangana?</h2>
        <p>Join thousands of happy customers enjoying our products</p>
        <Link to="/products" className="hero-btn-primary">Browse Products →</Link>
      </div>

    </div>
  );
}

export default Home;

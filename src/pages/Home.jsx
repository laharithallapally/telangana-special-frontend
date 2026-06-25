import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const categories = [
    { emoji: "🍘", name: "Traditional Snacks", desc: "Sarvapindi, Vadalu & more", category: "Snacks" },
    { emoji: "🍬", name: "Sweets", desc: "Bobbatlu & Telangana sweets", category: "Sweets" },
    { emoji: "🌶️", name: "Pickles", desc: "Traditional homemade pickles", category: "Pickles" },
    { emoji: "🎨", name: "Handicrafts", desc: "Local artisan products", category: "Handicrafts" },
  ];

  return (
    <div className="home-page">

      {/* Welcome Message */}
      {user && (
        <div style={{
          background: "#1a1a1a",
          borderBottom: "1px solid #2a2a2a",
          padding: "12px 32px",
          fontSize: "15px",
          color: "#e0e0e0"
        }}>
          👋 Welcome back, <strong style={{ color: "#ff4500" }}>{user.name}</strong>!
        </div>
      )}

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            🌶️ Telangana Special
          </h1>
          <p className="hero-subtitle">
            Authentic Telangana Foods & Traditional Products
          </p>
          <div className="hero-buttons">
            <Link to="/products" className="hero-btn-primary">
              Shop Now →
            </Link>
            <Link to="/register" className="hero-btn-secondary">
              Join Us
            </Link>
          </div>
        </div>
      </div>

      {/* Features Strip */}
      <div className="features-strip">
        <div className="feature-item">
          🚚 <span>Free Delivery</span>
        </div>
        <div className="feature-item">
          ✅ <span>100% Authentic</span>
        </div>
        <div className="feature-item">
          🔒 <span>Secure Payment</span>
        </div>
        <div className="feature-item">
          ↩️ <span>Easy Returns</span>
        </div>
      </div>

      {/* Categories */}
      <div className="home-section">
        <h2 className="section-title">Popular Categories</h2>
        <p className="section-subtitle">
          Explore our wide range of authentic Telangana products
        </p>

        <div className="categories-grid">
          {categories.map((cat, index) => (
            <Link
              to="/products"
              key={index}
              className="category-card"
            >
              <div className="category-emoji">{cat.emoji}</div>
              <h3 className="category-name">{cat.name}</h3>
              <p className="category-desc">{cat.desc}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Why Us Section */}
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

      {/* CTA Section */}
      <div className="cta-section">
        <h2>Ready to taste authentic Telangana?</h2>
        <p>Join thousands of happy customers enjoying our products</p>
        <Link to="/products" className="hero-btn-primary">
          Browse Products →
        </Link>
      </div>

    </div>
  );
}

export default Home;

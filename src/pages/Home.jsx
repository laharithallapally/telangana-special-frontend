$content 
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
      {user ? (
        <div style={{ background:"#1a1a2e", borderBottom:"2px solid #ff4500", padding:"14px 32px", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          <div>
            <div style={{ fontSize:"20px", fontWeight:"800", color:"#ffffff" }}>
              🎉 Welcome back, <span style={{ color:"#ff4500" }}>{user.name}</span>!
            </div>
            <div style={{ fontSize:"13px", color:"#ccaaff", marginTop:"3px" }}>
              ✨ Explore today's fresh Telangana specials just for you
            </div>
          </div>
        </div>
      ) : (
        <div style={{ background:"#1a1a2e", borderBottom:"2px solid #ff4500", padding:"14px 32px", display:"flex", alignItems:"center", justifyContent:"center", textAlign:"center" }}>
          <div>
            <div style={{ fontSize:"20px", fontWeight:"800", color:"#ffffff" }}>
              🛍️ Taste the Soul of <span style={{ color:"#ff4500" }}>Telangana</span>!
            </div>
            <div style={{ fontSize:"13px", color:"#ffaa80", marginTop:"3px" }}>
              🌟 Handpicked authentic products —{" "}
              <Link to="/register" style={{ color:"#ff4500", fontWeight:"700", textDecoration:"underline" }}>Create Free Account</Link>{" "}
              or{" "}
              <Link to="/" style={{ color:"#ff4500", fontWeight:"700", textDecoration:"underline" }}>Sign In</Link>
            </div>
          </div>
        </div>
      )}

      <div style={{ position:"relative", width:"100%", height:"100vh", overflow:"hidden", display:"flex", alignItems:"center", justifyContent:"center" }}>
        <video autoPlay muted loop playsInline style={{ position:"absolute", top:"50%", left:"50%", transform:"translate(-50%,-50%)", minWidth:"100%", minHeight:"100%", objectFit:"cover", zIndex:0 }}>
          <source src="/food-video.mp4" type="video/mp4" />
        </video>
        <div style={{ position:"absolute", top:0, left:0, width:"100%", height:"100%", background:"rgba(0,0,0,0.5)", zIndex:1 }} />
        <div style={{ position:"relative", zIndex:2, textAlign:"center", padding:"0 24px", maxWidth:"700px" }}>
          <h1 style={{ fontSize:"clamp(36px,6vw,72px)", fontWeight:"900", color:"#ffffff", marginBottom:"16px", textShadow:"0 2px 20px rgba(0,0,0,0.5)" }}>
            🌶️ Telangana Special
          </h1>
          <p style={{ fontSize:"clamp(16px,2.5vw,22px)", color:"#f0f0f0", marginBottom:"36px", lineHeight:"1.6" }}>
            Authentic Telangana Foods & Traditional Products
          </p>
          <div style={{ display:"flex", gap:"16px", justifyContent:"center", flexWrap:"wrap" }}>
            <Link to="/products" style={{ background:"#ff4500", color:"#fff", padding:"16px 40px", borderRadius:"50px", fontWeight:"700", fontSize:"18px", textDecoration:"none", boxShadow:"0 4px 20px rgba(255,69,0,0.4)" }}>Shop Now →</Link>
            <Link to="/register" style={{ background:"rgba(255,255,255,0.15)", color:"#fff", padding:"16px 40px", borderRadius:"50px", fontWeight:"700", fontSize:"18px", textDecoration:"none", border:"2px solid rgba(255,255,255,0.6)" }}>Join Us</Link>
          </div>
        </div>
      </div>

      <div className="features-strip">
        <div className="feature-item">🚚 <span>Free Delivery</span></div>
        <div className="feature-item">✅ <span>100% Authentic</span></div>
        <div className="feature-item">🔒 <span>Secure Payment</span></div>
        <div className="feature-item">↩️ <span>Easy Returns</span></div>
      </div>

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

      <div className="home-section why-section">
        <h2 className="section-title">Why Choose Us?</h2>
        <div className="why-grid">
          <div className="why-card"><div className="why-icon">🏡</div><h3>Homemade Quality</h3><p>Traditional recipes passed down generations</p></div>
          <div className="why-card"><div className="why-icon">🌿</div><h3>Natural Ingredients</h3><p>No preservatives, no artificial colors</p></div>
          <div className="why-card"><div className="why-icon">❤️</div><h3>Made with Love</h3><p>Supporting local Telangana artisans</p></div>
        </div>
      </div>

      <div className="cta-section">
        <h2>Ready to taste authentic Telangana?</h2>
        <p>Join thousands of happy customers enjoying our products</p>
        <Link to="/products" className="hero-btn-primary">Browse Products →</Link>
      </div>
    </div>
  );
}

export default Home;

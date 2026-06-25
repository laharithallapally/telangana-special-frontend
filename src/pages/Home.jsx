bash

cat > /mnt/user-data/outputs/Home.jsx << 'EOF'
import { useState } from "react";
import { Link } from "react-router-dom";

function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const heroProducts = [
    { id: "blueberry", name: "Blueberry Bun", image: "/images/products/blueberry-bun.png", badgeColor: "#5b3a8e", position: "top-left" },
    { id: "maska", name: "Bun Maska", image: "/images/products/bun-maska.png", badgeColor: "#c98a2c", position: "bottom-left-1" },
    { id: "mango", name: "Mango Cream Bun", image: "/images/products/mango-cream-bun.png", badgeColor: "#b5631f", position: "bottom-left-2" },
    { id: "twister", name: "Potato Twister", image: "/images/products/potato-twister.png", badgeColor: "#c9831f", position: "right-1" },
    { id: "bobbatlu", name: "Bobbatlu", image: "/images/products/bobbatlu.png", badgeColor: "#5a3320", position: "bottom-right" },
    { id: "sarvapindi", name: "Sarvapindi", image: "/images/products/sarvapindi.png", badgeColor: "#3f6b2e", position: "right-2" },
  ];

  const bestSellers = [
    { name: "Bun Maska", price: 40, image: "/images/products/bun-maska.png" },
    { name: "Blueberry Bun", price: 70, image: "/images/products/blueberry-bun.png" },
    { name: "Mango Cream Bun", price: 70, image: "/images/products/mango-cream-bun.png" },
    { name: "Potato Twister", price: 80, image: "/images/products/potato-twister.png" },
    { name: "Bobbatlu", price: 60, image: "/images/products/bobbatlu.png" },
    { name: "Chocolate Bopatlu", price: 70, image: "/images/products/chocolate-bopatlu.png" },
    { name: "Sarvapindi", price: 60, image: "/images/products/sarvapindi.png" },
  ];

  const features = [
    { icon: "🌿", title: "100% Authentic", sub: "Traditional Recipes" },
    { icon: "🔥", title: "Made Fresh", sub: "Every Single Day" },
    { icon: "🚚", title: "Fast Delivery", sub: "On Time, Every Time" },
    { icon: "🛡️", title: "Safe & Secure", sub: "Hygienic & Trusted" },
    { icon: "❤️", title: "Made With Love", sub: "Just For You" },
  ];

  const [cart, setCart] = useState([]);

  const addToCart = (item) => setCart((prev) => [...prev, item]);

  return (
    <div className="home-page" style={{ background: "#fbf3e6" }}>

      {/* Top Navbar */}
      <nav style={{
        background: "#1a1410",
        padding: "16px 40px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        flexWrap: "wrap",
        gap: "16px",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "28px" }}>🏛️</span>
          <div>
            <div style={{ color: "#fff", fontWeight: "800", fontSize: "18px", lineHeight: "1.1" }}>
              TELANGANA <span style={{ color: "#e2632b" }}>SPECIAL</span>
            </div>
            <div style={{ color: "#c9b8a0", fontSize: "10px", letterSpacing: "0.5px" }}>
              STREET FOOD MADE WITH LOVE ♡
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "28px", flexWrap: "wrap" }}>
          <Link to="/" style={{ color: "#e2632b", fontWeight: "700", fontSize: "13px", textDecoration: "none" }}>HOME</Link>
          <Link to="/products" style={{ color: "#fff", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>MENU</Link>
          <Link to="/about" style={{ color: "#fff", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>OUR STORY</Link>
          <Link to="/franchise" style={{ color: "#fff", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>FRANCHISE</Link>
          <Link to="/locations" style={{ color: "#fff", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>LOCATIONS</Link>
          <Link to="/contact" style={{ color: "#fff", fontWeight: "600", fontSize: "13px", textDecoration: "none" }}>CONTACT</Link>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link to="/cart" style={{ position: "relative", color: "#fff", fontSize: "20px", textDecoration: "none" }}>
            🛒
            {cart.length > 0 && (
              <span style={{
                position: "absolute", top: "-8px", right: "-10px",
                background: "#e2632b", color: "#fff", borderRadius: "50%",
                fontSize: "11px", fontWeight: "700", width: "18px", height: "18px",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>{cart.length}</span>
            )}
          </Link>
          <Link to="/order" style={{
            background: "#e2632b", color: "#fff", padding: "10px 22px",
            borderRadius: "8px", fontWeight: "700", fontSize: "13px", textDecoration: "none",
          }}>ORDER NOW</Link>
        </div>
      </nav>

      {/* Welcome strip for logged-in/out users */}
      {!user && (
        <div style={{ background: "#241a12", padding: "8px 24px", textAlign: "center" }}>
          <span style={{ color: "#f0d8b8", fontSize: "13px" }}>
            🌟 New here?{" "}
            <Link to="/register" style={{ color: "#e2632b", fontWeight: "700", textDecoration: "underline" }}>Create a free account</Link>{" "}
            for faster checkout
          </span>
        </div>
      )}

      {/* HERO SECTION */}
      <div style={{
        position: "relative",
        width: "100%",
        height: "640px",
        overflow: "hidden",
        background: "#1a120a",
      }}>
        {/* Background video — 70% of the visual weight */}
        <video
          autoPlay
          muted
          loop
          playsInline
          style={{
            position: "absolute",
            top: 0, left: 0,
            width: "100%", height: "100%",
            objectFit: "cover",
            zIndex: 0,
          }}
        >
          <source src="/videos/street-food-cinematic.mp4" type="video/mp4" />
        </video>

        {/* Warm dark overlay so text stays readable */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(180deg, rgba(26,18,10,0.55) 0%, rgba(26,18,10,0.25) 45%, rgba(20,14,8,0.7) 100%)",
          zIndex: 1,
        }} />

        {/* Floating product cutouts — 30% of the visual weight */}
        <img src="/images/products/blueberry-bun.png" alt="Blueberry Bun" style={{
          position: "absolute", top: "8%", left: "2%", width: "230px", zIndex: 2,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))", animation: "floatA 4s ease-in-out infinite",
        }} />
        <img src="/images/products/bun-maska.png" alt="Bun Maska" style={{
          position: "absolute", bottom: "6%", left: "0%", width: "190px", zIndex: 2,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))", animation: "floatB 4.5s ease-in-out infinite",
        }} />
        <img src="/images/products/mango-cream-bun.png" alt="Mango Cream Bun" style={{
          position: "absolute", bottom: "4%", left: "16%", width: "190px", zIndex: 2,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))", animation: "floatA 5s ease-in-out infinite",
        }} />
        <img src="/images/products/potato-twister.png" alt="Potato Twister" style={{
          position: "absolute", top: "4%", right: "2%", width: "150px", zIndex: 2,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))", animation: "floatB 4.2s ease-in-out infinite",
        }} />
        <img src="/images/products/bobbatlu.png" alt="Bobbatlu" style={{
          position: "absolute", bottom: "8%", right: "20%", width: "200px", zIndex: 2,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))", animation: "floatA 4.8s ease-in-out infinite",
        }} />
        <img src="/images/products/sarvapindi.png" alt="Sarvapindi" style={{
          position: "absolute", bottom: "6%", right: "2%", width: "210px", zIndex: 2,
          filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.5))", animation: "floatB 5.2s ease-in-out infinite",
        }} />

        {/* Hero copy — centered */}
        <div style={{
          position: "relative", zIndex: 3,
          height: "100%",
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          textAlign: "center", padding: "0 20px",
        }}>
          <div style={{ color: "#f0d8b8", fontSize: "13px", letterSpacing: "2px", marginBottom: "14px" }}>
            AUTHENTIC • LOCAL • IRRESISTIBLE
          </div>
          <h1 style={{
            fontSize: "clamp(42px, 7vw, 84px)",
            fontWeight: "900",
            color: "#fbf3e6",
            margin: 0,
            lineHeight: "1.05",
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}>
            TELANGANA
          </h1>
          <h1 style={{
            fontSize: "clamp(42px, 7vw, 84px)",
            fontWeight: "900",
            color: "#e2632b",
            margin: "0 0 18px",
            lineHeight: "1.05",
            textShadow: "0 4px 24px rgba(0,0,0,0.6)",
          }}>
            SPECIAL
          </h1>
          <div style={{
            background: "rgba(251,243,230,0.95)",
            color: "#3a2a18",
            fontWeight: "700",
            fontSize: "14px",
            padding: "8px 20px",
            borderRadius: "30px",
            marginBottom: "24px",
          }}>
            Street Food Made With Love ♡
          </div>
          <Link to="/products" style={{
            background: "#e2632b",
            color: "#fff",
            padding: "16px 38px",
            borderRadius: "50px",
            fontWeight: "700",
            fontSize: "16px",
            textDecoration: "none",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            boxShadow: "0 8px 24px rgba(226,99,43,0.4)",
          }}>
            ORDER NOW →
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes floatA { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-14px); } }
        @keyframes floatB { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
      `}</style>

      {/* Features Strip */}
      <div style={{
        background: "#fbf3e6",
        padding: "28px 24px",
        display: "flex",
        justifyContent: "center",
        gap: "48px",
        flexWrap: "wrap",
        borderBottom: "1px solid #e8dcc4",
      }}>
        {features.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: "180px" }}>
            <span style={{ fontSize: "26px" }}>{f.icon}</span>
            <div>
              <div style={{ fontWeight: "700", fontSize: "14px", color: "#2c2418" }}>{f.title}</div>
              <div style={{ fontSize: "12px", color: "#6b5d48" }}>{f.sub}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Best Sellers */}
      <div style={{ padding: "48px 40px", background: "#fbf3e6" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "24px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ color: "#e2632b", fontWeight: "700", fontSize: "13px", letterSpacing: "1px" }}>OUR FAVOURITES</div>
            <h2 style={{ fontSize: "32px", fontWeight: "900", color: "#2c2418", margin: "4px 0 0" }}>BEST SELLERS</h2>
          </div>
          <Link to="/products" style={{ color: "#e2632b", fontWeight: "700", fontSize: "14px", textDecoration: "none" }}>
            VIEW ALL MENU →
          </Link>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "20px",
        }}>
          {bestSellers.map((item, i) => (
            <div key={i} style={{
              background: "#ffffff",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid #eee0c8",
            }}>
              <div style={{ width: "100%", height: "140px", overflow: "hidden", background: "#f3e8d4" }}>
                <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "12px 14px" }}>
                <div style={{ fontWeight: "700", fontSize: "14px", color: "#2c2418", marginBottom: "8px" }}>
                  {item.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontWeight: "800", fontSize: "15px", color: "#2c2418" }}>₹{item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    style={{
                      background: "#e2632b",
                      color: "#fff",
                      border: "none",
                      borderRadius: "8px",
                      padding: "6px 14px",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                    }}
                  >
                    ADD +
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default Home;
import { Link } from "react-router-dom";

function AboutUs() {
  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "0 24px 80px" }}>
      <style>{`
        @media (max-width: 700px) {
          .story-hero { padding: 48px 20px !important; }
          .story-values { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <div
        className="story-hero"
        style={{
          background: "#2b2b2b",
          color: "#fff",
          borderRadius: "16px",
          padding: "64px 48px",
          margin: "40px 0 48px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#ff6b35", fontWeight: "700", letterSpacing: "2px", fontSize: "13px", marginBottom: "12px" }}>
          MADE WITH LOVE
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 44px)", fontWeight: "800", marginBottom: "16px" }}>
          Our Story
        </h1>
        <p style={{ fontSize: "16px", color: "#e0e0e0", maxWidth: "620px", margin: "0 auto", lineHeight: "1.7" }}>
          Telangana Special began with a simple idea — the snacks we grew up with deserve
          to be made the traditional way, and shared with anyone craving a taste of home.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "24px", marginBottom: "56px" }}>
        <p style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
          Telangana Special brings you the authentic taste of Telangana's rich culinary
          heritage — from the crispy Sarvapindi made with rice flour and peanuts, to the
          melt-in-your-mouth Bobbatlu. Every recipe has roots in kitchens near Hitech City,
          Madhapur, the kind of cooking passed down rather than written down.
        </p>
        <p style={{ fontSize: "16px", lineHeight: "1.8", color: "var(--text-secondary)" }}>
          We make everything fresh every single day — no preservatives, no shortcuts. Just
          pure love and traditional recipes passed down through generations, whether you're
          picking up an order near Madhapur Metro or having it delivered to your door.
        </p>
      </div>

      <div className="story-values" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "24px", marginBottom: "56px" }}>
        {[
          { icon: "🌾", title: "Authentic Recipes", text: "Traditional Telangana recipes, made the way they've always been made." },
          { icon: "🔥", title: "Made Fresh", text: "Nothing sits on a shelf — everything is prepared close to the day it's ordered." },
          { icon: "❤️", title: "Made With Care", text: "Small batches, real ingredients, and attention to the details that get skipped elsewhere." },
        ].map((v) => (
          <div
            key={v.title}
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: "14px",
              padding: "28px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "32px", marginBottom: "12px" }}>{v.icon}</div>
            <h3 style={{ fontSize: "17px", fontWeight: "700", marginBottom: "8px" }}>{v.title}</h3>
            <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: "1.6" }}>{v.text}</p>
          </div>
        ))}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link
          to="/products"
          style={{
            display: "inline-block",
            background: "var(--primary)",
            color: "#fff",
            fontWeight: "700",
            padding: "14px 32px",
            borderRadius: "8px",
            textDecoration: "none",
            fontSize: "15px",
          }}
        >
          Explore Our Menu →
        </Link>
      </div>
    </div>
  );
}

export default AboutUs;
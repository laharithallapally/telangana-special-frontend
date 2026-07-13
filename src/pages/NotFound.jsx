import { Link } from "react-router-dom";

function NotFound() {
  return (
    <div style={{
      minHeight: "70vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "40px 24px",
    }}>
      <div style={{ fontSize: "80px", lineHeight: 1, marginBottom: "8px" }}>🍘</div>

      <div style={{
        fontSize: "clamp(56px, 12vw, 96px)",
        fontWeight: "900",
        color: "var(--primary)",
        lineHeight: 1,
        marginBottom: "12px",
      }}>
        404
      </div>

      <h1 style={{ color: "var(--text)", fontSize: "clamp(18px,3vw,24px)", fontWeight: "700", margin: "0 0 8px" }}>
        This plate is empty
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "14px", maxWidth: "360px", margin: "0 0 28px", lineHeight: 1.6 }}>
        We couldn't find the page you were looking for. It may have moved, or the link might be broken.
      </p>

      <div style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
        <Link
          to="/home"
          style={{
            background: "var(--primary)",
            color: "#fff",
            padding: "12px 26px",
            borderRadius: "8px",
            fontWeight: "700",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Back to Home
        </Link>
        <Link
          to="/products"
          style={{
            background: "transparent",
            color: "var(--text)",
            border: "1px solid var(--border)",
            padding: "12px 26px",
            borderRadius: "8px",
            fontWeight: "600",
            fontSize: "14px",
            textDecoration: "none",
          }}
        >
          Browse Menu
        </Link>
      </div>
    </div>
  );
}

export default NotFound;
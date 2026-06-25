import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav style={{
      background: "#6a1b9a",
      padding: "15px 20px",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      position: "sticky",
      top: 0,
      zIndex: 1000,
      boxShadow: "0 3px 10px rgba(0,0,0,0.3)"
    }}>
      <div style={{ color: "white", fontWeight: "bold", fontSize: "20px" }}>
        🌶️ Telangana Special
      </div>

      <button onClick={() => setMenuOpen(!menuOpen)} style={{
        background: "none",
        border: "none",
        color: "white",
        fontSize: "28px",
        cursor: "pointer"
      }}>☰</button>

      {menuOpen && (
        <div style={{
          position: "absolute",
          top: "60px",
          left: 0,
          width: "100%",
          background: "#6a1b9a",
          display: "flex",
          flexDirection: "column",
          padding: "20px",
          gap: "16px",
          zIndex: 999,
          boxShadow: "0 4px 10px rgba(0,0,0,0.4)"
        }}>
          <Link to="/home" onClick={closeMenu} style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Home</Link>
          <Link to="/products" onClick={closeMenu} style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Products</Link>

          {!user ? (
            <>
              <Link to="/" onClick={closeMenu} style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Login</Link>
              <Link to="/register" onClick={closeMenu} style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>Register</Link>
            </>
          ) : (
            <>
              <Link to="/cart" onClick={closeMenu} style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>🛒 Cart</Link>
              <Link to="/orders" onClick={closeMenu} style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>📦 Orders</Link>
              {user.role === "ADMIN" && (
                <Link to="/admin" onClick={closeMenu} style={{ color: "white", textDecoration: "none", fontSize: "16px" }}>⚙️ Admin</Link>
              )}
              <button onClick={handleLogout} style={{
                background: "#e53935",
                color: "white",
                border: "none",
                padding: "10px",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "15px",
                textAlign: "left"
              }}>Logout</button>
            </>
          )}
        </div>
      )}
    </nav>
  );
}

export default Navbar;
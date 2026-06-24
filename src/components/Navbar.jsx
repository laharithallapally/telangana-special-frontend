import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="logo">
        🌶️ Telangana Special
      </div>

      {/* Mobile Menu Button */}
      <button
        className="menu-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </button>

      <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <Link to="/home" onClick={closeMenu}>
          Home
        </Link>

        <Link to="/products" onClick={closeMenu}>
          Products
        </Link>

        {!user ? (
          <>
            <Link to="/" onClick={closeMenu}>
              Login
            </Link>

            <Link to="/register" onClick={closeMenu}>
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/profile" onClick={closeMenu}>
              Profile
            </Link>

            <Link to="/cart" onClick={closeMenu}>
              🛒 Cart
            </Link>

            <Link to="/orders" onClick={closeMenu}>
              📦 Orders
            </Link>

            {/* Admin Link Only For ADMIN */}
            {user.role === "ADMIN" && (
              <Link to="/admin" onClick={closeMenu}>
                ⚙️ Admin
              </Link>
            )}

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import instagramIcon from "../assets/icons/instagram.png";
import whatsappIcon from "../assets/icons/whatsapp.png";

const NAV_LINKS = [
  { to: "/home",      label: "Home" },
  { to: "/products",  label: "Menu" },
  { to: "/about",     label: "Our Story" },
  { to: "/locations", label: "Locations" },
  { to: "/contact",   label: "Contact" },
];

function Navbar({ cartCount = 0 }) {
  const navigate  = useNavigate();
  const location  = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const handleLogout = () => {
    localStorage.clear();
    setMenuOpen(false);
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;
  const isHome   = location.pathname === "/home";

  return (
    <>
      <style>{`
        .ts-nav { transition: box-shadow 0.3s, background 0.3s; }
        .ts-navlink {
          position: relative;
          color: #3a1a00;
          font-size: 14px;
          font-weight: 500;
          text-decoration: none;
          padding-bottom: 4px;
          transition: color 0.2s;
          white-space: nowrap;
        }
        .ts-navlink::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 2px;
          background: #e2632b;
          transition: width 0.25s;
          border-radius: 2px;
        }
        .ts-navlink:hover { color: #e2632b !important; }
        .ts-navlink:hover::after { width: 100%; }
        .ts-navlink.active { color: #e2632b !important; font-weight: 700; }
        .ts-navlink.active::after { width: 100%; }

        /* mobile nav links in dark drawer */
        .ts-mlink {
          color: #fff;
          font-size: 18px;
          font-weight: 500;
          text-decoration: none;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.07);
          transition: color 0.2s;
          display: block;
        }
        .ts-mlink:hover, .ts-mlink.active { color: #e2632b; }

        .ts-order-btn { transition: background 0.2s, transform 0.15s; }
        .ts-order-btn:hover { background: #c9521e !important; transform: scale(1.03); }

        .ts-icon-btn { transition: transform 0.2s; display:flex; align-items:center; }
        .ts-icon-btn:hover { transform: scale(1.12); }

        @media (max-width: 900px) {
          .ts-desktop-links { display: none !important; }
          .ts-hamburger      { display: flex   !important; }
          .ts-desktop-right  { gap: 8px !important; }
          .ts-order-text     { display: none   !important; }
        }
        @media (min-width: 901px) {
          .ts-hamburger { display: none !important; }
        }
      `}</style>

      {/* ══════════════════════════════════════
          MAIN NAVBAR
      ══════════════════════════════════════ */}
      <nav className="ts-nav" style={{
        position: "sticky",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: "#fff",
        borderBottom: "1px solid rgba(226,99,43,0.15)",
        boxShadow: "0 2px 16px rgba(0,0,0,0.08)",
        padding: "0 40px",
        height: "68px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        gap: "24px",
        boxSizing: "border-box",
      }}>

        {/* ── LOGO ── */}
        <Link to="/home" style={{
          textDecoration: "none",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          flexShrink: 0,
        }}>
          <span style={{ fontSize: "30px", lineHeight: 1 }}>🏛️</span>
          <div style={{ lineHeight: 1.15 }}>
            <div style={{
              color: "#3a1a00",
              fontWeight: "900",
              fontSize: "15px",
              letterSpacing: "0.5px",
            }}>
              TELANGANA{" "}
              <span style={{ color: "#e2632b" }}>SPECIAL</span>
            </div>
            <div style={{
              color: "#e2632b",
              fontSize: "8.5px",
              letterSpacing: "1.5px",
              fontWeight: "600",
            }}>
              ♥ MADE WITH LOVE ♥
            </div>
          </div>
        </Link>

        {/* ── CENTER NAV LINKS ── */}
        <div className="ts-desktop-links" style={{
          display: "flex",
          alignItems: "center",
          gap: "28px",
          flex: 1,
          justifyContent: "center",
        }}>
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`ts-navlink${isActive(link.to) ? " active" : ""}`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* ── RIGHT SIDE ── */}
        <div className="ts-desktop-right" style={{
          display: "flex",
          alignItems: "center",
          gap: "14px",
          flexShrink: 0,
        }}>

          {/* WhatsApp */}
          <a href="https://wa.me/" target="_blank" rel="noreferrer" className="ts-icon-btn">
            <img src={whatsappIcon} alt="WhatsApp"
              style={{ width: "30px", height: "30px", objectFit: "contain" }} />
          </a>

          {/* Instagram */}
          <a href="https://instagram.com/" target="_blank" rel="noreferrer" className="ts-icon-btn">
            <img src={instagramIcon} alt="Instagram"
              style={{ width: "30px", height: "30px", objectFit: "contain" }} />
          </a>

          {/* Divider */}
          <div style={{ width: "1px", height: "28px", background: "rgba(0,0,0,0.1)" }} />

          {/* Cart */}
          {user && (
            <Link to="/cart" className="ts-icon-btn" style={{
              position: "relative",
              textDecoration: "none",
              fontSize: "22px",
              color: "#3a1a00",
            }}>
              🛒
              {cartCount > 0 && (
                <span style={{
                  position: "absolute",
                  top: "-7px", right: "-9px",
                  background: "#e2632b",
                  color: "#fff",
                  borderRadius: "50%",
                  fontSize: "9px",
                  fontWeight: "800",
                  width: "16px", height: "16px",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: "0 2px 6px rgba(226,99,43,0.5)",
                }}>{cartCount}</span>
              )}
            </Link>
          )}

          {/* Login / User info */}
          {!user ? (
            <>
              <Link to="/" style={{
                color: "#3a1a00",
                fontWeight: "600",
                fontSize: "13px",
                textDecoration: "none",
                border: "1.5px solid #3a1a00",
                padding: "7px 18px",
                borderRadius: "6px",
                transition: "all 0.2s",
              }}
                onMouseEnter={e => { e.target.style.background="#3a1a00"; e.target.style.color="#fff"; }}
                onMouseLeave={e => { e.target.style.background="transparent"; e.target.style.color="#3a1a00"; }}
              >Login</Link>

              <Link to="/register" className="ts-order-btn" style={{
                background: "#e2632b",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "13px",
                textDecoration: "none",
                letterSpacing: "0.3px",
              }}>Register</Link>
            </>
          ) : (
            <>
              {/* Admin badge */}
              {user.role === "ADMIN" && (
                <Link to="/admin" style={{
                  background: "#3a1a00",
                  color: "#fff",
                  padding: "7px 14px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "700",
                  textDecoration: "none",
                  display: "flex", alignItems: "center", gap: "5px",
                }}>⚙️ <span className="ts-order-text">Admin</span></Link>
              )}

              {/* ORDER NOW */}
              <Link to="/products" className="ts-order-btn" style={{
                background: "#e2632b",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: "6px",
                fontWeight: "700",
                fontSize: "13px",
                textDecoration: "none",
                letterSpacing: "0.3px",
                whiteSpace: "nowrap",
              }}>ORDER NOW →</Link>

              {/* Logout */}
              <button onClick={handleLogout} style={{
                background: "none",
                border: "1.5px solid rgba(226,99,43,0.4)",
                color: "#e2632b",
                borderRadius: "6px",
                padding: "7px 14px",
                fontSize: "12px",
                fontWeight: "600",
                cursor: "pointer",
                transition: "all 0.2s",
                whiteSpace: "nowrap",
              }}
                onMouseEnter={e => e.currentTarget.style.background="#e2632b20"}
                onMouseLeave={e => e.currentTarget.style.background="none"}
              >Logout</button>
            </>
          )}

          {/* ── HAMBURGER ── */}
          <button
            className="ts-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              background: "none", border: "none",
              color: "#3a1a00", fontSize: "24px",
              cursor: "pointer", padding: "0",
              lineHeight: 1, display: "none",
            }}
          >{menuOpen ? "✕" : "☰"}</button>
        </div>
      </nav>

      {/* ══════════════════════════════════════
          MOBILE FULL-SCREEN DRAWER
      ══════════════════════════════════════ */}
      {menuOpen && (
        <div style={{
          position: "fixed",
          inset: 0,
          background: "#0e0703",
          zIndex: 1100,
          display: "flex",
          flexDirection: "column",
          padding: "72px 32px 32px",
          overflowY: "auto",
        }}>
          {/* Close */}
          <button onClick={() => setMenuOpen(false)} style={{
            position: "absolute", top: "20px", right: "24px",
            background: "none", border: "none",
            color: "#fff", fontSize: "26px", cursor: "pointer",
          }}>✕</button>

          {/* Logo */}
          <div style={{ marginBottom: "28px" }}>
            <div style={{ color: "#fff", fontWeight: "900", fontSize: "18px" }}>
              TELANGANA <span style={{ color: "#e2632b" }}>SPECIAL</span> ♥
            </div>
            <div style={{ color: "#c9a87c", fontSize: "10px", letterSpacing: "2px" }}>
              STREET FOOD MADE WITH LOVE
            </div>
          </div>

          <div style={{ height: "1px", background: "rgba(226,99,43,0.3)", marginBottom: "20px" }} />

          {/* Nav links */}
          {NAV_LINKS.map((link) => (
            <Link key={link.to} to={link.to}
              className={`ts-mlink${isActive(link.to) ? " active" : ""}`}
              onClick={() => setMenuOpen(false)}
            >{link.label}</Link>
          ))}

          <div style={{ height: "1px", background: "rgba(226,99,43,0.3)", margin: "16px 0" }} />

          {!user ? (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <Link to="/" onClick={() => setMenuOpen(false)} style={{
                color: "#fff", textDecoration: "none",
                fontSize: "16px", padding: "10px 0",
              }}>🔑 Login</Link>
              <Link to="/register" onClick={() => setMenuOpen(false)} style={{
                color: "#fff", textDecoration: "none",
                fontSize: "16px", padding: "10px 0",
              }}>📝 Register</Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <Link to="/cart" onClick={() => setMenuOpen(false)} style={{
                color: "#fff", textDecoration: "none",
                fontSize: "16px", padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}>🛒 Cart {cartCount > 0 && `(${cartCount})`}</Link>

              <Link to="/orders" onClick={() => setMenuOpen(false)} style={{
                color: "#fff", textDecoration: "none",
                fontSize: "16px", padding: "10px 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)",
              }}>📦 My Orders</Link>

              {user.role === "ADMIN" && (
                <Link to="/admin" onClick={() => setMenuOpen(false)} style={{
                  color: "#fff", textDecoration: "none",
                  fontSize: "16px", padding: "10px 0",
                  borderBottom: "1px solid rgba(255,255,255,0.07)",
                }}>⚙️ Admin Panel</Link>
              )}

              <button onClick={handleLogout} style={{
                marginTop: "12px",
                background: "#e2632b", color: "#fff",
                border: "none", borderRadius: "8px",
                padding: "14px 20px", fontSize: "15px",
                fontWeight: "700", cursor: "pointer", textAlign: "left",
              }}>Logout</button>
            </div>
          )}

          {/* Social */}
          <div style={{ display: "flex", gap: "16px", marginTop: "28px" }}>
            <a href="https://wa.me/" target="_blank" rel="noreferrer">
              <img src={whatsappIcon} alt="WhatsApp"
                style={{ width: "38px", height: "38px", objectFit: "contain" }} />
            </a>
            <a href="https://instagram.com/" target="_blank" rel="noreferrer">
              <img src={instagramIcon} alt="Instagram"
                style={{ width: "38px", height: "38px", objectFit: "contain" }} />
            </a>
          </div>
        </div>
      )}
    </>
  );
}

export default Navbar;

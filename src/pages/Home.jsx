import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import charminar from "../assets/charminar.png";
import heroSarvapindi from "../assets/hero-sarvapindi.png";

import bunMaskaCard from "../assets/products/bun-maska-card.png";
import potatoTwisterCard from "../assets/products/potato-twister-card.png";
import bobbatluCard from "../assets/products/bobbatlu-card.png";
import blueberryBunCard from "../assets/products/blueberry-bun-card.png";
import sarvapindiCard from "../assets/products/sarvapindi.png";

import bunMaska from "../assets/products/bun-maska.png";
import blueberryBun from "../assets/products/blueberry-bun.png";
import mangoCreamBun from "../assets/products/mango-cream-bun.png";
import potatoTwister from "../assets/products/potato-twister.png";
import bobbatlu from "../assets/products/bobbatlu.png";
import chocolateBobbatlu from "../assets/products/chocolate-bobbatlu.png";
import carrotBobbatlu from "../assets/products/carrot-bobbatlu.png";
import sarvapindi from "../assets/products/sarvapindi.png";

/* ── TERRACOTTA & CREAM PALETTE ──
  page bg:        #FFF8ED
  section alt bg: #FDF1DD
  cards:          #FFFFFF
  accent:         #D5652E  (terracotta)
  accent hover:   #B5501F
  heading text:   #3A2418  (deep maroon-brown)
  body/muted:     #8B6F52
  faint text:     #A88A68
  borders:        rgba(58,36,24,.12)
*/

const FEATURES = [
  { icon: "🌿", title: "100% AUTHENTIC",               sub: "Traditional Telangana Recipes" },
  { icon: "🔥", title: "MADE FRESH",                   sub: "Every Single Day" },
  { icon: "📍", title: "NEAR YOU",                     sub: "Hitech City, Madhapur Metro" },
  { icon: "🛵", title: "STREET FOOD AT YOUR DOORSTEP", sub: "Delivered Hot & Fast" },
  { icon: "❤️", title: "MADE WITH LOVE",               sub: "Just For You" },
];

const SPECIALITY_PRODUCTS = [
  { name: "Bun Maska",      tagline: "Soft. Warm. Irresistible.",    image: bunMaskaCard,      specialty: false },
  { name: "Potato Twister", tagline: "Crispy. Spicy. Addictive.",    image: potatoTwisterCard, specialty: false },
  { name: "Sarvapindi",     tagline: "Telangana's Timeless Classic.", image: heroSarvapindi,    specialty: true  },
  { name: "Bobbatlu",       tagline: "Sweet. Soft. Soulful.",        image: bobbatluCard,      specialty: false },
  { name: "Blueberry Bun",  tagline: "Sweet meets Street.",          image: blueberryBunCard,  specialty: false },
];

const BEST_SELLERS = [
  { name: "Bun Maska",          price: 40, image: bunMaska },
  { name: "Blueberry Bun",      price: 70, image: blueberryBun },
  { name: "Mango Cream Bun",    price: 70, image: mangoCreamBun },
  { name: "Potato Twister",     price: 80, image: potatoTwister },
  { name: "Bobbatlu",           price: 60, image: bobbatlu },
  { name: "Chocolate Bobbatlu", price: 70, image: chocolateBobbatlu },
  { name: "Carrot Bobbatlu",    price: 70, image: carrotBobbatlu },
  { name: "Sarvapindi",         price: 60, image: sarvapindi },
];

export default function Home() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const [cart, setCart]         = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart      = (item) => setCart((p) => [...p, item]);
  const toggleWishlist = (name) =>
    setWishlist((p) => p.includes(name) ? p.filter((n) => n !== name) : [...p, name]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div style={{ background: "#FFF8ED", fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes bounce {
          0%,100% { transform:translateX(-50%) translateY(0); }
          50%      { transform:translateX(-50%) translateY(8px); }
        }
        .ts-card { transition:transform .25s,box-shadow .25s; cursor:pointer; }
        .ts-card:hover { transform:translateY(-5px); box-shadow:0 14px 30px rgba(213,101,46,.18)!important; }
        .ts-add:hover  { background:#B5501F!important; }
        .ts-cta:hover  { background:#B5501F!important; transform:scale(1.03); }
        .ts-cta { transition:background .2s,transform .2s; }
        .ts-heart { transition:color .2s; }
        .ts-heart:hover { color:#D5652E!important; }
        .img-zoom { transition:transform .45s ease; }
        .img-zoom:hover { transform:scale(1.06); }

        @media (max-width:768px) {
          .hero-section { height:auto!important; min-height:100vh!important; padding:100px 0 40px!important; }
          .hero-copy  { padding-left:20px!important; padding-right:20px!important; }
          .hero-charminar { display:none!important; width:0!important; height:0!important; }
          .hero-food  { display:block!important; width:88%!important; max-width:340px!important;
                        position:relative!important; margin:24px auto 0!important;
                        right:auto!important; left:auto!important; top:auto!important; transform:none!important; }
          .hero-callout { position:relative!important; right:auto!important; bottom:auto!important;
                           margin:24px auto 0!important; width:fit-content!important; }
          .features-strip { gap:0!important; flex-direction:column!important; }
          .features-strip > div { border-right:none!important; border-bottom:1px solid rgba(58,36,24,.1)!important; width:100%!important; }
          .about-section { padding:48px 24px!important; min-height:auto!important; }
          .about-grid { flex-direction:column!important; }
          .about-imgs { flex-direction:row!important; gap:10px!important; }
          .about-imgs img { height:140px!important; }
          .products-grid { grid-template-columns:repeat(2,1fr)!important; }
          .bestsellers-grid { grid-template-columns:repeat(2,1fr)!important; }
          .footer-inner { flex-direction:column!important; text-align:center!important; gap:24px!important; }
          .footer-inner > div { text-align:center!important; align-items:center!important; }
        }
        @media (max-width:480px) {
          .products-grid  { grid-template-columns:1fr!important; }
          .bestsellers-grid { grid-template-columns:1fr!important; }
        }
      `}</style>

      {/* ═══════════════════════════════════
          HERO
      ═══════════════════════════════════ */}
      <div id="home" className="hero-section" style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: "560px",
        overflow: "hidden",
        background: "linear-gradient(120deg,#FFF8ED 0%,#FDECD2 55%,#FFF8ED 100%)",
        display: "flex",
        alignItems: "center",
        boxSizing: "border-box",
      }}>

        <div style={{
          position:"absolute",inset:0,zIndex:0,pointerEvents:"none",
          backgroundImage:"radial-gradient(circle,rgba(213,101,46,.08) 1px,transparent 1px)",
          backgroundSize:"30px 30px",
        }}/>

        <img
          src={charminar}
          alt="Charminar"
          className="hero-charminar"
          style={{
            position: "absolute",
            top: "2%",
            left: "-5%",
            height: "110%",
            width: "auto",
            maxWidth: "31%",
            objectFit: "contain",
            objectPosition: "top left",
            zIndex: 1,
            opacity: 0.85,
          }}
        />

        <img
          src={heroSarvapindi}
          alt="Sarvapindi"
          className="hero-food"
          style={{
            position: "absolute",
            right: "-65px",
            top: "-43px",
            width: "41%",
            height: "101%",
            objectFit: "cover",
            objectPosition: "left center",
            zIndex: 1,
            filter: "drop-shadow(-16px 0 30px rgba(58,36,24,.18))",
          }}
        />

        <div className="hero-callout" style={{
          position: "absolute",
          right: "0%",
          bottom: "0%",
          zIndex: 2,
          animation: "fadeUp .8s ease .5s both",
        }}>
          <div style={{
            background: "#D5652E",
            padding: "10px 22px 16px",
            borderRadius: "6px 6px 38px 6px",
            boxShadow: "0 8px 24px rgba(213,101,46,.28)",
            textAlign: "right",
          }}>
            <div style={{ color:"rgba(255,255,255,.8)", fontSize:"10px", letterSpacing:"2.5px", fontWeight:"700" }}>
              OUR SPECIALITY
            </div>
            <div style={{
              color: "#fff",
              fontSize: "clamp(20px,2.2vw,28px)",
              fontWeight: "900",
              fontStyle: "italic",
              fontFamily: "Georgia,serif",
              lineHeight: "1.1",
            }}>Sarvapindi ♥</div>
            <div style={{ color:"rgba(255,255,255,.85)", fontSize:"11px", marginTop:"3px" }}>
              A Timeless Telangana Classic
            </div>
          </div>
        </div>

        <div
          className="hero-copy"
          style={{
            position: "absolute",
            zIndex: 2,
            textAlign: "left",
            left: "22%",
            right: "31%",
            top: "42%",
            transform: "translateY(-50%)",
            padding: "0 24px",
            boxSizing: "border-box",
            animation: "fadeUp .7s ease .1s both",
          }}
        >
          <div style={{
            color: "#B5501F",
            fontSize: "11px",
            letterSpacing: "3px",
            fontWeight: "700",
            marginBottom: "14px",
          }}>
            AUTHENTIC STREET FOOD, MADE WITH LOVE ♥
          </div>

          <h1 style={{
            margin: "0 0 2px",
            lineHeight: "1.05",
            color: "#3A2418",
            fontWeight: "900",
            fontSize: "clamp(20px,3.2vw,46px)",
            textTransform: "uppercase",
            letterSpacing: "2px",
          }}>THE TRUE TASTE OF</h1>

          <h1 style={{
            margin: "0 0 28px",
            lineHeight: "1",
            fontWeight: "900",
            fontSize: "clamp(40px,7vw,90px)",
            fontStyle: "italic",
            fontFamily: "Georgia,serif",
            background: "linear-gradient(90deg,#D5652E 0%,#F0954D 50%,#D5652E 100%)",
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            animation: "shimmer 3s linear infinite",
            letterSpacing: "-1px",
          }}>TELANGANA</h1>

          <div style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "16px",
            background: "#fff",
            border: "1px solid rgba(58,36,24,.1)",
            borderRadius: "12px",
            padding: "11px 18px",
            marginBottom: "30px",
            boxShadow: "0 4px 16px rgba(58,36,24,.06)",
          }}>
            <div style={{
              background: "#D5652E",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              flexShrink: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
            }}>📍</div>
            <div style={{ textAlign: "left" }}>
              <div style={{ color:"#3A2418", fontWeight:"700", fontSize:"13px" }}>
                NEAR HITECH CITY, MADHAPUR METRO 🚇
              </div>
              <div style={{ color:"#8B6F52", fontSize:"11px" }}>Easy to reach. Impossible to forget!</div>
            </div>
          </div>

          <br/>
          <a href="#menu" onClick={scrollTo("menu")} className="ts-cta" style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            background: "#D5652E",
            color: "#fff",
            padding: "15px 38px",
            borderRadius: "8px",
            fontWeight: "800",
            fontSize: "14px",
            textDecoration: "none",
            letterSpacing: "1px",
            boxShadow: "0 8px 24px rgba(213,101,46,.3)",
          }}>EXPLORE OUR MENU →</a>
        </div>

        <a href="#about" onClick={scrollTo("about")} style={{
          position: "absolute",
          bottom: "28px",
          left: "50%",
          transform: "translateX(-50%)",
          background: "#fff",
          border: "1px solid rgba(58,36,24,.12)",
          borderRadius: "30px",
          padding: "10px 20px",
          color: "#D5652E",
          fontSize: "12px",
          fontWeight: "700",
          letterSpacing: "2px",
          cursor: "pointer",
          zIndex: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "4px",
          animation: "bounce 2s ease-in-out infinite",
          textDecoration: "none",
        }}>
          SCROLL DOWN
          <span style={{ fontSize:"16px", lineHeight:"1" }}>↓</span>
        </a>
      </div>

      {/* FEATURES STRIP */}
      <div className="features-strip" style={{
        background: "#FDF1DD",
        borderTop: "1px solid rgba(58,36,24,.08)",
        borderBottom: "1px solid rgba(58,36,24,.08)",
        padding: "18px 32px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
      }}>
        {FEATURES.map((f,i) => (
          <div key={i} style={{ display:"flex", alignItems:"center" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "10px 24px",
              borderRight: i < FEATURES.length-1 ? "1px solid rgba(58,36,24,.1)" : "none",
            }}>
              <span style={{ fontSize:"20px" }}>{f.icon}</span>
              <div>
                <div style={{ color:"#D5652E", fontWeight:"700", fontSize:"10px", letterSpacing:".5px" }}>{f.title}</div>
                <div style={{ color:"#A88A68", fontSize:"10px" }}>{f.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════
          ABOUT
      ═══════════════════════════════════ */}
      <div id="about" className="about-section" style={{
        background:"#FFF8ED",
        padding:"80px 64px",
        minHeight:"100vh",
        display:"flex",alignItems:"center",
        boxSizing:"border-box",
      }}>
        <div className="about-grid" style={{
          display: "flex",
          gap: "60px",
          alignItems: "center",
          width: "100%",
          flexWrap: "wrap",
        }}>

          <div style={{ flex:"1 1 320px", maxWidth:"500px" }}>
            <div style={{ color:"#D5652E", fontSize:"11px", letterSpacing:"3px", fontWeight:"700", marginBottom:"14px" }}>
              WHO WE ARE
            </div>
            <h2 style={{
              color: "#3A2418",
              fontWeight: "900",
              fontSize: "clamp(26px,3.5vw,46px)",
              lineHeight: "1.1",
              margin: "0 0 20px",
            }}>
              Straight from the{" "}
              <span style={{ color:"#D5652E", fontStyle:"italic", fontFamily:"Georgia,serif" }}>
                Streets of Telangana
              </span>
            </h2>
            <div style={{ width:"48px", height:"3px", background:"#D5652E", borderRadius:"2px", marginBottom:"24px" }}/>
            <p style={{ color:"#8B6F52", fontSize:"15px", lineHeight:"1.9", margin:"0 0 16px" }}>
              Telangana Special brings you the authentic taste of Telangana's rich culinary heritage.
              From the crispy <strong style={{ color:"#D5652E" }}>Sarvapindi</strong> made with rice flour
              and peanuts, to the melt-in-your-mouth <strong style={{ color:"#D5652E" }}>Bobbatlu</strong>
              — every bite carries decades of tradition.
            </p>
            <p style={{ color:"#8B6F52", fontSize:"15px", lineHeight:"1.9", margin:"0 0 30px" }}>
              Located near <strong style={{ color:"#3A2418" }}>Hitech City, Madhapur Metro</strong>,
              we make everything fresh every single day — no preservatives, no shortcuts.
              Just pure love and traditional recipes passed down through generations.
            </p>

            <div style={{ display:"flex", gap:"36px", flexWrap:"wrap", marginBottom:"36px" }}>
              {[
                { num:"8+",   label:"Signature Dishes" },
                { num:"100%", label:"Authentic Recipes" },
                { num:"500+", label:"Happy Customers" },
              ].map((s,i) => (
                <div key={i}>
                  <div style={{ color:"#D5652E", fontSize:"30px", fontWeight:"900", lineHeight:"1" }}>{s.num}</div>
                  <div style={{ color:"#A88A68", fontSize:"12px", marginTop:"4px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <a href="#menu" onClick={scrollTo("menu")} className="ts-cta" style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              background: "#D5652E",
              color: "#fff",
              padding: "13px 30px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "13px",
              textDecoration: "none",
              boxShadow: "0 6px 20px rgba(213,101,46,.25)",
            }}>ORDER NOW →</a>
          </div>

          <div style={{ flex:"1 1 280px", display:"flex", flexDirection:"column", gap:"16px" }}>
            <div
              className="about-img-wrap"
              style={{
                borderRadius: "16px",
                overflow: "hidden",
                border: "1px solid rgba(58,36,24,.1)",
                boxShadow: "0 10px 30px rgba(58,36,24,.1)",
                height: "460px",
              }}
            >
              <img
                src={heroSarvapindi}
                alt="Sarvapindi"
                className="img-zoom"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  objectPosition: "left center",
                }}
              />
            </div>

            <div style={{
              background: "#D5652E",
              padding: "12px 20px",
              borderRadius: "12px",
              textAlign: "center",
              boxShadow: "0 6px 18px rgba(213,101,46,.25)",
            }}>
              <div style={{ color:"rgba(255,255,255,.85)", fontSize:"10px", letterSpacing:"2px" }}>VISIT US</div>
              <div style={{
                color: "#fff",
                fontWeight: "800",
                fontSize: "14px",
                fontStyle: "italic",
                fontFamily: "Georgia,serif",
              }}>
                Hitech City, Madhapur Metro 📍
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════
          SPECIALITIES + BESTSELLERS (id="menu")
      ═══════════════════════════════════ */}
      <div id="menu" style={{ background:"#FDF1DD", padding:"72px 48px", minHeight:"auto" }}>
        <div style={{ textAlign:"center", marginBottom:"44px" }}>
          <div style={{ color:"#D5652E", fontSize:"11px", letterSpacing:"3px", fontWeight:"700", marginBottom:"8px" }}>
            STRAIGHT FROM THE STREETS OF TELANGANA
          </div>
          <h2 style={{ color:"#3A2418", fontWeight:"900", fontSize:"clamp(24px,3vw,38px)", margin:0 }}>
            Our Specialities
          </h2>
        </div>

        <div className="products-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
          gap: "20px",
        }}>
          {SPECIALITY_PRODUCTS.map((item,i) => (
            <div key={i} className="ts-card" style={{
              background: "#fff",
              borderRadius: "16px",
              overflow: "hidden",
              border: item.specialty ? "2px solid #D5652E" : "1px solid rgba(58,36,24,.08)",
              boxShadow: item.specialty ? "0 8px 24px rgba(213,101,46,.15)" : "0 2px 10px rgba(58,36,24,.06)",
              position: "relative",
            }}>
              {item.specialty && (
                <div style={{
                  position: "absolute",
                  top: "12px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  background: "#D5652E",
                  color: "#fff",
                  fontSize: "9px",
                  fontWeight: "800",
                  letterSpacing: "1.5px",
                  padding: "4px 12px",
                  borderRadius: "20px",
                  zIndex: 2,
                  whiteSpace: "nowrap",
                }}>OUR SPECIALITY</div>
              )}
              <div style={{ width:"100%", height:"180px", overflow:"hidden", background:"#FDF1DD" }}>
                <img src={item.image} alt={item.name}
                  className="img-zoom"
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                />
              </div>
              <div style={{ padding:"14px 16px 16px" }}>
                <div style={{ color:"#3A2418", fontWeight:"700", fontSize:"14px", marginBottom:"4px" }}>{item.name}</div>
                <div style={{ color:"#A88A68", fontSize:"11px", marginBottom:"12px" }}>{item.tagline}</div>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <a href="#menu" onClick={scrollTo("menu")} style={{ color:"#D5652E", fontSize:"12px", fontWeight:"700", textDecoration:"none" }}>
                    Order Now →
                  </a>
                  <button className="ts-heart" onClick={() => toggleWishlist(item.name)} style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "18px",
                    color: wishlist.includes(item.name) ? "#D5652E" : "#D9C6AC",
                  }}>♥</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ padding:"72px 48px", background:"#FFF8ED" }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "12px",
        }}>
          <div>
            <div style={{ color:"#D5652E", fontWeight:"700", fontSize:"11px", letterSpacing:"2px" }}>OUR FAVOURITES</div>
            <h2 style={{ fontSize:"clamp(22px,3vw,34px)", fontWeight:"900", color:"#3A2418", margin:"4px 0 0" }}>
              BEST SELLERS
            </h2>
          </div>
        </div>

        <div className="bestsellers-grid" style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: "18px",
        }}>
          {BEST_SELLERS.map((item,i) => (
            <div key={i} className="ts-card" style={{
              background: "#fff",
              borderRadius: "14px",
              overflow: "hidden",
              border: "1px solid rgba(58,36,24,.08)",
              boxShadow: "0 2px 10px rgba(58,36,24,.06)",
            }}>
              <div style={{ width:"100%", height:"148px", overflow:"hidden", background:"#FDF1DD" }}>
                <img src={item.image} alt={item.name}
                  className="img-zoom"
                  style={{ width:"100%", height:"100%", objectFit:"cover" }}
                />
              </div>
              <div style={{ padding:"12px 14px" }}>
                <div style={{ fontWeight:"700", fontSize:"14px", color:"#3A2418", marginBottom:"8px" }}>{item.name}</div>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontWeight:"800", fontSize:"15px", color:"#D5652E" }}>₹{item.price}</span>
                  <button className="ts-add" onClick={() => addToCart(item)} style={{
                    background: "#D5652E",
                    color: "#fff",
                    border: "none",
                    borderRadius: "8px",
                    padding: "6px 16px",
                    fontWeight: "700",
                    fontSize: "12px",
                    cursor: "pointer",
                    transition: "background .2s",
                  }}>ADD +</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
          FOOTER (id="visit")
      ═══════════════════════════════════ */}
      <footer id="visit" style={{ background:"#D5652E", position:"relative", overflow:"hidden" }}>

        <div className="footer-inner" style={{
          padding: "32px 48px",
          display: "flex",
          alignItems: "flex-start",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "28px",
          borderBottom: "1px solid rgba(255,255,255,.2)",
        }}>
          <div style={{
            position: "absolute",
            right: "120px",
            top: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            fontSize: "90px",
            opacity: .08,
            pointerEvents: "none",
            letterSpacing: "-10px",
          }}>🏛️🏛️🏛️</div>

          <div style={{ zIndex:1, maxWidth:"340px" }}>
            <div style={{ color:"rgba(255,255,255,.75)", fontSize:"10px", letterSpacing:"1.5px", marginBottom:"6px" }}>
              VISIT US
            </div>
            <div style={{ color:"#fff", fontWeight:"800", fontSize:"14px", lineHeight:"1.6" }}>
              Near Huda Techno Enclave, Madhapur,<br/>
              Near Hitech City, Near Ratnadeep Super Market,<br/>
              Hyderabad, Telangana - 500081
            </div>

            <div style={{ color:"rgba(255,255,255,.75)", fontSize:"10px", letterSpacing:"1.5px", marginTop:"16px", marginBottom:"6px" }}>
              TIMINGS
            </div>
            <div style={{ color:"#fff", fontWeight:"600", fontSize:"13px", lineHeight:"1.6" }}>
              Mon - Sat: 8:00 PM - 12:30 AM<br/>
              Sunday: 7:00 PM - 12:30 AM
            </div>
          </div>

          <div style={{
            color: "#fff",
            zIndex: 1,
            textAlign: "center",
            fontSize: "clamp(16px,2.2vw,24px)",
            fontWeight: "700",
            fontStyle: "italic",
            fontFamily: "Georgia,serif",
            alignSelf: "center",
          }}>
            Taste Telangana, Feel at Home. ♡
          </div>

          <div style={{ zIndex:1, maxWidth:"280px", textAlign:"right" }}>
            <div style={{ color:"rgba(255,255,255,.75)", fontSize:"10px", letterSpacing:"1.5px", marginBottom:"6px" }}>
              BULK ORDERS
            </div>
            <div style={{ color:"#fff", fontWeight:"600", fontSize:"13px", lineHeight:"1.6" }}>
              We prepare bulk & party orders fresh at home<br/>
              and deliver straight to your door.
            </div>
            <div style={{ color:"#fff", fontWeight:"800", fontSize:"14px", marginTop:"10px" }}>
              📞 +91 98765 43210
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(0,0,0,.15)",
          padding: "14px 48px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "8px",
        }}>
          <div style={{ color:"rgba(255,255,255,.75)", fontSize:"12px" }}>
            © 2026 Telangana Special. All rights reserved.
          </div>
          <div style={{ display:"flex", gap:"20px" }}>
            {["Privacy Policy","Terms of Service","Contact Us"].map((l,i) => (
              <span key={i} style={{ color:"rgba(255,255,255,.75)", fontSize:"12px", cursor:"pointer" }}>
                {l}
              </span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}

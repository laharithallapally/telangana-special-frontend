import { useState, useEffect, useRef, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";
import { useToast } from "../context/ToastContext";

import heroSarvapindi from "../assets/hero-sarvapindi.webp";
import sarvapindiPlate from "../assets/products/sarvapindi-plate.webp";

import bunMaskaCard from "../assets/products/bun-maska-card.webp";
import bunMaskaPlate from "../assets/products/bun-maska-plate.webp";
import potatoTwisterCard from "../assets/products/potato-twister-card.webp";
import potatoTwisterAction from "../assets/products/potato-twister-action.webp";
import bobbatluGhee from "../assets/products/bobbatlu-ghee.webp";
import blueberryBunCard from "../assets/products/blueberry-bun-card.webp";
import blueberryBunPlate from "../assets/products/blueberry-bun-plate.webp";

import bunMaska from "../assets/products/bun-maska.webp";
import blueberryBun from "../assets/products/blueberry-bun.webp";
import mangoCreamBun from "../assets/products/mango-cream-bun.webp";
import potatoTwister from "../assets/products/potato-twister.webp";
import bobbatlu from "../assets/products/bobbatlu.webp";
import chocolateBobbatlu from "../assets/products/chocolate-bobbatlu.webp";
import carrotBobbatlu from "../assets/products/carrot-bobbatlu.webp";
import sarvapindi from "../assets/products/sarvapindi.webp";
import { buildWhatsAppLink, whatsAppOrderMessage } from "../utils/whatsapp";
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

/* ─── HERO CAROUSEL SLIDES ───
   Each slide now shows a full-bleed HD background photo of the dish itself
   (instead of the old Charminar illustration), crossfading one into another.
   `focus` controls objectPosition per-slide so the subject isn't cropped out. */
const SLIDES = [
  {
    tag: "AUTHENTIC STREET FOOD, MADE WITH LOVE ♥",
    titleTop: "THE TRUE TASTE OF",
    titleMain: "TELANGANA",
    sub: "Crispy, spicy, soulful street food — delivered fresh, hot & fast from our kitchen straight to your door.",
    image: sarvapindiPlate,
    focus: "center 45%",
    effect: "slideRight",
    cta: "EXPLORE OUR MENU",
    badge: { label: "OUR SPECIALITY", title: "Sarvapindi ♥", sub: "A Timeless Telangana Classic" },
  },
  {
    tag: "SOFT. WARM. IRRESISTIBLE.",
    titleTop: "FRESH BAKED",
    titleMain: "BUN MASKA",
    sub: "Buttery soft buns served warm with a generous slab of maska — the classic Irani cafe favourite.",
    image: bunMaskaPlate,
    focus: "center center",
    layout: "containRight",
    effect: "slideRight",
    shine: true,
    cta: "ORDER NOW",
    badge: { label: "BEST SELLER", title: "Bun Maska ♥", sub: "Only ₹40 per plate" },
  },
  {
    tag: "SWEET. SOFT. SOULFUL.",
    titleTop: "FESTIVE FAVOURITE",
    titleMain: "BOBBATLU",
    sub: "Stuffed sweet flatbreads made the traditional way — a taste of every Telangana festival, any day of the year.",
    image: bobbatluGhee,
    focus: "center 35%",
    cta: "SHOP BOBBATLU",
    badge: { label: "TRENDING", title: "Bobbatlu ♥", sub: "Also try Chocolate & Carrot" },
  },
  {
    tag: "CRISPY. SPICY. ADDICTIVE.",
    titleTop: "STREET STYLE",
    titleMain: "POTATO TWISTER",
    sub: "Spiral-cut potatoes, deep fried golden and tossed in fiery masala — the ultimate street-side crunch.",
    image: potatoTwisterAction,
    focus: "center 40%",
    effect: "fallRoll",
    cta: "ORDER NOW",
    badge: { label: "MUST TRY", title: "Potato Twister ♥", sub: "Only ₹80 per stick" },
  },
  {
    tag: "SWEET MEETS STREET.",
    titleTop: "BAKERY FRESH",
    titleMain: "BLUEBERRY BUN",
    sub: "Soft milk bun loaded with real blueberry filling — a sweet surprise baked fresh every morning.",
    image: blueberryBunPlate,
    focus: "center 42%",
    effect: "blueberryFall",
    cta: "SHOP BAKERY",
    badge: { label: "NEW", title: "Blueberry Bun ♥", sub: "Only ₹70 per piece" },
  },
];

const FEATURES = [
  { icon: "🌿", title: "100% AUTHENTIC",               sub: "Traditional Telangana Recipes" },
  { icon: "🔥", title: "MADE FRESH",                   sub: "Every Single Day" },
  { icon: "📍", title: "NEAR YOU",                     sub: "Hitech City, Madhapur Metro" },
  { icon: "🛵", title: "STREET FOOD AT YOUR DOORSTEP", sub: "Delivered Hot & Fast" },
  { icon: "❤️", title: "MADE WITH LOVE",               sub: "Just For You" },
];

const SPECIALITY_PRODUCTS = [
  { name: "Bun Maska",      tagline: "Soft. Warm. Irresistible.",     image: bunMaskaCard,      specialty: false },
  { name: "Potato Twister", tagline: "Crispy. Spicy. Addictive.",     image: potatoTwisterCard, specialty: false },
  { name: "Sarvapindi",     tagline: "Telangana's Timeless Classic.", image: heroSarvapindi,    specialty: true  },
  { name: "Bobbatlu",       tagline: "Sweet. Soft. Soulful.",         image: bobbatluGhee,      specialty: false },
  { name: "Blueberry Bun",  tagline: "Sweet meets Street.",           image: blueberryBunCard,  specialty: false },
];

const FALLBACK_BEST_SELLERS = [
  { id: "fallback-1", name: "Bun Maska",          price: 40, image: bunMaska },
  { id: "fallback-2", name: "Blueberry Bun",      price: 70, image: blueberryBun },
  { id: "fallback-3", name: "Mango Cream Bun",    price: 70, image: mangoCreamBun },
  { id: "fallback-4", name: "Potato Twister",     price: 80, image: potatoTwister },
  { id: "fallback-5", name: "Bobbatlu",           price: 60, image: bobbatlu },
  { id: "fallback-6", name: "Chocolate Bobbatlu", price: 70, image: chocolateBobbatlu },
  { id: "fallback-7", name: "Carrot Bobbatlu",    price: 70, image: carrotBobbatlu },
  { id: "fallback-8", name: "Sarvapindi",         price: 60, image: sarvapindi },
];

const CATEGORY_ICONS = {
  Sweets: "🍬", Snacks: "🍟", Breakfast: "🍳", Beverages: "🥤", Bakery: "🥐",
  Curries: "🍛", Chats: "🥙", Desserts: "🍨", Combo: "🍱", Traditional: "🏺",
};
const CATEGORY_FALLBACK = [
  { name: "Sweets", icon: "🍬" }, { name: "Snacks", icon: "🍟" },
  { name: "Bakery", icon: "🥐" }, { name: "Traditional", icon: "🏺" },
  { name: "Beverages", icon: "🥤" }, { name: "Combo", icon: "🍱" },
];

const TESTIMONIALS = [
  { name: "Sindhu R.", area: "Madhapur", quote: "The Sarvapindi tastes exactly like my grandmother's — crispy on the outside, soft inside. Ordered thrice this month already!", stars: 5 },
  { name: "Karthik V.", area: "Hitech City", quote: "Bun Maska here is unreal. Soft, buttery, delivered still warm. My go-to evening snack now.", stars: 5 },
  { name: "Anitha M.", area: "Gachibowli", quote: "Booked bulk Bobbatlu for a family function — everyone asked where I got it from. Truly homemade taste.", stars: 4 },
];

/* ── AMBIENT FLOATING ICONS ──
   A quiet, persistent layer of drifting food emoji over the hero —
   independent of which slide is active, so the hero always feels alive. */
const AMBIENT_ICONS = [
  { icon: "🌶️", left: "3%",  top: "12%", size: "26px", delay: "0s",   duration: "7s" },
  { icon: "🫓", left: "9%",  top: "68%", size: "22px", delay: "1.4s", duration: "8.5s" },
  { icon: "🍯", left: "34%", top: "8%",  size: "20px", delay: "0.6s", duration: "6.5s" },
  { icon: "🧈", left: "64%", top: "6%",  size: "22px", delay: "2s",   duration: "7.5s" },
  { icon: "🥛", left: "88%", top: "14%", size: "24px", delay: "0.9s", duration: "9s" },
  { icon: "🌿", left: "93%", top: "60%", size: "20px", delay: "1.8s", duration: "6.8s" },
  { icon: "🍬", left: "20%", top: "82%", size: "20px", delay: "2.4s", duration: "8s" },
  { icon: "🥜", left: "80%", top: "80%", size: "20px", delay: "1.1s", duration: "7.2s" },
];

export default function Home() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [addedItems, setAddedItems] = useState({});
  const [slide, setSlide] = useState(0);
  const [testimonial, setTestimonial] = useState(0);
  const slideTimer = useRef(null);
  const aboutImgRef = useRef(null);
  const [aboutImgVisible, setAboutImgVisible] = useState(false);

  /* ── fetch live products so the homepage always mirrors the real menu ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await api.get("/products");
        if (!cancelled) setProducts(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        if (!cancelled) setLoadingProducts(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  /* ── hero autoplay ── */
  useEffect(() => {
    slideTimer.current = setInterval(() => {
      setSlide((s) => (s + 1) % SLIDES.length);
    }, 5000);
    return () => clearInterval(slideTimer.current);
  }, []);

  const goToSlide = useCallback((i) => {
    clearInterval(slideTimer.current);
    setSlide(i);
    slideTimer.current = setInterval(() => setSlide((s) => (s + 1) % SLIDES.length), 5000);
  }, []);

  /* ── testimonial autoplay ── */
  useEffect(() => {
    const t = setInterval(() => setTestimonial((s) => (s + 1) % TESTIMONIALS.length), 4500);
    return () => clearInterval(t);
  }, []);

  /* ── reveal the About section photo with a slide-in-from-right once it scrolls into view ── */
  useEffect(() => {
    const node = aboutImgRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setAboutImgVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const toggleWishlist = (name) =>
    setWishlist((p) => p.includes(name) ? p.filter((n) => n !== name) : [...p, name]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const addToCart = async (product) => {
    if (typeof product.id !== "number" && !String(product.id).match(/^[0-9a-f]{8,}/i) && String(product.id).startsWith("fallback")) {
      // demo/fallback item — no real backend id to add
      showToast(`${product.name} added to cart`, "success");
      return;
    }
    const token = localStorage.getItem("token");
    if (!token) {
      showToast("Please login first!", "error");
      navigate("/");
      return;
    }
    try {
      await api.post("/cart", { productId: product.id, quantity: 1 });
      setAddedItems((p) => ({ ...p, [product.id]: true }));
      showToast(`${product.name} added to cart`, "success");
      setTimeout(() => setAddedItems((p) => ({ ...p, [product.id]: false })), 2000);
    } catch (err) {
      console.error("Add to cart error:", err);
      showToast("Failed to add to cart!", "error");
    }
  };

  const liveCategories = [...new Set(products.map((p) => p.category).filter(Boolean))]
    .map((name) => ({ name, icon: CATEGORY_ICONS[name] || "🍽️" }));
  const categories = liveCategories.length ? liveCategories : CATEGORY_FALLBACK;

  const bestSellers = products.length ? products.slice(0, 8) : FALLBACK_BEST_SELLERS;
  // Today's Special — rotates automatically based on the date, no admin needed
  const specialPool = products.length ? products : FALLBACK_BEST_SELLERS;
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000
  );
  const todaysSpecial = specialPool.length
    ? specialPool[dayOfYear % specialPool.length]
    : null;

  const goToCategory = (name) => navigate(`/products?category=${encodeURIComponent(name)}`);

  return (
    <div style={{ background: "#FFF8ED", fontFamily: "'Segoe UI', sans-serif", overflowX: "hidden" }}>

      <style>{`
        @keyframes shimmer { 0% { background-position:-200% center; } 100% { background-position:200% center; } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(28px); } to { opacity:1; transform:translateY(0); } }
        @keyframes heroKenBurns { 0% { transform:scale(1); } 100% { transform:scale(1.04); } }
        @keyframes heroFallRoll {
          0%   { transform:translateY(-60%) rotate(-1080deg) scale(1.06); opacity:0; }
          8%   { opacity:1; }
          100% { transform:translateY(0) rotate(0deg) scale(1.06); opacity:1; }
        }
        @keyframes masalaFall {
          0%   { transform:translateY(-40px) translateX(0) rotate(0deg); opacity:0; }
          10%  { opacity:1; }
          85%  { opacity:1; }
          100% { transform:translateY(340px) translateX(var(--drift,0px)) rotate(140deg); opacity:0; }
        }
        .hero-bg-img.effect-fall.active { animation:heroFallRoll 3.4s cubic-bezier(.13,.7,.24,1) both; }
        @keyframes heroSlideRight {
          0%   { transform:translateX(38%) scale(1.08); opacity:0; }
          100% { transform:translateX(0) scale(1.06); opacity:1; }
        }
        .hero-bg-img.effect-slide-right.active { animation:heroSlideRight 3.2s cubic-bezier(.16,.7,.2,1) both; }
        @keyframes shineSweep {
          0%   { transform:translateX(-60%) translateY(-10%) rotate(18deg); opacity:0; }
          15%  { opacity:.55; }
          50%  { opacity:.55; }
          70%  { opacity:0; }
          100% { transform:translateX(140%) translateY(10%) rotate(18deg); opacity:0; }
        }
        .shine-sweep {
          position:absolute; top:-20%; left:-30%; width:55%; height:140%;
          background:linear-gradient(100deg, rgba(255,255,255,0) 30%, rgba(255,241,214,.9) 50%, rgba(255,255,255,0) 70%);
          mix-blend-mode:overlay; pointer-events:none;
          animation:shineSweep 4.5s ease-in-out infinite;
        }
        @keyframes blueberryFall {
          0%   { transform:translateY(-50px) translateX(0) rotate(0deg); opacity:0; }
          10%  { opacity:1; }
          80%  { opacity:1; }
          100% { transform:translateY(280px) translateX(var(--drift,0px)) rotate(200deg); opacity:0; }
        }
        .blueberry-particle {
          position:absolute; top:4%; left:50%; border-radius:50%;
          background:radial-gradient(circle at 32% 30%, #6E5BA8 0%, #3B2C63 55%, #241a42 100%);
          opacity:0; pointer-events:none;
          animation:blueberryFall 2.6s ease-in infinite both;
          box-shadow: inset -1px -1px 2px rgba(0,0,0,.4);
        }
        .masala-particle {
          position:absolute; top:10%; left:50%; width:5px; height:5px; border-radius:50%;
          background:#C1440E; opacity:0; pointer-events:none;
          animation:masalaFall 2.4s ease-in both;
        }
        .masala-crumb {
          position:absolute; top:10%; left:50%; border-radius:2px;
          background:#8A4A1E; opacity:0; pointer-events:none;
          animation:masalaFall 2.6s ease-in both;
        }
        @keyframes floatDrift {
          0%   { transform:translateY(0) rotate(0deg); opacity:.16; }
          50%  { transform:translateY(-22px) rotate(8deg); opacity:.34; }
          100% { transform:translateY(0) rotate(0deg); opacity:.16; }
        }
        .floating-icon {
          position:absolute; pointer-events:none;
          animation-name:floatDrift; animation-timing-function:ease-in-out; animation-iteration-count:infinite;
          filter:drop-shadow(0 4px 10px rgba(0,0,0,.3));
          will-change:transform;
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
        .about-img-reveal {
          opacity:0; transform:translateX(70px);
          transition:opacity 1s cubic-bezier(.16,.7,.2,1), transform 1s cubic-bezier(.16,.7,.2,1);
        }
        .about-img-reveal.in-view { opacity:1; transform:translateX(0); }
        .ts-cat:hover { transform:translateY(-4px); box-shadow:0 12px 26px rgba(213,101,46,.2)!important; border-color:#D5652E!important; }
        .ts-dot { transition:all .25s; cursor:pointer; }
        .ts-arrow { transition:background .2s,transform .2s; cursor:pointer; }
        .ts-arrow:hover { background:#D5652E!important; color:#fff!important; transform:translateY(-50%) scale(1.08); }
        .hero-bg-img { transition:opacity 1.4s ease-in-out; }
        .hero-bg-img.active { animation:heroKenBurns 12s ease-out forwards; }
        .ts-newsbtn:hover { background:#B5501F!important; }

        @media (max-width:768px) {
          .hero-carousel { height:auto!important; min-height:100vh!important; padding:100px 0 40px!important; }
          .hero-copy { position:relative!important; left:auto!important; right:auto!important; top:auto!important; transform:none!important; width:100%!important; padding-left:20px!important; padding-right:20px!important; box-sizing:border-box!important; margin-top:20px!important; text-align:center!important; }
          .hero-callout { position:relative!important; right:auto!important; bottom:auto!important; margin:24px auto 0!important; width:fit-content!important; }
          .hero-arrows { display:none!important; }
          .floating-icon { display:none!important; }
          .features-strip { gap:0!important; flex-direction:column!important; }
          .features-strip > div { border-right:none!important; border-bottom:1px solid rgba(58,36,24,.1)!important; width:100%!important; }
          .categories-row { grid-template-columns:repeat(3,1fr)!important; }
          .about-section { padding:48px 24px!important; min-height:auto!important; }
          .about-grid { flex-direction:column!important; }
          .about-imgs { flex-direction:row!important; gap:10px!important; }
          .about-imgs img { height:140px!important; }
          .products-grid { grid-template-columns:repeat(2,1fr)!important; }
          .bestsellers-grid { grid-template-columns:repeat(2,1fr)!important; }
          .testimonial-card { padding:28px 20px!important; }
          .newsletter-inner { flex-direction:column!important; text-align:center!important; }
          .newsletter-form { width:100%!important; flex-direction:column!important; }
          .newsletter-form input, .newsletter-form button { width:100%!important; }
          .footer-inner { flex-direction:column!important; text-align:center!important; gap:24px!important; }
          .footer-inner > div { text-align:center!important; align-items:center!important; }
        }
        @media (max-width:480px) {
          .products-grid  { grid-template-columns:1fr!important; }
          .bestsellers-grid { grid-template-columns:1fr!important; }
          .categories-row { grid-template-columns:repeat(2,1fr)!important; }
        }
      `}</style>

      {/* ═══════════════════════════════════
          HERO CAROUSEL — full-bleed HD dish photos crossfading one by one
      ═══════════════════════════════════ */}
      <div id="home" className="hero-carousel" style={{
        position: "relative", width: "100%", height: "100vh", minHeight: "560px",
        overflow: "hidden", display: "flex", alignItems: "center", boxSizing: "border-box",
        background: "#3A2418",
      }}>

        {/* full-bleed background photos, one floats in as the next fades out */}
        {SLIDES.map((s, i) =>
          s.layout === "containRight" ? (
            <div key={i} style={{ position: "absolute", inset: 0, opacity: i === slide ? 1 : 0, transition: "opacity 1.4s ease-in-out", zIndex: 0 }}>
              <img src={s.image} alt="" style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: s.focus || "center",
                filter: "blur(38px) brightness(.5) saturate(1.15)", transform: "scale(1.15)",
              }} />
              <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "flex-end", paddingRight: "2%", boxSizing: "border-box" }}>
                <img
                  src={s.image}
                  alt={s.titleMain}
                  className={`hero-bg-img${i === slide ? " active" : ""}${s.effect === "slideRight" ? " effect-slide-right" : ""}`}
                  style={{
                    maxHeight: "104%", maxWidth: "76%", objectFit: "contain",
                    borderRadius: "14px", boxShadow: "0 30px 70px rgba(0,0,0,.5)",
                  }}
                />
              </div>
            </div>
          ) : (
            <img
              key={i}
              src={s.image}
              alt={s.titleMain}
              className={`hero-bg-img${i === slide ? " active" : ""}${s.effect === "fallRoll" ? " effect-fall" : ""}${s.effect === "slideRight" ? " effect-slide-right" : ""}`}
              style={{
                position: "absolute", inset: 0, width: "100%", height: "100%",
                objectFit: "cover", objectPosition: s.focus || "center",
                opacity: i === slide ? 1 : 0,
                zIndex: 0,
              }}
            />
          )
        )}

        {/* darkening gradient so the white text stays readable over any photo */}
        <div style={{
          position: "absolute", inset: 0, zIndex: 1,
          background: "linear-gradient(100deg, rgba(20,12,7,.82) 0%, rgba(20,12,7,.55) 42%, rgba(20,12,7,.15) 70%, rgba(20,12,7,.35) 100%)",
        }} />

        {/* ambient floating food icons — always on, independent of active slide */}
        <div style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden", pointerEvents: "none" }}>
          {AMBIENT_ICONS.map((ic, idx) => (
            <span
              key={idx}
              className="floating-icon"
              style={{
                left: ic.left,
                top: ic.top,
                fontSize: ic.size,
                animationDelay: ic.delay,
                animationDuration: ic.duration,
              }}
            >
              {ic.icon}
            </span>
          ))}
        </div>

        {slide === SLIDES.findIndex((s) => s.shine) && (
          <div key={`shine-${slide}`} style={{
            position: "absolute", right: "2%", top: "0%", width: "76%", height: "100%",
            zIndex: 2, overflow: "hidden", pointerEvents: "none", borderRadius: "14px",
          }}>
            <div className="shine-sweep" />
          </div>
        )}

        {slide === SLIDES.findIndex((s) => s.effect === "blueberryFall") && (
          <div key={`blueberry-${slide}`} style={{
            position: "absolute", inset: 0,
            zIndex: 2, overflow: "hidden", pointerEvents: "none",
          }}>
            {[
              { left: "58%", delay: "0.2s", drift: "18px", size: 10 },
              { left: "64%", delay: "0.6s", drift: "-14px", size: 12 },
              { left: "70%", delay: "1.0s", drift: "22px", size: 9 },
              { left: "53%", delay: "0.9s", drift: "-20px", size: 11 },
              { left: "75%", delay: "1.4s", drift: "10px", size: 10 },
              { left: "60%", delay: "1.7s", drift: "-8px", size: 8 },
              { left: "48%", delay: "1.3s", drift: "16px", size: 11 },
              { left: "78%", delay: "2.0s", drift: "-18px", size: 9 },
              { left: "66%", delay: "2.3s", drift: "6px", size: 10 },
              { left: "56%", delay: "1.9s", drift: "-24px", size: 12 },
              { left: "72%", delay: "0.4s", drift: "12px", size: 9 },
              { left: "62%", delay: "1.1s", drift: "-10px", size: 11 },
            ].map((p, idx) => (
              <span key={idx} className="blueberry-particle" style={{
                left: p.left, animationDelay: p.delay, "--drift": p.drift,
                width: `${p.size}px`, height: `${p.size}px`,
              }} />
            ))}
          </div>
        )}

        {slide === SLIDES.findIndex((s) => s.effect === "fallRoll") && (
          <div key={`masala-${slide}`} style={{ position: "absolute", inset: 0, zIndex: 2, overflow: "hidden", pointerEvents: "none" }}>
            {[
              { left: "48%", delay: "3.1s", drift: "18px" },
              { left: "53%", delay: "3.2s", drift: "-14px" },
              { left: "58%", delay: "3.3s", drift: "22px" },
              { left: "44%", delay: "3.25s", drift: "-20px" },
              { left: "62%", delay: "3.4s", drift: "10px" },
              { left: "50%", delay: "3.5s", drift: "-8px" },
              { left: "40%", delay: "3.35s", drift: "16px" },
              { left: "66%", delay: "3.45s", drift: "-18px" },
              { left: "55%", delay: "3.6s", drift: "6px" },
              { left: "46%", delay: "3.55s", drift: "-24px" },
              { left: "60%", delay: "3.65s", drift: "14px" },
              { left: "51%", delay: "3.7s", drift: "-10px" },
              { left: "42%", delay: "3.8s", drift: "26px" },
              { left: "64%", delay: "3.9s", drift: "-16px" },
              { left: "38%", delay: "4.0s", drift: "12px" },
              { left: "68%", delay: "4.1s", drift: "-22px" },
              { left: "56%", delay: "4.2s", drift: "8px" },
              { left: "47%", delay: "4.3s", drift: "-12px" },
              { left: "61%", delay: "4.4s", drift: "18px" },
              { left: "43%", delay: "4.5s", drift: "-10px" },
            ].map((p, idx) => (
              <span key={idx} className="masala-particle" style={{
                left: p.left, animationDelay: p.delay, "--drift": p.drift,
                background: idx % 3 === 0 ? "#E08A2E" : "#C1440E",
              }} />
            ))}
            {[
              { left: "49%", delay: "3.5s", drift: "20px", size: 8 },
              { left: "57%", delay: "3.9s", drift: "-16px", size: 9 },
              { left: "45%", delay: "4.2s", drift: "24px", size: 7 },
              { left: "63%", delay: "4.5s", drift: "-14px", size: 8 },
              { left: "52%", delay: "4.7s", drift: "10px", size: 7 },
            ].map((p, idx) => (
              <span key={`crumb-${idx}`} className="masala-crumb" style={{
                left: p.left, animationDelay: p.delay, "--drift": p.drift,
                width: `${p.size}px`, height: `${p.size}px`,
                transform: `rotate(${idx * 23}deg)`,
              }} />
            ))}
          </div>
        )}

        {SLIDES.map((s, i) => (
          <div key={i} style={{ display: i === slide ? "contents" : "none" }}>
            <div className="hero-callout" style={{
              position: "absolute", right: "5%", bottom: "18%", zIndex: 3,
              animation: "fadeUp .8s ease .3s both",
            }}>
              <div style={{
                background: "#D5652E", padding: "10px 22px 16px", borderRadius: "6px 6px 38px 6px",
                boxShadow: "0 8px 24px rgba(0,0,0,.35)", textAlign: "right",
              }}>
                <div style={{ color: "rgba(255,255,255,.8)", fontSize: "10px", letterSpacing: "2.5px", fontWeight: "700" }}>
                  {s.badge.label}
                </div>
                <div style={{ color: "#fff", fontSize: "clamp(20px,2.2vw,28px)", fontWeight: "900", fontStyle: "italic", fontFamily: "Georgia,serif", lineHeight: "1.1" }}>
                  {s.badge.title}
                </div>
                <div style={{ color: "rgba(255,255,255,.85)", fontSize: "11px", marginTop: "3px" }}>
                  {s.badge.sub}
                </div>
              </div>
            </div>

            <div className="hero-copy" style={{
              position: "absolute", zIndex: 3, textAlign: "left", left: "7%", right: "38%",
              top: "42%", transform: "translateY(-50%)", padding: "0 24px", boxSizing: "border-box",
              animation: "fadeUp .7s ease .1s both",
            }}>
              <div style={{ color: "#F0954D", fontSize: "11px", letterSpacing: "3px", fontWeight: "700", marginBottom: "14px" }}>
                {s.tag}
              </div>
              <h1 style={{ margin: "0 0 2px", lineHeight: "1.05", color: "#fff", fontWeight: "900", fontSize: "clamp(20px,3.2vw,46px)", textTransform: "uppercase", letterSpacing: "2px", textShadow: "0 2px 18px rgba(0,0,0,.4)" }}>
                {s.titleTop}
              </h1>
              <h1 style={{
                margin: "0 0 20px", lineHeight: "1", fontWeight: "900", fontSize: "clamp(40px,7vw,90px)",
                fontStyle: "italic", fontFamily: "Georgia,serif",
                background: "linear-gradient(90deg,#F0954D 0%,#FFD9A8 50%,#F0954D 100%)",
                backgroundSize: "200% auto", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                backgroundClip: "text", animation: "shimmer 3s linear infinite", letterSpacing: "-1px",
                filter: "drop-shadow(0 4px 20px rgba(0,0,0,.35))",
              }}>{s.titleMain}</h1>

              <p style={{ color: "rgba(255,248,237,.88)", fontSize: "clamp(13px,1.3vw,15px)", lineHeight: "1.7", maxWidth: "440px", margin: "0 0 26px", textShadow: "0 1px 10px rgba(0,0,0,.35)" }}>
                {s.sub}
              </p>

              <a href="#menu" onClick={scrollTo("menu")} className="ts-cta" style={{
                display: "inline-flex", alignItems: "center", gap: "10px", background: "#D5652E", color: "#fff",
                padding: "15px 38px", borderRadius: "8px", fontWeight: "800", fontSize: "14px", textDecoration: "none",
                letterSpacing: "1px", boxShadow: "0 8px 24px rgba(0,0,0,.35)",
              }}>{s.cta} →</a>
            </div>
          </div>
        ))}

        {/* arrows */}
        <button className="ts-arrow hero-arrows" onClick={() => goToSlide((slide - 1 + SLIDES.length) % SLIDES.length)} style={{
          position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", zIndex: 4,
          width: "42px", height: "42px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.3)",
          background: "rgba(255,255,255,.14)", backdropFilter: "blur(6px)", color: "#fff", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,.25)",
        }}>‹</button>
        <button className="ts-arrow hero-arrows" onClick={() => goToSlide((slide + 1) % SLIDES.length)} style={{
          position: "absolute", right: "18px", top: "50%", transform: "translateY(-50%)", zIndex: 4,
          width: "42px", height: "42px", borderRadius: "50%", border: "1px solid rgba(255,255,255,.3)",
          background: "rgba(255,255,255,.14)", backdropFilter: "blur(6px)", color: "#fff", fontSize: "18px",
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(0,0,0,.25)",
        }}>›</button>

        {/* dots */}
        <div style={{ position: "absolute", bottom: "76px", left: "50%", transform: "translateX(-50%)", zIndex: 4, display: "flex", gap: "9px" }}>
          {SLIDES.map((_, i) => (
            <span key={i} className="ts-dot" onClick={() => goToSlide(i)} style={{
              width: i === slide ? "26px" : "9px", height: "9px", borderRadius: "5px",
              background: i === slide ? "#D5652E" : "rgba(255,255,255,.4)",
            }} />
          ))}
        </div>
      </div>

      {/* FEATURES STRIP */}
      <div className="features-strip" style={{
        background: "#FDF1DD", borderTop: "1px solid rgba(58,36,24,.08)", borderBottom: "1px solid rgba(58,36,24,.08)",
        padding: "18px 32px", display: "flex", justifyContent: "center", alignItems: "center", flexWrap: "wrap",
      }}>
        {FEATURES.map((f, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 24px", borderRight: i < FEATURES.length - 1 ? "1px solid rgba(58,36,24,.1)" : "none" }}>
              <span style={{ fontSize: "20px" }}>{f.icon}</span>
              <div>
                <div style={{ color: "#D5652E", fontWeight: "700", fontSize: "10px", letterSpacing: ".5px" }}>{f.title}</div>
                <div style={{ color: "#A88A68", fontSize: "10px" }}>{f.sub}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ═══════════════════════════════════
          SHOP BY CATEGORY
      ═══════════════════════════════════ */}
      <div style={{ padding: "64px 48px 8px", background: "#FFF8ED" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ color: "#D5652E", fontSize: "11px", letterSpacing: "3px", fontWeight: "700", marginBottom: "8px" }}>
            EXPLORE THE MENU
          </div>
          <h2 style={{ color: "#3A2418", fontWeight: "900", fontSize: "clamp(22px,3vw,34px)", margin: 0 }}>
            Shop by Category
          </h2>
        </div>

        <div className="categories-row" style={{
          display: "grid", gridTemplateColumns: "repeat(6,1fr)", gap: "18px", maxWidth: "1100px", margin: "0 auto",
        }}>
          {categories.map((cat, i) => (
            <div key={i} className="ts-card ts-cat" onClick={() => goToCategory(cat.name)} style={{
              background: "#fff", borderRadius: "16px", padding: "22px 12px", textAlign: "center",
              border: "1px solid rgba(58,36,24,.08)", boxShadow: "0 2px 10px rgba(58,36,24,.05)",
            }}>
              <div style={{
                width: "56px", height: "56px", borderRadius: "50%", background: "#FDF1DD", margin: "0 auto 10px",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px",
              }}>{cat.icon}</div>
              <div style={{ color: "#3A2418", fontWeight: "700", fontSize: "12.5px" }}>{cat.name}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
          ABOUT
      ═══════════════════════════════════ */}
      <div id="about" className="about-section" style={{
        background: "#FFF8ED", padding: "80px 64px", minHeight: "100vh", display: "flex", alignItems: "center", boxSizing: "border-box",
      }}>
        <div className="about-grid" style={{ display: "flex", gap: "60px", alignItems: "center", width: "100%", flexWrap: "wrap" }}>

          <div style={{ flex: "1 1 320px", maxWidth: "500px" }}>
            <div style={{ color: "#D5652E", fontSize: "11px", letterSpacing: "3px", fontWeight: "700", marginBottom: "14px" }}>
              WHO WE ARE
            </div>
            <h2 style={{ color: "#3A2418", fontWeight: "900", fontSize: "clamp(26px,3.5vw,46px)", lineHeight: "1.1", margin: "0 0 20px" }}>
              Straight from the{" "}
              <span style={{ color: "#D5652E", fontStyle: "italic", fontFamily: "Georgia,serif" }}>Streets of Telangana</span>
            </h2>
            <div style={{ width: "48px", height: "3px", background: "#D5652E", borderRadius: "2px", marginBottom: "24px" }} />
            <p style={{ color: "#8B6F52", fontSize: "15px", lineHeight: "1.9", margin: "0 0 16px" }}>
              Telangana Special brings you the authentic taste of Telangana's rich culinary heritage.
              From the crispy <strong style={{ color: "#D5652E" }}>Sarvapindi</strong> made with rice flour
              and peanuts, to the melt-in-your-mouth <strong style={{ color: "#D5652E" }}>Bobbatlu</strong>
              — every bite carries decades of tradition.
            </p>
            <p style={{ color: "#8B6F52", fontSize: "15px", lineHeight: "1.9", margin: "0 0 30px" }}>
              Located near <strong style={{ color: "#3A2418" }}>Hitech City, Madhapur Metro</strong>,
              we make everything fresh every single day — no preservatives, no shortcuts.
              Just pure love and traditional recipes passed down through generations.
            </p>

            <div style={{ display: "flex", gap: "36px", flexWrap: "wrap", marginBottom: "36px" }}>
              {[
                { num: "8+", label: "Signature Dishes" },
                { num: "100%", label: "Authentic Recipes" },
                { num: "500+", label: "Happy Customers" },
              ].map((s, i) => (
                <div key={i}>
                  <div style={{ color: "#D5652E", fontSize: "30px", fontWeight: "900", lineHeight: "1" }}>{s.num}</div>
                  <div style={{ color: "#A88A68", fontSize: "12px", marginTop: "4px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            <a href="#menu" onClick={scrollTo("menu")} className="ts-cta" style={{
              display: "inline-flex", alignItems: "center", gap: "8px", background: "#D5652E", color: "#fff",
              padding: "13px 30px", borderRadius: "8px", fontWeight: "700", fontSize: "13px", textDecoration: "none",
              boxShadow: "0 6px 20px rgba(213,101,46,.25)",
            }}>ORDER NOW →</a>
          </div>

          <div style={{ flex: "1 1 280px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <div
              ref={aboutImgRef}
              className={`about-img-wrap about-img-reveal${aboutImgVisible ? " in-view" : ""}`}
              style={{
                borderRadius: "16px", overflow: "hidden", border: "1px solid rgba(58,36,24,.1)",
                boxShadow: "0 10px 30px rgba(58,36,24,.1)", height: "460px",
              }}>
              <img src={sarvapindiPlate} alt="Sarvapindi" className="img-zoom" style={{
                width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 40%",
              }} />
            </div>

            <div style={{ background: "#D5652E", padding: "12px 20px", borderRadius: "12px", textAlign: "center", boxShadow: "0 6px 18px rgba(213,101,46,.25)" }}>
              <div style={{ color: "rgba(255,255,255,.85)", fontSize: "10px", letterSpacing: "2px" }}>VISIT US</div>
              <div style={{ color: "#fff", fontWeight: "800", fontSize: "14px", fontStyle: "italic", fontFamily: "Georgia,serif" }}>
                Hitech City, Madhapur Metro 📍
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ═══════════════════════════════════
          SPECIALITIES (id="menu")
      ═══════════════════════════════════ */}
      <div id="menu" style={{ background: "#FDF1DD", padding: "72px 48px", minHeight: "auto" }}>
        <div style={{ textAlign: "center", marginBottom: "44px" }}>
          <div style={{ color: "#D5652E", fontSize: "11px", letterSpacing: "3px", fontWeight: "700", marginBottom: "8px" }}>
            STRAIGHT FROM THE STREETS OF TELANGANA
          </div>
          <h2 style={{ color: "#3A2418", fontWeight: "900", fontSize: "clamp(24px,3vw,38px)", margin: 0 }}>
            Our Specialities
          </h2>
        </div>

        <div className="products-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "20px" }}>
          {SPECIALITY_PRODUCTS.map((item, i) => (
            <div key={i} className="ts-card" style={{
              background: "#fff", borderRadius: "16px", overflow: "hidden",
              border: item.specialty ? "2px solid #D5652E" : "1px solid rgba(58,36,24,.08)",
              boxShadow: item.specialty ? "0 8px 24px rgba(213,101,46,.15)" : "0 2px 10px rgba(58,36,24,.06)",
              position: "relative",
            }}>
              {item.specialty && (
                <div style={{
                  position: "absolute", top: "12px", left: "50%", transform: "translateX(-50%)",
                  background: "#D5652E", color: "#fff", fontSize: "9px", fontWeight: "800", letterSpacing: "1.5px",
                  padding: "4px 12px", borderRadius: "20px", zIndex: 2, whiteSpace: "nowrap",
                }}>OUR SPECIALITY</div>
              )}
              <div style={{ width: "100%", height: "180px", overflow: "hidden", background: "#FDF1DD" }}>
                <img src={item.image} alt={item.name} className="img-zoom" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
              <div style={{ padding: "14px 16px 16px" }}>
                <div style={{ color: "#3A2418", fontWeight: "700", fontSize: "14px", marginBottom: "4px" }}>{item.name}</div>
                <div style={{ color: "#A88A68", fontSize: "11px", marginBottom: "12px" }}>{item.tagline}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <a href="#bestsellers" onClick={scrollTo("bestsellers")} style={{ color: "#D5652E", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
                    Order Now →
                  </a>
                  <button className="ts-heart" onClick={() => toggleWishlist(item.name)} style={{
                    background: "transparent", border: "none", cursor: "pointer", fontSize: "18px",
                    color: wishlist.includes(item.name) ? "#D5652E" : "#D9C6AC",
                  }}>♥</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════
          BEST SELLERS / TRENDING (live data)
      ═══════════════════════════════════ */}
      <div id="bestsellers" style={{ padding: "72px 48px", background: "#FFF8ED" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "32px", flexWrap: "wrap", gap: "12px" }}>
          <div>
            <div style={{ color: "#D5652E", fontWeight: "700", fontSize: "11px", letterSpacing: "2px" }}>OUR FAVOURITES</div>
            <h2 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: "900", color: "#3A2418", margin: "4px 0 0" }}>
              BEST SELLERS
            </h2>
          </div>
          <Link to="/products" style={{ color: "#D5652E", fontWeight: "700", fontSize: "13px", textDecoration: "none" }}>
            View Full Menu →
          </Link>
        </div>

        {loadingProducts ? (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#A88A68" }}>Loading menu…</div>
        ) : (
          <div className="bestsellers-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: "18px" }}>
            {bestSellers.map((item, i) => (
              <div key={item.id ?? i} className="ts-card" style={{
                background: "#fff", borderRadius: "14px", overflow: "hidden",
                border: "1px solid rgba(58,36,24,.08)", boxShadow: "0 2px 10px rgba(58,36,24,.06)",
              }}>
                <Link to={item.id && typeof item.id !== "string" ? `/products/${item.id}` : "/products"} style={{ display: "block" }}>
                  <div style={{ width: "100%", height: "148px", overflow: "hidden", background: "#FDF1DD" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="img-zoom" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "40px" }}>🍘</div>
                    )}
                  </div>
                </Link>
                <div style={{ padding: "12px 14px" }}>
                  <div style={{ fontWeight: "700", fontSize: "14px", color: "#3A2418", marginBottom: "8px" }}>{item.name}</div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontWeight: "800", fontSize: "15px", color: "#D5652E" }}>₹{item.price}</span>
                    <button className="ts-add" onClick={() => addToCart(item)} style={{
                      background: addedItems[item.id] ? "#3A2418" : "#D5652E", color: "#fff", border: "none",
                      borderRadius: "8px", padding: "6px 16px", fontWeight: "700", fontSize: "12px", cursor: "pointer",
                      transition: "background .2s",
                    }}>{addedItems[item.id] ? "ADDED ✓" : "ADD +"}</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════
          TESTIMONIALS
      ═══════════════════════════════════ */}
      <div style={{ background: "#FDF1DD", padding: "72px 48px" }}>
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <div style={{ color: "#D5652E", fontSize: "11px", letterSpacing: "3px", fontWeight: "700", marginBottom: "8px" }}>
            WHAT PEOPLE SAY
          </div>
          <h2 style={{ color: "#3A2418", fontWeight: "900", fontSize: "clamp(22px,3vw,34px)", margin: 0 }}>
            Loved by Our Customers
          </h2>
        </div>

        <div className="testimonial-card" style={{
          maxWidth: "640px", margin: "0 auto", background: "#fff", borderRadius: "18px", padding: "40px 48px",
          textAlign: "center", border: "1px solid rgba(58,36,24,.08)", boxShadow: "0 10px 30px rgba(58,36,24,.08)",
        }}>
          <div style={{ color: "#D5652E", fontSize: "18px", marginBottom: "14px" }}>
            {"★".repeat(TESTIMONIALS[testimonial].stars)}{"☆".repeat(5 - TESTIMONIALS[testimonial].stars)}
          </div>
          <p style={{ color: "#3A2418", fontSize: "15.5px", lineHeight: "1.8", fontStyle: "italic", margin: "0 0 20px" }}>
            "{TESTIMONIALS[testimonial].quote}"
          </p>
          <div style={{ fontWeight: "800", color: "#3A2418", fontSize: "13.5px" }}>{TESTIMONIALS[testimonial].name}</div>
          <div style={{ color: "#A88A68", fontSize: "11.5px" }}>{TESTIMONIALS[testimonial].area}</div>

          <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "22px" }}>
            {TESTIMONIALS.map((_, i) => (
              <span key={i} className="ts-dot" onClick={() => setTestimonial(i)} style={{
                width: i === testimonial ? "22px" : "8px", height: "8px", borderRadius: "5px",
                background: i === testimonial ? "#D5652E" : "rgba(58,36,24,.15)",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════
          NEWSLETTER / OFFERS STRIP
      ═══════════════════════════════════ */}
      <div style={{ background: "#3A2418", padding: "48px 48px" }}>
        <div className="newsletter-inner" style={{
          maxWidth: "1000px", margin: "0 auto", display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "24px", flexWrap: "wrap",
        }}>
          <div>
            <div style={{ color: "#F0954D", fontWeight: "800", fontSize: "11px", letterSpacing: "2px", marginBottom: "6px" }}>
              STAY IN THE LOOP
            </div>
            <h3 style={{ color: "#fff", fontWeight: "900", fontSize: "clamp(18px,2.4vw,26px)", margin: 0 }}>
              Get offers &amp; new dishes straight to your inbox
            </h3>
          </div>
          <form
            className="newsletter-form"
            onSubmit={(e) => { e.preventDefault(); showToast("Thanks for subscribing!", "success"); e.target.reset(); }}
            style={{ display: "flex", gap: "10px" }}
          >
            <input type="email" required placeholder="Enter your email" style={{
              padding: "13px 18px", borderRadius: "8px", border: "none", fontSize: "13px",
              minWidth: "220px", outline: "none",
            }} />
            <button type="submit" className="ts-newsbtn" style={{
              background: "#D5652E", color: "#fff", border: "none", padding: "13px 26px", borderRadius: "8px",
              fontWeight: "800", fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap", transition: "background .2s",
            }}>Subscribe</button>
          </form>
        </div>
      </div>

      {/* ═══════════════════════════════════
          FOOTER (id="visit")
      ═══════════════════════════════════ */}
      <footer id="visit" style={{ background: "#D5652E", position: "relative", overflow: "hidden" }}>

        <div className="footer-inner" style={{
          padding: "32px 48px", display: "flex", alignItems: "flex-start", justifyContent: "space-between",
          flexWrap: "wrap", gap: "28px", borderBottom: "1px solid rgba(255,255,255,.2)",
        }}>
          <div style={{
            position: "absolute", right: "120px", top: 0, bottom: 0, display: "flex", alignItems: "center",
            fontSize: "90px", opacity: .08, pointerEvents: "none", letterSpacing: "-10px",
          }}>🏛️🏛️🏛️</div>

          <div style={{ zIndex: 1, maxWidth: "340px" }}>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: "10px", letterSpacing: "1.5px", marginBottom: "6px" }}>
              VISIT US
            </div>
            <div style={{ color: "#fff", fontWeight: "800", fontSize: "14px", lineHeight: "1.6" }}>
              Near Huda Techno Enclave, Madhapur,<br />
              Near Hitech City, Near Ratnadeep Super Market,<br />
              Hyderabad, Telangana - 500081
            </div>

            <div style={{ color: "rgba(255,255,255,.75)", fontSize: "10px", letterSpacing: "1.5px", marginTop: "16px", marginBottom: "6px" }}>
              TIMINGS
            </div>
            <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px", lineHeight: "1.6" }}>
              Mon - Sat: 8:00 PM - 12:30 AM<br />
              Sunday: 7:00 PM - 12:30 AM
            </div>
          </div>

          <div style={{
            color: "#fff", zIndex: 1, textAlign: "center", fontSize: "clamp(16px,2.2vw,24px)", fontWeight: "700",
            fontStyle: "italic", fontFamily: "Georgia,serif", alignSelf: "center",
          }}>
            Taste Telangana, Feel at Home. ♡
          </div>

          <div style={{ zIndex: 1, maxWidth: "280px", textAlign: "right" }}>
            <div style={{ color: "rgba(255,255,255,.75)", fontSize: "10px", letterSpacing: "1.5px", marginBottom: "6px" }}>
              BULK ORDERS
            </div>
            <div style={{ color: "#fff", fontWeight: "600", fontSize: "13px", lineHeight: "1.6" }}>
              We prepare bulk &amp; party orders fresh at home<br />
              and deliver straight to your door.
            </div>
            <div style={{ color: "#fff", fontWeight: "800", fontSize: "14px", marginTop: "10px" }}>
              📞 +91 98765 43210
            </div>
          </div>
        </div>

        <div style={{
          background: "rgba(0,0,0,.15)", padding: "14px 48px", display: "flex", alignItems: "center",
          justifyContent: "space-between", flexWrap: "wrap", gap: "8px",
        }}>
          <div style={{ color: "rgba(255,255,255,.75)", fontSize: "12px" }}>
            © 2026 Telangana Special. All rights reserved.
          </div>
          <div style={{ display: "flex", gap: "20px" }}>
            {["Privacy Policy", "Terms of Service", "Contact Us"].map((l, i) => (
              <span key={i} style={{ color: "rgba(255,255,255,.75)", fontSize: "12px", cursor: "pointer" }}>{l}</span>
            ))}
          </div>
        </div>
      </footer>

    </div>
  );
}
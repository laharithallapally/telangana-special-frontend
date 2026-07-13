function Locations() {
  const address = "Near Huda Techno Enclave, Madhapur, Near Hitech City, Near Ratnadeep Super Market, Hyderabad, Telangana - 500081";
  const mapsQuery = encodeURIComponent(`Telangana Special, ${address}`);

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "40px 24px 80px" }}>
      <style>{`
        @media (max-width: 700px) {
          .locations-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>

      <h1 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: "800", marginBottom: "8px" }}>
        Visit Us
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: "36px", fontSize: "15px" }}>
        Stop by near Madhapur Metro, or order online anytime — we deliver too.
      </p>

      <div className="locations-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px" }}>
        <div
          style={{
            background: "#2b2b2b",
            color: "#fff",
            borderRadius: "16px",
            padding: "32px",
          }}
        >
          <span
            style={{
              display: "inline-block",
              background: "#ff6b35",
              color: "#fff",
              fontSize: "12px",
              fontWeight: "700",
              padding: "4px 10px",
              borderRadius: "20px",
              marginBottom: "16px",
            }}
          >
            Near Madhapur Metro
          </span>

          <h2 style={{ fontSize: "22px", fontWeight: "800", marginBottom: "14px" }}>
            Telangana Special
          </h2>

          <p style={{ fontSize: "15px", lineHeight: "1.8", color: "#e0e0e0", marginBottom: "20px" }}>
            {address}
          </p>

          <div style={{ marginBottom: "20px" }}>
            <p style={{ fontSize: "13px", color: "#aaa", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "4px" }}>
              Store Hours
            </p>
            <p style={{ fontSize: "16px", fontWeight: "700", color: "#ff6b35" }}>
              Mon – Sat: 8:00 PM – 12:30 AM
            </p>
            <p style={{ fontSize: "16px", fontWeight: "700", color: "#ff6b35" }}>
              Sunday: 7:00 PM – 12:30 AM
            </p>
            <p style={{ fontSize: "13px", color: "#ccc", marginTop: "4px" }}>
              Prefer daytime? Order online — available all day, every day.
            </p>
          </div>

          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
            <a href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`} target="_blank" rel="noopener noreferrer" style={{ background: "var(--primary)", color: "#fff", fontWeight: "700", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>
              Get Directions
            </a>
            <a href="tel:+919876543210" style={{ background: "transparent", border: "1px solid #555", color: "#fff", fontWeight: "700", padding: "10px 18px", borderRadius: "8px", textDecoration: "none", fontSize: "14px" }}>
              Call Us
            </a>
          </div>
        </div>

        <div style={{ borderRadius: "16px", overflow: "hidden", border: "1px solid var(--border)", minHeight: "320px" }}>
          <iframe
            title="Telangana Special location"
            src={`https://maps.google.com/maps?q=${mapsQuery}&output=embed`}
            width="100%"
            height="100%"
            style={{ border: 0, minHeight: "320px" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </div>
  );
}

export default Locations;
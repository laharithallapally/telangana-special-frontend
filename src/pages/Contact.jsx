import { useState } from "react";
import emailjs from "@emailjs/browser";

const INSTAGRAM_URL = "https://www.instagram.com/telanganasarvapindi/?hl=en";

const EMAILJS_SERVICE_ID = "service_y59ewco";
const EMAILJS_TEMPLATE_ID = "template_4rjxaho";
const EMAILJS_PUBLIC_KEY = "gmmCM2ClvYVw5RivF";

function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSending(true);
    setError("");

    emailjs
      .send(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        {
          name: form.name,
          email: form.email,
          message: form.message,
        },
        EMAILJS_PUBLIC_KEY
      )
      .then(() => {
        setSubmitted(true);
        setSending(false);
        setForm({ name: "", email: "", message: "" });
      })
      .catch(() => {
        setError("Something went wrong. Please try again.");
        setSending(false);
      });
  };

  return (
    <div className="contact-wrapper" style={{ maxWidth: "1100px", margin: "60px auto", padding: "0 24px" }}>
      <style>{`
        @media (max-width: 700px) {
          .contact-wrapper { margin: 32px auto !important; padding: 0 16px !important; }
          .contact-info-card, .contact-form-card { padding: 24px !important; }
        }
      `}</style>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "32px" }}>

        {/* LEFT: Info card */}
        <div className="contact-info-card" style={{
          flex: "1 1 320px",
          background: "#2b2b2b",
          color: "#fff",
          borderRadius: "16px",
          padding: "36px",
        }}>
          <h1 style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: "800", marginBottom: "20px" }}>
            Customer Support
          </h1>

          <p style={{ fontSize: "16px", marginBottom: "28px" }}>
            Email:{" "}
            <a href="mailto:telanganaspecial.noreply@gmail.com" style={{ color: "#ff6b35", fontWeight: "700" }}>
              telanganaspecial.noreply@gmail.com
            </a>
          </p>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "12px" }}>Find us on</h3>
          <div style={{ marginBottom: "28px" }}>
            <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" style={socialIconStyle} aria-label="Instagram">
              IG
            </a>
          </div>

          <h3 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Our Shop</h3>
          <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#e0e0e0" }}>
            Telangana Sarvapindi<br />
            120, Hitech City Rd, HUDA Techno Enclave,<br />
            Madhapur, Hyderabad, Telangana 500081
          </p>
          <p style={{ fontSize: "15px", lineHeight: "1.7", color: "#ff6b35", marginTop: "12px", fontWeight: "700" }}>
            Open Daily: 8:00 PM to 12:30 PM
          </p>
        </div>

        {/* RIGHT: Form card */}
        <div className="contact-form-card" style={{
          flex: "1 1 380px",
          background: "#fff",
          borderRadius: "16px",
          padding: "36px",
          border: "2px solid var(--primary)",
          boxShadow: "0 8px 30px rgba(0,0,0,0.12)",
        }}>
          <h2 style={{ fontSize: "26px", fontWeight: "800", marginBottom: "20px", color: "#1a1a1a" }}>
            Get in touch
          </h2>

          {submitted ? (
            <p style={{ color: "#1a7d1a", fontWeight: "700", fontSize: "16px" }}>
              Thanks! We will get back to you soon.
            </p>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <input
                type="text"
                name="name"
                placeholder="Enter Name"
                value={form.name}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <input
                type="email"
                name="email"
                placeholder="Enter Email Address"
                value={form.email}
                onChange={handleChange}
                required
                style={inputStyle}
              />
              <textarea
                name="message"
                placeholder="Enter Message"
                rows={5}
                value={form.message}
                onChange={handleChange}
                required
                style={{ ...inputStyle, resize: "vertical" }}
              />
              {error && <p style={{ color: "#d32f2f", fontSize: "13px", fontWeight: "600" }}>{error}</p>}
              <button type="submit" disabled={sending} style={buttonStyle}>
                {sending ? "Sending..." : "Submit"}
              </button>

              <p style={{ fontSize: "12px", color: "#555", textAlign: "center" }}>
                By contacting us you agree to the{" "}
                <span style={{ color: "var(--primary)", fontWeight: "700" }}>Terms and Conditions</span> and{" "}
                <span style={{ color: "var(--primary)", fontWeight: "700" }}>Privacy Policy</span>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

const inputStyle = {
  padding: "14px 16px",
  border: "2px solid #ccc",
  borderRadius: "8px",
  fontSize: "14px",
  outline: "none",
  color: "#1a1a1a",
  background: "#f7f7f7",
};

const buttonStyle = {
  background: "var(--primary)",
  color: "#fff",
  fontWeight: "800",
  padding: "14px",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  fontSize: "15px",
};

const socialIconStyle = {
  width: "38px",
  height: "38px",
  borderRadius: "50%",
  background: "#ff6b35",
  color: "#fff",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: "12px",
  fontWeight: "800",
  textDecoration: "none",
};

export default Contact;
import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/forgot-password", { email: email.trim() });
      // Same message whether or not the email exists — avoids leaking accounts
      setSubmitted(true);
    } catch (error) {
      setMessage("❌ Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <style>{`
        @media (max-width: 768px) {
          .auth-wrapper {
            min-height: auto !important;
            align-items: flex-start !important;
            padding: 40px 16px !important;
          }
        }
        @media (max-width: 480px) {
          .auth-wrapper {
            padding: 24px 12px !important;
          }
        }
      `}</style>

      <div className="auth-container">
        <h2>Forgot Password 🔑</h2>

        {message && <p className="error-msg">{message}</p>}

        {submitted ? (
          <>
            <p className="success-msg">
              If an account with that email exists, a reset link has been sent. Check your inbox.
            </p>
            <p>
              <Link to="/">Back to Login</Link>
            </p>
          </>
        ) : (
          <>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  name="email"
                  placeholder="Enter your account email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>

            <p>
              Remembered your password? <Link to="/">Login</Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default ForgotPassword;

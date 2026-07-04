import { useState } from "react";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
import api from "../api/axiosConfig";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!token) {
      setMessage("❌ This reset link is invalid or missing a token.");
      return;
    }
    if (newPassword.length < 6) {
      setMessage("❌ Password must be at least 6 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage("❌ Passwords do not match");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      await api.post("/auth/reset-password", { token, newPassword });
      setMessage("✅ Password reset successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Reset link is invalid or expired.";
      setMessage("❌ " + errMsg);
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
        <h2>Reset Password 🔒</h2>

        {message && (
          <p className={message.includes("✅") ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}

        {!token && (
          <p className="error-msg">
            No reset token found. Please use the link from your email.
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="password"
              placeholder="New password (min 6 characters)"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading || !token}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <p>
          <Link to="/">Back to Login</Link>
        </p>
      </div>
    </div>
  );
}

export default ResetPassword;

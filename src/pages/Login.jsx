import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await api.post("/auth/login", {
        email: formData.email.trim().toLowerCase(),
        password: formData.password.trim(),
      });
      // save token separately for axios interceptor
      localStorage.setItem("token", response.data.token);

      // save user as single object — Navbar reads this!
      localStorage.setItem("user", JSON.stringify({
        name: response.data.name,
        email: response.data.email,
        role: response.data.role,
        gender: response.data.gender,
        token: response.data.token
      }));

      setMessage("Login Successful ✅");
      navigate("/home");

    } catch (error) {
      console.log("Status:", error.response?.status);
      console.log("Response Data:", error.response?.data);
      console.error(error);

      setMessage("❌ Invalid Email or Password");
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
        <h2>Welcome Back 👋</h2>

        {message && (
          <p className={message.includes("✅") ? "success-msg" : "error-msg"}>
            {message}
          </p>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              onChange={handleChange}
              value={formData.email}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="email"
              spellCheck="false"
              inputMode="email"
              required
            />
          </div>

          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password"
              onChange={handleChange}
              value={formData.password}
              autoCapitalize="none"
              autoCorrect="off"
              autoComplete="current-password"
              spellCheck="false"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

         <p style={{ marginTop: "4px" }}>
          <Link to="/forgot-password">Forgot password?</Link>
        </p>

        <p>
          Don't have an account?{" "}
          <Link to="/register">Register</Link>
        </p>

      </div>
    </div>
  );
}

export default Login;
import { useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // clear error when user starts typing
    setErrors({ ...errors, [e.target.name]: "" });
  };

  // frontend validation before sending to backend
  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 6) newErrors.password = "Password must be at least 6 characters";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // validate first
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post("/auth/register", formData);
      // save token and redirect to products
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      setMessage("✅ Registration successful! Redirecting...");
      setTimeout(() => navigate("/products"), 1500);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Registration failed!";
      setMessage("❌ " + errMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>

      {message && (
        <p className={message.includes("✅") ? "success-msg" : "error-msg"}>
          {message}
        </p>
      )}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            value={formData.name}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email"
            onChange={handleChange}
            value={formData.email}
          />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </div>

        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password (min 6 characters)"
            onChange={handleChange}
            value={formData.password}
          />
          {errors.password && <span className="field-error">{errors.password}</span>}
        </div>

        <div className="form-group">
          <input
            type="text"
            name="phone"
            placeholder="Phone (10 digits)"
            onChange={handleChange}
            value={formData.phone}
          />
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>

      <p>Already have an account? <a href="/">Login</a></p>
    </div>
  );
}

export default Register;
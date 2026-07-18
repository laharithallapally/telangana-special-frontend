import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import AddressManager from "../components/AddressManager";

function Profile() {
  const [user, setUser] = useState(null);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({ name: "", phone: "", gender: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
      setFormData({
        name: response.data.name || "",
        phone: response.data.phone || "",
        gender: response.data.gender || "",
      });
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "phone") {
      value = value.replace(/\D/g, "").slice(0, 10);
    }
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.phone.trim()) newErrors.phone = "Phone is required";
    else if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    return newErrors;
  };

  const handleCancel = () => {
    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      gender: user.gender || "",
    });
    setErrors({});
    setMessage("");
    setEditing(false);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSaving(true);
    setMessage("");
    try {
      const response = await api.put("/users/me", {
        name: formData.name.trim(),
        phone: formData.phone.trim(),
        gender: formData.gender,
      });

      setUser(response.data);

      // keep localStorage in sync so Navbar + the mascot greeting
      // reflect the change immediately, without needing a re-login
      const stored = JSON.parse(localStorage.getItem("user") || "null");
      if (stored) {
        localStorage.setItem("user", JSON.stringify({
          ...stored,
          name: response.data.name,
          gender: response.data.gender,
        }));
      }

      setMessage("✅ Profile updated");
      setEditing(false);
    } catch (error) {
      const errMsg = error.response?.data?.message || "Could not update profile";
      setMessage("❌ " + errMsg);
    } finally {
      setSaving(false);
    }
  };

  if (!user) {
    return (
      <>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="auth-wrapper" style={{ alignItems: "flex-start", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: "500px" }}>
          <div className="auth-container" style={{ margin: 0 }}>
            <h2>My Profile</h2>

            {message && (
              <p className={message.includes("✅") ? "success-msg" : "error-msg"}>
                {message}
              </p>
            )}

            {!editing ? (
              <>
                <div className="form-group">
                  <strong style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Name</strong>
                  <p style={{ margin: "4px 0 0" }}>{user.name}</p>
                </div>

                <div className="form-group">
                  <strong style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Email</strong>
                  <p style={{ margin: "4px 0 0" }}>{user.email}</p>
                </div>

                <div className="form-group">
                  <strong style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Phone</strong>
                  <p style={{ margin: "4px 0 0" }}>{user.phone}</p>
                </div>

                <div className="form-group">
                  <strong style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Gender</strong>
                  <p style={{ margin: "4px 0 0" }}>
                    {user.gender
                      ? user.gender === "other" ? "Prefer not to say" : user.gender
                      : "Not set"}
                  </p>
                </div>

                <div className="form-group">
                  <strong style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Role</strong>
                  <p style={{ margin: "4px 0 0" }}>{user.role}</p>
                </div>

                <button type="button" onClick={() => setEditing(true)}>
                  Edit Profile
                </button>
              </>
            ) : (
              <form onSubmit={handleSave}>
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
                    type="tel"
                    name="phone"
                    placeholder="Phone (10 digits)"
                    onChange={handleChange}
                    value={formData.phone}
                    maxLength={10}
                    inputMode="numeric"
                  />
                  {errors.phone && <span className="field-error">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <select name="gender" onChange={handleChange} value={formData.gender}>
                    <option value="">Gender (optional)</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Prefer not to say</option>
                  </select>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                  <button type="submit" disabled={saving}>
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={handleCancel}
                    style={{ background: "transparent", color: "var(--text-secondary)" }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>

          <AddressManager />
        </div>
      </div>
    </>
  );
}

export default Profile;
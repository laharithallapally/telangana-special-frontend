import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Navbar from "../components/Navbar";
import AddressManager from "../components/AddressManager";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await api.get("/users/me");
      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div className="auth-wrapper" style={{ alignItems: "flex-start", padding: "40px 20px" }}>
        <div style={{ width: "100%", maxWidth: "500px" }}>
          <div className="auth-container" style={{ margin: 0 }}>
            <h2>My Profile</h2>

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
              <strong style={{ color: "var(--text-secondary)", fontSize: "13px" }}>Role</strong>
              <p style={{ margin: "4px 0 0" }}>{user.role}</p>
            </div>
          </div>

          <AddressManager />
        </div>
      </div>
    </>
  );
}

export default Profile;
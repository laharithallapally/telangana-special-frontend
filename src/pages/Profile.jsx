import { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import Navbar from "../components/Navbar";

function Profile() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await api.get("/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(response.data);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  if (!user) {
    return (
      <>
        <Navbar />
        <h2 style={{ textAlign: "center", marginTop: "50px" }}>
          Loading...
        </h2>
      </>
    );
  }

  return (
    <>
      <Navbar />

      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f5f5f5",
          padding: "40px",
        }}
      >
        <div
          style={{
            maxWidth: "600px",
            margin: "0 auto",
            background: "white",
            padding: "30px",
            borderRadius: "12px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          }}
        >
          <h1
            style={{
              textAlign: "center",
              color: "#6a1b9a",
              marginBottom: "30px",
            }}
          >
            My Profile
          </h1>

          <div style={{ marginBottom: "15px" }}>
            <strong>Name:</strong> {user.name}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Email:</strong> {user.email}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Phone:</strong> {user.phone}
          </div>

          <div style={{ marginBottom: "15px" }}>
            <strong>Role:</strong> {user.role}
          </div>
        </div>
      </div>
    </>
  );
}

export default Profile;
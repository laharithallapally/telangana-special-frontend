import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return <Navigate to="/" />;
  }

  if (user.role !== "ADMIN") {
    return <Navigate to="/home" />;
  }

  return children;
}

export default AdminRoute;
import axios from "axios";

const api = axios.create({
  baseURL: "https://35.253.21.120.nip.io/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  const publicRoutes = [
    "/auth/login",
    "/auth/register",
  ];

  const isPublicRoute = publicRoutes.some(route =>
    config.url?.includes(route)
  );

  if (token && !isPublicRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
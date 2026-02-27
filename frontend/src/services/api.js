import axios from "axios";

// Ensure the base URL always ends with /api regardless of how the env var is set
const getRawBase = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;
  if (process.env.NODE_ENV === "production") return "https://redeem-appp.onrender.com/api";
  return "http://localhost:5000/api";
};

// Auto-correct: if env var is set to the domain without /api, append it
const rawBase = getRawBase().replace(/\/$/, ""); // strip trailing slash
const baseURL = rawBase.endsWith("/api") ? rawBase : `${rawBase}/api`;

if (process.env.NODE_ENV === "development") {
  console.log("[API] baseURL:", baseURL);
}

const api = axios.create({ baseURL });

// Attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auto-logout on 401
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;


import axios from "axios";

// Priority: REACT_APP_API_URL env var → production Render URL → local dev
const baseURL =
  process.env.REACT_APP_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://redeem-appp.onrender.com/api"
    : "http://localhost:5000/api");

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


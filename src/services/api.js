import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

export const register = (payload) => api.post("/register", payload);
export const login = (payload) => api.post("/login", payload);
export const getMe = (token) =>
  api.get("/me", { headers: { Authorization: `Bearer ${token}` } });

export default api;

import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/NATURE-HS-R/backend/",
  // baseURL: "https://nature-hs.unaux.com/backend/",
  withCredentials: true,
});

// ✅ Add interceptor HERE
axiosInstance.interceptors.request.use((config) => {
  const token =
    localStorage.getItem("token") || sessionStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default axiosInstance;

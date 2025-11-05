// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost/NATURE-HS-R/backend/",
});

axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from sessionStorage
    const authData = sessionStorage.getItem("auth-storage");
    if (authData) {
      const parsed = JSON.parse(authData);
      const token = parsed?.state?.token || parsed?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      sessionStorage.removeItem("auth-storage");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;

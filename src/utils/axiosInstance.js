// utils/axiosInstance.js
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://naturehotspring.com/backend/",
  //baseURL: "http://localhost/NATURE-HS-R/backend/",
  //baseURL: "https://naturehotspring.liveblog365.com/backend/",
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
    if (error.response) {
      if (error.response.status === 401) {
        // Unauthorized → token invalid or expired
        sessionStorage.removeItem("auth-storage");
        window.location.href = "/signin";
      }

      //its not fckn working
      if (error.response.status === 403) {
        // Forbidden → user authenticated but not allowed
        sessionStorage.removeItem("auth-storage");
        window.location.href = "/";
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

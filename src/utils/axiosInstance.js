import axios from "axios";

const axiosIntance = axios.create({
  baseURL: "http://localhost/NATURE-HS-R/backend/",

  withCredentials: true,
});

export default axiosIntance;

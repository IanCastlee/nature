import axios from "axios";

const axiosIntance = axios.create({
  baseURL: "http://localhost/NATURE-HS-R/backend/",
  //baseURL: "https://nature-hs.unaux.com/backend/",

  withCredentials: true,
});

export default axiosIntance;

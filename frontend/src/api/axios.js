import axios from "axios";

// const api = axios.create({
//   baseURL: "https://crack4success-backend.onrender.com/api",
//   // baseURL: "http://localhost:5000/api",
// });
    
const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});
// Add a request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

export default api;

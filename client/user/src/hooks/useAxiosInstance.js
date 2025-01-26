import axios from "axios";


const axiosInstance = axios.create({
  // baseURL: "http://localhost:1234",
  baseURL: import.meta.env.VITE_BASE_URL
  // baseURL: "https://turf-spot-be.vercel.app",
});

axiosInstance.interceptors.request.use((config) => {
  let token = null;
  try {
    const persistedUser = localStorage.getItem("persist:user");
    if (persistedUser) {
      const parsedUser = JSON.parse(persistedUser);
      if (parsedUser.auth) {
        const parsedAuth = JSON.parse(parsedUser.auth);
        token = parsedAuth.token;
      }
    }
  } catch (error) {
    console.error("Error parsing persisted user data:", error);
  }

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  return config;
});
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid, handle logout
      localStorage.removeItem("persist:user");
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);
export default axiosInstance;

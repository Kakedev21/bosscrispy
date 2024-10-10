import axios from "axios";
import useAuthStore from "@/store/authStore";

const api = axios.create({
  baseURL: "https://bosscrispy.online/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor (optional)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors here (e.g., redirect to login on 401)
    if (error.response && error.response.status === 401) {
      // Handle unauthorized access
      useAuthStore.getState().logout();
      // Redirect to login (you may need to adjust this based on your navigation setup)
    }
    return Promise.reject(error);
  }
);

export default api;

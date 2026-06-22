import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.DEV ? "" : "https://jomab-712232187160.europe-west1.run.app",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import store from "./redux/store";
import { logout } from "./redux/userSlice";

const api = axios.create({
  baseURL: "https://task-manager-app-7ynf.onrender.com/api",
});

api.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    return Promise.reject(error);
  }
);

export default api;

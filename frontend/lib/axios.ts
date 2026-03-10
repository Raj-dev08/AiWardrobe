import axios from "axios"
import { Platform } from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"


const axiosInstance = axios.create({
    baseURL: Platform.OS === "web" ? "http://localhost:5000/api" : "https://aiwardrobe-backend.onrender.com/api",
    withCredentials: false,
})

axiosInstance.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("wardrobe_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export { axiosInstance };
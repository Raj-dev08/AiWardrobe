import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { ToastAndroid , Platform } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  wardrobe?: string[] | string;
  previewModel?: string | string[];
};


type AuthState = {
  user: User | null;
  loading: boolean;
  isCheckingAuth: boolean;
  signup: (data: { email: string; name: string; password: string; fcmToken: string }) => Promise<boolean>;
  login: (data: { email: string; password: string }) => Promise<any>;
  logout: () => Promise<boolean>;
  checkAuth: () => Promise<User | null>;
};

const showToast = (message: string) => {
  if( Platform.OS === 'android'){
    ToastAndroid.show(message, ToastAndroid.SHORT);
  }
  else{
    alert(message);
  }
}


export const useAuthStore = create<AuthState>((set,get) => ({
  user: null,
  loading: false,
  isCheckingAuth: false,

  signup: async (data) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data); 
      set({ user: res.data });
      await AsyncStorage.setItem('wardrobe_token', res.data.token);
      showToast("Signup successful");  
      return true
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showToast(message);
      return false
    } finally {
      set({ loading: false });
    }
  },


  login: async (data) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/auth/login", data);
      set({ user: res.data });
      showToast("Login successful");
      await AsyncStorage.setItem('wardrobe_token', res.data.token);
      return res.data
    } catch (error: any) {
       const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showToast(message);
      return false
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    set({ loading: true });
    try {
      await axiosInstance.post("/auth/logout");
      set({ user: null });
      await AsyncStorage.removeItem('wardrobe_token');
      showToast("Logout successful");
      return true;
    } catch (error: any) {
       const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showToast(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },


  checkAuth: async () => {
    set({ isCheckingAuth: true });
    try {
      const token = await AsyncStorage.getItem("wardrobe_token");
      if (token) {
        const res = await axiosInstance.get("/auth/check");
        set({ user: res.data });
        return res.data
      } else {
        set({ user: null });
        return null
      }
    } catch (error: any) { 
       const message =
        error?.response?.data?.message ||
        error?.message ||
        "Something went wrong";
      showToast(message);
      set({ user: null });
    }
    finally {
      set({ isCheckingAuth: false });
    }
  }

}));
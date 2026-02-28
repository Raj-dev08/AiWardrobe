import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { ToastAndroid, Platform } from "react-native";

export type ClothingItem = {
  _id: string;
  imageUrl: string | any;
  embedding: number[];
};

export type Wardrobe = {
  _id: string;
  top: ClothingItem[];
  bottom: ClothingItem[];
  shoes: ClothingItem[];
};



type WardrobeState = {
  wardrobe: Wardrobe | null;
  loading: boolean;
  fetchWardrobe: () => Promise<Wardrobe | null>;
  createWardrobe: () => Promise<Wardrobe | null>;
  addClothingItem: (category: "Top" | "Bottom" | "Shoes", image: string) => Promise<boolean>;
  removeClothingItem: (category: "Top" | "Bottom" | "Shoes", clothId: string) => Promise<boolean>;
};

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    alert(message);
  }
};

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  wardrobe: null,
  loading: false,

  fetchWardrobe: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/wardrobe/me");
      set({ wardrobe: res.data.wardrobe });
      return res.data.wardrobe;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to fetch wardrobe";
      showToast(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createWardrobe: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/wardrobe");
      set({ wardrobe: res.data.wardrobe });
      showToast("Wardrobe created");
      return res.data.wardrobe;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to create wardrobe";
      showToast(message);
      return null;
    } finally {
      set({ loading: false });
    }
  },

  addClothingItem: async (category, image) => {
    set({ loading: true });
    try {
      await axiosInstance.post("/wardrobe/add-item", { category, image });
      //showToast("Clothing item is being processed");
      get().fetchWardrobe();
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to add clothing item";
      showToast(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  removeClothingItem: async (category, clothId) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.delete(`/wardrobe/remove-item/${clothId}`, { data: { category } });
      showToast(res.data.message || "Clothing item removed");

      get().fetchWardrobe();
      return true;
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "Failed to remove clothing item";
      showToast(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
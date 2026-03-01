import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { ToastAndroid, Platform } from "react-native";

export type PreviewMeasurement = {
  chest: number;
  waist: number;
  hips: number;
};

export type PreviewModel = {
  _id: string;
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female" | "other";
  skinColor: string;
  measurement: PreviewMeasurement;
};

type PreviewState = {
  previewModel: PreviewModel | null;
  loading: boolean;

  fetchPreviewModel: () => Promise<PreviewModel | null>;
  createPreviewModel: (data: {
    weight: number;
    height: number;
    age: number;
    gender: "male" | "female" | "other";
    skinColor: string;
  }) => Promise<boolean>;

  customizePreviewModel: (data: Partial<{
    chest: number;
    waist: number;
    hips: number;
    height: number;
    weight: number;
    age: number;
    gender: "male" | "female" | "other";
    skinColor: string;
  }>) => Promise<boolean>;
};

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    alert(message);
  }
};

export const usePreviewStore = create<PreviewState>((set, get) => ({
  previewModel: null,
  loading: false,

  fetchPreviewModel: async () => {
    set({ loading: true });
    try {
      const res = await axiosInstance.get("/preview");
      set({ previewModel: res.data.model });
      return res.data.model;
    } catch (error: any) {
      if (error?.response?.status !== 404) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to fetch preview model";
        showToast(message);
      }
      return null;
    } finally {
      set({ loading: false });
    }
  },

  createPreviewModel: async (data) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.post("/preview/create-model", data);
      set({ previewModel: res.data.savedModel });
      showToast("Preview model created");
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to create preview model";
      showToast(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  customizePreviewModel: async (data) => {
    set({ loading: true });
    try {
      const res = await axiosInstance.put("/preview/customize-model", data);
      set({ previewModel: res.data.savedModel });
      showToast("Preview model updated");
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to update preview model";
      showToast(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },
}));
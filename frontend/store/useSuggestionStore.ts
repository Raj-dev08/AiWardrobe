import { create } from "zustand";
import { axiosInstance } from "@/lib/axios";
import { ToastAndroid, Platform } from "react-native";

type SuggestionPayload = {
  top?: any[];
  bottom?: any[];
  shoes?: any[];
  accessories?: string;
};

type SuggestionState = {
  suggestion: SuggestionPayload | null;
  loading: boolean;
  generateSuggestion: (eventDescription: string) => Promise<boolean>;
  clearSuggestion: () => void;
};

const showToast = (message: string) => {
  if (Platform.OS === "android") {
    ToastAndroid.show(message, ToastAndroid.SHORT);
  } else {
    alert(message);
  }
};

export const useSuggestionStore = create<SuggestionState>((set) => ({
  suggestion: null,
  loading: false,

  generateSuggestion: async (eventDescription: string) => {
    if (!eventDescription.trim()) {
      showToast("Event description is required");
      return false;
    }

    set({ loading: true });

    try {
      const res = await axiosInstance.post("/suggestions", {
        eventDescription,
      });

      set({ suggestion: res.data.suggestion });
      return true;
    } catch (error: any) {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to generate suggestion";

      showToast(message);
      return false;
    } finally {
      set({ loading: false });
    }
  },

  clearSuggestion: () => {
    set({ suggestion: null });
  },
}));
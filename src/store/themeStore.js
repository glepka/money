import { create } from "zustand";
import { storage } from "../utils/cloudStorage";
import { STORAGE_KEYS } from "../config/config";

export const useThemeStore = create((set, get) => ({
  themeMode: "telegram", // 'telegram', 'light', 'dark'
  loaded: false,

  loadTheme: async () => {
    if (get().loaded) return;

    try {
      const saved = await storage.getItem(STORAGE_KEYS.THEME);
      if (saved?.themeMode) {
        set({ themeMode: saved.themeMode, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch (error) {
      console.error("Error loading theme:", error);
      set({ loaded: true });
    }
  },

  setThemeMode: async (mode) => {
    set({ themeMode: mode });
    await storage.setItem(STORAGE_KEYS.THEME, { themeMode: mode });
  },
}));

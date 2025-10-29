import { create } from "zustand";
import { storage } from "../utils/cloudStorage";
import { STORAGE_KEYS, DEFAULT_SETTINGS } from "../config/config";

export const useSettingsStore = create((set, get) => ({
  settings: DEFAULT_SETTINGS,
  loaded: false,

  loadSettings: async () => {
    if (get().loaded) return;
    
    try {
      const saved = await storage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        set({ settings: { ...DEFAULT_SETTINGS, ...saved }, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch (error) {
      console.error("Error loading settings:", error);
      set({ loaded: true });
    }
  },

  updateSettings: async (newSettings) => {
    const updated = { ...get().settings, ...newSettings };
    set({ settings: updated });
    await storage.setItem(STORAGE_KEYS.SETTINGS, updated);
  },

  updateNotification: async (key, value) => {
    const settings = get().settings;
    const notifications = { ...settings.notifications, [key]: value };
    await get().updateSettings({ notifications });
  },
}));


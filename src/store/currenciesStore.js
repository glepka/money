import { create } from "zustand";
import { storage } from "../utils/cloudStorage";
import { STORAGE_KEYS, DEFAULT_CURRENCIES } from "../config/config";

export const useCurrencyStore = create((set, get) => ({
  currencies: DEFAULT_CURRENCIES,
  loaded: false,

  loadCurrencies: async () => {
    if (get().loaded) return;
    
    try {
      const saved = await storage.getItem(STORAGE_KEYS.CURRENCIES);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        set({ currencies: saved, loaded: true });
      } else {
        set({ currencies: DEFAULT_CURRENCIES, loaded: true });
      }
    } catch (error) {
      console.error("Error loading currencies:", error);
      set({ currencies: DEFAULT_CURRENCIES, loaded: true });
    }
  },

  addCurrency: async (currency) => {
    const currencies = [...get().currencies, currency];
    set({ currencies });
    await storage.setItem(STORAGE_KEYS.CURRENCIES, currencies);
  },

  removeCurrency: async (code) => {
    const currencies = get().currencies.filter((c) => c.code !== code);
    set({ currencies });
    await storage.setItem(STORAGE_KEYS.CURRENCIES, currencies);
  },

  updateCurrency: async (code, updates) => {
    const currencies = get().currencies.map((c) =>
      c.code === code ? { ...c, ...updates } : c
    );
    set({ currencies });
    await storage.setItem(STORAGE_KEYS.CURRENCIES, currencies);
  },
}));


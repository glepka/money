import { create } from "zustand";
import { storage } from "../utils/cloudStorage";
import { STORAGE_KEYS } from "../config/config";

export const useBudgetStore = create((set, get) => ({
  budgets: [],
  loaded: false,

  loadBudgets: async () => {
    if (get().loaded) return;
    
    try {
      const saved = await storage.getItem(STORAGE_KEYS.BUDGETS);
      if (saved && Array.isArray(saved)) {
        set({ budgets: saved, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch (error) {
      console.error("Error loading budgets:", error);
      set({ loaded: true });
    }
  },

  addBudget: async (budget) => {
    const newBudget = {
      ...budget,
      id: budget.id || `budget-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
    };
    const budgets = [...get().budgets, newBudget];
    set({ budgets });
    await storage.setItem(STORAGE_KEYS.BUDGETS, budgets);
    return newBudget;
  },

  updateBudget: async (id, updates) => {
    const budgets = get().budgets.map((b) =>
      b.id === id ? { ...b, ...updates, updatedAt: new Date().toISOString() } : b
    );
    set({ budgets });
    await storage.setItem(STORAGE_KEYS.BUDGETS, budgets);
  },

  removeBudget: async (id) => {
    const budgets = get().budgets.filter((b) => b.id !== id);
    set({ budgets });
    await storage.setItem(STORAGE_KEYS.BUDGETS, budgets);
  },

  getBudgetById: (id) => {
    return get().budgets.find((b) => b.id === id);
  },

  getBudgetsByCategory: (categoryId) => {
    return get().budgets.filter((b) => b.categoryId === categoryId);
  },
}));


import { create } from "zustand";
import { storage } from "../utils/cloudStorage";
import { STORAGE_KEYS, DEFAULT_CATEGORIES } from "../config/config";

export const useCategoryStore = create((set, get) => ({
  categories: [],
  loaded: false,

  loadCategories: async () => {
    if (get().loaded) return;
    
    try {
      const saved = await storage.getItem(STORAGE_KEYS.CATEGORIES);
      if (saved && Array.isArray(saved) && saved.length > 0) {
        set({ categories: saved, loaded: true });
      } else {
        set({ categories: DEFAULT_CATEGORIES, loaded: true });
        await storage.setItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
      }
    } catch (error) {
      console.error("Error loading categories:", error);
      set({ categories: DEFAULT_CATEGORIES, loaded: true });
    }
  },

  addCategory: async (category) => {
    const newCategory = {
      ...category,
      id: category.id || `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    };
    const categories = [...get().categories, newCategory];
    set({ categories });
    await storage.setItem(STORAGE_KEYS.CATEGORIES, categories);
    return newCategory;
  },

  updateCategory: async (id, updates) => {
    const categories = get().categories.map((c) =>
      c.id === id ? { ...c, ...updates } : c
    );
    set({ categories });
    await storage.setItem(STORAGE_KEYS.CATEGORIES, categories);
  },

  removeCategory: async (id) => {
    const categories = get().categories.filter((c) => c.id !== id);
    set({ categories });
    await storage.setItem(STORAGE_KEYS.CATEGORIES, categories);
  },

  getCategoriesByType: (type) => {
    return get().categories.filter((c) => c.type === type);
  },

  getCategoryById: (id) => {
    return get().categories.find((c) => c.id === id);
  },

  getSubcategories: (parentId) => {
    return get().categories.filter((c) => c.parentId === parentId);
  },
}));


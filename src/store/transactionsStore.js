import { create } from "zustand";
import { storage } from "../utils/cloudStorage";
import { STORAGE_KEYS } from "../config/config";

export const useTransactionStore = create((set, get) => ({
  transactions: [],
  loaded: false,

  loadTransactions: async () => {
    if (get().loaded) return;
    
    try {
      const saved = await storage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (saved && Array.isArray(saved)) {
        set({ transactions: saved, loaded: true });
      } else {
        set({ loaded: true });
      }
    } catch (error) {
      console.error("Error loading transactions:", error);
      set({ loaded: true });
    }
  },

  addTransaction: async (transaction) => {
    const newTransaction = {
      ...transaction,
      id: transaction.id || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      date: transaction.date || new Date().toISOString(),
      createdAt: new Date().toISOString(),
    };
    const transactions = [...get().transactions, newTransaction];
    set({ transactions });
    await storage.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
    return newTransaction;
  },

  updateTransaction: async (id, updates) => {
    const transactions = get().transactions.map((t) =>
      t.id === id ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t
    );
    set({ transactions });
    await storage.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
  },

  removeTransaction: async (id) => {
    const transactions = get().transactions.filter((t) => t.id !== id);
    set({ transactions });
    await storage.setItem(STORAGE_KEYS.TRANSACTIONS, transactions);
  },

  getTransactionById: (id) => {
    return get().transactions.find((t) => t.id === id);
  },
}));


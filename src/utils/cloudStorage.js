import { cloudStorage } from "@telegram-apps/sdk";

const isSupported = () => {
  try {
    return cloudStorage?.isSupported?.() ?? false;
  } catch {
    return false;
  }
};

const isAvailable = (method) => {
  try {
    return cloudStorage?.[method]?.isAvailable?.() ?? false;
  } catch {
    return false;
  }
};

export const storage = {
  async setItem(key, value) {
    if (!isSupported() || !isAvailable("setItem")) {
      return Promise.resolve();
    }
    try {
      await cloudStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error saving to cloud storage:", error);
    }
  },

  async getItem(key) {
    if (!isSupported() || !isAvailable("getItem")) {
      return null;
    }
    try {
      const value = await cloudStorage.getItem(key);
      if (!value || value === "") {
        return null;
      }
      return JSON.parse(value);
    } catch (error) {
      console.error("Error reading from cloud storage:", error);
      return null;
    }
  },

  async getKeys() {
    if (!isSupported() || !isAvailable("getKeys")) {
      return [];
    }
    try {
      return await cloudStorage.getKeys();
    } catch (error) {
      console.error("Error getting keys from cloud storage:", error);
      return [];
    }
  },

  async deleteItem(key) {
    if (!isSupported() || !isAvailable("deleteItem")) {
      return Promise.resolve();
    }
    try {
      await cloudStorage.deleteItem(key);
    } catch (error) {
      console.error("Error deleting from cloud storage:", error);
    }
  },

  isSupported,
};

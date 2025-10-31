import { useMemo } from "react";
import { useTelegramTheme } from "./useTelegramTheme";
import { useThemeStore } from "../store/themeStore";

const LIGHT_THEME = {
  bgColor: "#F2F2F7",
  textColor: "#000000",
  buttonColor: "#007AFF",
  buttonTextColor: "#FFFFFF",
  secondaryBgColor: "#FFFFFF",
  hintColor: "#8E8E93",
  linkColor: "#007AFF",
  separatorColor: "rgba(60, 60, 67, 0.29)",
  cardBgColor: "#FFFFFF",
  incomeColor: "#34C759",
  expenseColor: "#FF3B30",
  accentColor: "#007AFF",
  blurBg: "rgba(255, 255, 255, 0.8)",
};

const DARK_THEME = {
  bgColor: "#000000",
  textColor: "#FFFFFF",
  buttonColor: "#0A84FF",
  buttonTextColor: "#FFFFFF",
  secondaryBgColor: "#1C1C1E",
  hintColor: "#8E8E93",
  linkColor: "#0A84FF",
  separatorColor: "rgba(84, 84, 88, 0.65)",
  cardBgColor: "#1C1C1E",
  incomeColor: "#30D158",
  expenseColor: "#FF453A",
  accentColor: "#0A84FF",
  blurBg: "rgba(28, 28, 30, 0.8)",
};

export const useTheme = () => {
  const telegramTheme = useTelegramTheme();
  const themeMode = useThemeStore((state) => state.themeMode);

  const theme = useMemo(() => {
    if (themeMode === "telegram") {
      return telegramTheme;
    } else if (themeMode === "light") {
      return LIGHT_THEME;
    } else {
      return DARK_THEME;
    }
  }, [themeMode, telegramTheme]);

  return theme;
};

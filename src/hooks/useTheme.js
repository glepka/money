import { useMemo } from "react";
import { useTelegramTheme } from "./useTelegramTheme";
import { useThemeStore } from "../store/themeStore";

const LIGHT_THEME = {
  bgColor: "#ffffff",
  textColor: "#000000",
  buttonColor: "#3390ec",
  buttonTextColor: "#ffffff",
  secondaryBgColor: "#f1f1f1",
  hintColor: "#999999",
  linkColor: "#3390ec",
};

const DARK_THEME = {
  bgColor: "#212121",
  textColor: "#ffffff",
  buttonColor: "#3390ec",
  buttonTextColor: "#ffffff",
  secondaryBgColor: "#2b2b2b",
  hintColor: "#707579",
  linkColor: "#5db5f5",
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

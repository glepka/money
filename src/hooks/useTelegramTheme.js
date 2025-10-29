import { useEffect, useState } from "react";
import { themeParams } from "@telegram-apps/sdk";

export const useTelegramTheme = () => {
  const getParams = () => {
    // Если themeParams - функция, вызовем ее.
    if (typeof themeParams === "function") {
      return themeParams() ?? {};
    }
    if (typeof themeParams === "object" && themeParams !== null) {
      return themeParams;
    }
    return {};
  };

  const [theme, setTheme] = useState(() => {
    const params = getParams();
    return {
      bgColor: params.bg_color || params.background_color || "#ffffff",
      textColor: params.text_color || "#000000",
      buttonColor: params.button_color || "#3390ec",
      buttonTextColor: params.button_text_color || "#ffffff",
      secondaryBgColor:
        params.secondary_bg_color ||
        params.secondary_background_color ||
        "#f1f1f1",
      hintColor: params.hint_color || "#999999",
      linkColor: params.link_color || "#3390ec",
    };
  });

  useEffect(() => {
    const updateTheme = () => {
      const params = getParams();
      setTheme({
        bgColor: params.bg_color || params.background_color || "#ffffff",
        textColor: params.text_color || "#000000",
        buttonColor: params.button_color || "#3390ec",
        buttonTextColor: params.button_text_color || "#ffffff",
        secondaryBgColor:
          params.secondary_bg_color ||
          params.secondary_background_color ||
          "#f1f1f1",
        hintColor: params.hint_color || "#999999",
        linkColor: params.link_color || "#3390ec",
      });
    };

    updateTheme();

    // Подписка на изменение если есть onChange
    let unsubscribe = () => {};

    if (typeof themeParams?.onChange === "function") {
      unsubscribe = themeParams.onChange(updateTheme);
    }
    // Иначе – игнорируем

    return () => {
      if (typeof unsubscribe === "function") unsubscribe();
    };
  }, []);

  return theme;
};

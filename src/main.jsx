import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import {
  init,
  disableVerticalSwipes,
  mountSwipeBehavior,
} from "@telegram-apps/sdk";
import App from "./App.jsx";
import "./index.css";

async function initApp() {
  try {
    init();

    // Монтируем и отключаем вертикальные свайпы для предотвращения закрытия приложения
    if (mountSwipeBehavior.isAvailable()) {
      mountSwipeBehavior();
    }

    if (disableVerticalSwipes.isAvailable()) {
      disableVerticalSwipes();
    }

    // Дополнительная защита через прямой API (для совместимости)
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.disableVerticalSwipes();
    }
  } catch (error) {
    console.error("Telegram SDK initialization error:", error);
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

initApp();

import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { init } from "@telegram-apps/sdk";
import App from "./App.jsx";
import "./index.css";

async function initApp() {
  try {
    init();
  } catch (error) {
    console.error("Telegram SDK initialization error:", error);
  }

  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.disableVerticalSwipes();
  }

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

initApp();


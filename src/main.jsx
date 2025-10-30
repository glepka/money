import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import {
  init,
  disableVerticalSwipes,
  mountSwipeBehavior,
} from "@telegram-apps/sdk";
import App from "./App.jsx";
import Home from "./pages/Home.jsx";
import Transactions from "./pages/Transactions.jsx";
import Categories from "./pages/Categories.jsx";
import StatisticsPage from "./pages/Statistics.jsx";
import Budgets from "./pages/Budgets.jsx";
import Currencies from "./pages/Currencies.jsx";
import ExportPage from "./pages/Export.jsx";
import AddTransaction from "./pages/AddTransaction.jsx";
import EditTransaction from "./pages/EditTransaction.jsx";
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

  const router = createBrowserRouter(
    [
      {
        path: "/",
        element: <App />,
        children: [
          { index: true, element: <Home /> },
          { path: "transactions", element: <Transactions /> },
          { path: "categories", element: <Categories /> },
          { path: "statistics", element: <StatisticsPage /> },
          { path: "budgets", element: <Budgets /> },
          { path: "currencies", element: <Currencies /> },
          { path: "export", element: <ExportPage /> },
          { path: "add", element: <AddTransaction /> },
          { path: "edit/:id", element: <EditTransaction /> },
        ],
      },
    ],
    {
      basename: "/money",
    }
  );

  createRoot(document.getElementById("root")).render(
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );
}

initApp();

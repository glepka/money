import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useTheme } from "./hooks/useTheme";
import { useTransactionStore } from "./store/transactionsStore";
import { useCategoryStore } from "./store/categoriesStore";
import { useCurrencyStore } from "./store/currenciesStore";
import { useBudgetStore } from "./store/budgetsStore";
import { useSettingsStore } from "./store/settingsStore";
import { useThemeStore } from "./store/themeStore";
import { useNotifications } from "./hooks/useNotifications";
import Header from "./components/Header/Header";
import FloatingMenu from "./components/FloatingMenu/FloatingMenu";
import FloatingAddButton from "./components/FloatingAddButton/FloatingAddButton";
import styles from "./App.module.css";

function App() {
  const theme = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const loadTransactions = useTransactionStore(
    (state) => state.loadTransactions
  );
  const loadCategories = useCategoryStore((state) => state.loadCategories);
  const loadCurrencies = useCurrencyStore((state) => state.loadCurrencies);
  const loadBudgets = useBudgetStore((state) => state.loadBudgets);
  const loadSettings = useSettingsStore((state) => state.loadSettings);
  const loadTheme = useThemeStore((state) => state.loadTheme);

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([
        loadTransactions(),
        loadCategories(),
        loadCurrencies(),
        loadBudgets(),
        loadSettings(),
        loadTheme(),
      ]);
    };
    initialize();
  }, [
    loadTransactions,
    loadCategories,
    loadCurrencies,
    loadBudgets,
    loadSettings,
    loadTheme,
  ]);

  useNotifications();

  // Предотвращение закрытия приложения при скролле
  useEffect(() => {
    const handleTouchStart = (e) => {
      const mainElement = document.querySelector("main");
      if (mainElement) {
        const touch = e.touches[0];
        const target = document.elementFromPoint(touch.clientX, touch.clientY);
        if (mainElement.contains(target) || mainElement === target) {
          // Скролл происходит внутри контента - предотвращаем закрытие
          if (window.Telegram?.WebApp) {
            window.Telegram.WebApp.disableVerticalSwipes();
          }
        }
      }
    };

    document.addEventListener("touchstart", handleTouchStart, {
      passive: true,
    });

    return () => {
      document.removeEventListener("touchstart", handleTouchStart);
    };
  }, []);

  const handleAddTransaction = () => {
    navigate("/add");
  };

  const showAddButton =
    location.pathname === "/" || location.pathname.startsWith("/transactions");

  return (
    <div
      className={styles.app}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      <Header />
      <main className={styles.main}>
        <Outlet />
      </main>
      {showAddButton && <FloatingAddButton onClick={handleAddTransaction} />}
      <FloatingMenu />
    </div>
  );
}

export default App;

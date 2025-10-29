import { useState, useEffect } from "react";
import { useTelegramTheme } from "./hooks/useTelegramTheme";
import { useTransactionStore } from "./store/transactionsStore";
import { useCategoryStore } from "./store/categoriesStore";
import { useCurrencyStore } from "./store/currenciesStore";
import { useBudgetStore } from "./store/budgetsStore";
import { useSettingsStore } from "./store/settingsStore";
import { useNotifications } from "./hooks/useNotifications";
import Header from "./components/Header/Header";
import FloatingMenu from "./components/FloatingMenu/FloatingMenu";
import FloatingAddButton from "./components/FloatingAddButton/FloatingAddButton";
import TransactionList from "./components/TransactionList/TransactionList";
import BudgetList from "./components/BudgetList/BudgetList";
import TransactionForm from "./components/TransactionForm/TransactionForm";
import CategoryManager from "./components/CategoryManager/CategoryManager";
import Statistics from "./components/Statistics/Statistics";
import BudgetPanel from "./components/BudgetPanel/BudgetPanel";
import CurrencySettings from "./components/CurrencySettings/CurrencySettings";
import ExportPanel from "./components/ExportPanel/ExportPanel";
import styles from "./App.module.css";

const VIEWS = {
  TRANSACTIONS: "transactions",
  ADD_TRANSACTION: "add",
  EDIT_TRANSACTION: "edit",
  CATEGORIES: "categories",
  STATISTICS: "statistics",
  BUDGETS: "budgets",
  CURRENCIES: "currencies",
  EXPORT: "export",
};

function App() {
  const theme = useTelegramTheme();
  const [view, setView] = useState(null);
  const [editingTransactionId, setEditingTransactionId] = useState(null);

  const loadTransactions = useTransactionStore(
    (state) => state.loadTransactions
  );
  const loadCategories = useCategoryStore((state) => state.loadCategories);
  const loadCurrencies = useCurrencyStore((state) => state.loadCurrencies);
  const loadBudgets = useBudgetStore((state) => state.loadBudgets);
  const loadSettings = useSettingsStore((state) => state.loadSettings);

  useEffect(() => {
    const initialize = async () => {
      await Promise.all([
        loadTransactions(),
        loadCategories(),
        loadCurrencies(),
        loadBudgets(),
        loadSettings(),
      ]);
    };
    initialize();
  }, [
    loadTransactions,
    loadCategories,
    loadCurrencies,
    loadBudgets,
    loadSettings,
  ]);

  useNotifications();

  const handleAddTransaction = () => {
    setEditingTransactionId(null);
    setView(VIEWS.ADD_TRANSACTION);
  };

  const handleEditTransaction = (id) => {
    setEditingTransactionId(id);
    setView(VIEWS.EDIT_TRANSACTION);
  };

  const handleBack = () => {
    setView(null);
    setEditingTransactionId(null);
  };

  const renderView = () => {
    switch (view) {
      case VIEWS.ADD_TRANSACTION:
      case VIEWS.EDIT_TRANSACTION:
        return (
          <TransactionForm
            transactionId={editingTransactionId}
            onSave={handleBack}
            onCancel={handleBack}
          />
        );
      case VIEWS.TRANSACTIONS:
        return (
          <TransactionList
            onAdd={handleAddTransaction}
            onEdit={handleEditTransaction}
          />
        );
      case VIEWS.CATEGORIES:
        return <CategoryManager onBack={handleBack} />;
      case VIEWS.STATISTICS:
        return <Statistics onBack={handleBack} />;
      case VIEWS.BUDGETS:
        return <BudgetPanel onBack={handleBack} />;
      case VIEWS.CURRENCIES:
        return <CurrencySettings onBack={handleBack} />;
      case VIEWS.EXPORT:
        return <ExportPanel onBack={handleBack} />;
      default:
        return <BudgetList onAdd={handleAddTransaction} />;
    }
  };

  return (
    <div
      className={styles.app}
      style={{
        backgroundColor: theme.bgColor,
        color: theme.textColor,
      }}
    >
      <Header view={view} onNavigate={setView} />
      <main className={styles.main}>{renderView()}</main>
      {(view === null || view === VIEWS.TRANSACTIONS) && (
        <FloatingAddButton onClick={handleAddTransaction} />
      )}
      <FloatingMenu
        onViewTransactions={() => setView(VIEWS.TRANSACTIONS)}
        onViewCategories={() => setView(VIEWS.CATEGORIES)}
        onViewStatistics={() => setView(VIEWS.STATISTICS)}
        onViewBudgets={() => setView(VIEWS.BUDGETS)}
        onViewCurrencies={() => setView(VIEWS.CURRENCIES)}
        onViewExport={() => setView(VIEWS.EXPORT)}
      />
    </div>
  );
}

export default App;

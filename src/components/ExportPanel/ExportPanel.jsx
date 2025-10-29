import { useTransactionStore } from "../../store/transactionsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useBudgetStore } from "../../store/budgetsStore";
import { useCurrencyStore } from "../../store/currenciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import { exportToJSON, exportToCSV } from "../../utils/exporters";
import styles from "./ExportPanel.module.css";

const ExportPanel = ({ onBack }) => {
  const theme = useTelegramTheme();
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);
  const budgets = useBudgetStore((state) => state.budgets);
  const currencies = useCurrencyStore((state) => state.currencies);
  const settings = useSettingsStore((state) => state.settings);

  const handleExportJSON = () => {
    const data = {
      transactions,
      categories,
      budgets,
      currencies,
      settings,
      exportedAt: new Date().toISOString(),
    };
    exportToJSON(data);
  };

  const handleExportCSV = () => {
    exportToCSV(transactions, categories);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Экспорт данных</h2>
      </div>

      <div
        className={styles.info}
        style={{
          backgroundColor: theme.secondaryBgColor,
        }}
      >
        <p>Экспортируйте все ваши данные для резервного копирования или анализа.</p>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Транзакций:</span>
            <span className={styles.statValue}>{transactions.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Категорий:</span>
            <span className={styles.statValue}>{categories.length}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statLabel}>Бюджетов:</span>
            <span className={styles.statValue}>{budgets.length}</span>
          </div>
        </div>
      </div>

      <div className={styles.exportOptions}>
        <button
          onClick={handleExportJSON}
          className={styles.exportButton}
          style={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
          }}
        >
          📄 Экспорт JSON
        </button>
        <p className={styles.exportDescription}>
          Полный экспорт всех данных в формате JSON (транзакции, категории, бюджеты, настройки)
        </p>

        <button
          onClick={handleExportCSV}
          className={styles.exportButton}
          style={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
          }}
        >
          📊 Экспорт CSV
        </button>
        <p className={styles.exportDescription}>
          Экспорт транзакций в формате CSV для работы в Excel или других табличных редакторах
        </p>
      </div>
    </div>
  );
};

export default ExportPanel;


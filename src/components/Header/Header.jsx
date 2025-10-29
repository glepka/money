import { useTransactionStore } from "../../store/transactionsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import { calculateBalance } from "../../utils/calculators";
import { formatAmount } from "../../utils/formatters";
import styles from "./Header.module.css";

const Header = ({ view, onNavigate }) => {
  const theme = useTelegramTheme();
  const transactions = useTransactionStore((state) => state.transactions);
  const settings = useSettingsStore((state) => state.settings);
  const balance = calculateBalance(transactions, settings.defaultCurrency);

  const isMainView = view === "transactions";

  return (
    <>
      <header
        className={styles.header}
        style={{
          backgroundColor: theme.secondaryBgColor || theme.bgColor,
          borderBottom: `1px solid ${theme.hintColor}20`,
        }}
      >
        <div className={styles.topRow}>
          {!isMainView && (
            <button
              className={styles.backButton}
              onClick={() => onNavigate("transactions")}
              style={{
                color: theme.linkColor,
              }}
            >
              ← Назад
            </button>
          )}
        </div>
        <div className={styles.content}>
          <div className={styles.balance}>
            <span className={styles.label}>Баланс</span>
            <span
              className={styles.amount}
              style={{
                color: balance >= 0 ? "#4CAF50" : "#F44336",
              }}
            >
              {formatAmount(Math.abs(balance), settings.defaultCurrency)}
            </span>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

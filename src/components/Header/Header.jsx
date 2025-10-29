import { useState } from "react";
import { useTransactionStore } from "../../store/transactionsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTheme } from "../../hooks/useTheme";
import { calculateBalance } from "../../utils/calculators";
import { formatAmount } from "../../utils/formatters";
import styles from "./Header.module.css";

const Header = ({ view, onNavigate }) => {
  const theme = useTheme();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState("");
  const transactions = useTransactionStore((state) => state.transactions);
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const initialBalance =
    settings.initialBalance?.[settings.defaultCurrency] || 0;
  const balance = calculateBalance(
    transactions,
    settings.defaultCurrency,
    initialBalance
  );

  const isMainView = view === null;

  const handleBalanceClick = () => {
    setIsEditing(true);
    setEditValue(balance.toString());
  };

  const handleBalanceSave = async () => {
    const newBalance = parseFloat(editValue) || 0;
    const transactionsBalance = balance - initialBalance;
    const newInitialBalance = newBalance - transactionsBalance;

    const updatedInitialBalance = {
      ...(settings.initialBalance || {}),
      [settings.defaultCurrency]: newInitialBalance,
    };

    await updateSettings({ initialBalance: updatedInitialBalance });
    setIsEditing(false);
    setEditValue("");
  };

  const handleBalanceCancel = () => {
    setIsEditing(false);
    setEditValue("");
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleBalanceSave();
    } else if (e.key === "Escape") {
      handleBalanceCancel();
    }
  };

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
              onClick={() => onNavigate(null)}
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
            {isEditing ? (
              <div className={styles.balanceEdit}>
                <input
                  type="number"
                  step="0.01"
                  value={editValue}
                  onChange={(e) => setEditValue(e.target.value)}
                  onKeyDown={handleKeyPress}
                  onBlur={handleBalanceSave}
                  autoFocus
                  className={styles.balanceInput}
                  style={{
                    color: parseFloat(editValue) >= 0 ? "#4CAF50" : "#F44336",
                    borderColor: theme.hintColor,
                    backgroundColor: theme.bgColor,
                  }}
                />
              </div>
            ) : (
              <span
                className={styles.amount}
                onClick={handleBalanceClick}
                style={{
                  color: balance >= 0 ? "#4CAF50" : "#F44336",
                  cursor: "pointer",
                }}
                title="Нажмите для редактирования"
              >
                {formatAmount(Math.abs(balance), settings.defaultCurrency)}
              </span>
            )}
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;

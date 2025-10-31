import { useState } from "react";
import { useBudgetStore } from "../../store/budgetsStore";
import { useTransactionStore } from "../../store/transactionsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTheme } from "../../hooks/useTheme";
import { formatAmount } from "../../utils/formatters";
import {
  calculateBudgetProgress,
  getCurrentPeriod,
} from "../../utils/calculators";
import BudgetModal from "../BudgetModal/BudgetModal";
import styles from "./BudgetPanel.module.css";

const BudgetPanel = () => {
  const theme = useTheme();
  const budgets = useBudgetStore((state) => state.budgets);
  const removeBudget = useBudgetStore((state) => state.removeBudget);
  const transactionsRaw = useTransactionStore((state) => state.transactions);
  const transactions = Array.isArray(transactionsRaw) ? transactionsRaw : [];
  const settings = useSettingsStore((state) => state.settings);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const totalsByCurrency = budgets.reduce((acc, b) => {
    const currency = b.currency || settings.defaultCurrency || "RUB";
    const amount =
      typeof b.amount === "number" ? b.amount : parseFloat(b.amount) || 0;
    acc[currency] = (acc[currency] || 0) + amount;
    return acc;
  }, {});

  const totalsLine = Object.entries(totalsByCurrency)
    .map(([currency, amount]) => formatAmount(amount, currency))
    .join(" + ");

  const handleOpenModal = (id = null) => {
    setEditingId(id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
  };

  const handleDelete = async (id) => {
    if (confirm("Удалить бюджет?")) {
      await removeBudget(id);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Бюджеты</h2>
        <button
          onClick={() => handleOpenModal()}
          className={styles.addButton}
          style={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
          }}
        >
          + Добавить
        </button>
      </div>

      {budgets.length > 0 && (
        <div className={styles.totals}>
          <span>Итого: </span>
          <strong>{totalsLine}</strong>
        </div>
      )}

      <BudgetModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        editingId={editingId}
      />

      <div className={styles.budgets}>
        {budgets.length === 0 ? (
          <div className={styles.empty}>
            <p>Нет бюджетов</p>
          </div>
        ) : (
          budgets.map((budget) => {
            const currentPeriod = getCurrentPeriod(budget);
            const progress = calculateBudgetProgress(
              budget,
              transactions,
              currentPeriod.start,
              currentPeriod.end
            );

            return (
              <div
                key={budget.id}
                className={styles.budgetCard}
                style={{
                  backgroundColor: theme.secondaryBgColor,
                }}
              >
                <div className={styles.budgetHeader}>
                  <div className={styles.budgetInfo}>
                    <div
                      className={styles.budgetIcon}
                      style={{
                        backgroundColor: "#999999",
                      }}
                    >
                      {budget.icon || "💰"}
                    </div>
                    <div>
                      <div className={styles.budgetName}>{budget.name}</div>
                    </div>
                  </div>
                  <div className={styles.budgetActions}>
                    <button
                      onClick={() => handleOpenModal(budget.id)}
                      style={{ color: theme.linkColor }}
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(budget.id)}
                      style={{ color: "#F44336" }}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className={styles.budgetProgress}>
                  <div className={styles.budgetAmounts}>
                    <span style={{ color: "#F44336" }}>
                      {formatAmount(progress.spent, budget.currency)}
                    </span>
                    <span style={{ opacity: 0.6 }}>
                      / {formatAmount(progress.limit, budget.currency)}
                    </span>
                  </div>
                  <div className={styles.progressBar}>
                    <div
                      className={styles.progressFill}
                      style={{
                        width: `${progress.percentage}%`,
                        backgroundColor: progress.exceeded
                          ? "#F44336"
                          : progress.percentage >= 80
                          ? "#FF9800"
                          : "#4CAF50",
                      }}
                    />
                  </div>
                  <div className={styles.budgetFooter}>
                    <span className={styles.progressText}>
                      {progress.percentage.toFixed(1)}%
                    </span>
                    <span
                      style={{
                        color: progress.remaining >= 0 ? "#4CAF50" : "#F44336",
                      }}
                    >
                      {progress.remaining >= 0 ? "Осталось" : "Превышено"}:{" "}
                      {formatAmount(
                        Math.abs(progress.remaining),
                        budget.currency
                      )}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default BudgetPanel;

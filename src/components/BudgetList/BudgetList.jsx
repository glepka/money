import { useBudgetStore } from "../../store/budgetsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useTransactionStore } from "../../store/transactionsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import { formatAmount } from "../../utils/formatters";
import {
  calculateBudgetProgress,
  calculateBalance,
} from "../../utils/calculators";
import CategoryBadge from "../shared/CategoryBadge/CategoryBadge";
import styles from "./BudgetList.module.css";

const BudgetList = ({ onAdd }) => {
  const theme = useTelegramTheme();
  const budgets = useBudgetStore((state) => state.budgets);
  const categories = useCategoryStore((state) => state.categories);
  const transactions = useTransactionStore((state) => state.transactions);
  const settings = useSettingsStore((state) => state.settings);

  const balance = calculateBalance(transactions, settings.defaultCurrency);
  const income = transactions
    .filter((t) => t.type === "income")
    .reduce(
      (sum, t) =>
        sum + (t.currency === settings.defaultCurrency ? t.amount : 0),
      0
    );
  const expenses = transactions
    .filter((t) => t.type === "expense")
    .reduce(
      (sum, t) =>
        sum + (t.currency === settings.defaultCurrency ? t.amount : 0),
      0
    );

  if (budgets.length === 0) {
    return (
      <div className={styles.container}>
        <div
          className={styles.summary}
          style={{
            backgroundColor: theme.secondaryBgColor,
          }}
        >
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Доходы</span>
            <span className={styles.summaryAmount} style={{ color: "#4CAF50" }}>
              {formatAmount(income, settings.defaultCurrency)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Расходы</span>
            <span className={styles.summaryAmount} style={{ color: "#F44336" }}>
              {formatAmount(expenses, settings.defaultCurrency)}
            </span>
          </div>
          <div className={styles.summaryItem}>
            <span className={styles.summaryLabel}>Баланс</span>
            <span
              className={styles.summaryAmount}
              style={{ color: balance >= 0 ? "#4CAF50" : "#F44336" }}
            >
              {formatAmount(Math.abs(balance), settings.defaultCurrency)}
            </span>
          </div>
        </div>
        <div className={styles.empty}>
          <p>Нет бюджетов</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.summary}
        style={{
          backgroundColor: theme.secondaryBgColor,
        }}
      >
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Доходы</span>
          <span className={styles.summaryAmount} style={{ color: "#4CAF50" }}>
            {formatAmount(income, settings.defaultCurrency)}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Расходы</span>
          <span className={styles.summaryAmount} style={{ color: "#F44336" }}>
            {formatAmount(expenses, settings.defaultCurrency)}
          </span>
        </div>
        <div className={styles.summaryItem}>
          <span className={styles.summaryLabel}>Баланс</span>
          <span
            className={styles.summaryAmount}
            style={{ color: balance >= 0 ? "#4CAF50" : "#F44336" }}
          >
            {formatAmount(Math.abs(balance), settings.defaultCurrency)}
          </span>
        </div>
      </div>
      <div className={styles.budgets}>
        {budgets.map((budget) => {
          const category = budget.categoryId
            ? categories.find((c) => c.id === budget.categoryId)
            : null;

          const progress = calculateBudgetProgress(
            budget,
            transactions,
            budget.periodStart,
            budget.periodEnd
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
                  {category && <CategoryBadge category={category} />}
                  <div>
                    <div className={styles.budgetName}>{budget.name}</div>
                    {category && (
                      <div className={styles.budgetCategory}>
                        {category.name}
                      </div>
                    )}
                  </div>
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
        })}
      </div>
    </div>
  );
};

export default BudgetList;

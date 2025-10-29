import { useState, useEffect } from "react";
import { useBudgetStore } from "../../store/budgetsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useTransactionStore } from "../../store/transactionsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import { formatAmount } from "../../utils/formatters";
import { calculateBudgetProgress } from "../../utils/calculators";
import CategoryBadge from "../shared/CategoryBadge/CategoryBadge";
import styles from "./BudgetPanel.module.css";

const BudgetPanel = ({ onBack }) => {
  const theme = useTelegramTheme();
  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  const updateBudget = useBudgetStore((state) => state.updateBudget);
  const removeBudget = useBudgetStore((state) => state.removeBudget);
  const categories = useCategoryStore((state) => state.categories);
  const transactions = useTransactionStore((state) => state.transactions);
  const settings = useSettingsStore((state) => state.settings);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    categoryId: "",
    amount: "",
    currency: settings.defaultCurrency,
    periodStart: new Date().toISOString().split("T")[0],
    periodEnd: (() => {
      const date = new Date();
      date.setMonth(date.getMonth() + 1);
      return date.toISOString().split("T")[0];
    })(),
  });

  useEffect(() => {
    if (editingId) {
      const budget = budgets.find((b) => b.id === editingId);
      if (budget) {
        setFormData({
          name: budget.name,
          categoryId: budget.categoryId || "",
          amount: budget.amount.toString(),
          currency: budget.currency || settings.defaultCurrency,
          periodStart: budget.periodStart.split("T")[0],
          periodEnd: budget.periodEnd.split("T")[0],
        });
        setShowForm(true);
      }
    }
  }, [editingId, budgets, settings.defaultCurrency]);

  const handleSave = async () => {
    if (!formData.name || !formData.amount || parseFloat(formData.amount) <= 0) {
      return;
    }

    const budgetData = {
      name: formData.name,
      categoryId: formData.categoryId || null,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      periodStart: new Date(formData.periodStart).toISOString(),
      periodEnd: new Date(formData.periodEnd).toISOString(),
    };

    if (editingId) {
      await updateBudget(editingId, budgetData);
    } else {
      await addBudget(budgetData);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData({
      name: "",
      categoryId: "",
      amount: "",
      currency: settings.defaultCurrency,
      periodStart: new Date().toISOString().split("T")[0],
      periodEnd: (() => {
        const date = new Date();
        date.setMonth(date.getMonth() + 1);
        return date.toISOString().split("T")[0];
      })(),
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Удалить бюджет?")) {
      await removeBudget(id);
    }
  };

  const expenseCategories = categories.filter((c) => c.type === "expense");

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Бюджеты</h2>
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
          }}
          className={styles.addButton}
          style={{
            backgroundColor: theme.buttonColor,
            color: theme.buttonTextColor,
          }}
        >
          + Добавить
        </button>
      </div>

      {showForm && (
        <div
          className={styles.form}
          style={{
            backgroundColor: theme.secondaryBgColor,
          }}
        >
          <input
            type="text"
            placeholder="Название бюджета"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          />
          <select
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          >
            <option value="">Все категории</option>
            {expenseCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
          <div className={styles.amountInput}>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Сумма"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              style={{
                backgroundColor: theme.bgColor,
                color: theme.textColor,
              }}
            />
            <select
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              style={{
                backgroundColor: theme.bgColor,
                color: theme.textColor,
              }}
            >
              <option value="RUB">₽ RUB</option>
              <option value="USD">$ USD</option>
              <option value="EUR">€ EUR</option>
            </select>
          </div>
          <input
            type="date"
            label="Начало периода"
            value={formData.periodStart}
            onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          />
          <input
            type="date"
            label="Конец периода"
            value={formData.periodEnd}
            onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          />
          <div className={styles.formActions}>
            <button
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
              }}
            >
              Отмена
            </button>
            <button
              onClick={handleSave}
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
              }}
            >
              Сохранить
            </button>
          </div>
        </div>
      )}

      <div className={styles.budgets}>
        {budgets.length === 0 ? (
          <div className={styles.empty}>
            <p>Нет бюджетов</p>
          </div>
        ) : (
          budgets.map((budget) => {
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
                        <div className={styles.budgetCategory}>{category.name}</div>
                      )}
                    </div>
                  </div>
                  <div className={styles.budgetActions}>
                    <button
                      onClick={() => {
                        setEditingId(budget.id);
                      }}
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
                      {formatAmount(Math.abs(progress.remaining), budget.currency)}
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


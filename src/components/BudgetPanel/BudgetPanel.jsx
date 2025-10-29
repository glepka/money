import { useState, useEffect } from "react";
import { useBudgetStore } from "../../store/budgetsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useTransactionStore } from "../../store/transactionsStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTheme } from "../../hooks/useTheme";
import { formatAmount } from "../../utils/formatters";
import { calculateBudgetProgress } from "../../utils/calculators";
import styles from "./BudgetPanel.module.css";

const BudgetPanel = ({ onBack }) => {
  const theme = useTheme();
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
    categoryIds: [],
    amount: "",
    currency: settings.defaultCurrency,
    icon: "💰",
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
        // Поддержка обратной совместимости
        const categoryIds =
          budget.categoryIds || (budget.categoryId ? [budget.categoryId] : []);
        setFormData({
          name: budget.name,
          categoryIds: categoryIds,
          amount: budget.amount.toString(),
          currency: budget.currency || settings.defaultCurrency,
          icon: budget.icon || "💰",
          periodStart: budget.periodStart.split("T")[0],
          periodEnd: budget.periodEnd.split("T")[0],
        });
        setShowForm(true);
      }
    }
  }, [editingId, budgets, settings.defaultCurrency]);

  const handleSave = async () => {
    if (
      !formData.name ||
      !formData.amount ||
      parseFloat(formData.amount) <= 0
    ) {
      return;
    }

    const budgetData = {
      name: formData.name,
      categoryIds:
        formData.categoryIds.length > 0 ? formData.categoryIds : null,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      icon: formData.icon || "💰",
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
      categoryIds: [],
      amount: "",
      currency: settings.defaultCurrency,
      icon: "💰",
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

  const budgetIcons = [
    "💰",
    "💵",
    "💳",
    "📊",
    "📈",
    "🎯",
    "🏦",
    "💼",
    "📱",
    "🚗",
    "🏠",
    "🍔",
    "🛒",
    "✈️",
    "🎮",
  ];

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
          <div className={styles.iconSelector}>
            <label>Иконка (эмодзи)</label>
            <div className={styles.emojiInput}>
              <input
                type="text"
                placeholder="Введите эмодзи"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                maxLength={2}
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.textColor,
                  fontSize: "24px",
                  textAlign: "center",
                  padding: "12px",
                }}
              />
            </div>
            <div className={styles.icons}>
              {budgetIcons.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => setFormData({ ...formData, icon })}
                  className={formData.icon === icon ? styles.selected : ""}
                  style={{
                    backgroundColor: theme.bgColor,
                  }}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.categorySelector}>
            <label
              style={{
                fontSize: "14px",
                opacity: 0.8,
                marginBottom: "8px",
                display: "block",
                color: theme.textColor,
              }}
            >
              Категории и подкатегории (можно выбрать несколько)
            </label>
            <div
              className={styles.categoryList}
              style={{
                backgroundColor: theme.bgColor,
                borderColor: theme.hintColor + "30",
                color: theme.textColor,
              }}
            >
              {expenseCategories
                .filter((cat) => !cat.parentId)
                .map((cat) => {
                  const subcategories = expenseCategories.filter(
                    (c) => c.parentId === cat.id
                  );
                  return (
                    <div key={cat.id} className={styles.categoryGroup}>
                      <label className={styles.categoryItem}>
                        <input
                          type="checkbox"
                          checked={formData.categoryIds.includes(cat.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData({
                                ...formData,
                                categoryIds: [...formData.categoryIds, cat.id],
                              });
                            } else {
                              setFormData({
                                ...formData,
                                categoryIds: formData.categoryIds.filter(
                                  (id) => id !== cat.id
                                ),
                              });
                            }
                          }}
                          style={{
                            marginRight: "8px",
                          }}
                        />
                        <span>{cat.name}</span>
                      </label>
                      {subcategories.length > 0 && (
                        <div className={styles.subcategoryGroup}>
                          {subcategories.map((sub) => (
                            <label
                              key={sub.id}
                              className={styles.categoryItem}
                              style={{ marginLeft: "20px" }}
                            >
                              <input
                                type="checkbox"
                                checked={formData.categoryIds.includes(sub.id)}
                                onChange={(e) => {
                                  if (e.target.checked) {
                                    setFormData({
                                      ...formData,
                                      categoryIds: [
                                        ...formData.categoryIds,
                                        sub.id,
                                      ],
                                    });
                                  } else {
                                    setFormData({
                                      ...formData,
                                      categoryIds: formData.categoryIds.filter(
                                        (id) => id !== sub.id
                                      ),
                                    });
                                  }
                                }}
                                style={{
                                  marginRight: "8px",
                                }}
                              />
                              <span>{sub.name}</span>
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
            </div>
          </div>
          <div className={styles.amountInput}>
            <input
              type="number"
              step="0.01"
              min="0"
              placeholder="Сумма"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              style={{
                backgroundColor: theme.bgColor,
                color: theme.textColor,
              }}
            />
            <select
              value={formData.currency}
              onChange={(e) =>
                setFormData({ ...formData, currency: e.target.value })
              }
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
            onChange={(e) =>
              setFormData({ ...formData, periodStart: e.target.value })
            }
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          />
          <input
            type="date"
            label="Конец периода"
            value={formData.periodEnd}
            onChange={(e) =>
              setFormData({ ...formData, periodEnd: e.target.value })
            }
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

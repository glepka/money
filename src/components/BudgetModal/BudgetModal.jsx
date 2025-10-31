import { useState, useEffect } from "react";
import { useBudgetStore } from "../../store/budgetsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTheme } from "../../hooks/useTheme";
import styles from "./BudgetModal.module.css";

const BudgetModal = ({ isOpen, onClose, editingId = null }) => {
  const theme = useTheme();
  const budgets = useBudgetStore((state) => state.budgets);
  const addBudget = useBudgetStore((state) => state.addBudget);
  const updateBudget = useBudgetStore((state) => state.updateBudget);
  const categories = useCategoryStore((state) => state.categories);
  const settings = useSettingsStore((state) => state.settings);

  const [formData, setFormData] = useState({
    name: "",
    categoryIds: [],
    amount: "",
    currency: settings.defaultCurrency,
    icon: "💰",
    periodStart: new Date().toISOString().split("T")[0],
    renewalPeriod: "month",
    customDays: 30,
  });

  useEffect(() => {
    if (editingId && isOpen) {
      const budget = budgets.find((b) => b.id === editingId);
      if (budget) {
        const categoryIds =
          budget.categoryIds || (budget.categoryId ? [budget.categoryId] : []);
        setFormData({
          name: budget.name,
          categoryIds: categoryIds,
          amount: budget.amount.toString(),
          currency: budget.currency || settings.defaultCurrency,
          icon: budget.icon || "💰",
          periodStart: budget.periodStart.split("T")[0],
          renewalPeriod: budget.renewalPeriod || "month",
          customDays: budget.customDays || 30,
        });
      }
    } else if (isOpen) {
      setFormData({
        name: "",
        categoryIds: [],
        amount: "",
        currency: settings.defaultCurrency,
        icon: "💰",
        periodStart: new Date().toISOString().split("T")[0],
        renewalPeriod: "month",
        customDays: 30,
      });
    }
  }, [editingId, isOpen, budgets, settings.defaultCurrency]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

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
      renewalPeriod: formData.renewalPeriod,
      customDays: formData.customDays,
    };

    if (editingId) {
      await updateBudget(editingId, budgetData);
    } else {
      await addBudget(budgetData);
    }

    onClose();
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

  if (!isOpen) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        style={{
          backgroundColor: theme.secondaryBgColor,
        }}
      >
        <div className={styles.header}>
          <h2>{editingId ? "Изменить бюджет" : "Добавить бюджет"}</h2>
          <button
            onClick={onClose}
            className={styles.closeButton}
            style={{
              color: theme.textColor,
            }}
          >
            ✕
          </button>
        </div>

        <div className={styles.content}>
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
                              const subcategoryIds = subcategories.map(
                                (sub) => sub.id
                              );
                              setFormData({
                                ...formData,
                                categoryIds: [
                                  ...formData.categoryIds,
                                  cat.id,
                                  ...subcategoryIds,
                                ],
                              });
                            } else {
                              const subcategoryIds = subcategories.map(
                                (sub) => sub.id
                              );
                              setFormData({
                                ...formData,
                                categoryIds: formData.categoryIds.filter(
                                  (id) =>
                                    id !== cat.id &&
                                    !subcategoryIds.includes(id)
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
          <div className={styles.periodSelector}>
            <label
              style={{
                fontSize: "14px",
                opacity: 0.8,
                marginBottom: "8px",
                display: "block",
                color: theme.textColor,
              }}
            >
              Период обновления
            </label>
            <select
              value={formData.renewalPeriod}
              onChange={(e) =>
                setFormData({ ...formData, renewalPeriod: e.target.value })
              }
              style={{
                backgroundColor: theme.bgColor,
                color: theme.textColor,
              }}
            >
              <option value="week">Неделя</option>
              <option value="month">Месяц</option>
              <option value="custom">Свое количество дней</option>
            </select>
            {formData.renewalPeriod === "custom" && (
              <input
                type="number"
                min="1"
                placeholder="Количество дней"
                value={formData.customDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    customDays: parseInt(e.target.value) || 30,
                  })
                }
                style={{
                  backgroundColor: theme.bgColor,
                  color: theme.textColor,
                  marginTop: "8px",
                }}
              />
            )}
          </div>
        </div>

        <div className={styles.footer}>
          <button
            onClick={onClose}
            className={styles.cancelButton}
            style={{
              backgroundColor: theme.bgColor,
              color: theme.textColor,
            }}
          >
            Отмена
          </button>
          <button
            onClick={handleSave}
            className={styles.saveButton}
            style={{
              backgroundColor: theme.buttonColor,
              color: theme.buttonTextColor,
            }}
          >
            Сохранить
          </button>
        </div>
      </div>
    </div>
  );
};

export default BudgetModal;


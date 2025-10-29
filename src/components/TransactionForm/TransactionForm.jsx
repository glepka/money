import { useState, useEffect } from "react";
import { useTransactionStore } from "../../store/transactionsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useCurrencyStore } from "../../store/currenciesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useTheme } from "../../hooks/useTheme";
import styles from "./TransactionForm.module.css";

const TransactionForm = ({ transactionId, onSave, onCancel }) => {
  const theme = useTheme();
  const getTransaction = useTransactionStore(
    (state) => state.getTransactionById
  );
  const updateTransaction = useTransactionStore(
    (state) => state.updateTransaction
  );
  const addTransaction = useTransactionStore((state) => state.addTransaction);
  const categories = useCategoryStore((state) => state.categories);
  const currencies = useCurrencyStore((state) => state.currencies);
  const settings = useSettingsStore((state) => state.settings);

  const [type, setType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(settings.defaultCurrency);
  const [categoryId, setCategoryId] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);

  useEffect(() => {
    if (transactionId) {
      const transaction = getTransaction(transactionId);
      if (transaction) {
        setType(transaction.type);
        setAmount(transaction.amount.toString());
        setCurrency(transaction.currency || settings.defaultCurrency);
        setCategoryId(transaction.categoryId || "");
        setDescription(transaction.description || "");
        setDate(transaction.date.split("T")[0]);
      }
    } else {
      setCategoryId(categories.find((c) => c.type === type)?.id || "");
    }
  }, [
    transactionId,
    getTransaction,
    categories,
    type,
    settings.defaultCurrency,
  ]);

  const filteredCategories = categories.filter(
    (c) => c.type === type && !c.parentId
  );
  const allCategories = categories.filter((c) => c.type === type);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0 || !categoryId) {
      return;
    }

    const transactionData = {
      type,
      amount: parseFloat(amount),
      currency,
      categoryId,
      description: description.trim(),
      date: new Date(date).toISOString(),
    };

    if (transactionId) {
      await updateTransaction(transactionId, transactionData);
    } else {
      await addTransaction(transactionData);
    }

    onSave();
  };

  return (
    <div className={styles.formContainer}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.typeSelector}>
          <button
            type="button"
            className={`${styles.typeButton} ${
              type === "income" ? styles.active : ""
            }`}
            onClick={() => setType("income")}
            style={{
              backgroundColor:
                type === "income" ? theme.buttonColor : theme.secondaryBgColor,
              color:
                type === "income" ? theme.buttonTextColor : theme.textColor,
            }}
          >
            Доход
          </button>
          <button
            type="button"
            className={`${styles.typeButton} ${
              type === "expense" ? styles.active : ""
            }`}
            onClick={() => setType("expense")}
            style={{
              backgroundColor:
                type === "expense" ? theme.buttonColor : theme.secondaryBgColor,
              color:
                type === "expense" ? theme.buttonTextColor : theme.textColor,
            }}
          >
            Расход
          </button>
        </div>

        <div className={styles.field}>
          <label>Сумма</label>
          <div className={styles.amountInput}>
            <input
              type="number"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              required
              style={{
                backgroundColor: theme.secondaryBgColor,
                color: theme.textColor,
                borderColor: theme.hintColor + "30",
              }}
            />
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              style={{
                backgroundColor: theme.secondaryBgColor,
                color: theme.textColor,
                borderColor: theme.hintColor + "30",
              }}
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className={styles.field}>
          <label>Категория</label>
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            required
            style={{
              backgroundColor: theme.secondaryBgColor,
              color: theme.textColor,
              borderColor: theme.hintColor + "30",
            }}
          >
            <option value="">Выберите категорию</option>
            {filteredCategories.map((cat) => {
              const subcategories = allCategories.filter(
                (c) => c.parentId === cat.id
              );
              if (subcategories.length > 0) {
                return (
                  <optgroup key={cat.id} label={`${cat.icon} ${cat.name}`}>
                    {subcategories.map((sub) => (
                      <option key={sub.id} value={sub.id}>
                        {sub.icon} {sub.name}
                      </option>
                    ))}
                  </optgroup>
                );
              }
              return (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.name}
                </option>
              );
            })}
          </select>
        </div>

        <div className={styles.field}>
          <label>Дата</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            style={{
              backgroundColor: theme.secondaryBgColor,
              color: theme.textColor,
              borderColor: theme.hintColor + "30",
            }}
          />
        </div>

        <div className={styles.field}>
          <label>Описание (необязательно)</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Добавить описание..."
            rows={3}
            style={{
              backgroundColor: theme.secondaryBgColor,
              color: theme.textColor,
              borderColor: theme.hintColor + "30",
            }}
          />
        </div>

        <div className={styles.actions}>
          <button
            type="button"
            onClick={onCancel}
            className={styles.cancelButton}
            style={{
              backgroundColor: theme.secondaryBgColor,
              color: theme.textColor,
            }}
          >
            Отмена
          </button>
          <button
            type="submit"
            className={styles.submitButton}
            style={{
              backgroundColor: theme.buttonColor,
              color: theme.buttonTextColor,
            }}
          >
            {transactionId ? "Сохранить" : "Добавить"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TransactionForm;

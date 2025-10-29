import { useState } from "react";
import { useTransactionStore } from "../../store/transactionsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { usePeriodFilter } from "../../hooks/usePeriodFilter";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import { formatDate, formatAmount } from "../../utils/formatters";
import { calculateBalance } from "../../utils/calculators";
import CategoryBadge from "../shared/CategoryBadge/CategoryBadge";
import styles from "./TransactionList.module.css";

const TransactionList = ({ onAdd, onEdit }) => {
  const theme = useTelegramTheme();
  const transactions = useTransactionStore((state) => state.transactions);
  const removeTransaction = useTransactionStore(
    (state) => state.removeTransaction
  );
  const categories = useCategoryStore((state) => state.categories);
  const settings = useSettingsStore((state) => state.settings);

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    categoryFilter,
    setCategoryFilter,
    typeFilter,
    setTypeFilter,
    filteredTransactions,
    setPeriod,
  } = usePeriodFilter(transactions);

  const [showFilters, setShowFilters] = useState(false);

  const balance = calculateBalance(
    filteredTransactions,
    settings.defaultCurrency
  );
  const income = filteredTransactions
    .filter((t) => t.type === "income")
    .reduce(
      (sum, t) =>
        sum + (t.currency === settings.defaultCurrency ? t.amount : 0),
      0
    );
  const expenses = filteredTransactions
    .filter((t) => t.type === "expense")
    .reduce(
      (sum, t) =>
        sum + (t.currency === settings.defaultCurrency ? t.amount : 0),
      0
    );

  const handleDelete = async (id) => {
    if (confirm("Удалить транзакцию?")) {
      await removeTransaction(id);
    }
  };

  const filteredCategories = categories.filter(
    (c) =>
      !c.parentId && filteredTransactions.some((t) => t.categoryId === c.id)
  );

  const groupedTransactions = filteredTransactions.reduce((acc, t) => {
    const date = new Date(t.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(t);
    return acc;
  }, {});

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

      <div className={styles.filters}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={styles.filterToggle}
          style={{
            backgroundColor: theme.secondaryBgColor,
            color: theme.textColor,
          }}
        >
          {showFilters ? "▼" : "▶"} Фильтры
        </button>
        {showFilters && (
          <div
            className={styles.filterPanel}
            style={{
              backgroundColor: theme.secondaryBgColor,
            }}
          >
            <div className={styles.periodButtons}>
              <button onClick={() => setPeriod("today")}>Сегодня</button>
              <button onClick={() => setPeriod("week")}>Неделя</button>
              <button onClick={() => setPeriod("month")}>Месяц</button>
              <button onClick={() => setPeriod("year")}>Год</button>
            </div>
            <div className={styles.dateInputs}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <span>—</span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
            <div className={styles.typeFilter}>
              <button
                onClick={() => setTypeFilter(null)}
                className={!typeFilter ? styles.active : ""}
              >
                Все
              </button>
              <button
                onClick={() => setTypeFilter("income")}
                className={typeFilter === "income" ? styles.active : ""}
              >
                Доходы
              </button>
              <button
                onClick={() => setTypeFilter("expense")}
                className={typeFilter === "expense" ? styles.active : ""}
              >
                Расходы
              </button>
            </div>
            {filteredCategories.length > 0 && (
              <select
                value={categoryFilter || ""}
                onChange={(e) => setCategoryFilter(e.target.value || null)}
              >
                <option value="">Все категории</option>
                {filteredCategories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}
      </div>

      <div className={styles.transactions}>
        {Object.keys(groupedTransactions).length === 0 ? (
          <div className={styles.empty}>
            <p>Нет транзакций</p>
            <button
              onClick={onAdd}
              style={{
                backgroundColor: theme.buttonColor,
                color: theme.buttonTextColor,
              }}
            >
              Добавить транзакцию
            </button>
          </div>
        ) : (
          Object.keys(groupedTransactions)
            .sort((a, b) => new Date(b) - new Date(a))
            .map((date) => (
              <div key={date} className={styles.dateGroup}>
                <div
                  className={styles.dateHeader}
                  style={{
                    color: theme.hintColor,
                  }}
                >
                  {formatDate(date)}
                </div>
                {groupedTransactions[date].map((transaction) => {
                  const category = categories.find(
                    (c) => c.id === transaction.categoryId
                  );
                  return (
                    <div
                      key={transaction.id}
                      className={styles.transaction}
                      style={{
                        backgroundColor: theme.secondaryBgColor,
                      }}
                    >
                      <div
                        className={styles.transactionContent}
                        onClick={() => onEdit(transaction.id)}
                      >
                        <div className={styles.transactionMain}>
                          <CategoryBadge category={category} />
                          <div className={styles.transactionInfo}>
                            <div className={styles.transactionDescription}>
                              {transaction.description ||
                                category?.name ||
                                "Без описания"}
                            </div>
                            {transaction.currency !==
                              settings.defaultCurrency && (
                              <div className={styles.transactionCurrency}>
                                {transaction.currency}
                              </div>
                            )}
                          </div>
                        </div>
                        <div
                          className={styles.transactionAmount}
                          style={{
                            color:
                              transaction.type === "income"
                                ? "#4CAF50"
                                : "#F44336",
                          }}
                        >
                          {transaction.type === "income" ? "+" : "-"}
                          {formatAmount(
                            transaction.amount,
                            transaction.currency
                          )}
                        </div>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(transaction.id);
                        }}
                        style={{
                          color: theme.hintColor,
                        }}
                        title="Удалить транзакцию"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            ))
        )}
      </div>
    </div>
  );
};

export default TransactionList;

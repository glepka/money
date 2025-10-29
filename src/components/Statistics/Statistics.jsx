import { useState } from "react";
import { useTransactionStore } from "../../store/transactionsStore";
import { useCategoryStore } from "../../store/categoriesStore";
import { useSettingsStore } from "../../store/settingsStore";
import { usePeriodFilter } from "../../hooks/usePeriodFilter";
import { useTelegramTheme } from "../../hooks/useTelegramTheme";
import { formatAmount, getPeriodLabel } from "../../utils/formatters";
import { calculateByPeriod, groupByMonth } from "../../utils/calculators";
import styles from "./Statistics.module.css";

const Statistics = ({ onBack }) => {
  const theme = useTelegramTheme();
  const transactions = useTransactionStore((state) => state.transactions);
  const categories = useCategoryStore((state) => state.categories);
  const settings = useSettingsStore((state) => state.settings);

  const {
    startDate,
    endDate,
    setStartDate,
    setEndDate,
    filteredTransactions,
    setPeriod,
  } = usePeriodFilter(transactions);

  const periodData = calculateByPeriod(filteredTransactions, startDate, endDate);
  const monthlyData = groupByMonth(filteredTransactions);

  const categoryStats = categories
    .map((cat) => {
      const catTransactions = filteredTransactions.filter((t) => t.categoryId === cat.id);
      const total = catTransactions.reduce((sum, t) => {
        if (t.type === "expense") {
          return sum - (t.currency === settings.defaultCurrency ? t.amount : 0);
        }
        return sum + (t.currency === settings.defaultCurrency ? t.amount : 0);
      }, 0);
      return { ...cat, total, count: catTransactions.length };
    })
    .filter((stat) => stat.count > 0)
    .sort((a, b) => Math.abs(b.total) - Math.abs(a.total))
    .slice(0, 10);

  const maxAmount = Math.max(
    periodData.income,
    Math.abs(periodData.expenses),
    1
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Статистика</h2>
      </div>

      <div className={styles.periodSelector}>
        <button onClick={() => setPeriod("today")}>Сегодня</button>
        <button onClick={() => setPeriod("week")}>Неделя</button>
        <button onClick={() => setPeriod("month")}>Месяц</button>
        <button onClick={() => setPeriod("year")}>Год</button>
      </div>

      <div className={styles.dateRange}>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          style={{
            backgroundColor: theme.secondaryBgColor,
            color: theme.textColor,
          }}
        />
        <span>—</span>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          style={{
            backgroundColor: theme.secondaryBgColor,
            color: theme.textColor,
          }}
        />
      </div>

      <div
        className={styles.summary}
        style={{
          backgroundColor: theme.secondaryBgColor,
        }}
      >
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>Доходы</div>
          <div className={styles.summaryAmount} style={{ color: "#4CAF50" }}>
            {formatAmount(periodData.income, settings.defaultCurrency)}
          </div>
          <div
            className={styles.summaryBar}
            style={{
              width: `${(periodData.income / maxAmount) * 100}%`,
              backgroundColor: "#4CAF50",
            }}
          />
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>Расходы</div>
          <div className={styles.summaryAmount} style={{ color: "#F44336" }}>
            {formatAmount(periodData.expenses, settings.defaultCurrency)}
          </div>
          <div
            className={styles.summaryBar}
            style={{
              width: `${(Math.abs(periodData.expenses) / maxAmount) * 100}%`,
              backgroundColor: "#F44336",
            }}
          />
        </div>
        <div className={styles.summaryItem}>
          <div className={styles.summaryLabel}>Баланс</div>
          <div
            className={styles.summaryAmount}
            style={{ color: periodData.balance >= 0 ? "#4CAF50" : "#F44336" }}
          >
            {formatAmount(Math.abs(periodData.balance), settings.defaultCurrency)}
          </div>
        </div>
      </div>

      {categoryStats.length > 0 && (
        <div className={styles.categoryStats}>
          <h3 className={styles.sectionTitle}>По категориям</h3>
          {categoryStats.map((stat) => (
            <div
              key={stat.id}
              className={styles.categoryStat}
              style={{
                backgroundColor: theme.secondaryBgColor,
              }}
            >
              <div className={styles.categoryStatInfo}>
                <span
                  className={styles.categoryStatIcon}
                  style={{ backgroundColor: stat.color }}
                >
                  {stat.icon}
                </span>
                <span className={styles.categoryStatName}>{stat.name}</span>
              </div>
              <div
                className={styles.categoryStatAmount}
                style={{
                  color: stat.total >= 0 ? "#4CAF50" : "#F44336",
                }}
              >
                {stat.total >= 0 ? "+" : ""}
                {formatAmount(Math.abs(stat.total), settings.defaultCurrency)}
              </div>
              <div className={styles.categoryStatBar}>
                <div
                  style={{
                    width: `${(Math.abs(stat.total) / maxAmount) * 100}%`,
                    backgroundColor: stat.color,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {Object.keys(monthlyData).length > 0 && (
        <div className={styles.monthlyStats}>
          <h3 className={styles.sectionTitle}>По месяцам</h3>
          {Object.keys(monthlyData)
            .sort()
            .reverse()
            .slice(0, 6)
            .map((monthKey) => {
              const monthData = monthlyData[monthKey];
              const [year, month] = monthKey.split("-");
              const monthNames = [
                "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
                "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
              ];
              const monthName = monthNames[parseInt(month) - 1];
              return (
                <div
                  key={monthKey}
                  className={styles.monthItem}
                  style={{
                    backgroundColor: theme.secondaryBgColor,
                  }}
                >
                  <div className={styles.monthLabel}>
                    {monthName} {year}
                  </div>
                  <div className={styles.monthValues}>
                    <div style={{ color: "#4CAF50" }}>
                      +{formatAmount(monthData.income, settings.defaultCurrency)}
                    </div>
                    <div style={{ color: "#F44336" }}>
                      -{formatAmount(monthData.expenses, settings.defaultCurrency)}
                    </div>
                    <div
                      style={{
                        color: monthData.income - monthData.expenses >= 0 ? "#4CAF50" : "#F44336",
                      }}
                    >
                      {formatAmount(
                        Math.abs(monthData.income - monthData.expenses),
                        settings.defaultCurrency
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
};

export default Statistics;


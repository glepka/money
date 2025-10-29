export const calculateBalance = (transactions, currency = "RUB") => {
  const filtered = transactions.filter((t) => t.currency === currency);
  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);
  const expenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);
  return income - expenses;
};

export const calculateByPeriod = (transactions, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  const filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= start && date <= end;
  });

  const income = filtered
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const expenses = filtered
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return {
    income,
    expenses,
    balance: income - expenses,
    transactions: filtered,
  };
};

export const calculateByCategory = (transactions, categoryId) => {
  const filtered = transactions.filter((t) => t.categoryId === categoryId);
  return filtered.reduce((sum, t) => {
    if (t.type === "expense") {
      return sum - t.amount;
    }
    return sum + t.amount;
  }, 0);
};

export const getPeriodEnd = (startDate, renewalPeriod, customDays = 30) => {
  const start = new Date(startDate);
  const end = new Date(start);

  switch (renewalPeriod) {
    case "week":
      end.setDate(end.getDate() + 7);
      break;
    case "month":
      end.setMonth(end.getMonth() + 1);
      break;
    case "custom":
      end.setDate(end.getDate() + customDays);
      break;
    default:
      end.setMonth(end.getMonth() + 1);
  }

  return end.toISOString();
};

export const getCurrentPeriod = (budget) => {
  const now = new Date();
  const periodStart = new Date(budget.periodStart);
  let currentPeriodStart = new Date(periodStart);

  const renewalPeriod = budget.renewalPeriod || "month";
  const customDays = budget.customDays || 30;

  let periodDays;
  switch (renewalPeriod) {
    case "week":
      periodDays = 7;
      break;
    case "month": {
      // Рассчитываем количество дней в текущем периоде
      const tempEnd = new Date(periodStart);
      tempEnd.setMonth(tempEnd.getMonth() + 1);
      periodDays = Math.ceil((tempEnd - periodStart) / (1000 * 60 * 60 * 24));
      break;
    }
    case "custom":
      periodDays = customDays;
      break;
    default:
      periodDays = 30;
  }

  // Находим текущий период (сколько периодов прошло с начала)
  const daysSinceStart = Math.floor(
    (now - periodStart) / (1000 * 60 * 60 * 24)
  );
  const periodsPassed = Math.floor(daysSinceStart / periodDays);

  currentPeriodStart.setDate(
    currentPeriodStart.getDate() + periodsPassed * periodDays
  );

  const currentPeriodEnd = getPeriodEnd(
    currentPeriodStart.toISOString(),
    renewalPeriod,
    customDays
  );

  return {
    start: currentPeriodStart.toISOString(),
    end: currentPeriodEnd,
  };
};

export const calculateBudgetProgress = (
  budget,
  transactions,
  startDate,
  endDate
) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);

  let filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= start && date <= end && t.type === "expense";
  });

  // Поддержка обратной совместимости: если categoryId, преобразуем в массив
  const categoryIds =
    budget.categoryIds || (budget.categoryId ? [budget.categoryId] : []);

  if (categoryIds.length > 0) {
    filtered = filtered.filter((t) => categoryIds.includes(t.categoryId));
  }

  if (budget.currency) {
    filtered = filtered.filter((t) => t.currency === budget.currency);
  }

  const spent = filtered.reduce((sum, t) => sum + t.amount, 0);
  const limit = budget.amount;
  const percentage = limit > 0 ? (spent / limit) * 100 : 0;
  const remaining = limit - spent;

  return {
    spent,
    limit,
    remaining,
    percentage: Math.min(percentage, 100),
    exceeded: spent > limit,
  };
};

export const groupByMonth = (transactions) => {
  const grouped = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}`;

    if (!grouped[key]) {
      grouped[key] = {
        income: 0,
        expenses: 0,
        transactions: [],
      };
    }

    if (t.type === "income") {
      grouped[key].income += t.amount;
    } else {
      grouped[key].expenses += t.amount;
    }

    grouped[key].transactions.push(t);
  });

  return grouped;
};

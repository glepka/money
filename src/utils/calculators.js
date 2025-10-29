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

export const calculateBudgetProgress = (budget, transactions, startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  end.setHours(23, 59, 59, 999);
  
  let filtered = transactions.filter((t) => {
    const date = new Date(t.date);
    return date >= start && date <= end && t.type === "expense";
  });
  
  if (budget.categoryId) {
    filtered = filtered.filter((t) => t.categoryId === budget.categoryId);
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
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    
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


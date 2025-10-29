import { useState, useMemo } from "react";

export const usePeriodFilter = (transactions) => {
  const [startDate, setStartDate] = useState(() => {
    const date = new Date();
    date.setDate(1);
    date.setHours(0, 0, 0, 0);
    return date.toISOString().split("T")[0];
  });

  const [endDate, setEndDate] = useState(() => {
    const date = new Date();
    date.setHours(23, 59, 59, 999);
    return date.toISOString().split("T")[0];
  });

  const [categoryFilter, setCategoryFilter] = useState(null);
  const [typeFilter, setTypeFilter] = useState(null);

  const filteredTransactions = useMemo(() => {
    let filtered = [...transactions];

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);
      
      filtered = filtered.filter((t) => {
        const date = new Date(t.date);
        return date >= start && date <= end;
      });
    }

    if (categoryFilter) {
      filtered = filtered.filter((t) => t.categoryId === categoryFilter);
    }

    if (typeFilter) {
      filtered = filtered.filter((t) => t.type === typeFilter);
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [transactions, startDate, endDate, categoryFilter, typeFilter]);

  const setPeriod = (period) => {
    const now = new Date();
    
    switch (period) {
      case "today": {
        const today = new Date(now);
        today.setHours(0, 0, 0, 0);
        setStartDate(today.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        break;
      }
      case "week": {
        const weekAgo = new Date(now);
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);
        setStartDate(weekAgo.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        break;
      }
      case "month": {
        const monthStart = new Date(now);
        monthStart.setDate(1);
        monthStart.setHours(0, 0, 0, 0);
        setStartDate(monthStart.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        break;
      }
      case "year": {
        const yearStart = new Date(now);
        yearStart.setMonth(0, 1);
        yearStart.setHours(0, 0, 0, 0);
        setStartDate(yearStart.toISOString().split("T")[0]);
        setEndDate(now.toISOString().split("T")[0]);
        break;
      }
      default:
        break;
    }
  };

  return {
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
  };
};


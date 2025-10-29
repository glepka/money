import { useEffect } from "react";
import { useBudgetStore } from "../store/budgetsStore";
import { useTransactionStore } from "../store/transactionsStore";
import { useSettingsStore } from "../store/settingsStore";
import { calculateBudgetProgress } from "../utils/calculators";

export const useNotifications = () => {
  const budgets = useBudgetStore((state) => state.budgets);
  const transactions = useTransactionStore((state) => state.transactions);
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    if (!settings.notifications?.budgetWarning && !settings.notifications?.budgetExceeded) {
      return;
    }

    const checkBudgets = () => {
      const now = new Date();
      
      budgets.forEach((budget) => {
        const startDate = new Date(budget.periodStart);
        const endDate = new Date(budget.periodEnd);
        
        if (now >= startDate && now <= endDate) {
          const progress = calculateBudgetProgress(
            budget,
            transactions,
            budget.periodStart,
            budget.periodEnd
          );
          
          if (progress.exceeded && settings.notifications?.budgetExceeded) {
            console.warn(`Бюджет "${budget.name}" превышен на ${(progress.percentage - 100).toFixed(1)}%`);
          } else if (progress.percentage >= 80 && settings.notifications?.budgetWarning) {
            console.warn(`Бюджет "${budget.name}" почти исчерпан: ${progress.percentage.toFixed(1)}%`);
          }
        }
      });
    };

    checkBudgets();
    const interval = setInterval(checkBudgets, 60000);
    
    return () => clearInterval(interval);
  }, [budgets, transactions, settings]);

  return null;
};


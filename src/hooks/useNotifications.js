import { useEffect } from "react";
import { useBudgetStore } from "../store/budgetsStore";
import { useTransactionStore } from "../store/transactionsStore";
import { useSettingsStore } from "../store/settingsStore";
import {
  calculateBudgetProgress,
  getCurrentPeriod,
} from "../utils/calculators";

export const useNotifications = () => {
  const budgets = useBudgetStore((state) => state.budgets);
  const transactions = useTransactionStore((state) => state.transactions);
  const settings = useSettingsStore((state) => state.settings);

  useEffect(() => {
    if (!settings.notifications?.budgetWarning && !settings.notifications?.budgetExceeded) {
      return;
    }

    const checkBudgets = () => {
      budgets.forEach((budget) => {
        const currentPeriod = getCurrentPeriod(budget);
        const now = new Date();
        const periodStart = new Date(currentPeriod.start);
        const periodEnd = new Date(currentPeriod.end);
        
        if (now >= periodStart && now <= periodEnd) {
          const progress = calculateBudgetProgress(
            budget,
            transactions,
            currentPeriod.start,
            currentPeriod.end
          );
          
          if (progress.exceeded && settings.notifications?.budgetExceeded) {
            console.warn(
              `Бюджет "${budget.name}" превышен на ${(progress.percentage - 100).toFixed(1)}%`
            );
          } else if (
            progress.percentage >= 80 &&
            settings.notifications?.budgetWarning
          ) {
            console.warn(
              `Бюджет "${budget.name}" почти исчерпан: ${progress.percentage.toFixed(1)}%`
            );
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


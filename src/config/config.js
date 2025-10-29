export const STORAGE_KEYS = {
  TRANSACTIONS: "transactions",
  CATEGORIES: "categories",
  CURRENCIES: "currencies",
  BUDGETS: "budgets",
  SETTINGS: "settings",
  THEME: "theme",
};

export const DEFAULT_CATEGORIES = [
  {
    id: "income-salary",
    name: "Зарплата",
    type: "income",
    icon: "💰",
    color: "#4CAF50",
    parentId: null,
  },
  {
    id: "income-other",
    name: "Прочее",
    type: "income",
    icon: "💵",
    color: "#2196F3",
    parentId: null,
  },
  {
    id: "expense-food",
    name: "Еда",
    type: "expense",
    icon: "🍔",
    color: "#FF9800",
    parentId: null,
  },
  {
    id: "expense-transport",
    name: "Транспорт",
    type: "expense",
    icon: "🚗",
    color: "#9C27B0",
    parentId: null,
  },
  {
    id: "expense-shopping",
    name: "Покупки",
    type: "expense",
    icon: "🛒",
    color: "#E91E63",
    parentId: null,
  },
  {
    id: "expense-bills",
    name: "Счета",
    type: "expense",
    icon: "💳",
    color: "#F44336",
    parentId: null,
  },
  {
    id: "expense-other",
    name: "Прочее",
    type: "expense",
    icon: "📦",
    color: "#607D8B",
    parentId: null,
  },
];

export const DEFAULT_CURRENCIES = [
  { code: "RUB", symbol: "₽", name: "Российский рубль" },
  { code: "USD", symbol: "$", name: "Доллар США" },
  { code: "EUR", symbol: "€", name: "Евро" },
];

export const DEFAULT_SETTINGS = {
  defaultCurrency: "RUB",
  notifications: {
    budgetWarning: true,
    budgetExceeded: true,
    reminders: false,
  },
};

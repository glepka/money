export const formatDate = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
};

export const formatDateTime = (date) => {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${day}.${month}.${year} ${hours}:${minutes}`;
};

export const formatAmount = (amount, currency = "RUB") => {
  const currencies = {
    RUB: "₽",
    USD: "$",
    EUR: "€",
  };
  const symbol = currencies[currency] || currency;
  return new Intl.NumberFormat("ru-RU", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount) + ` ${symbol}`;
};

export const formatShortAmount = (amount, currency = "RUB") => {
  const currencies = {
    RUB: "₽",
    USD: "$",
    EUR: "€",
  };
  const symbol = currencies[currency] || currency;
  
  if (amount >= 1000000) {
    return `${(amount / 1000000).toFixed(1)}М ${symbol}`;
  }
  if (amount >= 1000) {
    return `${(amount / 1000).toFixed(1)}К ${symbol}`;
  }
  return `${amount.toFixed(0)} ${symbol}`;
};

export const getMonthName = (date) => {
  const d = new Date(date);
  const months = [
    "Январь", "Февраль", "Март", "Апрель", "Май", "Июнь",
    "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь",
  ];
  return months[d.getMonth()];
};

export const getPeriodLabel = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return getMonthName(start);
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};


export const exportToJSON = (data) => {
  const json = JSON.stringify(data, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `money-tracker-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const exportToCSV = (transactions, categories) => {
  const headers = ["Дата", "Тип", "Категория", "Сумма", "Валюта", "Описание"];
  const rows = transactions.map((t) => {
    const category = categories.find((c) => c.id === t.categoryId);
    const categoryName = category ? category.name : "Неизвестно";
    return [
      new Date(t.date).toLocaleDateString("ru-RU"),
      t.type === "income" ? "Доход" : "Расход",
      categoryName,
      t.amount.toFixed(2),
      t.currency,
      t.description || "",
    ];
  });
  
  const csv = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${cell}"`).join(",")),
  ].join("\n");
  
  const blob = new Blob(["\ufeff" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `money-tracker-${new Date().toISOString().split("T")[0]}.csv`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};


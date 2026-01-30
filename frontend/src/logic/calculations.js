export const calculateTotal = (items) => {
  if (!items || items.length === 0) return 0;
  return items.reduce((sum, item) => sum + (item.price * (item.quantity || 1)), 0);
};

export const groupByCategory = (items) => {
  if (!items) return {};
  return items.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {});
};

export const calculateExpenseSummary = (expenses, transactions) => {
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSales = transactions.reduce((sum, t) => sum + t.total, 0);
  const netProfit = totalSales - totalExpenses;
  return { totalExpenses, totalSales, netProfit };
};

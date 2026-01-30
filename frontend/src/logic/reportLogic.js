export const generateReportCsv = (completedTransactions, expenses) => {
  const totalSales = completedTransactions.reduce((sum, t) => sum + t.total, 0);
  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const netProfit = totalSales - totalExpenses;

  let csvContent = '=== RESTAURANT REPORT ===\n';
  csvContent += `Date: ${new Date().toLocaleDateString()}\n`;
  csvContent += `Total Sales: Rs.${totalSales.toFixed(2)}\n`;
  csvContent += `Total Expenses: Rs.${totalExpenses.toFixed(2)}\n`;
  csvContent += `Net Profit: Rs.${netProfit.toFixed(2)}\n`;

  return csvContent;
};

export const downloadReport = (completedTransactions, expenses) => {
  const csvContent = generateReportCsv(completedTransactions, expenses);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `restaurant_report_${new Date().toLocaleDateString()}.csv`);
  link.click();
};

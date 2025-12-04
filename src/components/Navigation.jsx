import React from 'react';
import { ShoppingCart, ChefHat, DollarSign, Minus, RefreshCw, Settings, Download } from 'lucide-react';

const Navigation = ({
  activeTab,
  setActiveTab,
  syncStatus,
  setShowSettings,
  handleSyncAll,
  completedTransactions,
  expenses
}) => {

  const downloadExcel = () => {
    let csvContent = "=== RESTAURANT REPORT ===\n";
    csvContent += "Date: " + new Date().toLocaleDateString() + "\n";

    const totalSales = completedTransactions.reduce((sum, t) => sum + t.total, 0);
    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    csvContent += `Total Sales: Rs.${totalSales.toFixed(2)}\n`;
    csvContent += `Total Expenses: Rs.${totalExpenses.toFixed(2)}\n`;
    csvContent += `Net Profit: Rs.${(totalSales - totalExpenses).toFixed(2)}\n`;

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `restaurant_report_${new Date().toLocaleDateString()}.csv`);
    link.click();
  };

  return (
    <div className="bg-orange-600 text-white shadow-lg">
      <div className="mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <button
              onClick={() => setActiveTab('waiter')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${activeTab === 'waiter' ? 'bg-black' : 'hover:bg-orange-700'
                }`}
            >
              <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Waiter</span>
            </button>
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${activeTab === 'kitchen' ? 'bg-black' : 'hover:bg-orange-700'
                }`}
            >
              <ChefHat size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Kitchen</span>
            </button>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${activeTab === 'checkout' ? 'bg-black' : 'hover:bg-orange-700'
                }`}
            >
              <DollarSign size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Checkout</span>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${activeTab === 'expenses' ? 'bg-black' : 'hover:bg-orange-700'
                }`}
            >
              <Minus size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Expenses</span>
            </button>
          </div>
          <div className="flex gap-2 ml-2">
            {syncStatus.message && (
              <div className={`flex items-center px-3 py-2 rounded-lg text-sm font-semibold ${syncStatus.type === 'success' ? 'bg-green-100 text-green-800' :
                syncStatus.type === 'error' ? 'bg-red-100 text-red-800' :
                  'bg-blue-100 text-blue-800'
                }`}>
                {syncStatus.message}
              </div>
            )}
            <button
              onClick={handleSyncAll}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              <RefreshCw size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Sync</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-black hover:bg-gray-900 rounded-lg font-semibold transition-colors text-sm sm:text-base"
            >
              <Settings size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden md:inline">Settings</span>
            </button>
            {(completedTransactions?.length > 0 || expenses?.length > 0) && (
              <button
                onClick={downloadExcel}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-black hover:bg-gray-900 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                <Download size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden md:inline">Download</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
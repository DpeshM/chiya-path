import React from 'react';
import { ShoppingCart, ChefHat, DollarSign, Minus, RefreshCw, Settings, Download, Monitor } from 'lucide-react';

const Navigation = ({
  activeTab,
  setActiveTab,
  syncStatus,
  setShowSettings,
  handleSyncAll,
  onDownloadReport,
  showDownload,
}) => {
  return (
    <div className="bg-orange-600 text-white shadow-lg">
      <div className="mx-auto px-2 sm:px-4">
        <div className="flex justify-between items-center overflow-x-auto">
          <div className="flex space-x-1 min-w-max">
            <button
              onClick={() => setActiveTab('waiter')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'waiter' ? 'bg-black' : 'hover:bg-orange-700'
              }`}
            >
              <ShoppingCart size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Waiter</span>
            </button>
            <button
              onClick={() => setActiveTab('kitchen')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'kitchen' ? 'bg-black' : 'hover:bg-orange-700'
              }`}
            >
              <ChefHat size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Kitchen</span>
            </button>
            <a
              href="/kitchen-display"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base hover:bg-orange-700"
              title="Open Kitchen Display (auto-fetches orders)"
            >
              <Monitor size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Kitchen Display</span>
            </a>
            <button
              onClick={() => setActiveTab('checkout')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'checkout' ? 'bg-black' : 'hover:bg-orange-700'
              }`}
            >
              <DollarSign size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Checkout</span>
            </button>
            <button
              onClick={() => setActiveTab('expenses')}
              className={`flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-3 sm:py-4 font-semibold transition-colors text-sm sm:text-base ${
                activeTab === 'expenses' ? 'bg-black' : 'hover:bg-orange-700'
              }`}
            >
              <Minus size={16} className="sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">Expenses</span>
            </button>
          </div>
          <div className="flex gap-2 ml-2">
            {syncStatus.message && (
              <div
                className={`flex items-center px-3 py-2 rounded-lg text-sm font-semibold ${
                  syncStatus.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : syncStatus.type === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-blue-100 text-blue-800'
                }`}
              >
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
            {showDownload && (
              <button
                onClick={onDownloadReport}
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

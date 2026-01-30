import React from 'react';
import { Link } from 'react-router-dom';
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
  const navBtn = (tab, icon, label) => (
    <button
      onClick={() => setActiveTab(tab)}
      className={`flex items-center gap-2 px-4 sm:px-5 py-2.5 font-semibold rounded-xl transition-all duration-200 ${
        activeTab === tab
          ? 'bg-white text-amber-700 shadow-md'
          : 'text-white/95 hover:bg-white/15 hover:text-white'
      }`}
    >
      {icon}
      <span className="hidden sm:inline">{label}</span>
    </button>
  );

  return (
    <nav className="bg-gradient-to-r from-amber-600 to-amber-700 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center py-3 gap-4 overflow-x-auto">
          <div className="flex items-center gap-2 min-w-max">
            {navBtn('waiter', <ShoppingCart size={20} />, 'Orders')}
            {navBtn('kitchen', <ChefHat size={20} />, 'Kitchen')}
            <Link
              to="/kitchen-display"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 sm:px-5 py-2.5 font-semibold rounded-xl text-white/95 hover:bg-white/15 hover:text-white transition-all duration-200"
              title="Open Kitchen Display"
            >
              <Monitor size={20} />
              <span className="hidden sm:inline">Display</span>
            </Link>
            {navBtn('checkout', <DollarSign size={20} />, 'Checkout')}
            {navBtn('expenses', <Minus size={20} />, 'Expenses')}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {syncStatus.message && (
              <div
                className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                  syncStatus.type === 'success'
                    ? 'bg-emerald-100 text-emerald-800'
                    : syncStatus.type === 'error'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-sky-100 text-sky-800'
                }`}
              >
                {syncStatus.message}
              </div>
            )}
            <button
              onClick={handleSyncAll}
              className="flex items-center gap-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl font-semibold transition-colors"
            >
              <RefreshCw size={18} />
              <span className="hidden md:inline">Sync</span>
            </button>
            <button
              onClick={() => setShowSettings(true)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
            >
              <Settings size={18} />
              <span className="hidden md:inline">Settings</span>
            </button>
            {showDownload && (
              <button
                onClick={onDownloadReport}
                className="flex items-center gap-2 px-4 py-2 bg-white text-amber-700 rounded-xl font-semibold hover:bg-amber-50 transition-colors"
              >
                <Download size={18} />
                <span className="hidden md:inline">Report</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

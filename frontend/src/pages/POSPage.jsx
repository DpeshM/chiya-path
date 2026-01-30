import React from 'react';
import Navigation from '../ui/Navigation';
import SettingsModal from '../ui/SettingsModal';
import WaiterTab from '../pages/WaiterTab';
import KitchenTab from '../ui/KitchenTab';
import CheckoutTab from '../pages/CheckoutTab';
import ExpensesTab from '../pages/ExpensesTab';
import { usePOSStore } from '../state/usePOSStore';
import { testGoogleSheetsConnection, saveDataToGoogle, syncAllToGoogle } from '../services/googleSheets';
import { markOrderReady } from '../services/api';
import { calculateTotal, groupByCategory } from '../logic/calculations';
import { downloadReport } from '../logic/reportLogic';

const POSPage = () => {
  const store = usePOSStore();
  const {
    activeTab,
    setActiveTab,
    tables,
    menuItems,
    selectedTable,
    selectedSeat,
    currentOrder,
    setSelectedTable,
    setSelectedSeat,
    setCurrentOrder,
    kitchenOrders,
    setKitchenOrders,
    setTables,
    completedTransactions,
    expenses,
    showSettings,
    setShowSettings,
    syncStatus,
    setSyncStatus,
    sheetConfig,
    setSheetConfig,
    useBackend,
    isLoading,
    loadError,
    loadAll,
  } = store;

  const handleSyncToGoogle = async (type, data) => {
    if (sheetConfig.enabled && sheetConfig.isConfigured) {
      return saveDataToGoogle(type, data, sheetConfig, setSyncStatus);
    }
  };

  const handleTestConnection = async () => {
    return testGoogleSheetsConnection(sheetConfig, setSheetConfig, setSyncStatus);
  };

  const handleSyncAll = async () => {
    return syncAllToGoogle(
      { tables, menuItems, completedTransactions, expenses, kitchenOrders },
      sheetConfig,
      setSyncStatus
    );
  };

  const handleDownloadReport = () => {
    downloadReport(completedTransactions, expenses);
  };

  const handleMarkReady = async (id) => {
    try {
      await markOrderReady(id);
      await loadAll();
    } catch (err) {
      console.error('Failed to mark order ready:', err);
      setKitchenOrders((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: 'ready' } : o))
      );
    }
  };

  const renderTab = () => {
    switch (activeTab) {
      case 'waiter':
        return (
          <WaiterTab
            tables={tables}
            menuItems={menuItems}
            selectedTable={selectedTable}
            selectedSeat={selectedSeat}
            currentOrder={currentOrder}
            setSelectedTable={setSelectedTable}
            setSelectedSeat={setSelectedSeat}
            setCurrentOrder={setCurrentOrder}
            setKitchenOrders={setKitchenOrders}
            setTables={setTables}
            calculateTotal={calculateTotal}
            groupByCategory={groupByCategory}
            proceedToCheckout={(tableNumber) => {
              setActiveTab('checkout');
              setSelectedTable(tableNumber);
            }}
            useBackend={useBackend}
            loadAll={loadAll}
          />
        );
      case 'kitchen':
        return (
          <KitchenTab
            kitchenOrders={kitchenOrders}
            onMarkReady={handleMarkReady}
            calculateTotal={calculateTotal}
          />
        );
      case 'checkout':
        return (
          <CheckoutTab
            tables={tables}
            selectedTable={selectedTable}
            setSelectedTable={setSelectedTable}
            setTables={setTables}
            setKitchenOrders={setKitchenOrders}
            setCompletedTransactions={store.setCompletedTransactions}
            calculateTotal={calculateTotal}
            handleSyncToGoogle={handleSyncToGoogle}
            loadAll={loadAll}
          />
        );
      case 'expenses':
        return (
          <ExpensesTab
            expenses={expenses}
            setExpenses={store.setExpenses}
            completedTransactions={completedTransactions}
            handleSyncToGoogle={handleSyncToGoogle}
            loadAll={loadAll}
          />
        );
      default:
        return null;
    }
  };

  if (loadError) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Cannot connect to server</h2>
          <p className="text-gray-600 mb-4">{loadError}</p>
          <p className="text-sm text-gray-500 mb-4">
            Make sure MongoDB is running and the backend is started:
          </p>
          <p className="text-sm font-mono bg-gray-100 p-2 rounded mb-4">
            mongod<br />
            npm run dev --prefix backend
          </p>
          <button
            onClick={loadAll}
            className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        syncStatus={syncStatus}
        setShowSettings={setShowSettings}
        handleSyncAll={handleSyncAll}
        onDownloadReport={handleDownloadReport}
        showDownload={completedTransactions?.length > 0 || expenses?.length > 0}
      />

      <SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        sheetConfig={sheetConfig}
        setSheetConfig={setSheetConfig}
        tables={tables}
        setTables={setTables}
        menuItems={menuItems}
        setMenuItems={store.setMenuItems}
        handleTestConnection={handleTestConnection}
        handleSyncAll={handleSyncAll}
        syncStatus={syncStatus}
        handleSyncToGoogle={handleSyncToGoogle}
        loadAll={loadAll}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">{renderTab()}</div>
    </div>
  );
};

export default POSPage;

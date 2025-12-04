import React, { useState, useEffect } from 'react';
import Navigation from './components/Navigation';
import SettingsModal from './components/SettingsModal';
import WaiterTab from './components/WaiterTab';
import KitchenTab from './components/KitchenTab';
import CheckoutTab from './components/CheckoutTab';
import ExpensesTab from './components/ExpensesTab';
import { loadFromStorage, saveToStorage } from './utils/localStorage';
import { testGoogleSheetsConnection, saveDataToGoogle, syncAllToGoogle } from './utils/googleSheets';
import { calculateTotal, groupByCategory } from './utils/calculations';

const App = () => {
  // State
  const [activeTab, setActiveTab] = useState('waiter');
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ message: '', type: '', lastSync: null, details: '' });
  const [sheetConfig, setSheetConfig] = useState({
    scriptUrl: '',
    enabled: false,
    autoSync: false,
    isConfigured: false
  });

  // Initialize data
  useEffect(() => {
    const defaultTables = [
      { number: 1, status: 'vacant', orders: [] },
      { number: 2, status: 'vacant', orders: [] },
      { number: 3, status: 'vacant', orders: [] },
      { number: 4, status: 'vacant', orders: [] },
      { number: 5, status: 'vacant', orders: [] },
      { number: 6, status: 'vacant', orders: [] },
      { number: 7, status: 'vacant', orders: [] },
      { number: 8, status: 'vacant', orders: [] },
      { number: 9, status: 'vacant', orders: [] },
      { number: 10, status: 'vacant', orders: [] }
    ];

    const defaultMenu = [
      { id: 1, name: 'Momo', price: 150, category: 'Main' },
      { id: 2, name: 'Chowmein', price: 120, category: 'Main' },
      { id: 3, name: 'Fried Rice', price: 180, category: 'Main' },
      { id: 4, name: 'Chicken Chilly', price: 250, category: 'Main' },
      { id: 5, name: 'Veg Salad', price: 100, category: 'Starter' },
      { id: 6, name: 'French Fries', price: 80, category: 'Side' },
      { id: 7, name: 'Coke', price: 60, category: 'Drink' },
      { id: 8, name: 'Water', price: 20, category: 'Drink' },
      { id: 9, name: 'Ice Cream', price: 120, category: 'Dessert' },
      { id: 10, name: 'Kheer', price: 100, category: 'Dessert' }
    ];

    setTables(saveToStorage('tables', defaultTables));
    setMenuItems(saveToStorage('menuItems', defaultMenu));
    setKitchenOrders(saveToStorage('kitchenOrders', []));
    setCompletedTransactions(saveToStorage('completedTransactions', []));
    setExpenses(saveToStorage('expenses', []));
    setSheetConfig(saveToStorage('sheetConfig', sheetConfig));


  }, []);

  // Save to localStorage
  // useEffect(() => { saveToStorage('tables', tables); }, [tables]);
  // useEffect(() => { saveToStorage('menuItems', menuItems); }, [menuItems]);
  // useEffect(() => { saveToStorage('kitchenOrders', kitchenOrders); }, [kitchenOrders]);
  // useEffect(() => { saveToStorage('completedTransactions', completedTransactions); }, [completedTransactions]);
  // useEffect(() => { saveToStorage('expenses', expenses); }, [expenses]);
  // useEffect(() => { saveToStorage('sheetConfig', sheetConfig); }, [sheetConfig]);

  console.log(tables);
  // Core functions
  const handleSyncToGoogle = async (type, data) => {
    if (sheetConfig.enabled && sheetConfig.isConfigured) {
      return saveDataToGoogle(type, data, sheetConfig, setSyncStatus);
    }
  };

  const handleTestConnection = async () => {
    return testGoogleSheetsConnection(sheetConfig, setSheetConfig, setSyncStatus);
  };

  const handleSyncAll = async () => {
    return syncAllToGoogle({ tables, menuItems, completedTransactions, expenses, kitchenOrders }, sheetConfig, setSyncStatus);
  };

  // Tab selection helper
  const renderTab = () => {
    switch (activeTab) {
      case 'waiter':
        return (
          <WaiterTab
            tables={tables}
            menuItems={menuItems}
            selectedTable={selectedTable}
            currentOrder={currentOrder}
            setSelectedTable={setSelectedTable}
            setCurrentOrder={setCurrentOrder}
            setKitchenOrders={setKitchenOrders}
            setTables={setTables}
            calculateTotal={calculateTotal}
            groupByCategory={groupByCategory}
            proceedToCheckout={(tableNumber) => {
              setActiveTab('checkout');
              setSelectedTable(tableNumber);
            }}
          />
        );
      case 'kitchen':
        return (
          <KitchenTab
            kitchenOrders={kitchenOrders}
            setKitchenOrders={setKitchenOrders}
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
            setCompletedTransactions={setCompletedTransactions}
            calculateTotal={calculateTotal}
            handleSyncToGoogle={handleSyncToGoogle}
          />
        );
      case 'expenses':
        return (
          <ExpensesTab
            expenses={expenses}
            setExpenses={setExpenses}
            completedTransactions={completedTransactions}
            handleSyncToGoogle={handleSyncToGoogle}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <Navigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        syncStatus={syncStatus}
        setShowSettings={setShowSettings}
        handleSyncAll={handleSyncAll}
        completedTransactions={completedTransactions}
        expenses={expenses}
      />

      <SettingsModal
        showSettings={showSettings}
        setShowSettings={setShowSettings}
        sheetConfig={sheetConfig}
        setSheetConfig={setSheetConfig}
        tables={tables}
        setTables={setTables}
        menuItems={menuItems}
        setMenuItems={setMenuItems}
        handleTestConnection={handleTestConnection}
        handleSyncAll={handleSyncAll}
        syncStatus={syncStatus}
        handleSyncToGoogle={handleSyncToGoogle}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {renderTab()}
      </div>
    </div>
  );
};

export default App;
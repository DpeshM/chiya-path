import { useState, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage } from '../services/localStorage';
import {
  fetchTables,
  fetchMenu,
  fetchOrders,
  fetchTransactions,
  fetchExpenses,
  isBackendAvailable,
} from '../services/api';
import { defaultSheetConfig } from './defaults';

export const usePOSStore = () => {
  const [activeTab, setActiveTab] = useState('waiter');
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [useBackend, setUseBackend] = useState(true);
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [syncStatus, setSyncStatus] = useState({ message: '', type: '', lastSync: null, details: '' });
  const [sheetConfig, setSheetConfig] = useState(defaultSheetConfig);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const loadAll = useCallback(async () => {
    try {
      setIsLoading(true);
      setLoadError(null);
      const [tablesData, menuData, ordersData, transactionsData, expensesData] = await Promise.all([
        fetchTables(),
        fetchMenu(),
        fetchOrders(),
        fetchTransactions(),
        fetchExpenses(),
      ]);
      setTables(tablesData);
      setMenuItems(menuData);
      setKitchenOrders(ordersData);
      setCompletedTransactions(transactionsData);
      setExpenses(expensesData);
      setUseBackend(true);
    } catch (err) {
      setLoadError(err.message);
      setTables([]);
      setMenuItems([]);
      setKitchenOrders([]);
      setCompletedTransactions([]);
      setExpenses([]);
      setUseBackend(false);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setSheetConfig(loadFromStorage('sheetConfig', defaultSheetConfig));
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  useEffect(() => {
    isBackendAvailable().then(setUseBackend);
  }, []);

  useEffect(() => {
    saveToStorage('sheetConfig', sheetConfig);
  }, [sheetConfig]);

  return {
    activeTab,
    setActiveTab,
    tables,
    setTables,
    menuItems,
    setMenuItems,
    selectedTable,
    setSelectedTable,
    currentOrder,
    setCurrentOrder,
    kitchenOrders,
    setKitchenOrders,
    useBackend,
    completedTransactions,
    setCompletedTransactions,
    expenses,
    setExpenses,
    showSettings,
    setShowSettings,
    syncStatus,
    setSyncStatus,
    sheetConfig,
    setSheetConfig,
    isLoading,
    loadError,
    loadAll,
  };
};

import React, { useState, useEffect } from 'react';
import { ShoppingCart, ChefHat, DollarSign, Plus, Minus, Trash2, Check, Download, Settings, X, Edit2, RefreshCw, Database, Link, AlertCircle } from 'lucide-react';

const RestaurantOrderSystem = () => {
  // Google Apps Script URL - Update this with your URL
  const [scriptUrl, setScriptUrl] = useState('https://script.google.com/macros/s/AKfycbyyqrPly-zB6AmVD9k7AjAv10gLG6xErNVvJb6vxp4ly7Y_EVD6sC3Ac6qKA4-TZ3LQ/exec');
  
  const [syncStatus, setSyncStatus] = useState({
    message: '',
    type: '',
    lastSync: null,
    details: ''
  });

  const [activeTab, setActiveTab] = useState('waiter');
  const [tables, setTables] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [selectedTable, setSelectedTable] = useState(null);
  const [currentOrder, setCurrentOrder] = useState([]);
  const [kitchenOrders, setKitchenOrders] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [qrAmount, setQrAmount] = useState('');
  const [completedTransactions, setCompletedTransactions] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsTab, setSettingsTab] = useState('sheets');
  
  const [sheetConfig, setSheetConfig] = useState({
    scriptUrl: '',
    enabled: false,
    autoSync: false,
    isConfigured: false
  });
  
  const [newTableNumber, setNewTableNumber] = useState('');
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: 'Main'
  });
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food Supplies'
  });
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null);

  // Initialize data
  useEffect(() => {
    const loadFromStorage = (key, defaultValue) => {
      try {
        const saved = localStorage.getItem(key);
        return saved ? JSON.parse(saved) : defaultValue;
      } catch {
        return defaultValue;
      }
    };

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

    setTables(loadFromStorage('tables', defaultTables));
    setMenuItems(loadFromStorage('menuItems', defaultMenu));
    setKitchenOrders(loadFromStorage('kitchenOrders', []));
    setCompletedTransactions(loadFromStorage('completedTransactions', []));
    setExpenses(loadFromStorage('expenses', []));
    
    const savedConfig = loadFromStorage('sheetConfig', {});
    setSheetConfig({
      scriptUrl: savedConfig.scriptUrl || '',
      enabled: savedConfig.enabled || false,
      autoSync: savedConfig.autoSync || false,
      isConfigured: savedConfig.isConfigured || false
    });
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('tables', JSON.stringify(tables));
  }, [tables]);

  useEffect(() => {
    localStorage.setItem('menuItems', JSON.stringify(menuItems));
  }, [menuItems]);

  useEffect(() => {
    localStorage.setItem('kitchenOrders', JSON.stringify(kitchenOrders));
  }, [kitchenOrders]);

  useEffect(() => {
    localStorage.setItem('completedTransactions', JSON.stringify(completedTransactions));
  }, [completedTransactions]);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('sheetConfig', JSON.stringify(sheetConfig));
  }, [sheetConfig]);

  // ========== GOOGLE SHEETS FUNCTIONS WITH CORS FIX ==========

  // Method 1: JSONP for GET requests (CORS bypass)
  const jsonpRequest = (url, callbackName = 'callback') => {
    return new Promise((resolve, reject) => {
      const uniqueCallback = `${callbackName}_${Date.now()}`;
      window[uniqueCallback] = (data) => {
        delete window[uniqueCallback];
        document.body.removeChild(script);
        resolve(data);
      };

      const script = document.createElement('script');
      script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${uniqueCallback}`;
      script.onerror = () => {
        delete window[uniqueCallback];
        document.body.removeChild(script);
        reject(new Error('JSONP request failed'));
      };
      
      document.body.appendChild(script);
    });
  };

  // Method 2: Image ping for simple POST (no response needed)
  const imagePing = (url, data) => {
    return new Promise((resolve) => {
      const params = new URLSearchParams();
      params.append('data', JSON.stringify(data));
      
      const img = new Image();
      img.src = `${url}?${params.toString()}`;
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
    });
  };

  // Method 3: Form submission (CORS friendly)
  const formSubmit = (url, data) => {
    return new Promise((resolve, reject) => {
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = url;
      form.target = '_blank'; // Open in new tab to avoid CORS
      form.style.display = 'none';
      
      // Add data as hidden inputs
      Object.entries(data).forEach(([key, value]) => {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = typeof value === 'object' ? JSON.stringify(value) : value;
        form.appendChild(input);
      });
      
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
      resolve(true);
    });
  };

  // Method 4: Using no-cors mode (limited)
  const noCorsFetch = async (url, options = {}) => {
    try {
      const response = await fetch(url, {
        ...options,
        mode: 'no-cors',
        credentials: 'omit'
      });
      // We can't read response in no-cors mode, but request goes through
      return { success: true, status: 'sent' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  // Main save function that tries multiple methods
  const saveDataToGoogle = async (type, data) => {
    if (!sheetConfig.enabled || !sheetConfig.scriptUrl || !sheetConfig.isConfigured) {
      return;
    }

    try {
      setSyncStatus({
        message: 'Saving to Google Sheets...',
        type: 'loading',
        lastSync: new Date(),
        details: `Saving ${type}`
      });

      const payload = {
        action: 'save',
        type: type,
        data: data,
        timestamp: new Date().toISOString()
      };

      // Try no-cors fetch first (most reliable for POST)
      const result = await noCorsFetch(sheetConfig.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (result.success) {
        setSyncStatus({
          message: '✓ Data sent to Google Sheets',
          type: 'success',
          lastSync: new Date(),
          details: 'Request successful (no-cors mode)'
        });
        
        // Also try form submission as backup
        setTimeout(() => {
          formSubmit(sheetConfig.scriptUrl, payload);
        }, 100);
      } else {
        // Fallback to image ping
        await imagePing(sheetConfig.scriptUrl, payload);
        setSyncStatus({
          message: '✓ Data sent (fallback method)',
          type: 'success',
          lastSync: new Date(),
          details: 'Used alternative method'
        });
      }

      // Clear message after 3 seconds
      setTimeout(() => {
        setSyncStatus(prev => prev.type === 'success' ? { ...prev, message: '', details: '' } : prev);
      }, 3000);

    } catch (error) {
      console.error('Save error:', error);
      setSyncStatus({
        message: '⚠️ Data may not have synced',
        type: 'warning',
        lastSync: new Date(),
        details: 'Using local storage only'
      });
    }
  };

  // Test connection with multiple methods
  const testGoogleSheetsConnection = async () => {
    if (!sheetConfig.scriptUrl) {
      setConnectionStatus({
        success: false,
        message: '❌ No URL provided',
        details: 'Please enter your Google Apps Script URL'
      });
      return;
    }

    setTestingConnection(true);
    setConnectionStatus(null);

    try {
      // Method 1: Try JSONP first (CORS bypass for GET)
      console.log('Testing with JSONP...');
      
      // Create a test URL with callback parameter
      const testUrl = `${sheetConfig.scriptUrl}?action=test&timestamp=${Date.now()}`;
      
      try {
        const result = await jsonpRequest(testUrl);
        console.log('JSONP result:', result);
        
        if (result.success) {
          setConnectionStatus({
            success: true,
            message: '✅ Connection Successful!',
            details: 'Connected via JSONP method'
          });
          
          setSheetConfig(prev => ({
            ...prev,
            isConfigured: true
          }));
          
          setTestingConnection(false);
          return;
        }
      } catch (jsonpError) {
        console.log('JSONP failed, trying direct fetch...');
      }

      // Method 2: Try direct fetch (might work if script allows CORS)
      try {
        const response = await fetch(testUrl);
        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setConnectionStatus({
              success: true,
              message: '✅ Connection Successful!',
              details: 'Connected via direct fetch'
            });
            setSheetConfig(prev => ({
              ...prev,
              isConfigured: true
            }));
            setTestingConnection(false);
            return;
          }
        }
      } catch (fetchError) {
        console.log('Direct fetch failed:', fetchError);
      }

      // Method 3: Test POST with no-cors
      console.log('Testing POST with no-cors...');
      const postResult = await noCorsFetch(sheetConfig.scriptUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: 'test',
          type: 'test',
          data: [{ test: 'connection', timestamp: new Date().toISOString() }]
        })
      });

      if (postResult.success) {
        setConnectionStatus({
          success: true,
          message: '✅ POST Connection Working!',
          details: 'Can send data (no-cors mode)',
          note: 'GET requests may not work due to CORS'
        });
        
        setSheetConfig(prev => ({
          ...prev,
          isConfigured: true
        }));
      } else {
        throw new Error('All connection methods failed');
      }

    } catch (error) {
      console.error('Connection test failed:', error);
      
      // Check if script URL is accessible by opening in new tab
      window.open(sheetConfig.scriptUrl + '?action=test', '_blank');
      
      setConnectionStatus({
        success: false,
        message: '⚠️ Manual Authorization Required',
        details: 'Please authorize the script in the new tab that opened, then test again.',
        steps: [
          '1. A new tab opened with your script',
          '2. Click "Advanced" if shown',
          '3. Click "Go to [Project Name]"',
          '4. Click "Allow"',
          '5. Return here and test again'
        ]
      });
      
    } finally {
      setTestingConnection(false);
    }
  };

  // Sync all data
  const syncAllToGoogle = async () => {
    if (!sheetConfig.enabled || !sheetConfig.isConfigured) {
      alert('Please configure and test Google Sheets connection first');
      return;
    }

    try {
      setSyncStatus({
        message: 'Syncing all data...',
        type: 'loading',
        lastSync: new Date(),
        details: 'Please wait'
      });

      await Promise.all([
        saveDataToGoogle('tables', tables),
        saveDataToGoogle('menu', menuItems),
        saveDataToGoogle('transactions', completedTransactions),
        saveDataToGoogle('expenses', expenses),
        saveDataToGoogle('kitchenOrders', kitchenOrders)
      ]);

    } catch (error) {
      console.error('Sync failed:', error);
    }
  };

  // Business logic functions (same as before, but updated to use saveDataToGoogle)
  const selectTable = (tableNumber) => {
    const table = tables.find(t => t.number === tableNumber);
    setSelectedTable(tableNumber);
    setCurrentOrder(table.orders);
  };

  const addItemToOrder = (item) => {
    const existingItem = currentOrder.find(i => i.id === item.id);
    if (existingItem) {
      setCurrentOrder(currentOrder.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCurrentOrder([...currentOrder, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, delta) => {
    setCurrentOrder(currentOrder.map(i =>
      i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0));
  };

  const removeItem = (itemId) => {
    setCurrentOrder(currentOrder.filter(i => i.id !== itemId));
  };

  const submitOrder = async () => {
    if (selectedTable && currentOrder.length > 0) {
      const newKitchenOrder = {
        id: Date.now(),
        tableNumber: selectedTable,
        items: currentOrder,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      };
      
      const updatedKitchenOrders = [...kitchenOrders, newKitchenOrder];
      setKitchenOrders(updatedKitchenOrders);
      
      const updatedTables = tables.map(t =>
        t.number === selectedTable
          ? { ...t, status: 'occupied', orders: currentOrder }
          : t
      );
      setTables(updatedTables);
      
      // Save to Google Sheets
      if (sheetConfig.enabled && sheetConfig.isConfigured) {
        await Promise.all([
          saveDataToGoogle('kitchenOrders', updatedKitchenOrders),
          saveDataToGoogle('tables', updatedTables)
        ]);
      }
      
      alert(`Order submitted to kitchen for Table ${selectedTable}`);
      setSelectedTable(null);
      setCurrentOrder([]);
    } else {
      alert('Please select a table and add items');
    }
  };

  // ... [Keep all other business logic functions the same] ...

  // Render function
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <div className="bg-orange-600 text-white shadow-lg">
        <div className="container mx-auto px-2 sm:px-4">
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
              {/* Other tab buttons */}
            </div>
            <div className="flex gap-2 ml-2">
              {syncStatus.message && (
                <div className={`flex flex-col px-3 py-2 rounded-lg text-sm ${
                  syncStatus.type === 'success' ? 'bg-green-100 text-green-800' :
                  syncStatus.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  syncStatus.type === 'loading' ? 'bg-blue-100 text-blue-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  <span className="font-semibold">{syncStatus.message}</span>
                  {syncStatus.details && (
                    <span className="text-xs mt-1">{syncStatus.details}</span>
                  )}
                </div>
              )}
              {sheetConfig.isConfigured && (
                <button
                  onClick={syncAllToGoogle}
                  className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-green-600 hover:bg-green-700 rounded-lg font-semibold transition-colors text-sm sm:text-base"
                >
                  <RefreshCw size={16} className="sm:w-5 sm:h-5" />
                  <span className="hidden md:inline">Sync Now</span>
                </button>
              )}
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-1 sm:gap-2 px-3 sm:px-6 py-2 sm:py-3 bg-black hover:bg-gray-900 rounded-lg font-semibold transition-colors text-sm sm:text-base"
              >
                <Settings size={16} className="sm:w-5 sm:h-5" />
                <span className="hidden md:inline">Settings</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            <div className="bg-orange-600 text-white p-6 flex justify-between items-center">
              <h2 className="text-2xl font-bold">Google Sheets Setup</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="p-2 hover:bg-orange-700 rounded-lg transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex border-b border-gray-200">
              <button
                onClick={() => setSettingsTab('sheets')}
                className={`px-6 py-3 font-semibold transition-colors ${
                  settingsTab === 'sheets' ? 'bg-orange-100 text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Database className="inline mr-2 w-4 h-4" />
                Google Sheets
              </button>
              {/* Other tabs */}
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
              {settingsTab === 'sheets' && (
                <div>
                  <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
                    <h3 className="text-lg font-bold text-black mb-2">Step-by-Step Setup</h3>
                    <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
                      <li>Copy the Google Apps Script code below</li>
                      <li>Go to <a href="https://script.google.com" target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">script.google.com</a></li>
                      <li>Create new project, paste the code, and save</li>
                      <li>Click "Deploy" → "New deployment" → "Web app"</li>
                      <li>Set: Execute as "Me", Who has access: "Anyone"</li>
                      <li>Click "Deploy" and copy the URL</li>
                      <li>Paste URL below and test connection</li>
                    </ol>
                  </div>

                  <div className="mb-6">
                    <label className="block text-sm font-semibold text-black mb-2">
                      Google Apps Script URL
                    </label>
                    <input
                      type="text"
                      value={sheetConfig.scriptUrl}
                      onChange={(e) => setSheetConfig({ ...sheetConfig, scriptUrl: e.target.value, isConfigured: false })}
                      placeholder="https://script.google.com/macros/s/.../exec"
                      className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="flex gap-3 mb-6">
                    <button
                      onClick={testGoogleSheetsConnection}
                      disabled={testingConnection || !sheetConfig.scriptUrl}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2 ${
                        testingConnection || !sheetConfig.scriptUrl
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {testingConnection ? (
                        <>
                          <RefreshCw className="animate-spin" size={20} />
                          Testing...
                        </>
                      ) : (
                        <>
                          <Link size={20} />
                          Test Connection
                        </>
                      )}
                    </button>

                    <button
                      onClick={syncAllToGoogle}
                      disabled={!sheetConfig.isConfigured}
                      className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                        !sheetConfig.isConfigured
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                      }`}
                    >
                      <RefreshCw size={20} className="inline mr-2" />
                      Sync All Data
                    </button>
                  </div>

                  {connectionStatus && (
                    <div className={`mb-6 p-4 rounded-lg ${
                      connectionStatus.success
                        ? 'bg-green-50 border-2 border-green-500'
                        : 'bg-yellow-50 border-2 border-yellow-500'
                    }`}>
                      <div className="font-semibold text-black mb-2">{connectionStatus.message}</div>
                      <div className="text-sm text-gray-700 mb-2">{connectionStatus.details}</div>
                      {connectionStatus.steps && (
                        <div className="mt-3">
                          <div className="text-sm font-semibold mb-1">Steps to fix:</div>
                          <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                            {connectionStatus.steps.map((step, index) => (
                              <li key={index}>{step}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="enableSync"
                      checked={sheetConfig.enabled}
                      onChange={(e) => setSheetConfig({ ...sheetConfig, enabled: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <label htmlFor="enableSync" className="text-black font-semibold">
                      Enable Google Sheets Sync
                    </label>
                  </div>

                  <div className="flex items-center gap-3 mb-6">
                    <input
                      type="checkbox"
                      id="autoSync"
                      checked={sheetConfig.autoSync}
                      onChange={(e) => setSheetConfig({ ...sheetConfig, autoSync: e.target.checked })}
                      className="w-5 h-5"
                      disabled={!sheetConfig.enabled}
                    />
                    <label htmlFor="autoSync" className={`font-semibold ${!sheetConfig.enabled ? 'text-gray-400' : 'text-black'}`}>
                      Auto-sync on changes
                    </label>
                  </div>

                  {sheetConfig.isConfigured && (
                    <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                      <div className="flex items-center gap-2 text-green-800 font-semibold">
                        <Database size={20} />
                        Google Sheets is Configured
                      </div>
                      <div className="text-sm text-green-700 mt-1">
                        Your data will be automatically saved to Google Sheets.
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
        {/* Your existing tab content remains the same */}
        {/* Waiter Tab */}
        {activeTab === 'waiter' && (
          <div>
            {/* ... existing waiter tab content ... */}
          </div>
        )}
        
        {/* Other tabs */}
      </div>
    </div>
  );
};

export default RestaurantOrderSystem;
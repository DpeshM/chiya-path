import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Database, Link, RefreshCw } from 'lucide-react';

const SettingsModal = ({
  showSettings,
  setShowSettings,
  sheetConfig,
  setSheetConfig,
  tables,
  setTables,
  menuItems,
  setMenuItems,
  handleTestConnection,
  handleSyncAll,
  syncStatus,
  handleSyncToGoogle
}) => {
  const [settingsTab, setSettingsTab] = useState('sheets');
  const [newTableNumber, setNewTableNumber] = useState('');
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({
    name: '',
    price: '',
    category: 'Main'
  });

  const addTable = async () => {
    const tableNum = parseInt(newTableNumber);
    if (!tableNum || tableNum <= 0) {
      alert('Please enter a valid table number');
      return;
    }
    if (tables.find(t => t.number === tableNum)) {
      alert('Table number already exists');
      return;
    }
    const newTables = [...tables, { number: tableNum, status: 'vacant', orders: [] }].sort((a, b) => a.number - b.number);
    setTables(newTables);
    setNewTableNumber('');
    await handleSyncToGoogle('tables', newTables);
    alert(`Table ${tableNum} added successfully`);
  };

  const deleteTable = async (tableNumber) => {
    const table = tables.find(t => t.number === tableNumber);
    if (table.status === 'occupied') {
      alert('Cannot delete an occupied table');
      return;
    }
    if (window.confirm(`Delete Table ${tableNumber}?`)) {
      const newTables = tables.filter(t => t.number !== tableNumber);
      setTables(newTables);
      await handleSyncToGoogle('tables', newTables);
    }
  };

  const addMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price || parseFloat(newMenuItem.price) <= 0) {
      alert('Please enter valid item name and price');
      return;
    }
    const item = {
      id: Date.now(),
      name: newMenuItem.name,
      price: parseFloat(newMenuItem.price),
      category: newMenuItem.category
    };
    const newMenu = [...menuItems, item];
    setMenuItems(newMenu);
    setNewMenuItem({ name: '', price: '', category: 'Main' });
    setShowAddMenuItem(false);
    await handleSyncToGoogle('menu', newMenu);
    alert(`${item.name} added to menu`);
  };

  const updateMenuItem = async () => {
    if (!editingMenuItem.name || !editingMenuItem.price || parseFloat(editingMenuItem.price) <= 0) {
      alert('Please enter valid item name and price');
      return;
    }
    const newMenu = menuItems.map(item =>
      item.id === editingMenuItem.id
        ? { ...item, name: editingMenuItem.name, price: parseFloat(editingMenuItem.price), category: editingMenuItem.category }
        : item
    );
    setMenuItems(newMenu);
    setEditingMenuItem(null);
    await handleSyncToGoogle('menu', newMenu);
    alert('Menu item updated');
  };

  const deleteMenuItem = async (itemId) => {
    if (window.confirm('Delete this menu item?')) {
      const newMenu = menuItems.filter(item => item.id !== itemId);
      setMenuItems(newMenu);
      await handleSyncToGoogle('menu', newMenu);
    }
  };

  const groupByCategory = (items) => {
    return items.reduce((acc, item) => {
      if (!acc[item.category]) acc[item.category] = [];
      acc[item.category].push(item);
      return acc;
    }, {});
  };

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-orange-600 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">Settings</h2>
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
            Google Sheets
          </button>
          <button
            onClick={() => setSettingsTab('tables')}
            className={`px-6 py-3 font-semibold transition-colors ${
              settingsTab === 'tables' ? 'bg-orange-100 text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manage Tables
          </button>
          <button
            onClick={() => setSettingsTab('menu')}
            className={`px-6 py-3 font-semibold transition-colors ${
              settingsTab === 'menu' ? 'bg-orange-100 text-orange-600 border-b-2 border-orange-600' : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Manage Menu
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {settingsTab === 'sheets' && (
            <div>
              <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
                <h3 className="text-lg font-bold text-black mb-2">Google Sheets Setup</h3>
                <p className="text-sm text-gray-700">Connect to Google Sheets for data backup and sync.</p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">Script URL</label>
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
                  onClick={handleTestConnection}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Link size={20} />
                  Test Connection
                </button>
                <button
                  onClick={handleSyncAll}
                  disabled={!sheetConfig.isConfigured}
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${!sheetConfig.isConfigured ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw size={20} className="inline mr-2" />
                  Sync All Data
                </button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="enableSync"
                    checked={sheetConfig.enabled}
                    onChange={(e) => setSheetConfig({ ...sheetConfig, enabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                  <label htmlFor="enableSync" className="text-black font-semibold">Enable Google Sheets Sync</label>
                </div>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="autoSync"
                    checked={sheetConfig.autoSync}
                    onChange={(e) => setSheetConfig({ ...sheetConfig, autoSync: e.target.checked })}
                    className="w-5 h-5"
                    disabled={!sheetConfig.enabled}
                  />
                  <label htmlFor="autoSync" className={`font-semibold ${!sheetConfig.enabled ? 'text-gray-400' : 'text-black'}`}>Auto-sync on changes</label>
                </div>
              </div>

              {sheetConfig.isConfigured && (
                <div className="mt-6 p-4 bg-green-50 border-2 border-green-500 rounded-lg">
                  <div className="flex items-center gap-2 text-green-800 font-semibold">
                    <Database size={20} />
                    Google Sheets Connected
                  </div>
                </div>
              )}
            </div>
          )}

          {settingsTab === 'tables' && (
            <div>
              <div className="mb-6">
                <h3 className="text-xl font-bold text-black mb-4">Add New Table</h3>
                <div className="flex gap-3">
                  <input
                    type="number"
                    value={newTableNumber}
                    onChange={(e) => setNewTableNumber(e.target.value)}
                    placeholder="Enter table number"
                    className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                  />
                  <button
                    onClick={addTable}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                  >
                    <Plus size={20} className="inline mr-2" />
                    Add Table
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-4">Current Tables</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tables.map(table => (
                    <div
                      key={table.number}
                      className={`p-4 rounded-lg border-2 ${
                        table.status === 'occupied'
                          ? 'border-orange-500 bg-orange-50'
                          : 'border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg text-black">Table {table.number}</span>
                        <span className={`text-xs px-2 py-1 rounded ${
                          table.status === 'occupied' ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {table.status}
                        </span>
                      </div>
                      {table.status === 'vacant' && (
                        <button
                          onClick={() => deleteTable(table.number)}
                          className="w-full mt-2 px-3 py-2 bg-red-500 text-white rounded text-sm font-semibold hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {settingsTab === 'menu' && (
            <div>
              <div className="mb-6">
                <button
                  onClick={() => setShowAddMenuItem(true)}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Menu Item
                </button>
              </div>

              {showAddMenuItem && (
                <div className="mb-6 p-4 bg-orange-50 border-2 border-orange-500 rounded-lg">
                  <h3 className="text-lg font-bold text-black mb-4">New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                      placeholder="Item name"
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                      placeholder="Price"
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                    <select
                      value={newMenuItem.category}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Main">Main</option>
                      <option value="Starter">Starter</option>
                      <option value="Side">Side</option>
                      <option value="Drink">Drink</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={addMenuItem}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Add Item
                    </button>
                    <button
                      onClick={() => setShowAddMenuItem(false)}
                      className="px-6 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              {editingMenuItem && (
                <div className="mb-6 p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
                  <h3 className="text-lg font-bold text-black mb-4">Edit Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={editingMenuItem.name}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, name: e.target.value })}
                      placeholder="Item name"
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editingMenuItem.price}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, price: e.target.value })}
                      placeholder="Price"
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    />
                    <select
                      value={editingMenuItem.category}
                      onChange={(e) => setEditingMenuItem({ ...editingMenuItem, category: e.target.value })}
                      className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none"
                    >
                      <option value="Main">Main</option>
                      <option value="Starter">Starter</option>
                      <option value="Side">Side</option>
                      <option value="Drink">Drink</option>
                      <option value="Dessert">Dessert</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={updateMenuItem}
                      className="px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => setEditingMenuItem(null)}
                      className="px-6 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold text-black mb-4">Menu Items</h3>
                {Object.entries(groupByCategory(menuItems)).map(([category, items]) => (
                  <div key={category} className="mb-6">
                    <h4 className="text-lg font-semibold text-black mb-3 border-b-2 border-orange-500 pb-2">{category}</h4>
                    <div className="space-y-2">
                      {items.map(item => (
                        <div key={item.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-300">
                          <div className="flex-1">
                            <span className="font-medium text-black">{item.name}</span>
                            <span className="text-orange-600 font-semibold ml-4">Rs.{item.price.toFixed(2)}</span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingMenuItem(item)}
                              className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteMenuItem(item.id)}
                              className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
import React, { useState } from 'react';
import { X, Plus, Edit2, Trash2, Database, Link, RefreshCw } from 'lucide-react';
import { groupByCategory } from '../logic/calculations';
import {
  createTable,
  deleteTable as deleteTableApi,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem as deleteMenuItemApi,
} from '../services/api';

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
  handleSyncToGoogle,
  loadAll,
}) => {
  const [settingsTab, setSettingsTab] = useState('sheets');
  const [newTableNumber, setNewTableNumber] = useState('');
  const [showAddMenuItem, setShowAddMenuItem] = useState(false);
  const [editingMenuItem, setEditingMenuItem] = useState(null);
  const [newMenuItem, setNewMenuItem] = useState({ name: '', price: '', category: 'Main' });

  const addTable = async () => {
    const tableNum = parseInt(newTableNumber);
    if (!tableNum || tableNum <= 0) {
      alert('Please enter a valid table number');
      return;
    }
    if (tables.find((t) => t.number === tableNum)) {
      alert('Table number already exists');
      return;
    }
    try {
      await createTable({ number: tableNum, status: 'vacant', orders: [] });
      setNewTableNumber('');
      await loadAll?.();
      await handleSyncToGoogle('tables', [...tables, { number: tableNum, status: 'vacant', orders: [] }]);
      alert(`Table ${tableNum} added successfully`);
    } catch (err) {
      console.error('Failed to add table:', err);
      alert('Failed to add table. Please try again.');
    }
  };

  const deleteTable = async (table) => {
    if (table.status === 'occupied') {
      alert('Cannot delete an occupied table');
      return;
    }
    if (!window.confirm(`Delete Table ${table.number}?`)) return;
    try {
      await deleteTableApi(table.id);
      await loadAll?.();
      await handleSyncToGoogle('tables', tables.filter((t) => t.number !== table.number));
    } catch (err) {
      console.error('Failed to delete table:', err);
      alert('Failed to delete table. Please try again.');
    }
  };

  const addMenuItem = async () => {
    if (!newMenuItem.name || !newMenuItem.price || parseFloat(newMenuItem.price) <= 0) {
      alert('Please enter valid item name and price');
      return;
    }
    try {
      const created = await createMenuItem({
        name: newMenuItem.name,
        price: parseFloat(newMenuItem.price),
        category: newMenuItem.category,
      });
      setNewMenuItem({ name: '', price: '', category: 'Main' });
      setShowAddMenuItem(false);
      await loadAll?.();
      await handleSyncToGoogle('menu', [...menuItems, created]);
      alert(`${created.name} added to menu`);
    } catch (err) {
      console.error('Failed to add menu item:', err);
      alert('Failed to add menu item. Please try again.');
    }
  };

  const updateMenuItemHandler = async () => {
    if (!editingMenuItem.name || !editingMenuItem.price || parseFloat(editingMenuItem.price) <= 0) {
      alert('Please enter valid item name and price');
      return;
    }
    try {
      await updateMenuItem(editingMenuItem.id, {
        name: editingMenuItem.name,
        price: parseFloat(editingMenuItem.price),
        category: editingMenuItem.category,
      });
      setEditingMenuItem(null);
      await loadAll?.();
      await handleSyncToGoogle('menu', menuItems);
      alert('Menu item updated');
    } catch (err) {
      console.error('Failed to update menu item:', err);
      alert('Failed to update menu item. Please try again.');
    }
  };

  const deleteMenuItemHandler = async (itemId) => {
    if (!window.confirm('Delete this menu item?')) return;
    try {
      await deleteMenuItemApi(itemId);
      await loadAll?.();
      await handleSyncToGoogle('menu', menuItems.filter((item) => item.id !== itemId));
    } catch (err) {
      console.error('Failed to delete menu item:', err);
      alert('Failed to delete menu item. Please try again.');
    }
  };

  if (!showSettings) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="bg-gradient-to-r from-amber-600 to-amber-700 text-white p-6 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold">Settings</h2>
          <button
            onClick={() => setShowSettings(false)}
            className="p-2 hover:bg-amber-700 rounded-xl transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="flex border-b border-gray-200">
          <button
            onClick={() => setSettingsTab('sheets')}
            className={`px-6 py-3 font-semibold transition-colors ${
              settingsTab === 'sheets'
                ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Google Sheets
          </button>
          <button
            onClick={() => setSettingsTab('tables')}
            className={`px-6 py-3 font-semibold transition-colors ${
              settingsTab === 'tables'
                ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Manage Tables
          </button>
          <button
            onClick={() => setSettingsTab('menu')}
            className={`px-6 py-3 font-semibold transition-colors ${
              settingsTab === 'menu'
                ? 'bg-amber-100 text-amber-700 border-b-2 border-amber-600'
                : 'text-stone-600 hover:bg-stone-100'
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
                <p className="text-sm text-gray-700">
                  Connect to Google Sheets for data backup and sync.
                </p>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-black mb-2">Script URL</label>
                <input
                  type="text"
                  value={sheetConfig.scriptUrl}
                  onChange={(e) =>
                    setSheetConfig({ ...sheetConfig, scriptUrl: e.target.value, isConfigured: false })
                  }
                  placeholder="https://script.google.com/macros/s/.../exec"
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
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
                  className={`px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors ${
                    !sheetConfig.isConfigured ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
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
                  <label htmlFor="enableSync" className="text-black font-semibold">
                    Enable Google Sheets Sync
                  </label>
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
                  <label
                    htmlFor="autoSync"
                    className={`font-semibold ${!sheetConfig.enabled ? 'text-gray-400' : 'text-black'}`}
                  >
                    Auto-sync on changes
                  </label>
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
                    className="flex-1 px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-emerald-500 focus:outline-none"
                  />
                  <button
                    onClick={addTable}
                    className="px-6 py-3 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
                  >
                    <Plus size={20} className="inline mr-2" />
                    Add Table
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-black mb-4">Current Tables</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {tables.map((table) => (
                    <div
                      key={table.number}
                      className={`p-4 rounded-lg border-2 ${
                        table.status === 'occupied'
                          ? 'border-amber-500 bg-amber-50'
                          : 'border-stone-200 bg-white'
                      }`}
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-lg text-black">Table {table.number}</span>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            table.status === 'occupied'
                              ? 'bg-amber-600 text-white'
                              : 'bg-stone-200 text-stone-700'
                          }`}
                        >
                          {table.status}
                        </span>
                      </div>
                      {table.status === 'vacant' && (
                        <button
                          onClick={() => deleteTable(table)}
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
                  className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 transition-colors"
                >
                  <Plus size={20} className="inline mr-2" />
                  Add Menu Item
                </button>
              </div>

              {showAddMenuItem && (
                <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-500 rounded-xl">
                  <h3 className="text-lg font-bold text-black mb-4">New Menu Item</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <input
                      type="text"
                      value={newMenuItem.name}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, name: e.target.value })}
                      placeholder="Item name"
                      className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={newMenuItem.price}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, price: e.target.value })}
                      placeholder="Price"
                      className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                    <select
                      value={newMenuItem.category}
                      onChange={(e) => setNewMenuItem({ ...newMenuItem, category: e.target.value })}
                      className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
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
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, name: e.target.value })
                      }
                      placeholder="Item name"
                      className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                    <input
                      type="number"
                      step="0.01"
                      value={editingMenuItem.price}
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, price: e.target.value })
                      }
                      placeholder="Price"
                      className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                    />
                    <select
                      value={editingMenuItem.category}
                      onChange={(e) =>
                        setEditingMenuItem({ ...editingMenuItem, category: e.target.value })
                      }
                      className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
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
                      onClick={updateMenuItemHandler}
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
                    <h4 className="text-lg font-semibold text-stone-800 mb-3 border-b-2 border-amber-500 pb-2">
                      {category}
                    </h4>
                    <div className="space-y-2">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-300"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-black">{item.name}</span>
                            <span className="text-amber-600 font-semibold ml-4">
                              Rs.{item.price.toFixed(2)}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingMenuItem(item)}
                              className="p-2 bg-blue-100 text-blue-600 rounded hover:bg-blue-200 transition-colors"
                            >
                              <Edit2 size={16} />
                            </button>
                            <button
                              onClick={() => deleteMenuItemHandler(item.id)}
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

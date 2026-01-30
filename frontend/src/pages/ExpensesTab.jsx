import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { createExpense, deleteExpense } from '../services/api';

const ExpensesTab = ({
  expenses,
  setExpenses,
  completedTransactions,
  handleSyncToGoogle,
  loadAll,
}) => {
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'Food Supplies',
  });

  const addExpense = async () => {
    if (!newExpense.description || !newExpense.amount || parseFloat(newExpense.amount) <= 0) {
      alert('Please enter valid description and amount');
      return;
    }
    const expense = {
      description: newExpense.description,
      amount: parseFloat(newExpense.amount),
      category: newExpense.category,
    };
    try {
      const created = await createExpense(expense);
      setExpenses((prev) => [...prev, created]);
      await handleSyncToGoogle('expenses', [...expenses, created]);
    } catch (err) {
      console.error('Failed to add expense:', err);
      alert('Failed to add expense. Please try again.');
      return;
    }
    setNewExpense({ description: '', amount: '', category: 'Food Supplies' });
    setShowAddExpense(false);
    alert('Expense added successfully');
  };

  const deleteExpenseHandler = async (expenseId) => {
    if (!window.confirm('Delete this expense?')) return;
    try {
      await deleteExpense(expenseId);
      setExpenses((prev) => prev.filter((e) => e.id !== expenseId));
      await handleSyncToGoogle('expenses', expenses.filter((e) => e.id !== expenseId));
    } catch (err) {
      console.error('Failed to delete expense:', err);
      alert('Failed to delete expense. Please try again.');
    }
  };

  const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);
  const totalSales = completedTransactions.reduce((sum, t) => sum + t.total, 0);
  const netProfit = totalSales - totalExpenses;

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-2 border-orange-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-black">Daily Expenses</h2>
        <button
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="w-full sm:w-auto px-4 sm:px-6 py-2 sm:py-3 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm sm:text-base"
        >
          <Plus size={16} className="inline mr-2 sm:w-5 sm:h-5" />
          Add Expense
        </button>
      </div>

      {showAddExpense && (
        <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-orange-50 border-2 border-orange-500 rounded-lg">
          <h3 className="text-base sm:text-lg font-bold text-black mb-3 sm:mb-4">New Expense</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="Description"
              className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm sm:text-base"
            />
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              placeholder="Amount (Rs.)"
              className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm sm:text-base"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="px-3 sm:px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-sm sm:text-base"
            >
              <option value="Food Supplies">Food Supplies</option>
              <option value="Utilities">Utilities</option>
              <option value="Salary">Salary</option>
              <option value="Rent">Rent</option>
              <option value="Maintenance">Maintenance</option>
              <option value="Transportation">Transportation</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-3 sm:mt-4">
            <button
              onClick={addExpense}
              className="px-4 sm:px-6 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm sm:text-base"
            >
              Add Expense
            </button>
            <button
              onClick={() => {
                setShowAddExpense(false);
                setNewExpense({ description: '', amount: '', category: 'Food Supplies' });
              }}
              className="px-4 sm:px-6 py-2 bg-gray-300 text-black rounded-lg font-semibold hover:bg-gray-400 transition-colors text-sm sm:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-6">
        <div className="p-3 sm:p-4 bg-orange-50 border-2 border-orange-500 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Expenses</p>
          <p className="text-xl sm:text-2xl font-bold text-orange-600">Rs.{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="p-3 sm:p-4 bg-green-50 border-2 border-green-500 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Total Sales</p>
          <p className="text-xl sm:text-2xl font-bold text-green-600">Rs.{totalSales.toFixed(2)}</p>
        </div>
        <div className="p-3 sm:p-4 bg-blue-50 border-2 border-blue-500 rounded-lg">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Net Profit</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-600">Rs.{netProfit.toFixed(2)}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <p className="text-gray-500 text-center py-8 sm:py-12 text-base sm:text-lg">
          No expenses recorded
        </p>
      ) : (
        <div className="space-y-2 sm:space-y-3">
          <h3 className="text-lg sm:text-xl font-bold text-black mb-3 sm:mb-4">Today's Expenses</h3>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 sm:gap-4 p-3 sm:p-4 bg-gray-50 rounded-lg border border-gray-300"
            >
              <div className="flex-1 min-w-0 w-full sm:w-auto">
                <p className="font-semibold text-black text-sm sm:text-base">{expense.description}</p>
                <p className="text-xs sm:text-sm text-gray-600">
                  {expense.category} • {expense.date} • {expense.timestamp}
                </p>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-lg sm:text-xl font-bold text-orange-600">
                  Rs.{expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteExpenseHandler(expense.id)}
                  className="p-2 bg-red-100 text-red-600 rounded hover:bg-red-200 transition-colors flex-shrink-0"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpensesTab;

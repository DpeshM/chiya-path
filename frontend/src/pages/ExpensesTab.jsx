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
    <div className="bg-white rounded-2xl shadow-md p-6 border border-stone-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-stone-800">Daily Expenses</h2>
          <p className="text-stone-500 mt-0.5">Track costs and profit</p>
        </div>
        <button
          onClick={() => setShowAddExpense(!showAddExpense)}
          className="flex items-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
        >
          <Plus size={18} />
          Add Expense
        </button>
      </div>

      {showAddExpense && (
        <div className="mb-6 p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
          <h3 className="text-lg font-bold text-stone-800 mb-4">New Expense</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              value={newExpense.description}
              onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
              placeholder="Description"
              className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
            />
            <input
              type="number"
              step="0.01"
              value={newExpense.amount}
              onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
              placeholder="Amount (Rs.)"
              className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
            />
            <select
              value={newExpense.category}
              onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
              className="px-4 py-2 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
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
          <div className="flex gap-3 mt-4">
            <button
              onClick={addExpense}
              className="px-6 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
            >
              Add Expense
            </button>
            <button
              onClick={() => {
                setShowAddExpense(false);
                setNewExpense({ description: '', amount: '', category: 'Food Supplies' });
              }}
              className="px-6 py-2 bg-stone-200 text-stone-700 rounded-xl font-semibold hover:bg-stone-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="p-4 bg-amber-50 border-2 border-amber-200 rounded-xl">
          <p className="text-sm text-stone-600 mb-1">Total Expenses</p>
          <p className="text-xl font-bold text-amber-600">Rs.{totalExpenses.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-emerald-50 border-2 border-emerald-200 rounded-xl">
          <p className="text-sm text-stone-600 mb-1">Total Sales</p>
          <p className="text-xl font-bold text-emerald-600">Rs.{totalSales.toFixed(2)}</p>
        </div>
        <div className="p-4 bg-teal-50 border-2 border-teal-200 rounded-xl">
          <p className="text-sm text-stone-600 mb-1">Net Profit</p>
          <p className="text-xl font-bold text-teal-600">Rs.{netProfit.toFixed(2)}</p>
        </div>
      </div>

      {expenses.length === 0 ? (
        <p className="text-stone-500 text-center py-12">No expenses recorded</p>
      ) : (
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-stone-800 mb-4">Today&apos;s Expenses</h3>
          {expenses.map((expense) => (
            <div
              key={expense.id}
              className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 p-4 bg-stone-50 rounded-xl border border-stone-200"
            >
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-stone-800">{expense.description}</p>
                <p className="text-sm text-stone-500">
                  {expense.category} • {expense.date} • {expense.timestamp}
                </p>
              </div>
              <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end">
                <span className="text-lg font-bold text-amber-600">
                  Rs.{expense.amount.toFixed(2)}
                </span>
                <button
                  onClick={() => deleteExpenseHandler(expense.id)}
                  className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                >
                  <Trash2 size={16} />
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

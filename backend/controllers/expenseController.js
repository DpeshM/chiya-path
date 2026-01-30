import * as expenseService from '../services/expenseService.js';

export const getExpenses = async (req, res) => {
  try {
    const expenses = await expenseService.getAll();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.create(req.body);
    res.status(201).json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteExpense = async (req, res) => {
  try {
    const expense = await expenseService.remove(req.params.id);
    if (!expense) return res.status(404).json({ error: 'Expense not found' });
    res.json(expense);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

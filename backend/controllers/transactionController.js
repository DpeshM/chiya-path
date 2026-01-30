import * as transactionService from '../services/transactionService.js';

export const getTransactions = async (req, res) => {
  try {
    const transactions = await transactionService.getAll();
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.create(req.body);
    res.status(201).json(transaction);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

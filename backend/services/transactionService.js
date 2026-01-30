import Transaction from '../models/Transaction.js';

export const getAll = async () => {
  const transactions = await Transaction.find().sort({ _id: -1 }).lean();
  return transactions.map((t) => ({ ...t, id: t._id.toString() }));
};

export const create = async (data) => {
  const transaction = await Transaction.create(data);
  return transaction.toJSON();
};

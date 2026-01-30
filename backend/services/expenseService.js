import Expense from '../models/Expense.js';

export const getAll = async () => {
  const expenses = await Expense.find().sort({ _id: -1 }).lean();
  return expenses.map((e) => ({ ...e, id: e._id.toString() }));
};

export const create = async (data) => {
  const expense = await Expense.create(data);
  return expense.toJSON();
};

export const remove = async (id) => {
  const expense = await Expense.findByIdAndDelete(id);
  return expense?.toJSON();
};

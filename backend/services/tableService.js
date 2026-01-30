import Table from '../models/Table.js';

export const getAll = async () => {
  const tables = await Table.find().sort({ number: 1 }).lean();
  return tables.map(({ _id, ...t }) => ({ ...t, id: _id.toString() }));
};

export const getById = async (id) => {
  const table = await Table.findById(id).lean();
  if (!table) return null;
  const { _id, ...rest } = table;
  return { ...rest, id: _id.toString() };
};

export const getByNumber = async (number) => {
  return Table.findOne({ number }).lean();
};

export const create = async (data) => {
  const table = await Table.create(data);
  return table.toJSON();
};

export const update = async (id, updates) => {
  const table = await Table.findByIdAndUpdate(id, { $set: updates }, { new: true }).lean();
  if (!table) return null;
  const { _id, ...rest } = table;
  return { ...rest, id: _id.toString() };
};

export const updateByNumber = async (number, updates) => {
  const table = await Table.findOneAndUpdate({ number }, { $set: updates }, { new: true });
  if (!table) return null;
  return table.toJSON();
};

export const remove = async (id) => {
  const table = await Table.findByIdAndDelete(id);
  return table?.toJSON();
};

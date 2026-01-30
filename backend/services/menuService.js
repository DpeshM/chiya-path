import MenuItem from '../models/MenuItem.js';

export const getAll = async () => {
  const items = await MenuItem.find().sort({ category: 1, name: 1 }).lean();
  return items.map((item) => ({ ...item, id: item._id.toString() }));
};

export const getById = async (id) => {
  const item = await MenuItem.findById(id).lean();
  if (!item) return null;
  const { _id, ...rest } = item;
  return { ...rest, id: _id.toString() };
};

export const create = async (data) => {
  const item = await MenuItem.create(data);
  return item.toJSON();
};

export const update = async (id, updates) => {
  const item = await MenuItem.findByIdAndUpdate(id, { $set: updates }, { new: true });
  if (!item) return null;
  return item.toJSON();
};

export const remove = async (id) => {
  const item = await MenuItem.findByIdAndDelete(id);
  return item?.toJSON();
};

import Order from '../models/Order.js';

export const getOrders = async (status) => {
  const query = status === 'ready' ? { status: 'ready' } : { status: { $ne: 'completed' } };
  const orders = await Order.find(query).sort({ _id: -1 }).lean();
  return orders.map(({ _id, ...o }) => ({ ...o, id: _id.toString() }));
};

export const getById = async (id) => {
  const order = await Order.findById(id).lean();
  if (!order) return null;
  const { _id, ...rest } = order;
  return { ...rest, id: _id.toString() };
};

export const createOrder = async (data) => {
  const { tableNumber, seatNumber, items } = data;
  if (!tableNumber || !items || items.length === 0) {
    throw new Error('Table number and items required');
  }
  const order = await Order.create({
    tableNumber,
    seatNumber: seatNumber ?? null,
    items,
  });
  return order.toJSON();
};

export const markOrderReady = async (id) => {
  const order = await Order.findByIdAndUpdate(id, { $set: { status: 'ready' } }, { new: true });
  if (!order) throw new Error('Order not found');
  return order.toJSON();
};

export const completeOrder = async (id) => {
  const order = await Order.findByIdAndUpdate(id, { $set: { status: 'completed' } }, { new: true });
  if (!order) throw new Error('Order not found');
  return order.toJSON();
};

export const completeOrdersByTable = async (tableNumber) => {
  const result = await Order.updateMany(
    { tableNumber, status: { $ne: 'completed' } },
    { $set: { status: 'completed' } }
  );
  return result;
};

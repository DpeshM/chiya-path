import * as orderService from '../services/orderService.js';

export const getOrders = async (req, res) => {
  try {
    const status = req.query.status;
    const orders = await orderService.getOrders(status);
    res.json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createOrder = async (req, res) => {
  try {
    const order = await orderService.createOrder(req.body);
    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const markOrderReady = async (req, res) => {
  try {
    const order = await orderService.markOrderReady(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const completeOrder = async (req, res) => {
  try {
    const order = await orderService.completeOrder(req.params.id);
    res.json(order);
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
};

export const completeOrdersByTable = async (req, res) => {
  try {
    const result = await orderService.completeOrdersByTable(parseInt(req.params.tableNumber));
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

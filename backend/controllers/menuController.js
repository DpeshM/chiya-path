import * as menuService from '../services/menuService.js';

export const getMenu = async (req, res) => {
  try {
    const items = await menuService.getAll();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createMenuItem = async (req, res) => {
  try {
    const item = await menuService.create(req.body);
    res.status(201).json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateMenuItem = async (req, res) => {
  try {
    const item = await menuService.update(req.params.id, req.body);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteMenuItem = async (req, res) => {
  try {
    const item = await menuService.remove(req.params.id);
    if (!item) return res.status(404).json({ error: 'Menu item not found' });
    res.json(item);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

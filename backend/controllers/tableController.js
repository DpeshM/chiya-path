import * as tableService from '../services/tableService.js';

export const getTables = async (req, res) => {
  try {
    const tables = await tableService.getAll();
    res.json(tables);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTable = async (req, res) => {
  try {
    const table = await tableService.create(req.body);
    res.status(201).json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTable = async (req, res) => {
  try {
    const table = await tableService.update(req.params.id, req.body);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const updateTableByNumber = async (req, res) => {
  try {
    const table = await tableService.updateByNumber(parseInt(req.params.number), req.body);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTable = async (req, res) => {
  try {
    const table = await tableService.remove(req.params.id);
    if (!table) return res.status(404).json({ error: 'Table not found' });
    res.json(table);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

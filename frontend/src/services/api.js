const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000';

// Tables
export const fetchTables = async () => {
  const res = await fetch(`${API_BASE}/api/tables`);
  if (!res.ok) throw new Error('Failed to fetch tables');
  return res.json();
};

export const createTable = async (table) => {
  const res = await fetch(`${API_BASE}/api/tables`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(table),
  });
  if (!res.ok) throw new Error('Failed to create table');
  return res.json();
};

export const updateTable = async (id, updates) => {
  const res = await fetch(`${API_BASE}/api/tables/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update table');
  return res.json();
};

export const updateTableByNumber = async (number, updates) => {
  const res = await fetch(`${API_BASE}/api/tables/number/${number}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update table');
  return res.json();
};

export const deleteTable = async (id) => {
  const res = await fetch(`${API_BASE}/api/tables/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete table');
  return res.json();
};

// Menu
export const fetchMenu = async () => {
  const res = await fetch(`${API_BASE}/api/menu`);
  if (!res.ok) throw new Error('Failed to fetch menu');
  return res.json();
};

export const createMenuItem = async (item) => {
  const res = await fetch(`${API_BASE}/api/menu`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(item),
  });
  if (!res.ok) throw new Error('Failed to create menu item');
  return res.json();
};

export const updateMenuItem = async (id, updates) => {
  const res = await fetch(`${API_BASE}/api/menu/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error('Failed to update menu item');
  return res.json();
};

export const deleteMenuItem = async (id) => {
  const res = await fetch(`${API_BASE}/api/menu/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete menu item');
  return res.json();
};

// Orders
export const fetchOrders = async () => {
  const res = await fetch(`${API_BASE}/api/orders`);
  if (!res.ok) throw new Error('Failed to fetch orders');
  return res.json();
};

export const createOrder = async (order) => {
  const res = await fetch(`${API_BASE}/api/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(order),
  });
  if (!res.ok) throw new Error('Failed to create order');
  return res.json();
};

export const markOrderReady = async (orderId) => {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status: 'ready' }),
  });
  if (!res.ok) throw new Error('Failed to update order');
  return res.json();
};

export const completeOrder = async (orderId) => {
  const res = await fetch(`${API_BASE}/api/orders/${orderId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Failed to complete order');
  return res.json();
};

export const completeOrdersByTable = async (tableNumber) => {
  const res = await fetch(`${API_BASE}/api/orders/complete-by-table/${tableNumber}`, {
    method: 'POST',
  });
  if (!res.ok) throw new Error('Failed to complete orders');
  return res.json();
};

// Transactions
export const fetchTransactions = async () => {
  const res = await fetch(`${API_BASE}/api/transactions`);
  if (!res.ok) throw new Error('Failed to fetch transactions');
  return res.json();
};

export const createTransaction = async (transaction) => {
  const res = await fetch(`${API_BASE}/api/transactions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(transaction),
  });
  if (!res.ok) throw new Error('Failed to create transaction');
  return res.json();
};

// Expenses
export const fetchExpenses = async () => {
  const res = await fetch(`${API_BASE}/api/expenses`);
  if (!res.ok) throw new Error('Failed to fetch expenses');
  return res.json();
};

export const createExpense = async (expense) => {
  const res = await fetch(`${API_BASE}/api/expenses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(expense),
  });
  if (!res.ok) throw new Error('Failed to create expense');
  return res.json();
};

export const deleteExpense = async (id) => {
  const res = await fetch(`${API_BASE}/api/expenses/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete expense');
  return res.json();
};

export const isBackendAvailable = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/tables`);
    return res.ok;
  } catch {
    return false;
  }
};

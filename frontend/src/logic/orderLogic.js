export const addItemToOrder = (currentOrder, item) => {
  const existingItem = currentOrder.find((i) => i.id === item.id);
  if (existingItem) {
    return currentOrder.map((i) =>
      i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
    );
  }
  return [...currentOrder, { ...item, quantity: 1 }];
};

export const updateOrderQuantity = (currentOrder, itemId, delta) => {
  return currentOrder
    .map((i) =>
      i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    )
    .filter((i) => i.quantity > 0);
};

export const removeItemFromOrder = (currentOrder, itemId) => {
  return currentOrder.filter((i) => i.id !== itemId);
};

export const buildKitchenOrder = (tableNumber, items) => ({
  id: Date.now(),
  tableNumber,
  items,
  status: 'pending',
  timestamp: new Date().toLocaleTimeString(),
  date: new Date().toLocaleDateString(),
});

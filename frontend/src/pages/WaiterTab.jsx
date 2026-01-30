import React from 'react';
import TableGrid from '../ui/TableGrid';
import MenuGrid from '../ui/MenuGrid';
import OrderSummary from '../ui/OrderSummary';
import { createOrder, updateTableByNumber } from '../services/api';
import { addItemToOrder, updateOrderQuantity, removeItemFromOrder, buildKitchenOrder } from '../logic/orderLogic';
import { calculateTotal, groupByCategory } from '../logic/calculations';

const WaiterTab = ({
  tables,
  menuItems,
  selectedTable,
  currentOrder,
  setSelectedTable,
  setCurrentOrder,
  setKitchenOrders,
  setTables,
  calculateTotal,
  groupByCategory,
  proceedToCheckout,
  useBackend,
  loadAll,
}) => {
  const handleAddItem = (item) => {
    setCurrentOrder(addItemToOrder(currentOrder, item));
  };

  const handleUpdateQuantity = (itemId, delta) => {
    setCurrentOrder(updateOrderQuantity(currentOrder, itemId, delta));
  };

  const handleRemoveItem = (itemId) => {
    setCurrentOrder(removeItemFromOrder(currentOrder, itemId));
  };

  const handleSubmitOrder = async () => {
    if (!selectedTable || currentOrder.length === 0) {
      alert('Please select a table and add items');
      return;
    }

    const table = tables.find((t) => t.number === selectedTable);

    if (useBackend) {
      try {
        await createOrder({
          tableNumber: selectedTable,
          items: currentOrder,
        });
        await updateTableByNumber(selectedTable, {
          status: 'occupied',
          orders: [...(table?.orders || []), ...currentOrder],
        });
        await loadAll();
      } catch (err) {
        console.error('Failed to submit order:', err);
        alert('Failed to submit order. Please try again.');
        return;
      }
    } else {
      const newKitchenOrder = buildKitchenOrder(selectedTable, currentOrder);
      setKitchenOrders((prev) => [...prev, newKitchenOrder]);
      setTables(
        tables.map((t) =>
          t.number === selectedTable
            ? { ...t, status: 'occupied', orders: [...(t.orders || []), ...currentOrder] }
            : t
        )
      );
    }

    alert(`Order submitted to kitchen for Table ${selectedTable}`);
    setSelectedTable(null);
    setCurrentOrder([]);
  };

  return (
    <div>
      {!selectedTable ? (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-stone-800">Select a Table</h2>
          <p className="text-stone-500 mb-6">Click a table to take an order</p>
          <TableGrid
            tables={tables}
            onSelectTable={setSelectedTable}
            onCheckout={proceedToCheckout}
            calculateTotal={calculateTotal}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <MenuGrid
              menuItems={menuItems}
              selectedTable={selectedTable}
              onAddItem={handleAddItem}
              onBack={() => {
                setSelectedTable(null);
                setCurrentOrder([]);
              }}
              groupByCategory={groupByCategory}
            />
          </div>
          <div className="lg:col-span-1">
            <OrderSummary
              selectedTable={selectedTable}
              currentOrder={currentOrder}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onSubmitOrder={handleSubmitOrder}
              calculateTotal={calculateTotal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterTab;

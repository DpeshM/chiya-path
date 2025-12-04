import React from 'react';
import TableGrid from './TableGrid';
import MenuGrid from './MenuGrid';
import OrderSummary from './OrderSummary';

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
  proceedToCheckout
}) => {
  const addItemToOrder = (item) => {
    const existingItem = currentOrder.find(i => i.id === item.id);
    if (existingItem) {
      setCurrentOrder(currentOrder.map(i =>
        i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
      ));
    } else {
      setCurrentOrder([...currentOrder, { ...item, quantity: 1 }]);
    }
  };

  const updateQuantity = (itemId, delta) => {
    setCurrentOrder(currentOrder.map(i =>
      i.id === itemId ? { ...i, quantity: Math.max(0, i.quantity + delta) } : i
    ).filter(i => i.quantity > 0));
  };

  const removeItem = (itemId) => {
    setCurrentOrder(currentOrder.filter(i => i.id !== itemId));
  };

  const submitOrder = () => {
    if (selectedTable && currentOrder.length > 0) {
      const newKitchenOrder = {
        id: Date.now(),
        tableNumber: selectedTable,
        items: currentOrder,
        status: 'pending',
        timestamp: new Date().toLocaleTimeString(),
        date: new Date().toLocaleDateString()
      };
      
      setKitchenOrders(prev => [...prev, newKitchenOrder]);
      setTables(tables.map(t =>
        t.number === selectedTable
          ? { ...t, status: 'occupied', orders: currentOrder }
          : t
      ));
      
      alert(`Order submitted to kitchen for Table ${selectedTable}`);
      setSelectedTable(null);
      setCurrentOrder([]);
    } else {
      alert('Please select a table and add items');
    }
  };

  return (
    <div>
      {!selectedTable ? (
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-black px-2">Select a Table</h2>
          <TableGrid
            tables={tables}
            onSelectTable={setSelectedTable}
            onCheckout={proceedToCheckout}
            calculateTotal={calculateTotal}
          />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2">
            <MenuGrid
              menuItems={menuItems}
              selectedTable={selectedTable}
              onAddItem={addItemToOrder}
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
              onUpdateQuantity={updateQuantity}
              onRemoveItem={removeItem}
              onSubmitOrder={submitOrder}
              calculateTotal={calculateTotal}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default WaiterTab;
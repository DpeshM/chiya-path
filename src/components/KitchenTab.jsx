import React from 'react';

const KitchenTab = ({ kitchenOrders, setKitchenOrders, calculateTotal }) => {
  const markOrderReady = (orderId) => {
    setKitchenOrders(kitchenOrders.map(order =>
      order.id === orderId ? { ...order, status: 'ready' } : order
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-2 border-orange-500">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-black">Kitchen Display System</h2>
      {kitchenOrders.length === 0 ? (
        <p className="text-gray-500 text-center py-8 sm:py-12 text-base sm:text-lg">No pending orders</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
          {kitchenOrders.map(order => (
            <div
              key={order.id}
              className={`border-4 rounded-lg p-4 sm:p-6 ${
                order.status === 'ready' ? 'border-black bg-gray-50' : 'border-orange-500 bg-orange-50'
              }`}
            >
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div>
                  <h3 className="text-xl sm:text-2xl font-bold text-black">Table {order.tableNumber}</h3>
                  <p className="text-xs sm:text-sm text-gray-600">{order.timestamp}</p>
                </div>
                <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-semibold ${
                  order.status === 'ready' ? 'bg-black text-white' : 'bg-orange-600 text-white'
                }`}>
                  {order.status === 'ready' ? 'Ready' : 'Preparing'}
                </span>
              </div>

              <div className="space-y-2 mb-3 sm:mb-4">
                {order.items.map(item => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-gray-300 text-sm sm:text-base">
                    <span className="font-medium text-black">{item.name}</span>
                    <span className="font-semibold text-black">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-black">
                  Rs.{calculateTotal(order.items).toFixed(2)}
                </span>
                {order.status === 'pending' && (
                  <button
                    onClick={() => markOrderReady(order.id)}
                    className="px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm"
                  >
                    Mark as Ready
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default KitchenTab;
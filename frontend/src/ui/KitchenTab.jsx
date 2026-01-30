import React from 'react';

const KitchenTab = ({ kitchenOrders, onMarkReady, calculateTotal }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-stone-200">
      <h2 className="text-2xl font-bold mb-2 text-stone-800">Kitchen Orders</h2>
      <p className="text-stone-500 mb-6">Pending orders from tables</p>
      {kitchenOrders.length === 0 ? (
        <p className="text-stone-500 text-center py-12">No pending orders</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {kitchenOrders.map((order) => (
            <div
              key={order.id}
              className={`rounded-2xl p-5 border-2 transition-all ${
                order.status === 'ready'
                  ? 'border-stone-300 bg-stone-50'
                  : 'border-amber-500 bg-amber-50/50'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-stone-800">Table {order.tableNumber}</h3>
                  <p className="text-sm text-stone-500">{order.timestamp}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-xl text-sm font-semibold ${
                    order.status === 'ready'
                      ? 'bg-stone-700 text-white'
                      : 'bg-amber-600 text-white'
                  }`}
                >
                  {order.status === 'ready' ? 'Ready' : 'Preparing'}
                </span>
              </div>
              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex justify-between py-2 border-b border-stone-200">
                    <span className="font-medium text-stone-800">{item.name}</span>
                    <span className="font-semibold text-stone-800">×{item.quantity}</span>
                  </div>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-stone-800">
                  Rs.{calculateTotal(order.items).toFixed(2)}
                </span>
                {order.status === 'pending' && (
                  <button
                    onClick={() => onMarkReady(order.id)}
                    className="px-4 py-2 bg-amber-600 text-white rounded-xl font-semibold hover:bg-amber-700 transition-colors"
                  >
                    Mark Ready
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

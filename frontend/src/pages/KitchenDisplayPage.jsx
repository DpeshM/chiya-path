import React from 'react';
import { useKitchenDisplay } from '../state/useKitchenDisplay';

const KitchenDisplayPage = () => {
  const { orders, error, handleMarkReady, calculateTotal } = useKitchenDisplay();

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-8">
        <div className="text-center text-amber-400 text-xl font-semibold max-w-md">
          {error}
          <p className="mt-4 text-sm text-gray-400">
            Start the backend with: npm run dev --prefix backend
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-4 sm:p-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-white mb-6 text-center">Kitchen Display</h1>
      {orders.length === 0 ? (
        <div className="flex items-center justify-center min-h-[50vh]">
          <p className="text-2xl text-gray-500">No pending orders</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
          {orders.map((order) => (
            <div
              key={order.id}
              className={`rounded-xl p-5 sm:p-6 border-4 transition-all ${
                order.status === 'ready'
                  ? 'border-emerald-500 bg-emerald-900/30'
                  : 'border-amber-500 bg-amber-900/20'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold text-white">
                    Table {order.tableNumber}
                    {order.seatNumber != null && (
                      <span className="text-lg sm:text-xl text-amber-300 ml-1">
                        Seat {order.seatNumber}
                      </span>
                    )}
                  </h2>
                  <p className="text-sm text-gray-400 mt-1">{order.timestamp}</p>
                </div>
                <span
                  className={`px-3 py-1.5 rounded-lg text-sm font-bold ${
                    order.status === 'ready' ? 'bg-emerald-600 text-white' : 'bg-amber-600 text-white'
                  }`}
                >
                  {order.status === 'ready' ? 'Ready' : 'Preparing'}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-2 border-b border-gray-600 text-base sm:text-lg"
                  >
                    <span className="font-medium text-white">{item.name}</span>
                    <span className="font-bold text-amber-400">x{item.quantity}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xl font-bold text-white">
                  Rs.{calculateTotal(order.items).toFixed(2)}
                </span>
                {order.status === 'pending' && (
                  <button
                    onClick={() => handleMarkReady(order.id)}
                    className="px-5 py-2.5 bg-amber-600 text-white rounded-lg font-bold hover:bg-amber-500 transition-colors"
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

export default KitchenDisplayPage;

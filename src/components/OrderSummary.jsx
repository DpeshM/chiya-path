import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const OrderSummary = ({
  selectedTable,
  currentOrder,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
  calculateTotal
}) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 lg:sticky lg:top-8 border-2 border-orange-500">
      <h2 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 text-black">Current Order</h2>
      <div className="mb-3 sm:mb-4 p-3 bg-orange-100 rounded-lg border border-orange-500">
        <p className="text-base sm:text-lg font-semibold text-black">Table {selectedTable}</p>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4 max-h-64 sm:max-h-96 overflow-y-auto">
        {currentOrder.length === 0 ? (
          <p className="text-gray-500 text-center py-6 sm:py-8 text-sm sm:text-base">No items added</p>
        ) : (
          currentOrder.map(item => (
            <div key={item.id} className="flex items-center justify-between p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-300">
              <div className="flex-1 min-w-0 mr-2">
                <p className="font-medium text-black text-sm sm:text-base truncate">{item.name}</p>
                <p className="text-xs sm:text-sm text-gray-600">Rs.{item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <Minus size={14} className="sm:w-4 sm:h-4" />
                </button>
                <span className="font-semibold w-6 sm:w-8 text-center text-black text-sm sm:text-base">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="p-1 bg-gray-200 rounded hover:bg-gray-300"
                >
                  <Plus size={14} className="sm:w-4 sm:h-4" />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1 bg-orange-100 text-orange-600 rounded hover:bg-orange-200 ml-1"
                >
                  <Trash2 size={14} className="sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {currentOrder.length > 0 && (
        <div className="border-t-2 border-orange-500 pt-3 sm:pt-4">
          <div className="flex justify-between text-lg sm:text-xl font-bold mb-3 sm:mb-4">
            <span className="text-black">Total:</span>
            <span className="text-orange-600">Rs.{calculateTotal(currentOrder).toFixed(2)}</span>
          </div>
          <button
            onClick={onSubmitOrder}
            className="w-full bg-orange-600 text-white py-2 sm:py-3 rounded-lg font-semibold hover:bg-orange-700 transition-colors text-sm sm:text-base"
          >
            Submit Order to Kitchen
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
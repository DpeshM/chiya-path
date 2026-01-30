import React from 'react';
import { Plus, Minus, Trash2 } from 'lucide-react';

const OrderSummary = ({
  selectedTable,
  currentOrder,
  onUpdateQuantity,
  onRemoveItem,
  onSubmitOrder,
  calculateTotal,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 lg:sticky lg:top-8 border border-stone-200">
      <h2 className="text-xl font-bold mb-4 text-stone-800">Current Order</h2>
      <div className="mb-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
        <p className="text-lg font-semibold text-stone-800">Table {selectedTable}</p>
      </div>

      <div className="space-y-2 mb-4 max-h-64 sm:max-h-96 overflow-y-auto">
        {currentOrder.length === 0 ? (
          <p className="text-stone-500 text-center py-8 text-sm">No items added yet</p>
        ) : (
          currentOrder.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 bg-stone-50 rounded-xl border border-stone-200"
            >
              <div className="flex-1 min-w-0 mr-3">
                <p className="font-medium text-stone-800 truncate">{item.name}</p>
                <p className="text-xs text-stone-500">Rs.{item.price.toFixed(2)} each</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onUpdateQuantity(item.id, -1)}
                  className="p-1.5 bg-stone-200 rounded-lg hover:bg-stone-300 text-stone-700"
                >
                  <Minus size={14} />
                </button>
                <span className="font-semibold w-8 text-center text-stone-800">{item.quantity}</span>
                <button
                  onClick={() => onUpdateQuantity(item.id, 1)}
                  className="p-1.5 bg-stone-200 rounded-lg hover:bg-stone-300 text-stone-700"
                >
                  <Plus size={14} />
                </button>
                <button
                  onClick={() => onRemoveItem(item.id)}
                  className="p-1.5 bg-red-100 rounded-lg hover:bg-red-200 text-red-600"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {currentOrder.length > 0 && (
        <div className="border-t border-stone-200 pt-4">
          <div className="flex justify-between text-lg font-bold mb-4">
            <span className="text-stone-800">Total</span>
            <span className="text-amber-600">Rs.{calculateTotal(currentOrder).toFixed(2)}</span>
          </div>
          <button
            onClick={onSubmitOrder}
            className="w-full bg-amber-600 text-white py-3 rounded-xl font-semibold hover:bg-amber-700 transition-colors"
          >
            Submit to Kitchen
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;

import React from 'react';
import { UtensilsCrossed, Receipt } from 'lucide-react';

const TableGrid = ({ tables, onSelectTable, onCheckout, calculateTotal }) => {
  const handleTableClick = (table) => {
    if (table.status === 'occupied') {
      onCheckout(table.number);
    } else {
      onSelectTable(table.number);
    }
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {tables?.map((table) => (
        <button
          key={table.number}
          onClick={() => handleTableClick(table)}
          className={`group relative p-6 rounded-2xl font-bold text-xl transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 ${
            table.status === 'vacant'
              ? 'bg-white border-2 border-stone-200 text-stone-800 hover:border-amber-400 hover:bg-amber-50/50 shadow-sm'
              : 'bg-amber-600 text-white border-2 border-amber-700 hover:bg-amber-700 shadow-md'
          }`}
        >
          <div className="flex flex-col items-center text-center">
            <div className="mb-2">
              {table.status === 'vacant' ? (
                <UtensilsCrossed size={32} className="text-stone-400 group-hover:text-amber-500 mx-auto" />
              ) : (
                <Receipt size={32} className="text-white/90 mx-auto" />
              )}
            </div>
            <div className="text-2xl sm:text-3xl mb-1">Table {table.number}</div>
            <div className="text-sm font-normal opacity-90">
              {table.status === 'vacant' ? 'Take Order' : 'Occupied'}
            </div>
            {table.status === 'occupied' && (
              <div className="mt-4 pt-4 border-t border-white/30 w-full">
                <div className="text-sm mb-2">Rs.{calculateTotal(table.orders || []).toFixed(2)}</div>
                <span
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheckout(table.number);
                  }}
                  className="inline-block bg-white text-amber-700 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-stone-100 transition-colors"
                >
                  Checkout
                </span>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default TableGrid;

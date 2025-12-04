import React from 'react';

const TableGrid = ({ tables, onSelectTable, onCheckout, calculateTotal }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
      {tables?.map(table => (
        <button
          key={table.number}
          onClick={() => onSelectTable(table.number)}
          className={`p-4 sm:p-8 rounded-lg shadow-lg font-bold text-xl sm:text-2xl transition-all transform hover:scale-105 ${
            table.status === 'vacant'
              ? 'bg-white border-4 border-orange-500 text-black hover:bg-orange-50'
              : 'bg-orange-600 text-white hover:bg-orange-700 border-4 border-black'
          }`}
        >
          <div className="text-center">
            <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">Table {table.number}</div>
            <div className="text-xs sm:text-sm font-normal">
              {table.status === 'vacant' ? 'Vacant' : 'Occupied'}
            </div>
            {table.status === 'occupied' && (
              <div className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-white/30">
                <div className="text-xs mb-1">Rs.{calculateTotal(table.orders).toFixed(2)}</div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onCheckout(table.number);
                  }}
                  className="bg-black text-white px-3 sm:px-4 py-1 sm:py-2 rounded text-xs sm:text-sm font-semibold hover:bg-gray-800"
                >
                  Checkout
                </button>
              </div>
            )}
          </div>
        </button>
      ))}
    </div>
  );
};

export default TableGrid;
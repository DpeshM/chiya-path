import React, { useState } from 'react';

const TableGrid = ({ tables, onSelectTable, onSelectSeat, onCheckout, calculateTotal }) => {
  const [selectedTableForSeat, setSelectedTableForSeat] = useState(null);

  const handleTableClick = (table) => {
    if (table.status === 'occupied') {
      onCheckout(table.number);
    } else {
      const seats = table.seats || 4;
      if (seats === 1) {
        onSelectTable(table.number);
        onSelectSeat?.(1);
      } else {
        setSelectedTableForSeat(table);
      }
    }
  };

  const handleSeatSelect = (tableNumber, seatNumber) => {
    onSelectTable(tableNumber);
    onSelectSeat?.(seatNumber);
    setSelectedTableForSeat(null);
  };

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
        {tables?.map((table) => (
          <button
            key={table.number}
            onClick={() => handleTableClick(table)}
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
                  <div className="text-xs mb-1">Rs.{calculateTotal(table.orders || []).toFixed(2)}</div>
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

      {selectedTableForSeat && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-4 text-black">
              Select Seat for Table {selectedTableForSeat.number}
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {Array.from({ length: selectedTableForSeat.seats || 4 }, (_, i) => i + 1).map((seat) => (
                <button
                  key={seat}
                  onClick={() => handleSeatSelect(selectedTableForSeat.number, seat)}
                  className="p-4 bg-orange-500 text-white rounded-lg font-bold hover:bg-orange-600 transition-colors"
                >
                  Seat {seat}
                </button>
              ))}
            </div>
            <button
              onClick={() => setSelectedTableForSeat(null)}
              className="mt-4 w-full py-2 bg-gray-200 text-black rounded-lg font-semibold hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableGrid;

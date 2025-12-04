import React from 'react';

const MenuGrid = ({ menuItems, selectedTable, onAddItem, onBack, groupByCategory }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-2 border-orange-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-4 sm:mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-black">Menu - Table {selectedTable}</h2>
        <button
          onClick={onBack}
          className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold text-sm sm:text-base"
        >
          Back to Tables
        </button>
      </div>
      {Object.entries(groupByCategory(menuItems)).map(([category, items]) => (
        <div key={category} className="mb-4 sm:mb-6">
          <h3 className="text-base sm:text-lg font-semibold text-black mb-2 sm:mb-3 border-b-2 border-orange-500 pb-2">{category}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {items.map(item => (
              <button
                key={item.id}
                onClick={() => onAddItem(item)}
                className="flex justify-between items-center p-3 sm:p-4 border-2 border-gray-300 rounded-lg hover:bg-orange-50 hover:border-orange-500 transition-colors text-sm sm:text-base"
              >
                <span className="font-medium text-black">{item.name}</span>
                <span className="text-orange-600 font-semibold">Rs.{item.price.toFixed(2)}</span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;
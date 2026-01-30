import React from 'react';
import { ArrowLeft, Plus } from 'lucide-react';

const MenuGrid = ({ menuItems, selectedTable, onAddItem, onBack, groupByCategory }) => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-stone-200">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-stone-800">
            Menu — Table {selectedTable}
          </h2>
          <p className="text-sm text-stone-500 mt-0.5">Add items to the order</p>
        </div>
        <button
          onClick={onBack}
          className="flex items-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-stone-800 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors"
        >
          <ArrowLeft size={18} />
          Back to Tables
        </button>
      </div>
      {Object.entries(groupByCategory(menuItems)).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h3 className="text-base sm:text-lg font-semibold text-stone-700 mb-3 pb-2 border-b-2 border-amber-500">
            {category}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {items.map((item) => (
              <button
                key={item.id}
                onClick={() => onAddItem(item)}
                className="flex justify-between items-center p-4 border-2 border-stone-200 rounded-xl hover:border-amber-400 hover:bg-amber-50/50 transition-all text-left group"
              >
                <span className="font-medium text-stone-800 group-hover:text-stone-900">{item.name}</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Plus size={16} className="opacity-70" />
                  Rs.{item.price.toFixed(2)}
                </span>
              </button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default MenuGrid;

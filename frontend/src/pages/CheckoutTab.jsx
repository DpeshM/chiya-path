import React, { useState } from 'react';
import PaymentForm from '../ui/PaymentForm';
import { validatePayment, buildTransaction } from '../logic/checkoutLogic';
import { calculateTotal } from '../logic/calculations';
import {
  createTransaction,
  updateTableByNumber,
  completeOrdersByTable,
} from '../services/api';

const CheckoutTab = ({
  tables,
  selectedTable,
  setSelectedTable,
  setTables,
  setKitchenOrders,
  setCompletedTransactions,
  calculateTotal,
  handleSyncToGoogle,
  loadAll,
}) => {
  const [paymentMethod, setPaymentMethod] = useState('');
  const [cashAmount, setCashAmount] = useState('');
  const [qrAmount, setQrAmount] = useState('');

  const processPayment = async () => {
    const table = tables.find((t) => t.number === selectedTable);
    const total = calculateTotal(table?.orders || []);
    const validation = validatePayment(paymentMethod, cashAmount, qrAmount, total);

    if (!validation.valid) {
      alert(validation.error);
      return;
    }

    const transaction = buildTransaction(
      selectedTable,
      table.orders,
      total,
      paymentMethod,
      cashAmount,
      qrAmount
    );

    try {
      await createTransaction(transaction);
      await updateTableByNumber(selectedTable, { status: 'vacant', orders: [] });
      await completeOrdersByTable(selectedTable);
      await loadAll();
    } catch (err) {
      console.error('Failed to process payment:', err);
      alert('Failed to process payment. Please try again.');
      return;
    }

    await handleSyncToGoogle('transactions', [transaction]);

    alert(`Payment processed for Table ${selectedTable}`);
    setSelectedTable(null);
    setPaymentMethod('');
    setCashAmount('');
    setQrAmount('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 border-2 border-orange-500">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-black">Checkout</h2>

      {selectedTable ? (
        <PaymentForm
          table={tables.find((t) => t.number === selectedTable)}
          selectedTable={selectedTable}
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
          cashAmount={cashAmount}
          setCashAmount={setCashAmount}
          qrAmount={qrAmount}
          setQrAmount={setQrAmount}
          onBack={() => {
            setSelectedTable(null);
            setPaymentMethod('');
            setCashAmount('');
            setQrAmount('');
          }}
          onProcessPayment={processPayment}
          calculateTotal={calculateTotal}
        />
      ) : (
        <div>
          <h3 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">
            Select a table to checkout
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-4">
            {tables
              .filter((t) => t.status === 'occupied')
              .map((table) => (
                <button
                  key={table.number}
                  onClick={() => setSelectedTable(table.number)}
                  className="p-4 sm:p-8 rounded-lg shadow-lg font-bold text-xl sm:text-2xl transition-all transform hover:scale-105 bg-orange-600 text-white hover:bg-orange-700 border-4 border-black"
                >
                  <div className="text-center">
                    <div className="text-2xl sm:text-4xl mb-1 sm:mb-2">Table {table.number}</div>
                    <div className="text-xs sm:text-sm font-normal">
                      Rs.{calculateTotal(table.orders || []).toFixed(2)}
                    </div>
                  </div>
                </button>
              ))}
          </div>
          {tables.filter((t) => t.status === 'occupied').length === 0 && (
            <p className="text-gray-500 text-center py-8 sm:py-12 text-sm sm:text-base">
              No occupied tables
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutTab;

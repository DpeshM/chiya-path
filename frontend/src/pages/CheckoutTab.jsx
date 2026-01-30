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

  const occupiedTables = tables.filter((t) => t.status === 'occupied');

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-stone-200">
      <h2 className="text-2xl font-bold mb-2 text-stone-800">Checkout</h2>
      <p className="text-stone-500 mb-6">Select a table to process payment</p>

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
          <h3 className="text-lg font-semibold mb-4 text-stone-700">Select a table to checkout</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {occupiedTables.map((table) => (
              <button
                key={table.number}
                onClick={() => setSelectedTable(table.number)}
                className="p-6 rounded-2xl font-bold text-xl bg-amber-600 text-white hover:bg-amber-700 transition-all shadow-md hover:shadow-lg"
              >
                <div className="text-center">
                  <div className="text-2xl sm:text-3xl mb-1">Table {table.number}</div>
                  <div className="text-sm font-normal opacity-90">
                    Rs.{calculateTotal(table.orders || []).toFixed(2)}
                  </div>
                </div>
              </button>
            ))}
          </div>
          {occupiedTables.length === 0 && (
            <p className="text-stone-500 text-center py-12">No occupied tables</p>
          )}
        </div>
      )}
    </div>
  );
};

export default CheckoutTab;

import React from 'react';
import { Check } from 'lucide-react';

const PaymentForm = ({
  table,
  selectedTable,
  paymentMethod,
  setPaymentMethod,
  cashAmount,
  setCashAmount,
  qrAmount,
  setQrAmount,
  onBack,
  onProcessPayment,
  calculateTotal,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <div className="border-2 border-orange-500 rounded-lg p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start gap-3 mb-4 sm:mb-6">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-black">Table {selectedTable}</h3>
          </div>
          <button
            onClick={onBack}
            className="w-full sm:w-auto px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 font-semibold text-sm sm:text-base"
          >
            Back
          </button>
        </div>

        <div className="space-y-2 sm:space-y-3 mb-4 sm:mb-6">
          {table?.orders.map((item) => (
            <div key={item.id} className="flex justify-between py-2 sm:py-3 border-b text-sm sm:text-base">
              <span className="text-black">
                {item.name} x{item.quantity}
              </span>
              <span className="font-semibold text-black">
                Rs.{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t-2 border-orange-500 pt-3 sm:pt-4 mb-4 sm:mb-6">
          <div className="flex justify-between text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">
            <span className="text-black">Total:</span>
            <span className="text-orange-600">
              Rs.{calculateTotal(table?.orders || []).toFixed(2)}
            </span>
          </div>

          <div className="mb-4 sm:mb-6">
            <h4 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-black">Payment Method</h4>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {['Cash', 'QR', 'Both'].map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setPaymentMethod(method);
                    setCashAmount('');
                    setQrAmount('');
                  }}
                  className={`py-3 sm:py-4 rounded-lg font-semibold transition-colors border-2 text-sm sm:text-base ${
                    paymentMethod === method
                      ? 'bg-orange-600 text-white border-orange-600'
                      : 'bg-white text-black border-gray-300 hover:border-orange-500'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'Both' && (
            <div className="mb-4 sm:mb-6 space-y-3 sm:space-y-4 p-3 sm:p-4 bg-orange-50 rounded-lg border-2 border-orange-500">
              <div>
                <label className="block text-sm font-semibold text-black mb-2">Cash Amount (Rs.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-base sm:text-lg"
                  placeholder="Enter cash amount"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-black mb-2">QR Amount (Rs.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:border-orange-500 focus:outline-none text-base sm:text-lg"
                  placeholder="Enter QR amount"
                />
              </div>
              {cashAmount && qrAmount && (
                <div className="text-center p-3 bg-white rounded border-2 border-orange-500">
                  <p className="text-xs sm:text-sm text-gray-600">Total Split</p>
                  <p className="text-lg sm:text-xl font-bold text-black">
                    Rs.{(parseFloat(cashAmount || 0) + parseFloat(qrAmount || 0)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onProcessPayment}
            disabled={!paymentMethod}
            className={`w-full py-3 sm:py-4 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2 text-base sm:text-lg ${
              paymentMethod ? 'bg-black text-white hover:bg-gray-800' : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            <Check size={20} className="sm:w-6 sm:h-6" />
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

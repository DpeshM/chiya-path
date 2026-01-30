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
      <div className="border border-stone-200 rounded-2xl p-6 bg-white">
        <div className="flex justify-between items-start gap-4 mb-6">
          <h3 className="text-2xl font-bold text-stone-800">Table {selectedTable}</h3>
          <button
            onClick={onBack}
            className="flex items-center gap-2 px-5 py-2.5 bg-stone-800 text-white rounded-xl font-semibold hover:bg-stone-700 transition-colors"
          >
            ← Back
          </button>
        </div>

        <div className="space-y-3 mb-6">
          {table?.orders?.map((item) => (
            <div key={item.id} className="flex justify-between py-3 border-b border-stone-200">
              <span className="text-stone-800">{item.name} ×{item.quantity}</span>
              <span className="font-semibold text-stone-800">
                Rs.{(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-6 mb-6">
          <div className="flex justify-between text-2xl font-bold mb-6">
            <span className="text-stone-800">Total</span>
            <span className="text-amber-600">
              Rs.{calculateTotal(table?.orders || []).toFixed(2)}
            </span>
          </div>

          <div className="mb-6">
            <h4 className="text-lg font-semibold mb-3 text-stone-800">Payment Method</h4>
            <div className="grid grid-cols-3 gap-3">
              {['Cash', 'QR', 'Both'].map((method) => (
                <button
                  key={method}
                  onClick={() => {
                    setPaymentMethod(method);
                    setCashAmount('');
                    setQrAmount('');
                  }}
                  className={`py-4 rounded-xl font-semibold transition-all border-2 ${
                    paymentMethod === method
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-white text-stone-800 border-stone-200 hover:border-amber-400'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          {paymentMethod === 'Both' && (
            <div className="mb-6 space-y-4 p-4 bg-amber-50 rounded-xl border border-amber-200">
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">Cash (Rs.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={cashAmount}
                  onChange={(e) => setCashAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  placeholder="Cash amount"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-stone-700 mb-2">QR (Rs.)</label>
                <input
                  type="number"
                  step="0.01"
                  value={qrAmount}
                  onChange={(e) => setQrAmount(e.target.value)}
                  className="w-full px-4 py-3 border-2 border-stone-200 rounded-xl focus:border-amber-500 focus:outline-none"
                  placeholder="QR amount"
                />
              </div>
              {cashAmount && qrAmount && (
                <div className="text-center p-3 bg-white rounded-xl border border-amber-200">
                  <p className="text-sm text-stone-500">Total Split</p>
                  <p className="text-xl font-bold text-stone-800">
                    Rs.{(parseFloat(cashAmount || 0) + parseFloat(qrAmount || 0)).toFixed(2)}
                  </p>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onProcessPayment}
            disabled={!paymentMethod}
            className={`w-full py-4 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all ${
              paymentMethod
                ? 'bg-amber-600 text-white hover:bg-amber-700'
                : 'bg-stone-200 text-stone-500 cursor-not-allowed'
            }`}
          >
            <Check size={22} />
            Process Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;

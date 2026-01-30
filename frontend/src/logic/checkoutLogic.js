export const validatePayment = (paymentMethod, cashAmount, qrAmount, total) => {
  if (!paymentMethod) return { valid: false, error: 'Please select a payment method' };
  if (paymentMethod === 'Both') {
    const cash = parseFloat(cashAmount) || 0;
    const qr = parseFloat(qrAmount) || 0;
    if (Math.abs(cash + qr - total) > 0.01) {
      return {
        valid: false,
        error: `Total must equal Rs.${total.toFixed(2)}. Cash (Rs.${cash.toFixed(2)}) + QR (Rs.${qr.toFixed(2)}) = Rs.${(cash + qr).toFixed(2)}`,
      };
    }
  }
  return { valid: true };
};

export const buildTransaction = (tableNumber, items, total, paymentMethod, cashAmount, qrAmount) => ({
  id: Date.now(),
  tableNumber,
  items,
  total,
  paymentMethod,
  cashAmount: paymentMethod === 'Cash' ? total : paymentMethod === 'Both' ? parseFloat(cashAmount) : 0,
  qrAmount: paymentMethod === 'QR' ? total : paymentMethod === 'Both' ? parseFloat(qrAmount) : 0,
  timestamp: new Date().toLocaleTimeString(),
  date: new Date().toLocaleDateString(),
});

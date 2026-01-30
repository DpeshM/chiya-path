import mongoose from 'mongoose';

const transactionItemSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.Mixed,
  name: String,
  price: Number,
  quantity: Number,
  category: String,
}, { _id: false });

const transactionSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  items: { type: [transactionItemSchema], required: true },
  total: { type: Number, required: true },
  paymentMethod: { type: String, required: true },
  cashAmount: { type: Number, default: 0 },
  qrAmount: { type: Number, default: 0 },
  timestamp: String,
  date: String,
});

transactionSchema.pre('save', function (next) {
  if (!this.timestamp) this.timestamp = new Date().toLocaleTimeString();
  if (!this.date) this.date = new Date().toLocaleDateString();
  next();
});

transactionSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Transaction', transactionSchema);

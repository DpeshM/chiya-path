import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: mongoose.Schema.Types.Mixed,
  name: String,
  price: Number,
  quantity: Number,
  category: String,
}, { _id: false });

const orderSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true },
  seatNumber: { type: Number, default: null },
  items: { type: [orderItemSchema], required: true },
  status: { type: String, enum: ['pending', 'ready', 'completed'], default: 'pending' },
  timestamp: String,
  date: String,
});

orderSchema.pre('save', function (next) {
  if (!this.timestamp) this.timestamp = new Date().toLocaleTimeString();
  if (!this.date) this.date = new Date().toLocaleDateString();
  next();
});

orderSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Order', orderSchema);

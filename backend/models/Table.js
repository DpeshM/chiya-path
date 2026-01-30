import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  quantity: Number,
  category: String,
}, { _id: false });

const tableSchema = new mongoose.Schema({
  number: { type: Number, required: true, unique: true },
  status: { type: String, enum: ['vacant', 'occupied'], default: 'vacant' },
  orders: { type: [orderItemSchema], default: [] },
  seats: { type: Number, default: 4 },
});

tableSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Table', tableSchema);

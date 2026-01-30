import mongoose from 'mongoose';

const expenseSchema = new mongoose.Schema({
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  category: { type: String, required: true },
  timestamp: String,
  date: String,
});

expenseSchema.pre('save', function (next) {
  if (!this.timestamp) this.timestamp = new Date().toLocaleTimeString();
  if (!this.date) this.date = new Date().toLocaleDateString();
  next();
});

expenseSchema.set('toJSON', {
  virtuals: true,
  transform: (doc, ret) => {
    ret.id = ret._id.toString();
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export default mongoose.model('Expense', expenseSchema);

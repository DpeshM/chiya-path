import mongoose from 'mongoose';
import MenuItem from '../models/MenuItem.js';
import { connectDB } from '../config/db.js';

const menuItems = [
  // Main
  { name: 'Chicken Momo', price: 180, category: 'Main' },
  { name: 'Veg Momo', price: 150, category: 'Main' },
  { name: 'Chowmein', price: 120, category: 'Main' },
  { name: 'Fried Rice', price: 130, category: 'Main' },
  { name: 'Thukpa', price: 140, category: 'Main' },
  { name: 'Sekuwa', price: 220, category: 'Main' },
  { name: 'Chicken Curry', price: 250, category: 'Main' },
  { name: 'Dal Bhat', price: 180, category: 'Main' },
  // Starter
  { name: 'French Fries', price: 100, category: 'Starter' },
  { name: 'Chicken Wings', price: 200, category: 'Starter' },
  { name: 'Spring Roll', price: 120, category: 'Starter' },
  { name: 'Soup', price: 80, category: 'Starter' },
  // Side
  { name: 'Salad', price: 90, category: 'Side' },
  { name: 'Papad', price: 40, category: 'Side' },
  { name: 'Achar', price: 30, category: 'Side' },
  // Drink
  { name: 'Chiya (Tea)', price: 30, category: 'Drink' },
  { name: 'Coffee', price: 80, category: 'Drink' },
  { name: 'Lassi', price: 70, category: 'Drink' },
  { name: 'Cold Drink', price: 50, category: 'Drink' },
  { name: 'Water', price: 20, category: 'Drink' },
  // Dessert
  { name: 'Ice Cream', price: 100, category: 'Dessert' },
  { name: 'Jalebi', price: 80, category: 'Dessert' },
  { name: 'Gulab Jamun', price: 70, category: 'Dessert' },
];

const seedMenu = async () => {
  try {
    await connectDB();
    const existing = await MenuItem.countDocuments();
    if (existing > 0) {
      console.log(`Menu already has ${existing} items. Clearing and reseeding...`);
      await MenuItem.deleteMany({});
    }
    const inserted = await MenuItem.insertMany(menuItems);
    console.log(`Seeded ${inserted.length} menu items.`);
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  } finally {
    await mongoose.connection.close();
  }
};

seedMenu();

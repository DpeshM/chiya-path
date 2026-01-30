# POS Backend

Express API with MongoDB for the restaurant POS system.

## Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment (optional - defaults work for local dev):
   ```bash
   cp .env.example .env
   # Edit .env with your MONGODB_URI if needed
   ```

3. Start MongoDB (if running locally):
   ```bash
   mongod
   ```
   Or use MongoDB Atlas - set `MONGODB_URI` in `.env`

4. Start the server:
   ```bash
   npm run dev
   ```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| PORT | 3001 | Server port |
| MONGODB_URI | mongodb://localhost:27017/chiya-pos | MongoDB connection string |

## API Endpoints

- `GET/POST /api/tables` - Tables
- `PUT /api/tables/number/:number` - Update table by number
- `PUT/DELETE /api/tables/:id` - Update/delete table by ID
- `GET/POST /api/menu` - Menu items
- `PUT/DELETE /api/menu/:id` - Update/delete menu item
- `GET/POST /api/orders` - Kitchen orders
- `PATCH /api/orders/:id` - Mark order ready
- `DELETE /api/orders/:id` - Complete order
- `POST /api/orders/complete-by-table/:tableNumber` - Complete all orders for table
- `GET/POST /api/transactions` - Completed transactions
- `GET/POST /api/expenses` - Expenses
- `DELETE /api/expenses/:id` - Delete expense

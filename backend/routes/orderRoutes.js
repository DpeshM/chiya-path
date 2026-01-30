import express from 'express';
import * as orderController from '../controllers/orderController.js';

const router = express.Router();

router.get('/', orderController.getOrders);
router.post('/', orderController.createOrder);
router.patch('/:id', orderController.markOrderReady);
router.delete('/:id', orderController.completeOrder);
router.post('/complete-by-table/:tableNumber', orderController.completeOrdersByTable);

export default router;

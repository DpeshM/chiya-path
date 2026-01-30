import express from 'express';
import * as transactionController from '../controllers/transactionController.js';

const router = express.Router();

router.get('/', transactionController.getTransactions);
router.post('/', transactionController.createTransaction);

export default router;

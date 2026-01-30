import express from 'express';
import * as menuController from '../controllers/menuController.js';

const router = express.Router();

router.get('/', menuController.getMenu);
router.post('/', menuController.createMenuItem);
router.put('/:id', menuController.updateMenuItem);
router.delete('/:id', menuController.deleteMenuItem);

export default router;

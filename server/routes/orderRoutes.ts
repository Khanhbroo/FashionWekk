import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus,
  getAnalytics,
} from '../controllers/orderController';

const router = Router();

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/analytics/overview', getAnalytics);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;

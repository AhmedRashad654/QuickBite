import { Router } from 'express';
import { authenticate } from '../../lib/auth/guard.js';
import { container } from '../../lib/di/container.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { OrderController } from './controller/order.controller.js';
import { idempotency } from '../../lib/idempotency/idempotency.js';
import { injectBranchIdFromOrder, rbac, requireBranchAccess, requireRestaurantMember } from '../../lib/auth/rbac.js';

export const orderRouter = Router();

const orderController = container.resolve<OrderController>(TOKENS.OrderController);

// ── Customer-facing ─────────────────────────────────────────────────────
orderRouter.post('/', authenticate, idempotency({ strict: true }), orderController.placeOrder);

orderRouter.get('/customer', authenticate, orderController.listCustomerOrders);

orderRouter.get('/:publicId', authenticate, orderController.getOrder);

// ── Restaurant-facing ───────────────────────────────────────────────────
orderRouter.get(
  '/restaurants/:restaurantId',
  authenticate,
  requireRestaurantMember('restaurantId'),
  rbac({ resource: 'orders', action: 'read' }),
  orderController.listRestaurantOrders,
);

orderRouter.get(
  '/branchs/:branchId',
  authenticate,
  requireBranchAccess('branchId'),
  rbac({ resource: 'orders', action: 'read' }),
  orderController.listBranchOrders,
);

orderRouter.patch(
  '/:publicId/status',
  authenticate,
  injectBranchIdFromOrder(),
  requireBranchAccess('branchId'),
  rbac({
    resource: 'core:orders',
    action: (req) => req.body.status || 'update',
  }),
  orderController.updateOrderStatus,
);

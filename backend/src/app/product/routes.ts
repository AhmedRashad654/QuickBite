import { Router } from 'express';
import { container } from '../../lib/di/container.js';
import { ProductController } from './controller/product.controller.js';
import { authenticate } from '../../lib/auth/guard.js';
import { rbac, requireBranchAccess, requireRestaurantMember } from '../../lib/auth/rbac.js';
import { TOKENS } from '../../lib/di/tokens.js';

export const productRouter = Router();

const productController = container.resolve<ProductController>(TOKENS.ProductController);

productRouter.get('/restaurants/:restaurantId/categories', productController.findCategories);
productRouter.get(
  '/restaurants/:restaurantId',
  authenticate,
  requireRestaurantMember('restaurantId'),
  rbac({ resource: 'core:product', action: 'read' }),
  productController.findByRestaurant,
);
productRouter.get('/branches/:branchId', productController.findByBranch);
productRouter.get('/:id', productController.findById);
productRouter.post(
  '/restaurants/:restaurantId',
  requireRestaurantMember('restaurantId'),
  rbac({ resource: 'core:product', action: 'create' }),
  authenticate,
  productController.create,
);
productRouter.patch(
  '/:id',
  authenticate,
  requireBranchAccess('branchId'),
  rbac({ resource: 'core:product', action: 'update' }),
  productController.update,
);

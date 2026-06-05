import { Router } from 'express';
import { container } from '../../lib/di/container.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { authenticate } from '../../lib/auth/guard.js';
import { rbac, requireRestaurantMember } from '../../lib/auth/rbac.js';
import { RestaurantController } from './controller/restaurant.controller.js';

export const restaurantRouter = Router();

const restaurantController = container.resolve<RestaurantController>(TOKENS.RestaurantController);

restaurantRouter.get('/', restaurantController.getAll);
restaurantRouter.get('/:id', restaurantController.getById);
restaurantRouter.post('/', authenticate, restaurantController.createWithOwner);
restaurantRouter.patch(
  '/:id',
  authenticate,
  requireRestaurantMember('id'),
  rbac({ resource: 'core:restaurant', action: 'update' }),
  restaurantController.update,
);
restaurantRouter.patch('/:id/status', authenticate, restaurantController.updateStatus);

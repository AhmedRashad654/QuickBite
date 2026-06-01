import { Router } from 'express';
import { branchController } from './controller/branch.controller.js';
import { authenticate } from '../../lib/auth/guard.js';

export const branchRouter = Router();

branchRouter.get('/nearby', branchController.findNearby);
branchRouter.get('/:restaurantId', branchController.findByRestaurant);
branchRouter.post('/:restaurantId', authenticate, branchController.create);
branchRouter.patch('/:id', authenticate, branchController.update);
branchRouter.patch('/:id/status', authenticate, branchController.updateStatus);

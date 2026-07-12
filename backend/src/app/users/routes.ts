import { Router } from 'express';
import { container } from '../../lib/di/container.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { authenticate } from '../../lib/auth/guard.js';
import { UsersController } from './controller/users.controller.js';

export const usersRouter = Router();

const usersController = container.resolve<UsersController>(TOKENS.UserController);

usersRouter.get('/me', authenticate, usersController.getMe);
usersRouter.patch('/me', authenticate, usersController.updateMe);
usersRouter.get('/delivery-agents', authenticate, usersController.searchDeliveryAgents);

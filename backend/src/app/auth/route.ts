import { Router } from 'express';
import { container } from '../../lib/di/container.js';
import { AuthController } from './controller/auth.controller.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { idempotency } from '../../lib/idempotency/idempotency.js';

export const authRouter = Router();
const authController = container.resolve<AuthController>(TOKENS.AuthController);

authRouter.post('/register', idempotency({ strict: true }), authController.register);
authRouter.post('/login', authController.login);
authRouter.post('/forget-password', authController.forgetPassword);
authRouter.post('/reset-password', authController.resetPassword);
authRouter.post('/refresh', authController.refresh);
authRouter.post('/logout', authController.logout);

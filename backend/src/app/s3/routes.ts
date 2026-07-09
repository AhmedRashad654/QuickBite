import { Router } from 'express';
import { container } from '../../lib/di/container.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { S3Controller } from './controller/s3.controller.js';
import { authenticate } from '../../lib/auth/guard.js';

export const s3Router = Router();

const ctrl = container.resolve<S3Controller>(TOKENS.S3Controller);

s3Router.post('/presigned-url', authenticate, ctrl.getPresignedUrlController);

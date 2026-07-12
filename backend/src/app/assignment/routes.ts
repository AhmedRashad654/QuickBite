import { Router } from 'express';
import { container } from '../../lib/di/container.js';
import { AssignmentController } from './controller/assignment.controller.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { authenticate } from '../../lib/auth/guard.js';
import { injectBranchIdFromOrder, rbac, requireBranchAccess } from '../../lib/auth/rbac.js';

export const assignmentRouter = Router();

const assignmentController = container.resolve<AssignmentController>(TOKENS.AssignmentController);

// owner override — force-assigns regardless of distance / busy state.
// rbac{deliveries:assign} or system_admin (admin always bypasses).
assignmentRouter.post(
  '/orders/:publicId/assign',
  authenticate,
  injectBranchIdFromOrder(),
  requireBranchAccess('branchId'),
  rbac({ resource: 'core:deliveries', action: 'assign' }),
  assignmentController.ownerAssign,
);

assignmentRouter.post(
  '/orders/:publicId/complete',
  authenticate,
  injectBranchIdFromOrder(),
  requireBranchAccess('branchId'),
  rbac({ resource: 'core:orders', action: 'update' }),
  assignmentController.complete,
);

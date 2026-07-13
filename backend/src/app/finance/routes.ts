import { Router } from 'express';
import { FinanceController } from './controller/finance.controller.js';
import { container } from '../../lib/di/container.js';
import { TOKENS } from '../../lib/di/tokens.js';
import { authenticate } from '../../lib/auth/guard.js';
import { rbac, requireAdmin, requireAgent, requireRestaurantMember } from '../../lib/auth/rbac.js';
import { idempotency } from '../../lib/idempotency/idempotency.js';

export const financeRouter = Router();

const ctrl = container.resolve<FinanceController>(TOKENS.FinanceController);

// ── Restaurant ────────────────────────────────────────────────────────

// Restaurant-scoped reads. requireRestaurantMember pins :restaurantId to the
// JWT's restaurantId; system_admin bypasses.
financeRouter.get(
  '/restaurants/:restaurantId/balance',
  authenticate,
  requireRestaurantMember('restaurantId'),
  rbac({ resource: 'finance', action: 'read' }),
  ctrl.getBalance,
);

financeRouter.get(
  '/restaurants/:restaurantId/payouts',
  authenticate,
  requireRestaurantMember('restaurantId'),
  rbac({ resource: 'finance', action: 'read' }),
  ctrl.listPayouts,
);

// Admin-only write. requireRestaurantMember would block non-admins anyway, but
// rbac covers admin bypass + future operator role.
financeRouter.post(
  '/admin/restaurants/:restaurantId/payouts',
  authenticate,
  requireAdmin,
  idempotency({ strict: true }),
  ctrl.createPayout,
);

// ── Agent (delivery) ─────────────────────────────────────────────────

// Agent reads own balance.
financeRouter.get('/agents/balance', authenticate, requireAgent, ctrl.getAgentBalance);

// Agent reads own payout history.
financeRouter.get('/agents/payouts', authenticate, requireAgent, ctrl.listAgentPayouts);

// Admin pays out an agent.
financeRouter.post(
  '/admin/agents/:agentId/payouts',
  authenticate,
  requireAdmin,
  idempotency({ strict: true }),
  ctrl.createAgentPayout,
);

// Admin reads agent balance.
financeRouter.get('/admin/agents/:agentId/balance', authenticate, requireAdmin, ctrl.getAdminAgentBalance);

// Admin reads agent payout history.
financeRouter.get('/admin/agents/:agentId/payouts', authenticate, requireAdmin, ctrl.listAdminAgentPayouts);

import { Request, Response, NextFunction } from 'express';
import { NotAuthenticated } from './error.js';
import { SystemRole } from '../../app/users/enums.js';
import { container } from '../../lib/di/container.js';
import { TOKENS } from '../di/tokens.js';
import { PermissionCacheService } from '../../app/rbac/service/permission-cache.service.js';
import { getRestaurantIdByBranch } from '../../app/branch/repository/branch.repo.js';
import { findRestaurantById } from '../../app/restaurant/repository/restaurant.repo.js';
import { RestaurantNotFoundError } from '../../app/restaurant/errors.js';
import { findProductById } from '../../app/product/repository/product.repo.js';
import { BranchNotFoundError } from '../../app/branch/errors.js';
import { findOrderByPublicId } from '../../app/order/repository/order.repo.js';
import { OrderNotFoundError } from '../../app/order/errors.js';

export interface RBACOptions {
  resource: string;
  action: string | ((req: Request) => string);
  allowSystemAdmin?: boolean; // by default will be true
}
// check for permissions
// system admin bypass this
// restaurant users must have permissions for their role

export function rbac(options: RBACOptions) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw NotAuthenticated;
      }

      const { resource, allowSystemAdmin = true } = options;
      const action = typeof options.action === 'function' ? options.action(req) : options.action;
      if (allowSystemAdmin && req.user.role == SystemRole.SYSTEM_ADMIN) {
        return next();
      }

      if (req.user.role == SystemRole.RESTAURANT_USER) {
        const currentMembership = req.currentMembership;

        if (!currentMembership) {
          return res.status(500).json({
            error: 'Security Configuration Error: Missing tenant validation middleware before RBAC',
          });
        }

        if (currentMembership.restaurantRole === 'owner') {
          return next();
        }
        const permissionCacheService = container.resolve<PermissionCacheService>(TOKENS.PermissionCacheService);

        const permissions = await permissionCacheService.getPermissions(currentMembership.restaurantRole);

        if (!permissionCacheService.hasPermission(permissions, resource, action)) {
          return res.status(403).json({
            error: 'Permission denied',
          });
        }

        return next();
      }

      return res.status(403).json({
        error: 'Permission denied',
      });
    } catch (error) {
      next(error);
    }
  };
}

export function requireRestaurantMember(paramName: string = 'restaurantId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    const restaurantId = parseInt(req.params[paramName] as string); // req.params.restaurantId
    if (!restaurantId) {
      return res.status(500).json({ message: 'something went wrong' });
    }

    const restaurant = await findRestaurantById(restaurantId);

    if (!restaurant) {
      throw RestaurantNotFoundError;
    }

    if (req.user?.role == SystemRole.SYSTEM_ADMIN) {
      return next();
    }
    const currentMembership = req.user?.memberships?.find((m) => Number(m.restaurantId) === Number(restaurantId));

    if (!currentMembership) {
      return res.status(403).json({ error: 'Permission denied' });
    }
    req.currentMembership = currentMembership;

    next();
  };
}

export function requireBranchAccess(paramName: string = 'branchId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role == SystemRole.SYSTEM_ADMIN) {
        return next();
      }

      const branchId = parseInt(req.params[paramName] as string) || parseInt(req.query[paramName] as string);
      if (!branchId) {
        return next();
      }

      const targetRestaurantId = await getRestaurantIdByBranch(branchId);
      if (!targetRestaurantId) {
        throw BranchNotFoundError;
      }

      const currentMembership = req.user?.memberships?.find(
        (m) => Number(m.restaurantId) === Number(targetRestaurantId),
      );

      if (!currentMembership) {
        return res.status(403).json({
          error: 'You do not have access to this branch',
        });
      }

      if (currentMembership.restaurantRole === 'owner') {
        req.currentMembership = currentMembership;
        return next();
      }

      if (!currentMembership.branchIds.includes(branchId)) {
        return res.status(403).json({
          error: 'You do not have access to this branch',
        });
      }

      req.currentMembership = currentMembership;

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function requireAgent(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'User not authenticated' });
  if (req.user.role !== SystemRole.DELIVERY_AGENT) return res.status(403).json({ error: 'Agent role required' });
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.user) return res.status(401).json({ error: 'User not authenticated' });
  if (req.user.role !== SystemRole.SYSTEM_ADMIN) return res.status(403).json({ error: 'Admin role required' });
  next();
}

export function injectRestaurantIdFromProduct(paramName: string = 'productId') {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const productId = parseInt(req.params[paramName] as string);
      if (!productId) return res.status(400).json({ error: 'Missing product ID' });

      const product = await findProductById(productId);
      if (!product) return res.status(404).json({ error: 'Product not found' });
      req.params.restaurantId = product.restaurant_id.toString();

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function injectBranchIdFromOrder() {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { publicId } = req.params;
      if (!publicId) return res.status(400).json({ error: 'Missing order public ID' });

      const order = await findOrderByPublicId(publicId as string);
      if (!order) throw OrderNotFoundError;
      req.order = order;
      req.params.branchId = order.branch_id.toString();

      next();
    } catch (error) {
      next(error);
    }
  };
}

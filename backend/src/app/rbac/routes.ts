import {Router} from "express";
import {container} from '../../lib/di/container.js'
import { authenticate } from "../../lib/auth/guard.js";
import { rbac, requireBranchAccess, requireRestaurantMember } from "../../lib/auth/rbac.js";
import { TOKENS } from "../../lib/di/tokens.js";
import { MemberController } from "./controller/member.controller.js";

export const rbacRouter = Router();

const memberController = container.resolve<MemberController>(TOKENS.MemberController);

rbacRouter.get('/roles/:role/permissions', memberController.getRolePermissions);

rbacRouter.post('/restaurants/:restaurantId',
    authenticate,
    requireRestaurantMember('restaurantId'),
    rbac({resource:"core:member", action:'create'}),
    memberController.createMember
);

rbacRouter.get('/branches/:branchId',
    authenticate,
    requireBranchAccess('branchId'),
    rbac({resource:"core:member", action:'read'}),
    memberController.getMembersByBranchId
);

rbacRouter.patch('/restaurants/:restaurantId/member/:memberId',
    authenticate,
    requireRestaurantMember('restaurantId'),
    rbac({resource:"core:member", action:'update'}),
    memberController.updateMember
);

rbacRouter.delete('/restaurants/:restaurantId/member/:memberId',
    authenticate,
    requireRestaurantMember('restaurantId'),
    rbac({resource:"core:member", action:'delete'}),
    memberController.deleteMember
);

import { Request, Response } from 'express';
import { BranchService } from '../service/branch.service.js';
import { CreateBranchDTO, UpdateBranchDTO, UpdateBranchStatusDTO } from '../dto/branch.dto.js';
import { validateBody } from '../../../lib/validation/validate.js';
import { SystemRole } from '../../users/enums.js';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens.js';
import { sendSuccess } from '../../../lib/http/response.js';
import { MemberRole } from '../../rbac/enums.js';

@injectable()
export class BranchController {
  constructor(@inject(TOKENS.BranchService) private readonly branchService: BranchService) {}

  create = async (req: Request, res: Response) => {
    const data = await validateBody(CreateBranchDTO, req.body);
    const branch = await this.branchService.create(
      Number(req.params.restaurantId),
      data,
    );
    sendSuccess(res, branch, 'Branch added', 201);
  };

  findNearby = async (req: Request, res: Response) => {
    const results = await this.branchService.findNearby(Number(req.query.lat), Number(req.query.lng));
    sendSuccess(res, results);
  };

  findByRestaurant = async (req: Request, res: Response) => {
    const restaurantId = Number(req.params.restaurantId);
    const membership = req.currentMembership;

    const isSystemAdmin = req.user?.role === SystemRole.SYSTEM_ADMIN;
    const isOwner = membership?.restaurantRole === MemberRole.OWNER;

    let allowedBranchIds: number[] | undefined = undefined;

    if (!isSystemAdmin && !isOwner && membership) {
      allowedBranchIds = membership.branchIds?.map((b) => Number(b)) || [];
    }
    const results = await this.branchService.findByRestaurant(restaurantId, isOwner || isSystemAdmin, allowedBranchIds);
    sendSuccess(res, results);
  };

  update = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateBranchDTO, req.body);
    const branch = await this.branchService.update(Number(req.params.branchId), data);
    sendSuccess(res, branch, 'Branch updated');
  };

  updateStatus = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateBranchStatusDTO, req.body);
    const branch = await this.branchService.updateStatus(Number(req.params.id), req.user?.role! as SystemRole, data);
    sendSuccess(
      res,
      {
        id: branch.id,
        is_active: branch.is_active,
        accept_orders: branch.accept_orders,
        commission: branch.commission,
      },
      'Branch status updated',
    );
  };
}

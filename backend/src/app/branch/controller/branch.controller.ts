import { Request, Response } from 'express';
import { branchService, BranchService } from '../service/branch.service.js';
import { CreateBranchDTO, UpdateBranchDTO, UpdateBranchStatusDTO } from '../dto/branch.dto.js';
import { validateBody } from '../../../lib/validation/validate.js';
import { SystemRole } from '../../users/enums.js';

export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  create = async (req: Request, res: Response) => {
    const data = await validateBody(CreateBranchDTO, req.body);
    const branch = await this.branchService.create(
      Number(req.params.restaurantId),
      req.user?.userId!,
      req.user?.role! as SystemRole,
      data,
    );
    res.status(201).json({ message: 'Branch added', branch });
  };

  findNearby = async (req: Request, res: Response) => {
    console.log(req.query.lat, req.query.lng);
    const results = await this.branchService.findNearby(
      Number(req.query.lat),
      Number(req.query.lng),
    );
    res.status(200).json({ data: results });
  };

  findByRestaurant = async (req: Request, res: Response) => {
      const results = await this.branchService.findByRestaurant(Number(req.params.restaurantId));
      res.status(200).json({ data: results });
  };

  update = async (req: Request, res: Response) => {
      const data = await validateBody(UpdateBranchDTO, req.body);
      const branch = await this.branchService.update(
        Number(req.params.id),
        req.user?.userId!,
        req.user?.role! as SystemRole,
        data,
      );
      res.status(200).json({ message: 'Branch updated', branch });
  };

  updateStatus = async (req: Request, res: Response) => {
      const data = await validateBody(UpdateBranchStatusDTO, req.body);
      const branch = await this.branchService.updateStatus(
        Number(req.params.id),
        req.user?.role! as SystemRole,
        data,
      );
      res
        .status(200)
        .json({
          message: 'Branch status updated',
          branch: {
            id: branch.id,
            is_active: branch.is_active,
            accept_orders: branch.accept_orders,
            commission: branch.commission,
          },
        });
  };
}

export const branchController = new BranchController(branchService);

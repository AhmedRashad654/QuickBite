import { Request, Response } from 'express';
import { restaurantService, RestaurantService } from '../service/restaurant.service.js';
import { SystemRole } from '../../users/enums.js';
import {
  CreateRestaurantWithOwnerDTO,
  UpdateRestaurantDTO,
  UpdateRestaurantStatusDTO,
} from '../dto/restaurant.dto.js';
import { validateBody } from '../../../lib/validation/validate.js';

export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  createWithOwner = async (req: Request, res: Response) => {
    const data = await validateBody(CreateRestaurantWithOwnerDTO, req.body);
    const result = await this.restaurantService.createWithOwner(
      req.user?.role! as SystemRole,
      data,
    );
    res.status(201).json({ message: 'Restaurant created', ...result });
  };

  getAll = async (_req: Request, res: Response) => {
    const result = await this.restaurantService.findAll();
    res.status(200).json({ data: result });
  };

  getById = async (req: Request, res: Response) => {
    const result = await this.restaurantService.findById(Number(req.params.id));
    res.status(200).json(result);
  };

  update = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateRestaurantDTO, req.body);
    const result = await this.restaurantService.update(
      Number(req.params.id),
      req.user?.userId!,
      req.user?.role! as SystemRole,
      data,
    );
    res.status(200).json({ message: 'Restaurant updated', restaurant: result });
  };

  updateStatus = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateRestaurantStatusDTO, req.body);
    const result = await this.restaurantService.updateStatus(
      Number(req.params.id),
      req.user?.role! as SystemRole,
      data,
    );
    res
      .status(200)
      .json({ message: 'Status updated', restaurant: { id: result.id, status: result.status } });
  };
}

export const restaurantController = new RestaurantController(restaurantService);

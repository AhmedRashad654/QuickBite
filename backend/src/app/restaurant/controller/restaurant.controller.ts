import { Request, Response } from 'express';
import { RestaurantService } from '../service/restaurant.service.js';
import { SystemRole } from '../../users/enums.js';
import {
  CreateRestaurantDTO,
  CreateRestaurantWithOwnerDTO,
  UpdateRestaurantDTO,
  UpdateRestaurantStatusDTO,
} from '../dto/restaurant.dto.js';
import { validateBody } from '../../../lib/validation/validate.js';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens.js';
import { sendPaginated, sendSuccess } from '../../../lib/http/response.js';
import { parseFilters, parsePaginationQuery } from '../../../lib/http/pagination/parse-query.js';
import { PermissionDeniedError } from '../../../lib/auth/error.js';
import { db } from '../../../lib/knex/knex.js';

@injectable()
export class RestaurantController {
  constructor(@inject(TOKENS.RestaurantService) private readonly restaurantService: RestaurantService) {}

  createWithOwner = async (req: Request, res: Response) => {
    const data = await validateBody(CreateRestaurantWithOwnerDTO, req.body);
    const result = await this.restaurantService.createWithOwner(req.user?.role! as SystemRole, data);
    sendSuccess(res, result, 'Restaurant created', 201);
  };

  create = async (req: Request, res: Response) => {
    const data = await validateBody(CreateRestaurantDTO, req.body);
    if (req.user?.role !== SystemRole.RESTAURANT_USER) {
      throw PermissionDeniedError;
    }
    const trx = await db.transaction();

    const result = await this.restaurantService.create(req.user?.userId!, data, trx);

    sendSuccess(res, result, 'Restaurant created', 201);
  };

  getAll = async (req: Request, res: Response) => {
    const params = parsePaginationQuery(req.query, ['id', 'created_at', 'owner_id']);
    const filters = parseFilters(req.query, ['id', 'status', 'name']);
    const result = await this.restaurantService.findAll(params, filters);
    sendPaginated(res, result.data, result.meta);
  };

  getAllAdmin = async (req: Request, res: Response) => {
    const params = parsePaginationQuery(req.query, ['id', 'created_at', 'owner_id']);
    const filters = parseFilters(req.query, ['id', 'status', 'name']);
    const result = await this.restaurantService.findAllForAdmin(params, filters);
    sendPaginated(res, result.data, result.meta);
  };

  getById = async (req: Request, res: Response) => {
    const result = await this.restaurantService.findById(Number(req.params.id));
    sendSuccess(res, result);
  };

  update = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateRestaurantDTO, req.body);
    const result = await this.restaurantService.update(
      Number(req.params.id),
      req.user?.userId!,
      req.user?.role! as SystemRole,
      data,
    );
    sendSuccess(res, result, 'Restaurant updated');
  };

  updateStatus = async (req: Request, res: Response) => {
    const data = await validateBody(UpdateRestaurantStatusDTO, req.body);
    const result = await this.restaurantService.updateStatus(
      Number(req.params.id),
      req.user?.role! as SystemRole,
      data,
    );
    sendSuccess(res, { id: result.id, status: result.status }, 'Restaurant status updated');
  };
}

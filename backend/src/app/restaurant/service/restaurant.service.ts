import { Knex } from 'knex';
import {
  CreateRestaurantDTO,
  CreateRestaurantWithOwnerDTO,
  UpdateRestaurantDTO,
  UpdateRestaurantStatusDTO,
} from '../dto/restaurant.dto.js';
import {
  createRestaurant,
  findAllRestaurants,
  findAllRestaurantsForAdmin,
  findRestaurantById,
  updateRestaurant,
  updateRestaurantStatus,
} from '../repository/restaurant.repo.js';
import { OwnerAlreadyExistsError, RestaurantNotFoundError } from '../errors.js';
import { SystemRole } from '../../users/enums.js';
import { PermissionDeniedError } from '../../../lib/auth/error.js';
import { createUser, findUserExistsByEmailOrPhone } from '../../users/repository/users.repo.js';
import { hashPassword } from '../../auth/utils.js';
import { db } from '../../../lib/knex/knex.js';
import { RestaurantStatus } from '../enums.js';
import { inject, injectable } from 'tsyringe';
import {
  buildPaginationResult,
  FilterParams,
  PaginationParams,
} from '../../../lib/http/pagination/cursor-pagination.js';
import { TOKENS } from '../../../lib/di/tokens.js';
import { MemberService } from '../../rbac/service/member.service.js';
import { AdminRestaurantItem } from '../type.js';

@injectable()
export class RestaurantService {
  constructor(@inject(TOKENS.MemberService) private readonly memberService: MemberService) {}
  createWithOwner = async (userRole: SystemRole, data: CreateRestaurantWithOwnerDTO) => {
    if (userRole !== SystemRole.SYSTEM_ADMIN) {
      throw PermissionDeniedError;
    }

    const existing = await findUserExistsByEmailOrPhone(data.owner.email, data.owner.phone);
    if (existing) {
      throw OwnerAlreadyExistsError;
    }

    const hashedPassword = await hashPassword(data.owner.password);
    const trx = await db.transaction();

    try {
      const user = await createUser(
        {
          email: data.owner.email,
          phone: data.owner.phone,
          name: data.owner.name,
          password_hash: hashedPassword,
          system_role: SystemRole.RESTAURANT_USER,
        },
        trx,
      );

      const restaurant = await createRestaurant(
        {
          owner_id: user.id,
          name: data.name,
          logo_url: data.logo_url ?? '',
          primary_country: data.primary_country,
          status: RestaurantStatus.ACTIVE,
        },
        trx,
      );

      await trx.commit();

      return {
        restaurant,
        owner: {
          id: user.id,
          email: user.email,
          phone: user.phone,
          name: user.name,
          systemRole: user.system_role,
        },
      };
    } catch (error) {
      await trx.rollback();
      throw error;
    }
  };

  create = async (userId: number, data: CreateRestaurantDTO, trx: Knex.Transaction) => {
    const restaurantPayload = {
      ...data,
      logo_url: data.logo_url ?? null,
      owner_id: userId,
    };

    let restaurant;
    try {
      restaurant = await createRestaurant(restaurantPayload, trx);
      await this.memberService.createOwnerMember(restaurant.id, userId, trx);
      await trx.commit();
    } catch {
      await trx.rollback();
    }

    return restaurant;
  };
  findAll = async (params: PaginationParams, filters: FilterParams[]) => {
    const result = await findAllRestaurants(params, filters);
    return buildPaginationResult(result, params.limit, params.sortBy);
  };

  findAllForAdmin = async (params: PaginationParams, filters: FilterParams[]) => {
    const result = await findAllRestaurantsForAdmin(params, filters);
    return buildPaginationResult<AdminRestaurantItem>(result, params.limit, params.sortBy);
  };

  findById = async (id: number) => {
    const restaurant = await findRestaurantById(id);
    if (!restaurant) {
      throw RestaurantNotFoundError;
    }
    return restaurant;
  };

  update = async (id: number, userId: number, userRole: SystemRole, data: UpdateRestaurantDTO) => {
    const restaurant = await findRestaurantById(id);
    if (!restaurant) {
      throw RestaurantNotFoundError;
    }
    if (userRole !== SystemRole.SYSTEM_ADMIN && Number(restaurant.owner_id) !== Number(userId)) {
      throw PermissionDeniedError;
    }
    return await updateRestaurant(id, data);
  };

  updateStatus = async (id: number, userRole: SystemRole, data: UpdateRestaurantStatusDTO) => {
    if (userRole !== SystemRole.SYSTEM_ADMIN) {
      throw PermissionDeniedError;
    }
    const restaurant = await findRestaurantById(id);
    if (!restaurant) {
      throw RestaurantNotFoundError;
    }
    return await updateRestaurantStatus(id, data.status);
  };
}

import { injectable } from 'tsyringe';
import { PermissionDeniedError } from '../../../lib/auth/error.js';
import { SystemRole } from '../../users/enums.js';
import { CreateBranchDTO, UpdateBranchDTO, UpdateBranchStatusDTO } from '../dto/branch.dto.js';
import { BranchNotFoundError } from '../errors.js';
import {
  createBranch,
  findBranchById,
  findBranchesByRestaurant,
  findClosestBranches,
  findNearbyBranches,
  updateBranch,
  updateBranchStatus,
} from '../repository/branch.repo.js';
import { isBranchOpen } from '../../../lib/utils/branchTime.js';

@injectable()
export class BranchService {
  findNearby = async (lat: number, lng: number) => {
    let isFallback = false;
    let branches = await findNearbyBranches(lat, lng);
    if (branches.length === 0) {
      branches = await findClosestBranches(lat, lng, 5);
      isFallback = true;
    }

    branches = branches.map((branch) => {
      return {
        ...branch,
        is_open: isBranchOpen({
          opens_at: branch.opens_at,
          closes_at: branch.closes_at,
          accept_orders: branch.accept_orders,
          is_active: branch.is_active,
          country_code: branch.country_code,
        }),
      };
    });
    return { branches, isFallback };
  };

  findByRestaurant = async (restaurantId: number, isSuperUser: boolean, allowedBranchIds?: number[]) => {
  return await findBranchesByRestaurant(restaurantId, isSuperUser, allowedBranchIds);
};

  create = async (restaurantId: number, data: CreateBranchDTO) => {
    const branch = await createBranch({
      restaurant_id: restaurantId,
      label: data.label,
      country_code: data.country_code,
      lat: data.lat,
      lng: data.lng,
      address_text: data.address_text,
      is_active: false,
      opens_at: data.opens_at,
      closes_at: data.closes_at,
      currency: data.currency,
      commission: 0,
      delivery_fee: data.delivery_fee,
      accept_orders: false,
    });

    return branch;
  };

  update = async (branchId: number, data: UpdateBranchDTO) => {
    return await updateBranch(branchId, data);
  };

  updateStatus = async (branchId: number, userRole: SystemRole, data: UpdateBranchStatusDTO) => {
    if (userRole !== SystemRole.SYSTEM_ADMIN) {
      throw PermissionDeniedError;
    }

    const branch = await findBranchById(branchId);
    if (!branch) {
      throw BranchNotFoundError;
    }

    return await updateBranchStatus(branchId, data);
  };
}

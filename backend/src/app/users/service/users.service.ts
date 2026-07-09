import { Knex } from 'knex';
import { UpdateUserDTO } from '../dto/users.dto.js';
import { UserNotFoundError } from '../error.js';
import { createUser, findUserById, updateUser } from '../repository/users.repo.js';
import { CreateUserData, User } from '../types.js';
import { hashPassword } from '../../auth/utils.js';
import { injectable } from 'tsyringe';
import { findRestaurantsWithRole } from '../../rbac/repository/restaurant_member.repo.js';
import { findBranchIdsByMemberId } from '../../rbac/repository/member-branch.repo.js';
import { SystemRole } from '../enums.js';
import { RestaurantMembership, ResultRestaurantsWithRole } from '../../rbac/type.js';

@injectable()
export class UserService {
  create = async (data: CreateUserData, trx?: Knex | Knex.Transaction): Promise<User> => {
    const hashedPassword = data.password ? await hashPassword(data.password) : '';
    return createUser(
      {
        email: data.email,
        phone: data.phone ?? null,
        name: data.name,
        password_hash: hashedPassword,
        system_role: data.system_role,
      },
      trx,
    );
  };

  getByUserId = async (userId: number) => {
    const user = await findUserById(userId);
    if (!user) {
      throw UserNotFoundError;
    }

    let memberships: RestaurantMembership[] = [];

    if (user.system_role === SystemRole.RESTAURANT_USER) {
      const rows = await findRestaurantsWithRole(user.id);
      memberships = await Promise.all(
        rows.map(async (row: ResultRestaurantsWithRole) => {
          const branchIds = await findBranchIdsByMemberId(row.member_id);
          return {
            restaurantId: row.restaurant_id,
            restaurantName: row.restaurant_name,
            restaurantRole: row.role_name,
            stautsMember: row.stauts_member,
            restaurantStatus:row.restaurant_status,
            branchIds: branchIds,
          };
        }),
      );
    }

    return {
      id: user.id,
      email: user.email,
      phone: user.phone,
      name: user.name,
      system_role: user.system_role,
      created_at: user.created_at,
      updated_at: user.updated_at,
      memberships,
    };
  };

  updateProfile = async (userId: number, data: UpdateUserDTO) => {
    const user = await findUserById(userId);
    if (!user) {
      throw UserNotFoundError;
    }
    const updated = await updateUser(userId, data);
    return {
      id: updated.id,
      email: updated.email,
      name: updated.name,
      phone: updated.phone,
      system_role: updated.system_role,
    };
  };
}

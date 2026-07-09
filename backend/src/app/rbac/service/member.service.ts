import { Knex } from 'knex';
import { MemberStatus } from '../enums.js';
import {
  CannotAssignBranchesToOwnerError,
  CannotAssignTwoOwnerForRestaurant,
  CannotCreateOwnerUserError,
  CannotDeleteOwnerError,
  CannotUpdateStatusOrRoleForOwner,
  InvalidBranchIdsError,
  MemberNotFoundError,
  RoleNotFoundError,
  UserAlreadyMemberInThisRestaurantError,
} from '../errors.js';
import {
  checkMemberExists,
  createRestaurantMember,
  deleteMember,
  findMemberWithRoleName,
  updateMember,
} from '../repository/restaurant_member.repo.js';
import { findRoleByName } from '../repository/role.repo.js';
import { RestaurantMember } from '../type.js';
import { CreateMemberDTO, UpdateMemberBranchesDTO, UpdateMemberDTO } from '../dto/member.dto.js';
import {
  countBranchesByIdsAndRestaurant,
  findMembersByBranchId,
  setMemberBranches,
} from '../repository/member-branch.repo.js';
import { db } from '../../../lib/knex/knex.js';
import { findUserByEmail } from '../../users/repository/users.repo.js';
import { UserService } from '../../users/service/users.service.js';
import { User } from '../../users/types.js';
import { SystemRole } from '../../users/enums.js';
import { generateOTP, hashOTP } from '../../auth/utils.js';
import { createPasswordReset } from '../../auth/repository/auth.repo.js';
import { toMs } from '../../../lib/utils/time.js';
import { getPermissionsByRoleName } from '../repository/permission.repo.js';
import { inject, injectable } from 'tsyringe';
import { TOKENS } from '../../../lib/di/tokens.js';
import { memberInvitationNew } from '../templates/member-invitation-new.js';
import { MailjetEmailProvider } from '../../../lib/email/mailjet.js';
import { memberInvitationExist } from '../templates/member-invitation-exist.js';
import { env } from '../../../lib/config/env.js';

@injectable()
export class MemberService {
  constructor(
    @inject(TOKENS.UserService) private readonly userService: UserService,
    @inject(TOKENS.EmailProvider) private readonly emailProvider: MailjetEmailProvider,
  ) {}

  async createOwnerMember(
    restaurantId: number,
    userId: number,
    trx?: Knex | Knex.Transaction,
  ): Promise<RestaurantMember> {
    const ownerRoleId = await findRoleByName('owner');
    if (!ownerRoleId) throw RoleNotFoundError;
    return createRestaurantMember(
      {
        restaurant_id: restaurantId,
        user_id: userId,
        role_id: ownerRoleId,
        status: MemberStatus.ACTIVE,
      },
      trx,
    );
  }

  async createMember(restaurantId: number, data: CreateMemberDTO) {
    if (data.role == 'owner') {
      throw CannotCreateOwnerUserError;
    }

    // find roleId by role name
    const roleId = await findRoleByName(data.role);
    if (!roleId) {
      throw RoleNotFoundError;
    }

    const branchIds = data.branchIds || [];
    await this.validateBranchOwnership(branchIds, restaurantId);

    let user: User | null = null;
    if (data.email) {
      user = await findUserByEmail(data.email);
    }

    const trx = await db.transaction();
    try {
      let isNewUser = false;
      if (!user) {
        isNewUser = true;
        user = await this.userService.create(
          {
            email: data.email,
            phone: null,
            name: data.name || '',
            password: '',
            system_role: SystemRole.RESTAURANT_USER,
          },
          trx,
        );
      } else {
        const isAlreadyMember = await checkMemberExists(user.id, restaurantId);
        if (isAlreadyMember) {
          throw UserAlreadyMemberInThisRestaurantError;
        }
      }

      const member = await createRestaurantMember(
        {
          restaurant_id: restaurantId,
          user_id: user.id,
          role_id: roleId,
          status: MemberStatus.ACTIVE,
        },
        trx,
      );

      const rows = branchIds.map((branchId) => ({
        branch_id: branchId,
        member_id: member.id,
      }));

      await setMemberBranches(member.id, rows, trx);

      if (isNewUser) {
        const otp = generateOTP();
        const hashedOtp = hashOTP(otp);

        await createPasswordReset(
          {
            user_id: user.id,
            otp_hash: hashedOtp,
            expires_at: new Date(Date.now() + toMs(7, 'd')),
          },
          trx,
        );
        const { subject, html } = memberInvitationNew(otp, data.role, `${env.frontendUrl}/auth/reset-password?email=${user.email}`);
        await this.emailProvider.send(data.email, subject, html);
      } else {
        const { subject, html } = memberInvitationExist(user.name || 'Team Member', data.role);
        await this.emailProvider.send(user.email || data.email, subject, html);
      }

      await trx.commit();

      return {
        id: member.id,
        user_id: user.id,
        email: data.email,
        name: data.name,
        role: data.role,
        status: member.status,
        branchIds,
      };
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  }

  async getMembersByBranchId(branchId: number) {
    const members = await findMembersByBranchId(branchId);
    return members;
  }

  async updateMember(restaurantId: number, memberId: number, data: UpdateMemberDTO) {
    const result = await findMemberWithRoleName(memberId);
    if (!result || Number(result.member.restaurant_id) !== Number(restaurantId)) {
      throw MemberNotFoundError;
    }

    if (result.roleName === 'owner') {
      throw CannotUpdateStatusOrRoleForOwner;
    }

    const updateData: { role_id?: number; status?: string } = {};
    if (data.role) {
      if (data.role === 'owner') throw CannotAssignTwoOwnerForRestaurant;
      const roleId = await findRoleByName(data.role);
      if (!roleId) throw RoleNotFoundError;
      updateData.role_id = roleId;
    }
    if (data.status) {
      updateData.status = data.status;
    }

    await updateMember(memberId, updateData);

    if (data?.branchIds && data?.branchIds?.length > 0) {
      await this.updateMemberBranches(restaurantId, memberId, {
        branchIds: data.branchIds,
      });
    }
  }

  async deleteMember(restaurantId: number, memberId: number) {
    const result = await findMemberWithRoleName(memberId);
    if (!result || Number(result.member.restaurant_id) !== Number(restaurantId)) {
      throw MemberNotFoundError;
    }
    if (result.roleName === 'owner') {
      throw CannotDeleteOwnerError;
    }
    await deleteMember(memberId);
  }

  async updateMemberBranches(restaurantId: number, memberId: number, data: UpdateMemberBranchesDTO) {
    // single query: member + role name (no N+1)
    const result = await findMemberWithRoleName(memberId);
    if (!result || Number(result.member.restaurant_id) !== Number(restaurantId)) {
      throw MemberNotFoundError;
    }
    if (result.roleName === 'owner') {
      throw CannotAssignBranchesToOwnerError;
    }

    // validate branchIds belong to this restaurant (single COUNT query)
    await this.validateBranchOwnership(data.branchIds, restaurantId);

    const rows = data.branchIds.map((branchId) => ({
      branch_id: branchId,
      member_id: result.member.id,
    }));
    await setMemberBranches(memberId, rows);

    return {
      message: 'Member branch assignments updated successfully',
      branchIds: data.branchIds,
    };
  }

  async getRolePermissions(roleName: string) {
    const permissions = await getPermissionsByRoleName(roleName);
    return { role: roleName, permissions };
  }

  private async validateBranchOwnership(branchIds: number[], restaurantId: number) {
    if (branchIds.length === 0) return;
    const count = await countBranchesByIdsAndRestaurant(branchIds, restaurantId);
    if (count !== branchIds.length) {
      throw InvalidBranchIdsError;
    }
  }
}

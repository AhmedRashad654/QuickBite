import { Knex } from 'knex';
import { db } from '../../../lib/knex/knex.js';
import { MemberBranch, ResultMemberByBranch } from '../type.js';

export async function setMemberBranches(memberId: number, rows: Partial<MemberBranch>[], trx?: Knex.Transaction) {
  // delete
  const query = trx || db;
  await query('member_branches').where('member_id', memberId).delete();
  // insert
  if (rows.length > 0) {
    await query('member_branches').insert(
      rows.map((row) => ({
        member_id: row.member_id,
        branch_id: row.branch_id,
      })),
    );
  }
}

export async function findBranchIdsByMemberId(memberId: number): Promise<number[]> {
  const rows = await db('member_branches').select('branch_id').where('member_id', memberId);
  return rows?.map((row) => row.branch_id);
}

export async function countBranchesByIdsAndRestaurant(branchIds: number[], restaurantId: number): Promise<number> {
  const [{ count }] = await db('restaurant_branches')
    .whereIn('id', branchIds)
    .andWhere('restaurant_id', restaurantId)
    .count('id as count');
  return Number(count);
}

export async function findMembersByBranchId(branchId: number): Promise<ResultMemberByBranch[]> {
  const branchMembers = await db('member_branches as mb')
    .join('restaurant_members as rm', 'mb.member_id', 'rm.id')
    .join('users as u', 'rm.user_id', 'u.id')
    .join('roles as r', 'rm.role_id', 'r.id')
    .select(
      'rm.id as member_id',
      'rm.status as member_status',
      'mb.branch_id',
      'rm.created_at',
      'u.id as user_id',
      'u.name as user_name',
      'u.email as user_email',
      'u.phone as user_phone',
      'r.name as role_name',
    )
    .where('mb.branch_id', branchId);

  if (branchMembers.length === 0) {
    const owner = await fetchOwnerOnly(branchId);
    return owner ? [owner] : [];
  }

  const memberIds = branchMembers.map((m) => m.member_id);
  const allBranches = await db('member_branches').select('member_id', 'branch_id').whereIn('member_id', memberIds);

  const branchMap: Record<number, number[]> = {};
  allBranches.forEach((row) => {
    if (!branchMap[row.member_id]) branchMap[row.member_id] = [];
    branchMap[row.member_id].push(row.branch_id);
  });

  const formattedMembers = branchMembers.map((member) => ({
    ...member,
    branchIds: branchMap[member.member_id] || [member.branch_id],
  }));

  const ownerRow = await fetchOwnerOnly(branchId);

  return ownerRow ? [ownerRow, ...formattedMembers] : formattedMembers;
}

async function fetchOwnerOnly(branchId: number) {
  return await db('restaurant_branches as rb')
    .join('restaurants as r', 'rb.restaurant_id', 'r.id')
    .join('users as u', 'r.owner_id', 'u.id')
    .select(
      'u.id as user_id',
      'u.name as user_name',
      'u.email as user_email',
      'u.phone as user_phone',
      db.raw('? as branch_id', [branchId]),
      db.raw('? as role_name', ['owner']),
      db.raw('? as member_status', ['active']),
    )
    .where('rb.id', branchId)
    .first();
}

import { RestaurantStatus } from '../restaurant/enums.js';
import { MemberStatus } from './enums.js';

export interface RestaurantMember {
  id: number;
  restaurant_id: number;
  user_id: number;
  role_id: number;
  status: MemberStatus;
  created_at: Date;
  updated_at: Date;
}

export interface RestaurantMembership {
  restaurantId: number;
  restaurantRole: string;
  restaurantName?: string;
  stautsMember?: MemberStatus;
  restaurantStatus?: RestaurantStatus;
  branchIds: number[];
}

export interface ResultRestaurantsWithRole {
  restaurant_id: number;
  member_id: number;
  role_name: string;
  restaurant_name?: string;
  stauts_member?: MemberStatus;
  restaurant_status?: RestaurantStatus;
}
export interface MemberBranch {
  member_id: number;
  branch_id: number;
  created_at: Date;
}

export interface ResultMemberByBranch {
  member_id?: number;
  member_status: MemberStatus;
  branch_id: number;
  branchIds?: number[];
  created_at?: Date;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  role_name: string;
}

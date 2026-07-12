import type { Country } from "@/types";

export const RESTAURANT_ROLES = {
  OWNER: "owner",
  BRANCH_MANAGER: "branch_manager",
  STAFF: "staff",
} as const;

export type RestaurantRole =
  (typeof RESTAURANT_ROLES)[keyof typeof RESTAURANT_ROLES];

export const RESTAURANT_STATUS = {
  ACTIVE: "active",
  SUSPENDED: "suspended",
  DISABLED: "disabled",
  PENDING: "pending",
} as const;

export type RestaurantStatues =
  (typeof RESTAURANT_STATUS)[keyof typeof RESTAURANT_STATUS];

export const MEMBER_STATUES = {
  ACTIVE: "active",
  INACTIVE: "inactive",
  SUSPENDED: "suspended",
} as const;

export type MemberStatues =
  (typeof MEMBER_STATUES)[keyof typeof MEMBER_STATUES];

export type RestaurantInfo = {
  id: number;
  owner_id: number;
  name: string;
  logo_url: string;
  status: string;
  primary_country: Country;
  created_at: string;
  updated_at: string;
};

export type ResultMemberByBranch = {
  member_id?: number;
  member_status: string;
  branch_id: number;
  branchIds?: number[];
  created_at?: string;
  user_id: number;
  user_name: string;
  user_email: string;
  user_phone: string;
  role_name: string;
};

export type RestaurantMember = {
  id: number;
  userId: number;
  email: string;
  name: string;
  phone: string;
  role: string;
  roleDisplayName: string;
  status: string;
};

export type UpdateMemberPayload = {
  role?: string;
  status?: string;
  branchIds?: number[];
};

export type RolePermissions = {
  role: string;
  permissions: string[];
};

export type RestaurantProduct = {
  id: number;
  category_id: number;
  restaurant_id: number;
  name: string;
  category_name?: string;
  description: string;
  image_url: string;
  created_at: Date;
  updated_at: Date;
  deleted_at: Date | null;
};

export type BranchProductItem = {
  id: number;
  name: string;
  description?: string;
  image_url?: string;
  price?: number;
  stock?: number;
  is_available?: boolean;
};

export type BranchProduct = {
  category_id: number;
  category_name: string;
  products: BranchProductItem[];
};

export type BranchProductDetail = {
  id: number;
  branch_id: number;
  product_id: number;
  price: number;
  stock: number;
  is_available: boolean;
};

export type UpdateProductBranchPayload = {
  price?: number;
  stock?: number;
  is_available?: boolean;
};

export type ProductCategory = {
  id: number;
  name: string;
};

export type Branch = {
  id: number;
  restaurant_id: number;
  country_code: string;
  address_text: string;
  label: string;
  lat: number;
  lng: number;
  is_active: boolean;
  opens_at: string;
  closes_at: string;
  accept_orders: boolean;
  delivery_fee: number;
  currency: string;
  commission: number;
  created_at: string;
  updated_at: string;
};

export type RestaurantBalance = {
  id: number;
  restaurant_id: number;
  balance: number;
  currency: string;
};

export type Payout = {
  id: number;
  restaurant_id: number;
  amount: number;
  status: string;
  created_at: string;
};

export interface DeliveryAgent {
  id: number;
  name: string;
  email: string;
  phone: string | null;
}

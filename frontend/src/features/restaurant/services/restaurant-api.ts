import { apiClient } from "@/api/axios-client";
import type { ApiResponse } from "@/api/api-helper";
import { unwrap, unwrapResponse } from "@/features/auth/services/auth-api";
import type {
  Branch,
  BranchProduct,
  ProductCategory,
  RestaurantInfo,
  RestaurantMember,
  RestaurantProduct,
  ResultMemberByBranch,
  RolePermissions,
  UpdateMemberPayload,
} from "../types";
import type { OrderSummary } from "@/features/orders/types";
import type {
  BranchFormValues,
  BranchProductFormValues,
  EditBranchFormValues,
  InviteFormValues,
  ProductFormValues,
  RestaurantFormValues,
} from "../schemas";

export const getRestaurant = async (id: number) => {
  const res = await apiClient.get<ApiResponse<RestaurantInfo>>(
    `/restaurant/${id}`,
  );
  return unwrapResponse(res);
};

export const updateRestaurant = async (
  id: number,
  data: RestaurantFormValues,
) => {
  const res = await apiClient.patch<ApiResponse<RestaurantInfo>>(
    `/restaurant/${id}`,
    data,
  );
  return unwrap(res);
};

export const createRestaurant = async (data: RestaurantFormValues) => {
  const res = await apiClient.post<ApiResponse<RestaurantInfo>>(
    '/restaurant/',
    data,
  );
  return unwrap(res);
};

export const getRestaurantBranches = async (restaurantId: number) => {
  const res = await apiClient.get<ApiResponse<Branch[]>>(
    `/branches/${restaurantId}`,
  );
  return unwrapResponse(res);
};

export const createBranch = async (
  restaurantId: number,
  data: BranchFormValues,
) => {
  const res = await apiClient.post<ApiResponse<Branch>>(
    `/branches/${restaurantId}`,
    data,
  );
  return unwrap(res);
};

export const updateBranch = async (
  id: number,
  data: Partial<EditBranchFormValues>,
) => {
  const res = await apiClient.patch<ApiResponse<Branch>>(
    `/branches/${id}`,
    data,
  );
  return unwrap(res);
};

export const getRestaurantProducts = async (restaurantId: number) => {
  const res = await apiClient.get<ApiResponse<RestaurantProduct[]>>(
    `/products/restaurants/${restaurantId}`,
  );
  return unwrapResponse(res);
};

export const createProduct = async (
  restaurantId: number,
  data: ProductFormValues,
) => {
  const res = await apiClient.post<ApiResponse<RestaurantProduct>>(
    `/products/restaurants/${restaurantId}`,
    data,
  );
  return unwrap(res);
};

export const updateRestaurantProduct = async (
  id: number,
  data: ProductFormValues,
) => {
  const res = await apiClient.patch<ApiResponse<RestaurantProduct>>(
    `/products/${id}/restaurant`,
    data,
  );
  return unwrap(res);
};

export const updateBranchProduct = async (
  productId: number,
  branchId: number,
  data: BranchProductFormValues,
) => {
  const res = await apiClient.patch<ApiResponse<RestaurantProduct>>(
    `/products/${productId}/branch/${branchId}`,
    data,
  );
  return unwrap(res);
};

export const getBranchProducts = async (branchId: number) => {
  const res = await apiClient.get<ApiResponse<BranchProduct[]>>(
    `/products/branches/${branchId}/restaurant_user`,
  );
  return unwrapResponse(res);
};

export const getCategories = async (restaurantId: number) => {
  const res = await apiClient.get<ApiResponse<ProductCategory[]>>(
    `/products/restaurants/${restaurantId}/categories`,
  );
  return unwrapResponse(res);
};

export const getMembers = async (branchId: number) => {
  const res = await apiClient.get<ApiResponse<ResultMemberByBranch[]>>(
    `/members/branches/${branchId}`,
  );
  return unwrapResponse(res);
};

export const createMember = async (
  restaurantId: number,
  data: InviteFormValues,
) => {
  const res = await apiClient.post<ApiResponse<RestaurantMember>>(
    `/members/restaurants/${restaurantId}`,
    data,
  );
  return unwrap(res);
};

export const updateMember = async (
  restaurantId: number,
  memberId: number,
  data: UpdateMemberPayload,
) => {
  const res = await apiClient.patch<ApiResponse<{ message: string }>>(
    `/members/restaurants/${restaurantId}/member/${memberId}`,
    data,
  );
  return unwrap(res);
};

export const deleteMember = async (restaurantId: number, memberId: number) => {
  const res = await apiClient.delete<ApiResponse<{ message: string }>>(
    `/members/restaurants/${restaurantId}/member/${memberId}`,
  );
  return unwrap(res);
};

export const getRolePermissions = async (role: string) => {
  const res = await apiClient.get<ApiResponse<RolePermissions>>(
    `/members/roles/${role}/permissions`,
  );
  return unwrap(res);
};

export const getRestaurantOrders = async (
  restaurantId: number,
  params?: Record<string, string>,
) => {
  const res = await apiClient.get<ApiResponse<OrderSummary[]>>(
    `/orders/restaurants/${restaurantId}`,
    { params },
  );
  return unwrapResponse(res);
};

export const getBracnhOrders = async (
  branchId: number,
  params?: Record<string, string | number>,
) => {
  const res = await apiClient.get<ApiResponse<OrderSummary[]>>(
    `/orders/branchs/${branchId}`,
    { params },
  );
  return unwrap(res);
};

export const updateOrderStatus = async (publicId: string, status: string) => {
  const res = await apiClient.patch<
    ApiResponse<{ publicId: string; status: string }>
  >(`/orders/${publicId}/status`, { status });
  return unwrap(res);
};

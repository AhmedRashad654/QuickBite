import { apiClient } from "@/api/axios-client";
import type { ApiResponse } from "@/api/api-helper";
import { unwrap, unwrapResponse } from "@/features/auth/services/auth-api";
import type {
  AdminAgentBalance,
  AdminAgentItem,
  AdminAgentPayoutItem,
  AdminBranchItem,
  AdminRestaurantBalance,
  AdminRestaurantItem,
  AdminRestaurantPayoutItem,
  CreatePayoutPayload,
} from "../types";

export const getAdminRestaurants = async (
  params?: Record<string, string | number>,
) => {
  const res = await apiClient.get<ApiResponse<AdminRestaurantItem[]>>(
    "/restaurant/",
    { params },
  );
  return unwrap(res);
};

export const getAdminRestaurantById = async (id: number) => {
  const res = await apiClient.get<ApiResponse<AdminRestaurantItem>>(
    `/restaurant/${id}`,
  );
  return unwrapResponse(res);
};

export const updateAdminRestaurantStatus = async (
  id: number,
  status: string,
) => {
  const res = await apiClient.patch<
    ApiResponse<{ id: number; status: string }>
  >(`/restaurant/${id}/status`, { status });
  return unwrap(res);
};

export const getAdminBranchesByRestaurant = async (restaurantId: number) => {
  const res = await apiClient.get<ApiResponse<AdminBranchItem[]>>(
    `/branches/${restaurantId}`,
  );
  return unwrapResponse(res);
};

export const updateAdminBranchStatus = async (
  branchId: number,
  data: { is_active?: boolean; commission?: number },
) => {
  const res = await apiClient.patch<
    ApiResponse<{
      id: number;
      is_active: boolean;
      accept_orders: boolean;
      commission: number;
    }>
  >(`/branches/${branchId}/status`, data);
  return unwrap(res);
};

export const getAdminRestaurantBalance = async (restaurantId: number) => {
  const res = await apiClient.get<ApiResponse<AdminRestaurantBalance>>(
    `/finance/restaurants/${restaurantId}/balance`,
  );
  return unwrapResponse(res);
};

export const getAdminRestaurantPayouts = async (
  restaurantId: number,
  from?: string,
  to?: string,
) => {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;

  const res = await apiClient.get<ApiResponse<AdminRestaurantPayoutItem[]>>(
    `/finance/restaurants/${restaurantId}/payouts`,
    { params },
  );
  return unwrapResponse(res);
};

export const getAdminAgents = async () => {
  const res = await apiClient.get<ApiResponse<AdminAgentItem[]>>(
    "/user/admin/delivery-agents",
  );
  return unwrapResponse(res);
};

export const getAdminAgentBalance = async (agentId: number) => {
  const res = await apiClient.get<ApiResponse<AdminAgentBalance>>(
    `/finance/admin/agents/${agentId}/balance`,
  );
  return unwrapResponse(res);
};

export const getAdminAgentPayouts = async (
  agentId: number,
  from?: string,
  to?: string,
) => {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;

  const res = await apiClient.get<ApiResponse<AdminAgentPayoutItem[]>>(
    `/finance/admin/agents/${agentId}/payouts`,
    { params },
  );
  return unwrapResponse(res);
};

export const createAdminRestaurantPayout = async (
  restaurantId: number,
  data: CreatePayoutPayload,
  idempotencyKey: string,
) => {
  const res = await apiClient.post<ApiResponse<AdminRestaurantPayoutItem>>(
    `/finance/admin/restaurants/${restaurantId}/payouts`,
    data,
    { headers: { "idempotency-key": idempotencyKey } },
  );
  return unwrap(res);
};

export const createAdminAgentPayout = async (
  agentId: number,
  data: CreatePayoutPayload,
  idempotencyKey: string,
) => {
  const res = await apiClient.post<ApiResponse<AdminAgentPayoutItem>>(
    `/finance/admin/agents/${agentId}/payouts`,
    data,
    { headers: { "idempotency-key": idempotencyKey } },
  );
  return unwrap(res);
};

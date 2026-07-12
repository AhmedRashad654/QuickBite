import { apiClient } from "@/api/axios-client";
import type { ApiResponse } from "@/api/api-helper";
import { unwrap, unwrapResponse } from "@/features/auth/services/auth-api";
import type { AgentEarningsResponse, DeliveryTask } from "../types";
import { DELIVERY_TABS, type DeliveryTab } from "../constants";
import { ORDER_STATUES } from "@/features/orders/types";

export const goOnline = async (lat: number, lng: number) => {
  const response = await apiClient.post<ApiResponse<{ ok: boolean }>>(
    "/agents/presence/online",
    { lat, lng },
  );
  return unwrapResponse(response);
};

export const sendPing = async (lat: number, lng: number) => {
  const response = await apiClient.post<ApiResponse<{ ok: boolean }>>(
    "/agents/presence/ping",
    { lat, lng },
  );
  return unwrapResponse(response);
};

export const goOffline = async () => {
  const response = await apiClient.post<ApiResponse<{ ok: boolean }>>(
    "/agents/presence/offline",
  );
  return unwrap(response);
};

export const acceptOffer = async (publicId: string, idempotencyKey: string) => {
  const response = await apiClient.post<ApiResponse<DeliveryTask>>(
    `/agents/orders/${publicId}/accept`,
    {},
    {
      headers: {
        "idempotency-Key": idempotencyKey,
      },
    },
  );
  return unwrap(response);
};

export const rejectOffer = async (publicId: string) => {
  const response = await apiClient.post<ApiResponse<{ ok: boolean }>>(
    `/agents/orders/${publicId}/reject`,
  );
  return unwrap(response);
};

export const transitionTask = async (
  publicId: string,
  status: "picked" | "delivered",
  idempotencyKey: string,
) => {
  const response = await apiClient.patch<ApiResponse<DeliveryTask>>(
    `/agents/orders/${publicId}/status`,
    { status },
    {
      headers: {
        "idempotency-Key": idempotencyKey,
      },
    },
  );
  return unwrap(response);
};

export const getAgentTasks = async (activeTab?: DeliveryTab) => {
  const params: Record<string, string> = {};
  if (activeTab === DELIVERY_TABS.DELIVERED)
    params.status = ORDER_STATUES.DELIVERED;

  const response = await apiClient.get<ApiResponse<DeliveryTask[]>>(
    "/agents/tasks",
    { params },
  );
  return unwrapResponse(response);
};

export const getAgentEarnings = async (from?: string, to?: string) => {
  const params: Record<string, string> = {};
  if (from) params.from = from;
  if (to) params.to = to;

  const response = await apiClient.get<ApiResponse<AgentEarningsResponse>>(
    "/agents/earnings",
    { params },
  );
  return unwrapResponse(response);
};

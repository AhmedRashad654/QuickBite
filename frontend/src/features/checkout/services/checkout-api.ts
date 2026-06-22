import { apiClient } from "@/api/axios-client";
import { unwrap } from "@/features/auth/services/auth-api";
import type { ApiResponse } from "@/api/api-helper";
import type { OrderResponse, PlaceOrderPayload } from "../types";

export const placeOrder = async (
  payload: PlaceOrderPayload,
  idempotencyKey: string,
) => {
  const response = await apiClient.post<ApiResponse<OrderResponse>>(
    "/orders",
    payload,
    {
      headers: {
        "idempotency-Key": idempotencyKey,
      },
    },
  );
  return unwrap(response);
};

import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createAdminAgentPayout,
  createAdminRestaurantPayout,
  getAdminAgents,
  getAdminAgentBalance,
  getAdminAgentPayouts,
  getAdminBranchesByRestaurant,
  getAdminRestaurants,
  getAdminRestaurantBalance,
  getAdminRestaurantPayouts,
  updateAdminBranchStatus,
  updateAdminRestaurantStatus,
} from "../services/admin-api";
import type { CreatePayoutPayload } from "../types";
import { useIdempotency } from "@/hooks/useIdempotency";

export const useAdminRestaurants = (status?: string) => {
  return useInfiniteQuery({
    queryKey: ["admin-restaurants", status],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number> = { limit: 10 };
      if (status) params["filter[status][eq]"] = status;
      if (pageParam) params.cursor = pageParam;
      return await getAdminRestaurants(params);
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.hasMore ? lastPage.meta.nextCursor : undefined,
  });
};

export const useUpdateAdminRestaurantStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: string }) =>
      updateAdminRestaurantStatus(id, status),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-restaurants"] });
    },
  });
};

export const useAdminBranches = (restaurantId: number) => {
  return useQuery({
    queryKey: ["admin-branches", restaurantId],
    queryFn: () => getAdminBranchesByRestaurant(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useUpdateAdminBranchStatus = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: number;
      data: { is_active?: boolean; commission?: number };
    }) => updateAdminBranchStatus(branchId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-branches"] });
    },
  });
};

export const useAdminRestaurantBalance = (restaurantId: number) => {
  return useQuery({
    queryKey: ["admin-restaurant-balance", restaurantId],
    queryFn: () => getAdminRestaurantBalance(restaurantId),
    enabled: !!restaurantId,
  });
};

export const useAdminRestaurantPayouts = (
  restaurantId: number,
  from?: string,
  to?: string,
) => {
  return useQuery({
    queryKey: ["admin-restaurant-payouts", restaurantId, from, to],
    queryFn: () => getAdminRestaurantPayouts(restaurantId, from, to),
    enabled: !!restaurantId,
  });
};

export const useAdminAgents = () => {
  return useQuery({
    queryKey: ["admin-agents"],
    queryFn: getAdminAgents,
  });
};

export const useAdminAgentBalance = (agentId: number) => {
  return useQuery({
    queryKey: ["admin-agent-balance", agentId],
    queryFn: () => getAdminAgentBalance(agentId),
    enabled: !!agentId,
  });
};

export const useAdminAgentPayouts = (
  agentId: number,
  from?: string,
  to?: string,
) => {
  return useQuery({
    queryKey: ["admin-agent-payouts", agentId, from, to],
    queryFn: () => getAdminAgentPayouts(agentId, from, to),
    enabled: !!agentId,
  });
};

export const useCreateAdminRestaurantPayout = () => {
  const { idempotencyKey, resetKey } = useIdempotency();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      restaurantId,
      data,
    }: {
      restaurantId: number;
      data: CreatePayoutPayload;
    }) => createAdminRestaurantPayout(restaurantId, data, idempotencyKey),
    onSuccess: (_data, variables) => {
      resetKey();
      qc.invalidateQueries({
        queryKey: ["admin-restaurant-payouts", variables.restaurantId],
      });
      qc.invalidateQueries({
        queryKey: ["admin-restaurant-balance", variables.restaurantId],
      });
    },
  });
};

export const useCreateAdminAgentPayout = () => {
  const { idempotencyKey, resetKey } = useIdempotency();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      agentId,
      data,
    }: {
      agentId: number;
      data: CreatePayoutPayload;
    }) => createAdminAgentPayout(agentId, data, idempotencyKey),
    onSuccess: (_data, variables) => {
      resetKey();
      qc.invalidateQueries({
        queryKey: ["admin-agent-payouts", variables.agentId],
      });
      qc.invalidateQueries({
        queryKey: ["admin-agent-balance", variables.agentId],
      });
    },
  });
};

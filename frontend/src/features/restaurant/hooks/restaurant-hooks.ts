import {
  useQuery,
  useMutation,
  useQueryClient,
  useInfiniteQuery,
} from "@tanstack/react-query";
import {
  createRestaurant,
  getRestaurant,
  updateRestaurant,
  getRestaurantBranches,
  createBranch,
  updateBranch,
  getRestaurantProducts,
  getBranchProducts,
  createProduct,
  updateRestaurantProduct,
  updateBranchProduct,
  getCategories,
  getMembers,
  createMember,
  updateMember,
  deleteMember,
  getRolePermissions,
  updateOrderStatus,
  getBracnhOrders,
  searchDeliveryAgents,
  assignOrderExhausted,
  completeOrder,
  getRestaurantBalance,
  getRestaurantPayouts,
} from "../services/restaurant-api";
import type { UpdateMemberPayload } from "../types";
import type {
  BranchProductFormValues,
  InviteFormValues,
  ProductFormValues,
  RestaurantFormValues,
} from "../schemas";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import type { BranchFormValues, EditBranchFormValues } from "../schemas";
import { useEffect } from "react";
import { getMe, refreshToken } from "@/features/auth/services/auth-api";
import { useAuthStore } from "@/store/auth-store";

export const useRestaurant = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  return useQuery({
    queryKey: ["restaurant", id],
    queryFn: () => getRestaurant(id!),
    enabled: !!id,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useUpdateRestaurant = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: RestaurantFormValues) => updateRestaurant(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", id] });
    },
  });
};

export const useCreateRestaurant = () => {
  const setSession = useAuthStore((s) => s.setSession);
  return useMutation({
    mutationFn: (data: RestaurantFormValues) => createRestaurant(data),
    onSuccess: async () => {
      const userData = await getMe();
      const response = await refreshToken();
      const accessToken = response.accessToken;
      setSession(accessToken, userData);
    },
  });
};

export const useBranches = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );

  const activeBranch = useActiveRestaurantStore((state) => state.activeBranch);
  const setActiveBranch = useActiveRestaurantStore(
    (state) => state.setActiveBranch,
  );

  const query = useQuery({
    queryKey: ["restaurant", activeRestaurant?.restaurantId, "branches"],
    queryFn: () => getRestaurantBranches(activeRestaurant!.restaurantId!),
    enabled: !!activeRestaurant?.restaurantId,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });

  useEffect(() => {
    if (query?.isLoading) return;
    if (query.data && query?.data?.length > 0) {
      const isCurrentActiveValid = query.data.some(
        (b) => b.id === activeBranch?.branchId,
      );
      if (!isCurrentActiveValid || !activeBranch) {
        const firstBranch = query.data[0];
        setActiveBranch({
          branchId: firstBranch.id,
          branchName: firstBranch.label,
        });
      }
    } else {
      setActiveBranch(null);
    }
  }, [activeBranch, query.data, query?.isLoading, setActiveBranch]);

  return query;
};

export const useCreateBranch = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: BranchFormValues) => createBranch(id!, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", id, "branches"] });
    },
  });
};

export const useUpdateBranch = () => {
  const qc = useQueryClient();
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  return useMutation({
    mutationFn: ({
      branchId,
      data,
    }: {
      branchId: number;
      data: Partial<EditBranchFormValues>;
    }) => updateBranch(branchId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", id, "branches"] });
    },
  });
};

export const useProducts = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  return useQuery({
    queryKey: ["restaurant", id, "products"],
    queryFn: () => getRestaurantProducts(id!),
    enabled: !!id,
  });
};

export const useBranchProducts = (branchId: number | null) => {
  return useQuery({
    queryKey: ["branch", branchId, "products"],
    queryFn: () => getBranchProducts(branchId!),
    enabled: !!branchId,
  });
};

export const useCreateProduct = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const idRestaurant = activeRestaurant?.restaurantId;

  const activeBranch = useActiveRestaurantStore((state) => state.activeBranch);
  const idBranch = activeBranch?.branchId;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: ProductFormValues) => createProduct(idRestaurant!, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["restaurant", idRestaurant, "products"],
      });
      qc.invalidateQueries({
        queryKey: ["restaurant", idRestaurant, "categories"],
      });
      qc.invalidateQueries({ queryKey: ["branch", idBranch, "products"] });
    },
  });
};

export const useUpdateRestaurantProduct = () => {
  const qc = useQueryClient();
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  return useMutation({
    mutationFn: ({
      productId,
      data,
    }: {
      productId: number;
      data: ProductFormValues;
    }) => updateRestaurantProduct(productId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["restaurant", id, "products"] });
    },
  });
};

export const useUpdateBranchProduct = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      productId,
      branchId,
      data,
    }: {
      productId: number;
      branchId: number;
      data: BranchProductFormValues;
    }) => updateBranchProduct(productId, branchId, data),
    onSuccess: (_data, variables) => {
      qc.invalidateQueries({
        queryKey: ["branch", variables.branchId, "products"],
      });
    },
  });
};

export const useCategories = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  return useQuery({
    queryKey: ["restaurant", id, "categories"],
    queryFn: () => getCategories(id!),
    enabled: !!id,
    staleTime: Infinity,
    refetchOnMount: false,
    refetchOnReconnect: false,
  });
};

export const useMembers = () => {
  const activeBranch = useActiveRestaurantStore((state) => state.activeBranch);
  const id = activeBranch?.branchId;
  return useQuery({
    queryKey: ["branch", id, "members"],
    queryFn: () => getMembers(id!),
    enabled: !!id,
  });
};

export const useCreateMember = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const idActiveRestaurant = activeRestaurant?.restaurantId;
  const activeBranch = useActiveRestaurantStore((state) => state.activeBranch);
  const idActiveBranch = activeBranch?.branchId;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: InviteFormValues) =>
      createMember(idActiveRestaurant!, data),
    onSuccess: () => {
      qc.invalidateQueries({
        queryKey: ["branch", idActiveBranch, "members"],
      });
    },
  });
};

export const useUpdateMember = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const idRestaurant = activeRestaurant?.restaurantId;
  const activeBranch = useActiveRestaurantStore((state) => state.activeBranch);
  const idActiveBranch = activeBranch?.branchId;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      memberId,
      data,
    }: {
      memberId: number;
      data: UpdateMemberPayload;
    }) => updateMember(idRestaurant!, memberId, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branch", idActiveBranch, "members"] });
    },
  });
};

export const useDeleteMember = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const idRestaurant = activeRestaurant?.restaurantId;
  const activeBranch = useActiveRestaurantStore((state) => state.activeBranch);
  const idActiveBranch = activeBranch?.branchId;
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (memberId: number) => deleteMember(idRestaurant!, memberId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["branch", idActiveBranch, "members"] });
    },
  });
};

export const useRolePermissions = (role: string | null) => {
  return useQuery({
    queryKey: ["role-permissions", role],
    queryFn: () => getRolePermissions(role!),
    enabled: !!role,
  });
};

export const useBranchOrders = (status?: string) => {
  const activeBranch = useActiveRestaurantStore((state) => state.activeBranch);
  const idBranch = activeBranch?.branchId;

  return useInfiniteQuery({
    queryKey: ["branch", idBranch, "orders", status],

    queryFn: async ({ pageParam }) => {
      const params: Record<string, string | number> = {
        limit: 10,
      };

      if (status) params["filter[status][eq]"] = status;

      if (pageParam) params["cursor"] = pageParam;

      return await getBracnhOrders(idBranch!, params);
    },

    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage?.meta?.hasMore ? lastPage.meta.nextCursor : undefined,
    enabled: !!idBranch,
  });
};

export const useUpdateOrderStatus = () => {
  return useMutation({
    mutationFn: ({ publicId, status }: { publicId: string; status: string }) =>
      updateOrderStatus(publicId, status),
  });
};

export const useDeliveryAgentSearch = (query: string) => {
  return useQuery({
    queryKey: ["delivery-agents", query],
    queryFn: () => searchDeliveryAgents(query),
    enabled: query.trim().length >= 2,
    staleTime: 30_000,
  });
};

export const useAssignOrderExhausted = () => {
  return useMutation({
    mutationFn: ({
      publicId,
      agentId,
    }: {
      publicId: string;
      agentId: number;
    }) => assignOrderExhausted(publicId, agentId),
  });
};

export const useCompleteOrder = () => {
  return useMutation({
    mutationFn: (publicId: string) => completeOrder(publicId),
  });
};

export const useRestaurantBalance = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  return useQuery({
    queryKey: ["restaurant", id, "balance"],
    queryFn: () => getRestaurantBalance(id!),
    enabled: !!id,
  });
};

export const useRestaurantPayouts = () => {
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const id = activeRestaurant?.restaurantId;
  return useQuery({
    queryKey: ["restaurant", id, "payouts"],
    queryFn: () => getRestaurantPayouts(id!),
    enabled: !!id,
  });
};

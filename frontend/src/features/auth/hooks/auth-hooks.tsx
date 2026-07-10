import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  getMe,
  login,
  logout,
  register,
  resetPassword,
} from "../services/auth-api";
import { useIdempotency } from "@/hooks/useIdempotency";
import { type ForgotPasswordPayload } from "../types";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { useSyncActiveRestaurant } from "./useSyncActiveRestaurant";

export const useLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const syncActiveRestaurant = useSyncActiveRestaurant();

  return useMutation({
    mutationFn: login,
    onSuccess: async ({ data }) => {
      setAccessToken(data.accessToken);
      const userData = await getMe();
      setUser(userData);
      syncActiveRestaurant(userData);
    },
  });
};

export const useRegister = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const syncActiveRestaurant = useSyncActiveRestaurant();
  return useMutation({
    mutationFn: register,
    meta: { successMessage: "Account created" },
    onSuccess: async ({ data }) => {
      setAccessToken(data.accessToken);
      const userData = await getMe();
      setUser(userData);
      syncActiveRestaurant(userData);
    },
  });
};

export const useLogout = () => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const clearActiveRestaurnatAndBranch = useActiveRestaurantStore(
    (state) => state.clearActiveRestaurnatAndBranch,
  );
  const qC = useQueryClient();

  return useMutation({
    mutationFn: logout,
    meta: { successMessage: "Signed out" },
    onSettled: () => {
      clearSession();
      clearActiveRestaurnatAndBranch();
      qC.clear();
    },
  });
};

export const useForgotPassword = () => {
  const { idempotencyKey, resetKey } = useIdempotency();
  return useMutation({
    mutationFn: (payload: ForgotPasswordPayload) =>
      forgotPassword(payload, idempotencyKey),
    onSuccess: () => {
      resetKey();
    },
  });
};

export const useResetPassword = () => {
  return useMutation({
    mutationFn: resetPassword,
  });
};

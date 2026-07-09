import { useAuthStore } from "@/store/auth-store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  forgotPassword,
  login,
  logout,
  register,
  resetPassword,
} from "../services/auth-api";
import { useIdempotency } from "@/hooks/useIdempotency";
import { type ForgotPasswordPayload } from "../types";

export const useLogin = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  return useMutation({
    mutationFn: login,
    onSuccess: ({ data }) => {
      setAccessToken(data.accessToken);
    },
  });
};

export const useRegister = () => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  return useMutation({
    mutationFn: register,
    meta: { successMessage: "Account created" },
    onSuccess: ({ data }) => {
      setAccessToken(data.accessToken);
    },
  });
};

export const useLogout = () => {
  const clearSession = useAuthStore((state) => state.clearSession);
  const qC = useQueryClient();

  return useMutation({
    mutationFn: logout,
    meta: { successMessage: "Signed out" },
    onSettled: () => {
      clearSession();
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

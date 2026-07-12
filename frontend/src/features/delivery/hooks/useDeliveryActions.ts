import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  acceptOffer,
  rejectOffer,
  transitionTask,
} from "../services/delivery-api";
import { useIdempotency } from "@/hooks/useIdempotency";

export function useAcceptOffer() {
  const { idempotencyKey, resetKey } = useIdempotency();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (publicId: string) => acceptOffer(publicId, idempotencyKey),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent", "tasks"] });
      resetKey();
    },
  });
}

export function useRejectOffer() {
  return useMutation({
    mutationFn: rejectOffer,
  });
}

export function useTransitionTask() {
  const { idempotencyKey, resetKey } = useIdempotency();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      publicId,
      status,
    }: {
      publicId: string;
      status: "picked" | "delivered";
    }) => transitionTask(publicId, status, idempotencyKey),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["agent", "tasks"] });
      resetKey();
    },
  });
}

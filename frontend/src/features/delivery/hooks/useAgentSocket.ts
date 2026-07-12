import { useEffect, useCallback, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth-store";
import { ensureSocket } from "@/api/socket";
import type { DeliveryOffer } from "../types";
type OfferHandler = (offer: DeliveryOffer) => void;

let isRefreshing = false;
const handleConnectError = async (err: Error) => {
  if (err.message === "Invalid or expired token") {
    if (isRefreshing) return;
    isRefreshing = true;
    try {
      const { centralRefresh } = await import("@/api/axios-client");
      const { destroySocket } = await import("@/api/socket");
      const accessToken = await centralRefresh();
      destroySocket();
      ensureSocket(accessToken);
    } catch {
      useAuthStore.getState().clearSession();
    } finally {
      isRefreshing = false;
    }
  }
};


export function useAgentSocket(onOffer: OfferHandler) {
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.accessToken);
  const user = useAuthStore((s) => s.user);
  const onOfferRef = useRef(onOffer);

  useEffect(() => {
    onOfferRef.current = onOffer;
  });

  const channel = user?.id ? `agent:${user.id}` : null;

  const handleOffer = useCallback(
    (payload: DeliveryOffer) => {
      onOfferRef.current(payload);
    },
    [],
  );

  const handleAssigned = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["agent", "tasks"] });
  }, [queryClient]);

  const handleOfferCancelled = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["agent", "tasks"] });
  }, [queryClient]);

  const handleStatusChanged = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["agent", "tasks"] });
  }, [queryClient]);

  useEffect(() => {
    if (!channel || !token) return;

    const socket = ensureSocket(token);

    const subscribe = () => {
      socket.emit("subscribe", channel);
    };

    socket.on("connect", subscribe);
    socket.on("connect_error", handleConnectError);
    socket.on("task.offered", handleOffer);
    socket.on("task.assigned", handleAssigned);
    socket.on("offer.cancelled", handleOfferCancelled);
    socket.on("order.status_changed", handleStatusChanged);

    if (socket.connected) {
      subscribe();
    }

    return () => {
      socket.emit("unsubscribe", channel);
      socket.off("connect", subscribe);
      socket.off("connect_error", handleConnectError);
      socket.off("task.offered", handleOffer);
      socket.off("task.assigned", handleAssigned);
      socket.off("offer.cancelled", handleOfferCancelled);
      socket.off("order.status_changed", handleStatusChanged);
    };
  }, [channel, token, handleOffer, handleAssigned, handleOfferCancelled, handleStatusChanged]);
}

export function playOfferSound() {
  try {
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.type = "sine";
    osc.frequency.setValueAtTime(880, ctx.currentTime);
    gain.gain.setValueAtTime(0.5, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.4);

    // Second beep
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(1100, ctx.currentTime + 0.15);
    gain2.gain.setValueAtTime(0.5, ctx.currentTime + 0.15);
    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.55);
    osc2.start(ctx.currentTime + 0.15);
    osc2.stop(ctx.currentTime + 0.55);
  } catch {
    // audio not available
  }
}

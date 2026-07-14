import { useEffect, useRef, useCallback, useState } from "react";
import { usePresenceStore } from "../../../store/presence-store";
import { goOnline, goOffline, sendPing } from "../services/delivery-api";
import { PING_INTERVAL_MS } from "../constants";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";

export function usePresence() {
  const isOnline = usePresenceStore((s) => s.isOnline);
  const setOnline = usePresenceStore((s) => s.setOnline);
  const watchIdRef = useRef<number | null>(null);
  const pingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastPosRef = useRef<{ lat: number; lng: number } | null>(null);
  const [tryOnlineAndOfflineLoading, setTryOnlineAndOfflineLoading] =
    useState(false);

  const { mutateAsync: triggerGoOnline } = useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      goOnline(lat, lng),
    meta: {
      successMessage: "You are online",
    },
  });

  const { mutateAsync: triggerSendPing } = useMutation({
    mutationFn: ({ lat, lng }: { lat: number; lng: number }) =>
      sendPing(lat, lng),
    meta: {
      disableSuccessToast: true,
    },
  });

  const { mutateAsync: triggerGoOffline } = useMutation({
    mutationFn: () => goOffline(),
  });

  const clearWatch = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
  }, []);

  const clearPing = useCallback(() => {
    if (pingRef.current !== null) {
      clearInterval(pingRef.current);
      pingRef.current = null;
    }
  }, []);

  const getCurrentPosition = useCallback(() => {
    return new Promise<{ lat: number; lng: number }>((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocation not supported"));
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) =>
          resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            toast.warning(
              "Location access is blocked. Please enable it in your browser settings.",
            );
          } else if (error.code === error.TIMEOUT) {
            toast.warning("Location request timed out. Retrying...");
          } else {
            console.error("Geolocation error:", error.message);
          }
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 15_000, maximumAge: 0 },
      );
    });
  }, []);

  const startPing = useCallback(
    (lat: number, lng: number) => {
      clearPing();
      lastPosRef.current = { lat, lng };
      pingRef.current = setInterval(async () => {
        try {
          const pos = await getCurrentPosition().catch(
            () => lastPosRef.current,
          );
          if (pos) {
            lastPosRef.current = pos;
            await triggerSendPing({ lat: pos.lat, lng: pos.lng });
          }
        } catch {
          // ping failure is non-critical
        }
      }, PING_INTERVAL_MS);
    },
    [clearPing, getCurrentPosition, triggerSendPing],
  );

  const becomeOnline = useCallback(async () => {
    try {
      setTryOnlineAndOfflineLoading(true);
      const pos = await getCurrentPosition();
      await triggerGoOnline({ lat: pos.lat, lng: pos.lng });
      setOnline(true);
      startPing(pos.lat, pos.lng);
    } catch {
      //
    } finally {
      setTryOnlineAndOfflineLoading(false);
    }
  }, [getCurrentPosition, triggerGoOnline, setOnline, startPing]);

  const becomeOffline = useCallback(async () => {
    try {
      setTryOnlineAndOfflineLoading(true);
      await triggerGoOffline();
    } catch {
      // proceed with local cleanup anyway
    } finally {
      setTryOnlineAndOfflineLoading(false);
    }
    setOnline(false);
    clearPing();
    clearWatch();
  }, [clearPing, clearWatch, setOnline, triggerGoOffline]);

  // Cleanup on unmount
  useEffect(() => {
    if (isOnline) {
      getCurrentPosition()
        .then((pos) => startPing(pos.lat, pos.lng))
        .catch(() => {});
    }
    return () => {
      clearPing();
      clearWatch();
    };
  }, [isOnline, startPing, getCurrentPosition, clearPing, clearWatch]);

  return { isOnline, becomeOnline, becomeOffline, tryOnlineAndOfflineLoading };
}

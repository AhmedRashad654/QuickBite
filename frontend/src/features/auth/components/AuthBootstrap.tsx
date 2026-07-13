import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { getMe, refreshToken } from "../services/auth-api";
import { useSyncUserSession } from "../hooks/useSyncUserSession";

type AuthBootstrapProps = {
  children: ReactNode;
};

const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);
  const clearSession = useAuthStore((state) => state.clearSession);
  const syncUserSession = useSyncUserSession();
  const setActiveRestaurant = useActiveRestaurantStore(
    (state) => state.setActiveRestaurant,
  );

  useEffect(() => {
    let isMounted = true;
    const bootstrap = async () => {
      try {
        const refreshed = await refreshToken();
        if (!isMounted) return;

        setAccessToken(refreshed.accessToken);

        const userData = await getMe();
        if (!isMounted) return;
        setUser(userData);
        syncUserSession(userData);
      } catch {
        if (isMounted) {
          clearSession();
          setActiveRestaurant(null);
        }
      } finally {
        if (isMounted) {
          setBootstrapped(true);
        }
      }
    };

    void bootstrap();

    return () => {
      isMounted = false;
    };
  }, [
    clearSession,
    setAccessToken,
    setActiveRestaurant,
    setBootstrapped,
    setUser,
    syncUserSession,
  ]);

  return children;
};

export default AuthBootstrap;

import { useEffect, type ReactNode } from "react";
import { useAuthStore } from "@/store/auth-store";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { getMe, refreshToken } from "../services/auth-api";
import { SYSTEM_ROLES } from "../types";

type AuthBootstrapProps = {
  children: ReactNode;
};

const AuthBootstrap = ({ children }: AuthBootstrapProps) => {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);
  const setUser = useAuthStore((state) => state.setUser);
  const setBootstrapped = useAuthStore((state) => state.setBootstrapped);
  const clearSession = useAuthStore((state) => state.clearSession);
  const activeRestaurant = useActiveRestaurantStore.getState().activeRestaurant;
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

        if (
          userData.system_role === SYSTEM_ROLES.RESTAURANT_USER &&
          userData.memberships &&
          userData.memberships.length > 0
        ) {
          const isCurrentActiveValid = userData.memberships.some(
            (m) =>
              m.restaurantId === activeRestaurant?.restaurantId &&
              m.restaurantRole === activeRestaurant?.restaurantRole &&
              m.restaurantStatus === activeRestaurant.restaurantStatus &&
              m.stautsMember === activeRestaurant.stautsMember,
          );

          if (!activeRestaurant || !isCurrentActiveValid) {
            const firstMembership = userData.memberships[0];
            setActiveRestaurant({
              restaurantId: firstMembership.restaurantId,
              restaurantName: firstMembership.restaurantName,
              restaurantRole: firstMembership.restaurantRole,
              restaurantStatus: firstMembership.restaurantStatus,
              stautsMember: firstMembership.stautsMember,
            });
          }
        } else {
          if (activeRestaurant) setActiveRestaurant(null);
        }
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
    setBootstrapped,
    setUser,
    activeRestaurant,
    setActiveRestaurant,
  ]);

  return children;
};

export default AuthBootstrap;

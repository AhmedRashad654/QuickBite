import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { useCallback } from "react";
import { SYSTEM_ROLES, type AuthUser } from "../types";
import { usePresenceStore } from "@/store/presence-store";

export const useSyncUserSession = () => {
  const setOnline = usePresenceStore((state) => state.setOnline);
  const setActiveRestaurant = useActiveRestaurantStore(
    (state) => state.setActiveRestaurant,
  );
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );

  const syncSession = useCallback(
    (userData: AuthUser) => {
      if (
        userData.system_role === SYSTEM_ROLES.DELIVERY_AGENT &&
        userData.isOnlineInRedis === true
      ) {
        setOnline(true);
      }
      if (
        userData?.system_role === SYSTEM_ROLES.RESTAURANT_USER &&
        userData?.memberships &&
        userData.memberships.length > 0
      ) {
        const isCurrentActiveValid = userData.memberships.some(
          (m) =>
            m.restaurantId === activeRestaurant?.restaurantId &&
            m.restaurantRole === activeRestaurant?.restaurantRole &&
            m.restaurantName === activeRestaurant?.restaurantName &&
            m.restaurantStatus === activeRestaurant?.restaurantStatus &&
            m.stautsMember === activeRestaurant?.stautsMember,
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
    },
    [activeRestaurant, setActiveRestaurant, setOnline],
  );

  return syncSession;
};

import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { useCallback } from "react";
import { SYSTEM_ROLES, type AuthUser } from "../types";

export const useSyncActiveRestaurant = () => {
  const setActiveRestaurant = useActiveRestaurantStore(
    (state) => state.setActiveRestaurant,
  );
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );

  const syncRestaurant = useCallback(
    (userData: AuthUser) => {
      if (
        userData?.system_role === SYSTEM_ROLES.RESTAURANT_USER &&
        userData?.memberships &&
        userData.memberships.length > 0
      ) {
        const isCurrentActiveValid = userData.memberships.some(
          (m) =>
            m.restaurantId === activeRestaurant?.restaurantId &&
            m.restaurantRole === activeRestaurant?.restaurantRole &&
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
    [activeRestaurant, setActiveRestaurant],
  );

  return syncRestaurant;
};

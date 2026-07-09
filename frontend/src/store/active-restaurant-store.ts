import type { MemberStatues, RestaurantRole, RestaurantStatues } from "@/features/restaurant/types";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type ActiveRestaurant = {
  restaurantId: number;
  restaurantName: string;
  restaurantRole: RestaurantRole;
  restaurantStatus: RestaurantStatues;
  stautsMember: MemberStatues;
};

export type ActiveBranch = {
  branchId: number;
  branchName: string;
};

type ActiveRestaurantState = {
  activeRestaurant: ActiveRestaurant | null;
  activeBranch: ActiveBranch | null;
  setActiveRestaurant: (restaurant: ActiveRestaurant | null) => void;
  setActiveBranch: (branch: ActiveBranch | null) => void;
};

export const useActiveRestaurantStore = create<ActiveRestaurantState>()(
  persist(
    (set) => ({
      activeRestaurant: null,
      activeBranch: null,
      setActiveRestaurant: (restaurant) =>
        set({ activeRestaurant: restaurant }),
      setActiveBranch: (branch) => set({ activeBranch: branch }),
    }),
    {
      name: "quickbite-active-restaurant",
    },
  ),
);

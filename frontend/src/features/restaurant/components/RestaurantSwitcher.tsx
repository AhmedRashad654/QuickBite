import * as React from "react";
import { ChevronsUpDown, Plus, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useAuthStore } from "@/store/auth-store";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { SYSTEM_ROLES } from "@/features/auth/types";
import DialogCreateRestaurant from "./DialogCreateRestaurant";
import { cn } from "@/lib/utils";

export function RestaurantSwitcher() {
  const [open, setOpen] = React.useState(false);
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const user = useAuthStore((state) => state.user);
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );
  const setActiveRestaurant = useActiveRestaurantStore(
    (state) => state.setActiveRestaurant,
  );

  if (
    user?.system_role !== SYSTEM_ROLES.RESTAURANT_USER ||
    !user?.memberships
  ) {
    return null;
  }

  const restaurants = user.memberships;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between gap-2 px-3 py-6 bg-sidebar-background hover:bg-accent/50 border-sidebar-border"
        >
          <div className="flex items-center gap-3 text-left">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Store className="h-4 w-4" />
            </div>

            <div className="flex flex-col gap-0.5 leading-none">
              <span className="font-semibold text-sm ">
                {activeRestaurant
                  ? `${activeRestaurant.restaurantName?.slice(0, 16)}${
                      activeRestaurant.restaurantName?.length > 16 ? "..." : ""
                    }`
                  : "Select Restaurant"}
              </span>
              {activeRestaurant && (
                <span className="text-xs text-muted-foreground capitalize">
                  {activeRestaurant.restaurantRole}
                </span>
              )}
            </div>
          </div>
          <ChevronsUpDown className="h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-(--radix-popover-trigger-width) p-0"
        align="start"
      >
        <Command>
          <CommandInput placeholder="Search restaurant..." />
          <CommandList>
            <CommandEmpty>No restaurant found.</CommandEmpty>
            <CommandGroup heading="Your Restaurants">
              {restaurants.map((membership) => {
                return (
                  <CommandItem
                    key={membership.restaurantId}
                    value={membership.restaurantName}
                    onSelect={() => {
                      setActiveRestaurant({
                        restaurantId: membership.restaurantId,
                        restaurantName: membership.restaurantName,
                        restaurantRole: membership.restaurantRole,
                        restaurantStatus: membership.restaurantStatus,
                        stautsMember: membership.stautsMember,
                      });
                      setOpen(false);
                    }}
                    className={cn(
                      "flex items-center justify-between py-3",
                      activeRestaurant?.restaurantId ===
                        membership.restaurantId && " bg-muted",
                    )}
                    isSelected={
                      activeRestaurant?.restaurantId === membership.restaurantId
                    }
                  >
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">
                        {membership.restaurantName}
                      </span>
                      <span className="text-xs text-muted-foreground capitalize">
                        {membership.restaurantRole}
                      </span>
                    </div>
                  </CommandItem>
                );
              })}
              <CommandItem
                onSelect={() => {
                  setOpen(false);
                  setDialogOpen(true);
                }}
                className="text-primary font-medium"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Restaurant
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
      <DialogCreateRestaurant open={dialogOpen} setOpen={setDialogOpen} />
    </Popover>
  );
}

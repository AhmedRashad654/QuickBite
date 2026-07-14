import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "../constants";
import { RestaurantSwitcher } from "./RestaurantSwitcher";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { RESTAURANT_ROLES } from "../types";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

interface RestaurantSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarNav = ({ onNavClick }: { onNavClick?: () => void }) => {
  const activeRestaurantRole = useActiveRestaurantStore(
    (s) => s.activeRestaurant?.restaurantRole,
  );

  return (
    <>
      <div className="px-3 pt-3">
        <RestaurantSwitcher />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.filter((n) => {
          if (n.label === "Settings") {
            return activeRestaurantRole === RESTAURANT_ROLES.OWNER;
          }
          return true;
        }).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={onNavClick}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )
            }
          >
            <item.icon className="size-4" />
            {item.label}
          </NavLink>
        ))}
      </nav>
    </>
  );
};

const RestaurantSidebar = ({ open, onOpenChange }: RestaurantSidebarProps) => {
  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col border-r bg-card min-h-full">
        <SidebarNav />
      </aside>

      {/* Mobile sidebar */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-60 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavClick={() => onOpenChange?.(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default RestaurantSidebar;

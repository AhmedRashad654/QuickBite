import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "../constants";
import { RestaurantSwitcher } from "./RestaurantSwitcher";

const RestaurantSidebar = () => {

  return (
    <aside className="hidden lg:flex w-60 flex-col border-r bg-card min-h-full">

      <div className="px-3 pt-3">
        <RestaurantSwitcher />
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
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
    </aside>
  );
};

export default RestaurantSidebar;

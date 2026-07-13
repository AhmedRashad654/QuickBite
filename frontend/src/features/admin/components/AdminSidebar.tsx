import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "../constants";

const AdminSidebar = () => {
  return (
    <aside className="hidden lg:flex w-60 flex-col border-r bg-card min-h-full">
      <nav className="flex-1 space-y-1 p-3">
        {ADMIN_NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
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

export default AdminSidebar;

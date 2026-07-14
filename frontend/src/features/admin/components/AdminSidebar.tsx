import { NavLink } from "react-router-dom";
import { cn } from "@/lib/utils";
import { ADMIN_NAV_ITEMS } from "../constants";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";

interface AdminSidebarProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const SidebarNav = ({ onNavClick }: { onNavClick?: () => void }) => {
  return (
    <nav className="flex-1 space-y-1 p-3">
      {ADMIN_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
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
  );
};

const AdminSidebar = ({ open, onOpenChange }: AdminSidebarProps) => {
  return (
    <>

      <aside className="hidden lg:flex w-60 flex-col border-r bg-card min-h-full">
        <SidebarNav />
      </aside>

      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="w-60 p-0" showCloseButton={false}>
          <SheetTitle className="sr-only">Navigation</SheetTitle>
          <SidebarNav onNavClick={() => onOpenChange?.(false)} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default AdminSidebar;

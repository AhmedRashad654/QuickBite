import { useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { LogOut, MenuIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/auth-hooks";
import AdminSidebar from "@/features/admin/components/AdminSidebar";

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const logoutMutation = useLogout();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-card">
        <div className="flex h-14 items-center border-b px-4 gap-2">
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <MenuIcon className="size-5" />
            <span className="sr-only">Open menu</span>
          </Button>
          <Link to="/admin/restaurants" className="text-lg font-semibold">
            QuickBite Admin
          </Link>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logoutMutation.mutate()}
          disabled={logoutMutation.isPending}
        >
          <LogOut />
          Sign out
        </Button>
      </header>
      <main className="flex flex-1">
        <AdminSidebar open={sidebarOpen} onOpenChange={setSidebarOpen} />
        <div className="max-w-7xl w-full mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

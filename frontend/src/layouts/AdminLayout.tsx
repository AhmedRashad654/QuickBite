import { Link, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/auth-hooks";
import AdminSidebar from "@/features/admin/components/AdminSidebar";

const AdminLayout = () => {
  const logoutMutation = useLogout();

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-card">
        <div className="flex h-14 items-center border-b px-4">
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
        <AdminSidebar />
        <div className="max-w-7xl w-full mx-auto p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;

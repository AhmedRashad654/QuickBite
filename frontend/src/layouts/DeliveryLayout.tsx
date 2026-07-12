import { Link, Outlet } from "react-router-dom";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/auth-hooks";

const DeliveryLayout = () => {
  const logoutMutation = useLogout();

  return (
    <div className="min-h-dvh bg-background">
      <nav className="sticky top-0 z-50 border-b bg-card">
        <div className="mx-auto flex h-14 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/delivery" className="text-lg font-semibold">
            QuickBite
          </Link>

          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut />
              Sign out
            </Button>
          </div>
        </div>
      </nav>
      <main className="mx-auto w-full max-w-3xl overflow-auto p-6">
        <Outlet />
      </main>
    </div>
  );
};

export default DeliveryLayout;

import { Outlet } from "react-router-dom";
import {
  AlertTriangleIcon,
  LockIcon,
  LogOut,
  ShieldAlertIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLogout } from "@/features/auth/hooks/auth-hooks";
import RestaurantSidebar from "@/features/restaurant/components/RestaurantSidebar";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { MEMBER_STATUES, RESTAURANT_STATUS } from "@/features/restaurant/types";
import {
  MEMBER_MESSAGES,
  RESTAURANT_MESSAGES,
} from "@/features/restaurant/constants";

const RestaurantLayout = () => {
  const logoutMutation = useLogout();
  const activeRestaurant = useActiveRestaurantStore((s) => s.activeRestaurant);

  const resStatus = activeRestaurant?.restaurantStatus;
  const memStatus = activeRestaurant?.stautsMember;

  const restaurantAlert =
    resStatus && resStatus !== RESTAURANT_STATUS.ACTIVE
      ? RESTAURANT_MESSAGES[resStatus as keyof typeof RESTAURANT_MESSAGES]
      : null;

  const memberAlert =
    memStatus && memStatus !== MEMBER_STATUES.ACTIVE
      ? MEMBER_MESSAGES[memStatus as keyof typeof MEMBER_MESSAGES]
      : null;

  return (
    <div className="flex flex-col h-screen">
      <header className="flex h-14 items-center justify-between border-b bg-card">
        <div className="flex h-14 items-center border-b px-4">
          <span className="text-lg font-semibold">QuickBite</span>
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
        <RestaurantSidebar />
        <div className="max-w-7xl w-full mx-auto  p-6">
          {restaurantAlert && (
            <Alert
              variant="destructive"
              className="border-destructive/50 bg-destructive/5 text-destructive mb-2"
            >
              <AlertTriangleIcon className="h-4 w-4 text-destructive" />
              <AlertTitle className="font-semibold tracking-tight">
                {restaurantAlert.title}
              </AlertTitle>
              <AlertDescription className="text-xs opacity-90 mt-1">
                {restaurantAlert.description}
              </AlertDescription>
            </Alert>
          )}
          {memStatus === "active" ? (
            <Outlet />
          ) : (
            <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 bg-muted/20 border border-dashed rounded-xl max-w-xl mx-auto mt-12 space-y-4 animate-in fade-in duration-300">
              <div className="p-4 bg-destructive/10 text-destructive rounded-full">
                {memStatus === "suspended" ? (
                  <ShieldAlertIcon className="h-8 w-8" />
                ) : (
                  <LockIcon className="h-8 w-8" />
                )}
              </div>
              <div className="space-y-2">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  {memberAlert?.title || "Access Restricted"}
                </h2>
                <p className="text-sm text-muted-foreground max-w-sm mx-auto">
                  {memberAlert?.description ||
                    "You do not have permission to access this restaurant dashboard."}
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RestaurantLayout;

import { Navigate, Outlet } from "react-router-dom";
import { useAuthStore } from "@/store/auth-store";
import { SYSTEM_ROLES, type SystemRole } from "@/features/auth/types";

const FullPageLoader = () => (
  <div className="flex min-h-dvh items-center justify-center bg-background text-sm text-muted-foreground">
    Loading
  </div>
);

export const ProtectedRoute = ({
  allowedRoles,
}: {
  allowedRoles: SystemRole;
}) => {
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const accessToken = useAuthStore((state) => state.accessToken);
  const user = useAuthStore((state) => state.user);
  if (!isBootstrapped) {
    return <FullPageLoader />;
  }

  if (!accessToken) {
    return <Navigate to="/auth/sign-in" replace />;
  }

  if (user?.system_role === allowedRoles) return <Outlet />;
  if (user?.system_role === SYSTEM_ROLES.CUSTOMER) return <Navigate to="/" />;
  if (user?.system_role === SYSTEM_ROLES.DELIVERY_AGENT) return <Navigate to="/delivery" />;
  if (user?.system_role === SYSTEM_ROLES.RESTAURANT_USER) return <Navigate to="/restaurant" />;

};

export const GuestRoute = () => {
  const isBootstrapped = useAuthStore((state) => state.isBootstrapped);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (!isBootstrapped) {
    return <FullPageLoader />;
  }

  if (accessToken) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

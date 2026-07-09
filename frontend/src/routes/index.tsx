import AppLayout from "@/layouts/AppLayout";
import AuthLayout from "@/layouts/AuthLayout";
import DeliveryLayout from "@/layouts/DeliveryLayout";
import RestaurantLayout from "@/layouts/RestaurantLayout";
import { lazy } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { GuestRoute, ProtectedRoute } from "./guards";
import { SYSTEM_ROLES } from "@/features/auth/types";

const SignUp = lazy(() => import("@/features/auth/pages/SignUp"));
const SignIn = lazy(() => import("@/features/auth/pages/SignIn"));
const ForgotPassword = lazy(
  () => import("@/features/auth/pages/ForgotPassword"),
);
const ResetPassword = lazy(() => import("@/features/auth/pages/ResetPassword"));
const Home = lazy(() => import("@/features/home/pages/Home"));
const Profile = lazy(() => import("@/features/profile/pages/Profile"));
const MenuPage = lazy(() => import("@/features/menu/pages/MenuPage"));
const Checkout = lazy(() => import("@/features/checkout/pages/Checkout"));
const OrdersPage = lazy(() => import("@/features/orders/pages/OrdersPage"));
const OrderDetailPage = lazy(
  () => import("@/features/orders/pages/OrderDetailPage"),
);
const Delivery = lazy(() => import("@/features/delivery/pages/Delivery"));
const RestaurantDashboard = lazy(
  () => import("@/features/restaurant/pages/Restaurant"),
);
const RestaurantOrdersPage = lazy(
  () => import("@/features/restaurant/pages/RestaurantOrdersPage"),
);
const RestaurantProductsPage = lazy(
  () => import("@/features/restaurant/pages/RestaurantProductsPage"),
);
const RestaurantBranchesPage = lazy(
  () => import("@/features/restaurant/pages/RestaurantBranchesPage"),
);
const RestaurantMembersPage = lazy(
  () => import("@/features/restaurant/pages/RestaurantMembersPage"),
);
const RestaurantSettingsPage = lazy(
  () => import("@/features/restaurant/pages/RestaurantSettingsPage"),
);
const RestaurantFinancePage = lazy(
  () => import("@/features/restaurant/pages/RestaurantFinancePage"),
);

const Routes = () => {
  const AuthRoutes = [
    {
      path: "/auth",
      element: <GuestRoute />,
      children: [
        {
          element: <AuthLayout />,
          children: [
            {
              index: true,
              element: <Navigate to="sign-in" replace />,
            },
            {
              path: "sign-in",
              element: <SignIn />,
            },
            {
              path: "sign-up",
              element: <SignUp />,
            },
            {
              path: "forgot-password",
              element: <ForgotPassword />,
            },
            {
              path: "reset-password",
              element: <ResetPassword />,
            },
          ],
        },
      ],
    },
  ];

  const CustomerRoutes = [
    {
      element: <ProtectedRoute allowedRoles={SYSTEM_ROLES.CUSTOMER} />,
      children: [
        {
          element: <AppLayout />,
          children: [
            { path: "/", element: <Home /> },
            { path: "/profile", element: <Profile /> },
            { path: "/menu/:branchId", element: <MenuPage /> },
            { path: "/checkout", element: <Checkout /> },
            { path: "/orders", element: <OrdersPage /> },
            { path: "/orders/:publicId", element: <OrderDetailPage /> },
          ],
        },
      ],
    },
  ];

  const DeliveryRoutes = [
    {
      path: "/delivery",
      element: <ProtectedRoute allowedRoles={SYSTEM_ROLES.DELIVERY_AGENT} />,
      children: [
        {
          element: <DeliveryLayout />,
          children: [{ path: "", element: <Delivery /> }],
        },
      ],
    },
  ];

  const RestaurantRoutes = [
    {
      path: "/restaurant",
      element: <ProtectedRoute allowedRoles={SYSTEM_ROLES.RESTAURANT_USER} />,
      children: [
        {
          element: <RestaurantLayout />,
          children: [
            { index: true, element: <RestaurantDashboard /> },
            { path: "orders", element: <RestaurantOrdersPage /> },
            { path: "orders/:publicId", element: <OrderDetailPage /> },
            { path: "products", element: <RestaurantProductsPage /> },
            { path: "branches", element: <RestaurantBranchesPage /> },
            { path: "members", element: <RestaurantMembersPage /> },
            { path: "settings", element: <RestaurantSettingsPage /> },
            { path: "finance", element: <RestaurantFinancePage /> },
          ],
        },
      ],
    },
  ];

  const errorRoute = {
    path: "*",
    element: <div>not found</div>,
  };

  const router = createBrowserRouter([
    ...AuthRoutes,
    ...CustomerRoutes,
    ...DeliveryRoutes,
    ...RestaurantRoutes,
    errorRoute,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;

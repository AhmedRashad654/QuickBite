import {
  useRestaurant,
  useRestaurantOrders,
} from "../hooks/restaurant-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { OrderSummary } from "@/features/orders/types";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { ShoppingBag, Store, Users, DollarSign } from "lucide-react";

const RestaurantDashboard = () => {
  const { data: restaurant } = useRestaurant();
  const { data: ordersData } = useRestaurantOrders();
  const membershipRole = useActiveRestaurantStore(
    (state) => state.activeRestaurant?.restaurantRole,
  );

  const orders = Array.isArray(ordersData) ? ordersData : [];
  const pendingOrders = orders.filter((o: OrderSummary) => o.status === "placed");
  const acceptedOrders = orders.filter((o: OrderSummary) => o.status === "accepted");
  const preparingOrders = orders.filter((o: OrderSummary) => o.status === "preparing");

  const stats = [
    {
      label: "Pending Orders",
      value: pendingOrders.length,
      icon: ShoppingBag,
      color: "text-orange-500",
    },
    {
      label: "In Progress",
      value: preparingOrders.length,
      icon: Store,
      color: "text-blue-500",
    },
    {
      label: "Accepted",
      value: acceptedOrders.length,
      icon: Users,
      color: "text-green-500",
    },
    {
      label: "Role",
      value: membershipRole ?? "—",
      icon: DollarSign,
      color: "text-purple-500",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {restaurant?.data?.name ?? "Dashboard"}
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.label}
              </CardTitle>
              <stat.icon className={`size-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">
                {typeof stat.value === "number" ? stat.value : stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-sm text-muted-foreground">No orders yet</p>
            ) : (
              <div className="space-y-3">
                {orders.slice(0, 5).map((order: OrderSummary) => (
                  <div
                    key={order.public_id}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="truncate font-medium">
                      {order.public_id.slice(0, 8)}...
                    </span>
                    <span className="capitalize text-muted-foreground">
                      {order.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm text-muted-foreground">
              Use the sidebar to navigate between sections.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RestaurantDashboard;

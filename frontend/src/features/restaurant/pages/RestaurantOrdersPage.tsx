import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useBranchOrders,
  useUpdateOrderStatus,
} from "../hooks/restaurant-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, X, CookingPot, Package, Loader2 } from "lucide-react";
import BranchSwitcher from "../components/BranchSwitcher";
import { Loader } from "@/components/shared/Loader";
import { ORDER_STATUES } from "@/features/orders/types";
import { filters } from "@/features/orders/constants";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { RESTAURANT_ROLES } from "../types";
import { STATUS_COLOR } from "../constants";
import { useRestaurantOrderEvents } from "@/features/orders/hooks/useOrderSocket";

const RestaurantOrdersPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useBranchOrders(filter);
  const updateStatus = useUpdateOrderStatus();
  const activeRestaurantRole = useActiveRestaurantStore(
    (s) => s.activeRestaurant?.restaurantRole,
  );
  const activeBranchId = useActiveRestaurantStore(
    (s) => s.activeBranch?.branchId ?? null,
  );

  const activeRestaurantId = useActiveRestaurantStore(
    (s) => s.activeRestaurant?.restaurantId ?? null,
  );

  useRestaurantOrderEvents(activeBranchId, activeRestaurantId);

  const orders = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Orders</h1>
      </div>
      <BranchSwitcher />
      <div className="flex gap-2">
        {filters.map((f) => (
          <Button
            key={f.label}
            variant={filter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Loader viewType="table" count={5} />
      ) : orders.filter((o) => !filter || o.status === filter).length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No orders found
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {orders
            .filter((o) => !filter || o.status === filter)
            .map((order) => (
              <Card key={order.public_id}>
                <CardHeader className="flex flex-row items-center justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-sm">
                      #{order.public_id.slice(0, 8)}
                    </CardTitle>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span>
                        {order.currency} {(order.total / 100).toFixed(2)}
                      </span>
                      <span>•</span>
                      <span>{order.items_count} items</span>
                    </div>
                  </div>
                  <Badge
                    className={STATUS_COLOR[order.status] ?? ""}
                    variant="outline"
                  >
                    {order.status}
                  </Badge>
                </CardHeader>
                <CardContent className="flex gap-2">
                  {order.status === "placed" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatus.mutate({
                            publicId: order.public_id,
                            status: ORDER_STATUES.ACCEPTED,
                          })
                        }
                        disabled={updateStatus.isPending}
                      >
                        <Check /> Accept
                      </Button>
                      {(activeRestaurantRole === RESTAURANT_ROLES.OWNER ||
                        activeRestaurantRole ===
                          RESTAURANT_ROLES.BRANCH_MANAGER) && (
                        <>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              updateStatus.mutate({
                                publicId: order.public_id,
                                status: ORDER_STATUES.REJECTED,
                              })
                            }
                            disabled={updateStatus.isPending}
                          >
                            <X /> Reject
                          </Button>
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() =>
                              updateStatus.mutate({
                                publicId: order.public_id,
                                status: ORDER_STATUES.CANCELLED,
                              })
                            }
                            disabled={updateStatus.isPending}
                          >
                            <X /> Cancelled
                          </Button>
                        </>
                      )}
                    </>
                  )}
                  {order.status === "accepted" && (
                    <>
                      <Button
                        size="sm"
                        onClick={() =>
                          updateStatus.mutate({
                            publicId: order.public_id,
                            status: ORDER_STATUES.PREPARING,
                          })
                        }
                        disabled={updateStatus.isPending}
                      >
                        <CookingPot /> Start Preparing
                      </Button>
                      {(activeRestaurantRole === RESTAURANT_ROLES.OWNER ||
                        activeRestaurantRole ===
                          RESTAURANT_ROLES.BRANCH_MANAGER) && (
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() =>
                            updateStatus.mutate({
                              publicId: order.public_id,
                              status: ORDER_STATUES.CANCELLED,
                            })
                          }
                          disabled={updateStatus.isPending}
                        >
                          <X /> Cancelled
                        </Button>
                      )}
                    </>
                  )}
                  {order.status === "preparing" && (
                    <Button
                      size="sm"
                      onClick={() =>
                        updateStatus.mutate({
                          publicId: order.public_id,
                          status: ORDER_STATUES.READY,
                        })
                      }
                      disabled={updateStatus.isPending}
                    >
                      <Package /> Mark Ready
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      navigate(`/restaurant/orders/${order.public_id}`)
                    }
                  >
                    View
                  </Button>
                </CardContent>
              </Card>
            ))}

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Show more
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RestaurantOrdersPage;

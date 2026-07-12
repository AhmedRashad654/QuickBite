import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useBranchOrders,
  useUpdateOrderStatus,
  useCompleteOrder,
} from "../hooks/restaurant-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  CookingPot,
  Package,
  Loader2,
  Truck,
  CheckCircle,
  Store,
} from "lucide-react";
import BranchSwitcher from "../components/BranchSwitcher";
import { Loader } from "@/components/shared/Loader";
import { ORDER_STATUES, ORDER_TYPE } from "@/features/orders/types";
import { filters } from "@/features/orders/constants";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { RESTAURANT_ROLES } from "../types";
import { STATUS_COLOR } from "../constants";
import { useRestaurantOrderEvents } from "@/features/orders/hooks/useOrderSocket";
import DialogAssignAgent from "../components/DialogAssignAgent";
import { formatUUID } from "@/lib/format-uuid";

const RestaurantOrdersPage = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string | undefined>(undefined);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedOrderPublicId, setSelectedOrderPublicId] = useState<
    string | null
  >(null);
  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } =
    useBranchOrders(filter);
  const updateStatus = useUpdateOrderStatus();
  const completePickup = useCompleteOrder();
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
      <div className="flex gap-2 flex-wrap">
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
                      # {formatUUID(order.public_id)}
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
                <CardContent className="flex gap-2 flex-wrap items-center">
                  {order.status === ORDER_STATUES.PLACED && (
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
                  {order.status === ORDER_STATUES.ACCEPTED && (
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
                  {order.status === ORDER_STATUES.PREPARING && (
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
                  {order.status === ORDER_STATUES.EXHAUSTED &&
                    (activeRestaurantRole === RESTAURANT_ROLES.OWNER ||
                      activeRestaurantRole ===
                        RESTAURANT_ROLES.BRANCH_MANAGER) && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedOrderPublicId(order.public_id);
                          setAssignDialogOpen(true);
                        }}
                      >
                        Assign Delivery
                        <Truck />
                      </Button>
                    )}
                  {order.status === ORDER_STATUES.READY &&
                    order.order_type === ORDER_TYPE.PICKUP && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => completePickup.mutate(order.public_id)}
                          disabled={completePickup.isPending}
                        >
                          <CheckCircle /> Mark Completed
                        </Button>
                      </>
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
                  <Badge
                    variant="secondary"
                    className="gap-1.5 text-xs"
                  >
                    {order.order_type === ORDER_TYPE.PICKUP ? (
                      <>
                        <Store className="size-3" />
                        Pickup
                      </>
                    ) : (
                      <>
                        <Truck className="size-3" />
                        Delivery
                      </>
                    )}
                  </Badge>
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
      <DialogAssignAgent
        open={assignDialogOpen}
        onOpenChange={setAssignDialogOpen}
        orderPublicId={selectedOrderPublicId}
      />
    </div>
  );
};

export default RestaurantOrdersPage;

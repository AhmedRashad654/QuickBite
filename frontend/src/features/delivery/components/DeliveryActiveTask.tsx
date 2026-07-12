import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Truck, CheckCircle2 } from "lucide-react";
import { useTransitionTask } from "../hooks/useDeliveryActions";
import { TASK_STATUS_LABELS } from "../constants";
import { formatPrice } from "@/lib/format-price";
import { formatDate } from "@/lib/format-date";
import type { DeliveryTask } from "../types";
import { ORDER_STATUES } from "@/features/orders/types";
import { formatUUID } from "@/lib/format-uuid";

interface Props {
  task: DeliveryTask;
}

export function DeliveryActiveTask({ task }: Props) {
  const transitionMutation = useTransitionTask();

  const handlePickUp = () => {
    transitionMutation.mutate({
      publicId: task.orderId,
      status: ORDER_STATUES.PICKED,
    });
  };

  const handleDelivered = () => {
    transitionMutation.mutate({
      publicId: task.orderId,
      status: ORDER_STATUES.DELIVERED,
    });
  };

  const isPending = transitionMutation.isPending;

  return (
    <Card className="border-primary/30">
      <CardContent className="space-y-4 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Truck className="size-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold">#{formatUUID(task.orderId)}</p>
              <Badge variant="outline" className="mt-1 text-xs">
                {TASK_STATUS_LABELS[task.status] || task.status}
              </Badge>
            </div>
          </div>
          <div className="text-right text-sm">
            <p className="font-semibold">
              {formatPrice(task.total, task.currency)}
            </p>
            <p className="text-xs text-muted-foreground">
              {task.paymentMethod === "cod" ? "COD" : "Online"}
            </p>
          </div>
        </div>

        <div className="grid gap-2 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-green-600" />
            <div className="min-w-0">
              <p className="font-medium">{task.pickup.name || "Branch"}</p>
              <p className="truncate text-xs text-muted-foreground">
                {task.pickup.addressText}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3.5 shrink-0 text-blue-600" />
            <div className="min-w-0">
              <p className="font-medium">Customer</p>
              <p className="truncate text-xs text-muted-foreground">
                {task.dropoff.addressText}
              </p>
            </div>
          </div>
        </div>

        {task.assignedAt && (
          <p className="text-xs text-muted-foreground">
            Assigned: {formatDate(task.assignedAt)}
          </p>
        )}
        {task.pickedAt && (
          <p className="text-xs text-muted-foreground">
            Picked up: {formatDate(task.pickedAt)}
          </p>
        )}

        <div className="flex gap-2">
          {task.status === "assigned" && (
            <Button
              className="w-full"
              onClick={handlePickUp}
              disabled={isPending}
            >
              <Package className="mr-2 size-4" />
              {isPending ? "Picking up..." : "Pick Up Order"}
            </Button>
          )}
          {task.status === "picked" && (
            <Button
              className="w-full"
              onClick={handleDelivered}
              disabled={isPending}
            >
              <CheckCircle2 className="mr-2 size-4" />
              {isPending ? "Delivering..." : "Mark as Delivered"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

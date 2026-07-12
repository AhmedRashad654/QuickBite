import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package } from "lucide-react";
import { TASK_STATUS_LABELS } from "../constants";
import { formatPrice } from "@/lib/format-price";
import { formatDate } from "@/lib/format-date";
import type { DeliveryTask } from "../types";
import { formatUUID } from "@/lib/format-uuid";

interface Props {
  task: DeliveryTask;
}

export function DeliveryTaskCard({ task }: Props) {
  return (
    <Card>
      <CardContent className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <Package className="size-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium">#{formatUUID(task.orderId)}</p>
              <p className="text-xs text-muted-foreground">
                {task.assignedAt ? formatDate(task.assignedAt) : ""}
              </p>
            </div>
          </div>
          <Badge variant="outline">
            {TASK_STATUS_LABELS[task.status] || task.status}
          </Badge>
        </div>

        <div className="grid gap-1.5 text-sm">
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3 shrink-0 text-green-600" />
            <div className="min-w-0">
              <p className="truncate font-medium">
                {task.pickup.name || "Branch"}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {task.pickup.addressText}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-2">
            <MapPin className="mt-0.5 size-3 shrink-0 text-blue-600" />
            <div className="min-w-0">
              <p className="truncate text-xs text-muted-foreground">
                {task.dropoff.addressText}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {task.paymentMethod === "cod" ? "Cash on Delivery" : "Paid Online"}
          </span>
          <span className="font-semibold">
            {formatPrice(task.total, task.currency)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

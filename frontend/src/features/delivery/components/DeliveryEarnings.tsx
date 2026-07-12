import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, TrendingUp } from "lucide-react";
import { useAgentEarnings } from "../hooks/useAgentTasks";
import { formatPrice } from "@/lib/format-price";

export function DeliveryEarnings() {
  const now = new Date();
  const monthStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1),
  ).toISOString();
  const monthEnd = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1),
  ).toISOString();

  const { data: earnings, isLoading } = useAgentEarnings(monthStart, monthEnd);

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <DollarSign className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-24 animate-pulse rounded bg-muted" />
          ) : (
            <div className="text-2xl font-bold">
              {formatPrice(earnings?.totals.sum ?? 0, earnings?.totals.currency ?? undefined)}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Monthly earnings</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium">Deliveries</CardTitle>
          <TrendingUp className="size-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="h-8 w-16 animate-pulse rounded bg-muted" />
          ) : (
            <div className="text-2xl font-bold">
              {earnings?.totals.count ?? 0}
            </div>
          )}
          <p className="text-xs text-muted-foreground">Completed this month</p>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet, ArrowUpRight } from "lucide-react";
import { useAgentBalance, useAgentPayouts } from "../hooks/useAgentTasks";
import { formatPrice } from "@/lib/format-price";

export function DeliveryEarnings() {
  const { data: balance, isLoading: balanceLoading } = useAgentBalance();
  const { data: payouts, isLoading: payoutsLoading } = useAgentPayouts();

  return (
    <div className="space-y-6">
      {/* Wallet Balance */}
      <div className="grid gap-4 sm:grid-cols-2">
        {balanceLoading ? (
          <>
            <div className="h-28 animate-pulse rounded-lg bg-muted" />
            <div className="h-28 animate-pulse rounded-lg bg-muted" />
          </>
        ) : balance?.balances && balance.balances.length > 0 ? (
          balance.balances.map((b) => (
            <Card key={b.currency}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">
                  Wallet Balance
                </CardTitle>
                <Wallet className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {formatPrice(b.balance, b.currency)}
                </div>
                <p className="text-xs text-muted-foreground">
                  Available for payout
                </p>
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                Wallet Balance
              </CardTitle>
              <Wallet className="size-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.00</div>
              <p className="text-xs text-muted-foreground">
                No balance yet. Complete deliveries to start earning.
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          {payoutsLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded bg-muted"
                />
              ))}
            </div>
          ) : !payouts || payouts.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">
              No payouts yet.
            </p>
          ) : (
            <div className="space-y-3">
              {payouts.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="flex items-center gap-3">
                    <ArrowUpRight className="size-4 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">
                        {formatPrice(p.amount, p.currency)}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(p.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={
                      p.status === "succeeded" ? "default" : "secondary"
                    }
                  >
                    {p.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAdminAgentBalance,
  useAdminAgentPayouts,
} from "../hooks/admin-hooks";
import { Button } from "@/components/ui/button";
import DialogCreatePayout from "../components/DialogCreatePayout";
import { formatPrice } from "@/lib/format-price";
import { Banknote } from "lucide-react";

const AdminAgentDetailPage = () => {
  const { agentId } = useParams<{ agentId: string }>();
  const id = Number(agentId);

  const [payoutOpen, setPayoutOpen] = useState(false);

  const { data: balance, isLoading: balanceLoading } = useAdminAgentBalance(id);
  const { data: payouts, isLoading: payoutsLoading } = useAdminAgentPayouts(id);

  if (!id) return <div className="text-red-500">Invalid agent ID.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Agent #{id} — Finance</h1>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Wallet Balance</h2>
          <Button size="sm" onClick={() => setPayoutOpen(true)}>
            <Banknote className="size-4" />
            Create Payout
          </Button>
        </div>
        {balanceLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : balance?.balances && balance.balances.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {balance.balances.map((b) => (
              <div
                key={b.currency}
                className="border rounded-lg p-4 bg-card space-y-1"
              >
                <span className="text-xs text-muted-foreground uppercase">
                  {b.currency}
                </span>
                <p className="text-2xl font-bold">
                  {formatPrice(b.balance, b.currency)}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No balance records.</p>
        )}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Payout History</h2>
        {payoutsLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : !payouts || payouts.length === 0 ? (
          <p className="text-sm text-muted-foreground">No payouts recorded.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b bg-muted/50 text-left">
                  <th className="px-4 py-2 font-medium">Date</th>
                  <th className="px-4 py-2 font-medium">Amount</th>
                  <th className="px-4 py-2 font-medium">Currency</th>
                  <th className="px-4 py-2 font-medium">Status</th>
                  <th className="px-4 py-2 font-medium">Reference</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="px-4 py-2">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-2">
                      {formatPrice(p.amount, p.currency)}
                    </td>
                    <td className="px-4 py-2">{p.currency}</td>
                    <td className="px-4 py-2">{p.status}</td>
                    <td className="px-4 py-2 text-muted-foreground">
                      {p.provider_reference_id ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <DialogCreatePayout
        open={payoutOpen}
        onOpenChange={setPayoutOpen}
        mode="agent"
        agentId={id}
        defaultCurrency={balance?.balances?.[0]?.currency}
      />
    </div>
  );
};

export default AdminAgentDetailPage;

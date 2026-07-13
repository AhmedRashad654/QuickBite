import { useState } from "react";
import { useParams } from "react-router-dom";
import {
  useAdminBranches,
  useAdminRestaurantBalance,
  useAdminRestaurantPayouts,
} from "../hooks/admin-hooks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader } from "@/components/shared/Loader";
import DialogEditBranchStatus from "../components/DialogEditBranchStatus";
import DialogCreatePayout from "../components/DialogCreatePayout";
import type { AdminBranchItem } from "../types";
import { formatPercentage, formatPrice } from "@/lib/format-price";
import { Banknote } from "lucide-react";

const AdminRestaurantDetailPage = () => {
  const { restaurantId } = useParams<{ restaurantId: string }>();
  const id = Number(restaurantId);

  const [editBranch, setEditBranch] = useState<AdminBranchItem | null>(null);
  const [payoutOpen, setPayoutOpen] = useState(false);

  const { data: balance, isLoading: balanceLoading } =
    useAdminRestaurantBalance(id);
  const { data: payouts, isLoading: payoutsLoading } =
    useAdminRestaurantPayouts(id);
  const { data: branches, isLoading: branchesLoading } = useAdminBranches(id);

  if (!id) return <div className="text-red-500">Invalid restaurant ID.</div>;

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">Restaurant #{id} — Finance</h1>

      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Balance</h2>
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
        <h2 className="text-lg font-semibold">Branches</h2>
        {branchesLoading ? (
          <Loader viewType="table" count={3} />
        ) : !branches || branches.length === 0 ? (
          <p className="text-sm text-muted-foreground">No branches found.</p>
        ) : (
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Label</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead className="text-center">Active</TableHead>
                  <TableHead className="text-center">Accept Orders</TableHead>
                  <TableHead className="text-center">Commission</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {branches.map((b) => (
                  <TableRow key={b.id}>
                    <TableCell className="font-medium">{b.label}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {b.address_text}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge
                        variant="secondary"
                        className={
                          b.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-500"
                        }
                      >
                        {b.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {b.accept_orders ? "Yes" : "No"}
                    </TableCell>
                    <TableCell className="text-center">
                      {formatPercentage(b.commission)}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditBranch(b)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
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

      <DialogEditBranchStatus
        open={!!editBranch}
        onOpenChange={(open) => {
          if (!open) setEditBranch(null);
        }}
        branch={editBranch}
      />

      <DialogCreatePayout
        open={payoutOpen}
        onOpenChange={setPayoutOpen}
        mode="restaurant"
        restaurantId={id}
        defaultCurrency={balance?.balances?.[0]?.currency}
      />
    </div>
  );
};

export default AdminRestaurantDetailPage;

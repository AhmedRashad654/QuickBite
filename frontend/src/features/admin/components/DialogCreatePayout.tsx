import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  useCreateAdminRestaurantPayout,
  useCreateAdminAgentPayout,
} from "../hooks/admin-hooks";
import { CURRENCIES } from "@/types";

type DialogCreatePayoutProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
} & (
  | { mode: "restaurant"; restaurantId: number; defaultCurrency?: string }
  | { mode: "agent"; agentId: number; defaultCurrency?: string }
);

const DialogCreatePayout = (props: DialogCreatePayoutProps) => {
  const { open, onOpenChange, mode, defaultCurrency } = props;
  const createRestaurantPayout = useCreateAdminRestaurantPayout();
  const createAgentPayout = useCreateAdminAgentPayout();

  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState(defaultCurrency ?? "EGP");
  const [providerRef, setProviderRef] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setTimeout(() => {
      setCurrency(defaultCurrency ?? "EGP");
    }, 50);
  }, [defaultCurrency]);
  const isPending =
    createRestaurantPayout.isPending || createAgentPayout.isPending;

  const handleClose = () => {
    setAmount("");
    setProviderRef("");
    setNote("");
    onOpenChange(false);
  };
  const handleSave = () => {
    const amountMinor = Math.round(Number(amount) * 100);
    if (amountMinor <= 0 || !providerRef.trim()) return;

    const payload = {
      amount: amountMinor,
      currency,
      provider_reference_id: providerRef.trim(),
      note: note.trim() || undefined,
    };

    if (mode === "restaurant") {
      createRestaurantPayout.mutate(
        { restaurantId: props.restaurantId, data: payload },
        {
          onSuccess: () => handleClose(),
        },
      );
    } else {
      createAgentPayout.mutate(
        { agentId: props.agentId, data: payload },
        {
          onSuccess: () => handleClose(),
        },
      );
    }
  };

  const canSubmit =
    Number(amount) > 0 && providerRef.trim().length > 0 && !isPending;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === "restaurant"
              ? "Create Restaurant Payout"
              : "Create Agent Payout"}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="payout-amount">Amount</Label>
              <Input
                id="payout-amount"
                type="number"
                min={0.01}
                step={0.01}
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="payout-currency">Currency</Label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger id="payout-currency" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="payout-ref">Provider Reference ID</Label>
            <Input
              id="payout-ref"
              placeholder="e.g. transaction reference number"
              value={providerRef}
              onChange={(e) => setProviderRef(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="payout-note">Note (optional)</Label>
            <Textarea
              id="payout-note"
              placeholder="Optional note..."
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!canSubmit}>
            {isPending ? "Creating..." : "Create Payout"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogCreatePayout;

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateAdminRestaurantStatus } from "../hooks/admin-hooks";
import { RESTAURANT_STATUSES } from "../constants";
import type { AdminRestaurantItem } from "../types";

type DialogEditRestaurantStatusProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: AdminRestaurantItem | null;
};

const DialogEditRestaurantStatus = ({
  open,
  onOpenChange,
  restaurant,
}: DialogEditRestaurantStatusProps) => {
  const updateStatus = useUpdateAdminRestaurantStatus();
  const [status, setStatus] = useState(restaurant?.status ?? "");

  useEffect(() => {
    if (restaurant?.status) {
      setTimeout(() => {
        setStatus(restaurant?.status ?? "");
      }, 50);
    }
  }, [restaurant?.status]);

  const handleSave = () => {
    if (!restaurant) return;
    updateStatus.mutate(
      { id: restaurant.id, status },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Update Restaurant Status</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">{restaurant?.name}</p>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RESTAURANT_STATUSES.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={updateStatus.isPending || status === restaurant?.status}
          >
            {updateStatus.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditRestaurantStatus;

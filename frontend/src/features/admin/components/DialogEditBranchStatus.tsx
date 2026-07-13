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
import { Switch } from "@/components/ui/switch";
import { useUpdateAdminBranchStatus } from "../hooks/admin-hooks";
import type { AdminBranchItem } from "../types";

type DialogEditBranchStatusProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  branch: AdminBranchItem | null;
};

const DialogEditBranchStatus = ({
  open,
  onOpenChange,
  branch,
}: DialogEditBranchStatusProps) => {
  const updateBranchStatus = useUpdateAdminBranchStatus();
  const [isActive, setIsActive] = useState(branch?.is_active ?? true);
  const [commission, setCommission] = useState(branch?.commission ?? 0);

  useEffect(() => {
    if (branch) {
      setTimeout(() => {
        setIsActive(branch?.is_active);
        setCommission(branch?.commission);
      }, 10);
    }
  }, [branch]);
  const handleSave = () => {
    if (!branch) return;
    updateBranchStatus.mutate(
      {
        branchId: branch.id,
        data: { is_active: isActive, commission: commission * 100 },
      },
      { onSuccess: () => onOpenChange(false) },
    );
  };

  const hasChanges =
    branch &&
    (isActive !== branch.is_active || commission !== branch.commission);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Edit Branch</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{branch?.label}</p>
          <div className="flex items-center justify-between">
            <Label htmlFor="branch-active">Active</Label>
            <Switch
              id="branch-active"
              checked={isActive}
              onCheckedChange={setIsActive}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="branch-commission">Commission (%)</Label>
            <Input
              id="branch-commission"
              type="number"
              min={0}
              max={100}
              step={0.5}
              value={commission}
              onChange={(e) => setCommission(Number(e.target.value))}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={handleSave}
            disabled={updateBranchStatus.isPending || !hasChanges}
          >
            {updateBranchStatus.isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DialogEditBranchStatus;

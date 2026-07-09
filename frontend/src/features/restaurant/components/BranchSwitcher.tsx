import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBranches } from "../hooks/restaurant-hooks";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { Building2 } from "lucide-react";

const BranchSwitcher = () => {
  const { data: branchesData } = useBranches();
  const activeBranch = useActiveRestaurantStore((s) => s.activeBranch);
  const setActiveBranch = useActiveRestaurantStore((s) => s.setActiveBranch);
  const branches = Array.isArray(branchesData) ? branchesData : [];
  if (branches.length === 0) return null;
  return (
    <Select
      value={activeBranch ? String(activeBranch.branchId) : ""}
      onValueChange={(value) => {
        const branch = branches.find((b) => String(b.id) === value);
        if (branch) {
          setActiveBranch({ branchId: branch.id, branchName: branch.label });
        }
      }}
    >
      <SelectTrigger className="w-full">
        <div className="flex gap-2 items-center">
          <Building2 className="size-4" />
          <SelectValue placeholder="Select branch" />
        </div>
      </SelectTrigger>
      <SelectContent>
        {branches.map((branch) => (
          <SelectItem key={branch.id} value={String(branch.id)}>
            <span className="text-blue-500 font-medium">branch: </span> {branch.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default BranchSwitcher;

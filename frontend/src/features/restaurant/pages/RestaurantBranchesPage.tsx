import { useState } from "react";
import { useBranches, useUpdateBranch } from "../hooks/restaurant-hooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Pencil, Power, PowerOff } from "lucide-react";
import DialogCreateBranch from "../components/DialogCreateBranch";
import DialogEditBranch from "../components/DialogEditBranch";
import type { Branch } from "../types";
import { useActiveRestaurantStore } from "@/store/active-restaurant-store";
import { Loader } from "@/components/shared/Loader";

const RestaurantBranchesPage = () => {
  const { data: branchesData, isLoading } = useBranches();
  const updateBranch = useUpdateBranch();
  const [open, setOpen] = useState(false);
  const [selectedBranch, setSelectedBranch] = useState<Branch | null>(null);
  const branches = Array.isArray(branchesData) ? branchesData : [];
  const activeRestaurant = useActiveRestaurantStore(
    (state) => state.activeRestaurant,
  );

  if (isLoading) return <Loader viewType="cards" count={6}/>;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Branches</h1>
        {activeRestaurant?.restaurantRole === "owner" && (
          <DialogCreateBranch open={open} setOpen={setOpen} />
        )}
        {selectedBranch && (
          <DialogEditBranch
            open={true}
            setOpen={(o) => {
              if (!o) setSelectedBranch(null);
            }}
            branch={selectedBranch}
          />
        )}
      </div>

      {branches.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center text-sm text-muted-foreground">
            No branches yet
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {branches.map((branch) => (
            <Card key={branch.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">{branch.label}</CardTitle>
                <div className="flex items-center gap-2">
                  <Button
                    size="icon-xs"
                    variant="ghost"
                    onClick={() => setSelectedBranch(branch)}
                  >
                    <Pencil className="size-3.5" />
                  </Button>
                  <Badge variant={branch.is_active ? "default" : "secondary"}>
                    {branch.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p>{branch.address_text}</p>
                <p>
                  {branch.opens_at.slice(0, 5)} — {branch.closes_at.slice(0, 5)}
                </p>
                <p>
                  Delivery fee:{" "}
                  {branch.delivery_fee
                    ? `${(branch.delivery_fee / 100).toFixed(2)} ${branch.currency}`
                    : "N/A"}
                </p>
                {branch.is_active ? (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="xs"
                      variant="outline"
                      onClick={() =>
                        updateBranch.mutate({
                          branchId: branch.id,
                          data: { accept_orders: !branch.accept_orders },
                        })
                      }
                    >
                      {branch.accept_orders ? (
                        <>
                          <PowerOff /> Pause
                        </>
                      ) : (
                        <>
                          <Power /> Resume
                        </>
                      )}
                    </Button>
                  </div>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantBranchesPage;

import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAdminRestaurants } from "../hooks/admin-hooks";
import {
  RESTAURANT_STATUS_FILTERS,
  STATUS_BADGE,
} from "../constants";
import { Loader } from "@/components/shared/Loader";
import { Loader2 } from "lucide-react";
import DialogEditRestaurantStatus from "../components/DialogEditRestaurantStatus";
import type { AdminRestaurantItem } from "../types";

const AdminRestaurantListPage = () => {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [editRestaurant, setEditRestaurant] =
    useState<AdminRestaurantItem | null>(null);

  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useAdminRestaurants(statusFilter || undefined);

  const restaurants = data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Restaurants</h1>

      <div className="flex gap-2 flex-wrap">
        {RESTAURANT_STATUS_FILTERS.map((f) => (
          <Button
            key={f.value}
            variant={statusFilter === f.value ? "default" : "outline"}
            size="sm"
            onClick={() => setStatusFilter(f.value)}
          >
            {f.label}
          </Button>
        ))}
      </div>

      {isLoading ? (
        <Loader viewType="table" count={5} />
      ) : restaurants.length === 0 ? (
        <p className="text-muted-foreground text-sm">No restaurants found.</p>
      ) : (
        <div className="space-y-3">
          <div className="border rounded-lg">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Branches</TableHead>
                  <TableHead className="text-center">Inactive</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead />
                </TableRow>
              </TableHeader>
              <TableBody>
                {restaurants.map((r) => (
                  <TableRow key={r.id}>
                    <TableCell className="font-medium">{r.name}</TableCell>
                    <TableCell>
                      <button
                        onClick={() => setEditRestaurant(r)}
                        className="cursor-pointer"
                      >
                        <Badge
                          variant="secondary"
                          className={`${STATUS_BADGE[r.status] ?? ""} hover:opacity-80`}
                        >
                          {r.status}
                        </Badge>
                      </button>
                    </TableCell>
                    <TableCell className="text-center">
                      {r.total_branches}
                    </TableCell>
                    <TableCell className="text-center">
                      {r.inactive_branches}
                    </TableCell>
                    <TableCell>
                      {new Date(r.created_at).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link
                        to={`/admin/restaurants/${r.id}`}
                        className="text-primary underline text-sm"
                      >
                        View
                      </Link>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {hasNextPage && (
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage && (
                  <Loader2 className="size-4 animate-spin" />
                )}
                Show more
              </Button>
            </div>
          )}
        </div>
      )}

      <DialogEditRestaurantStatus
        open={!!editRestaurant}
        onOpenChange={(open) => {
          if (!open) setEditRestaurant(null);
        }}
        restaurant={editRestaurant}
      />
    </div>
  );
};

export default AdminRestaurantListPage;

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Bike, Package } from "lucide-react";

const Delivery = () => {
  return (
    <div className="space-y-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Delivery Dashboard</h1>
        <p className="text-sm text-muted-foreground">
          Your delivery tasks and status
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Available Tasks</CardTitle>
            <Package className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">No tasks available right now</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-sm">Active Delivery</CardTitle>
            <Bike className="size-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">You are offline</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-sm">How it works</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>1. Go online to start receiving delivery tasks</p>
          <p>2. Accept an available task when you see one</p>
          <p>3. Pick up the order from the branch</p>
          <p>4. Deliver to the customer and mark as delivered</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default Delivery;

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Wifi, WifiOff } from "lucide-react";
import { usePresence } from "../hooks/usePresence";
import { useAgentTasks } from "../hooks/useAgentTasks";
import { useAgentSocket, playOfferSound } from "../hooks/useAgentSocket";
import { DeliveryOfferBanner } from "../components/DeliveryOfferBanner";
import { DeliveryActiveTask } from "../components/DeliveryActiveTask";
import { DeliveryTaskCard } from "../components/DeliveryTaskCard";
import { DeliveryEarnings } from "../components/DeliveryEarnings";
import { DELIVERY_TABS, type DeliveryTab } from "../constants";
import type { DeliveryOffer } from "../types";

const Delivery = () => {
  const { isOnline, becomeOnline, becomeOffline, tryOnlineAndOfflineLoading } =
    usePresence();
  const [activeTab, setActiveTab] = useState<DeliveryTab>(DELIVERY_TABS.ACTIVE);
  const [currentOffer, setCurrentOffer] = useState<DeliveryOffer | null>(null);

  const { data: tasks, isLoading } = useAgentTasks(activeTab);

  const handleOffer = useCallback((offer: DeliveryOffer) => {
    setCurrentOffer(offer);
    playOfferSound();
  }, []);

  useAgentSocket(handleOffer);

  return (
    <div className="space-y-6 p-4 sm:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Delivery Dashboard
          </h1>
          <p className="text-sm text-muted-foreground">
            {isOnline
              ? "You are online and receiving tasks"
              : "Go online to start receiving tasks"}
          </p>
        </div>
        <Button
          variant={isOnline ? "destructive" : "default"}
          onClick={isOnline ? becomeOffline : becomeOnline}
          disabled={tryOnlineAndOfflineLoading}
          size="lg"
        >
          {tryOnlineAndOfflineLoading ? (
            "Loading..."
          ) : isOnline ? (
            <>
              <WifiOff className="mr-2 size-4" />
              Go Offline
            </>
          ) : (
            <>
              <Wifi className="mr-2 size-4" />
              Go Online
            </>
          )}
        </Button>
      </div>

      {currentOffer && (
        <DeliveryOfferBanner
          offer={currentOffer}
          onDismiss={() => setCurrentOffer(null)}
        />
      )}

      <Tabs
        value={activeTab}
        onValueChange={(v) => setActiveTab(v as DeliveryTab)}
      >
        <TabsList>
          <TabsTrigger value={DELIVERY_TABS.ACTIVE}>Active</TabsTrigger>
          <TabsTrigger value={DELIVERY_TABS.DELIVERED}>Delivered</TabsTrigger>
          <TabsTrigger value={DELIVERY_TABS.EARNINGS}>Earnings</TabsTrigger>
        </TabsList>
      </Tabs>

      {activeTab === DELIVERY_TABS.ACTIVE && (
        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2].map((i) => (
                <div
                  key={i}
                  className="h-32 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : tasks?.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              {isOnline
                ? "No active deliveries. Waiting for offers..."
                : "Go online to receive delivery tasks."}
            </div>
          ) : (
            tasks?.map((task) => (
              <DeliveryActiveTask key={task.orderId} task={task} />
            ))
          )}
        </div>
      )}

      {activeTab === DELIVERY_TABS.DELIVERED && (
        <div className="space-y-3">
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 animate-pulse rounded-lg bg-muted"
                />
              ))}
            </div>
          ) : tasks?.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No completed deliveries yet.
            </div>
          ) : (
            tasks?.map((task) => (
              <DeliveryTaskCard key={task.orderId} task={task} />
            ))
          )}
        </div>
      )}

      {activeTab === DELIVERY_TABS.EARNINGS && <DeliveryEarnings />}
    </div>
  );
};

export default Delivery;

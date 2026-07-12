import { useQuery } from "@tanstack/react-query";
import { getAgentTasks, getAgentEarnings } from "../services/delivery-api";
import { DELIVERY_TABS, type DeliveryTab } from "../constants";

export function useAgentTasks(activeTab?: DeliveryTab) {
  return useQuery({
    queryKey: ["agent", "tasks", activeTab],
    queryFn: () => getAgentTasks(activeTab),
    enabled :!!activeTab && activeTab !== DELIVERY_TABS.EARNINGS
  });
}

export function useAgentEarnings(from?: string, to?: string) {
  return useQuery({
    queryKey: ["agent", "earnings", from, to],
    queryFn: () => getAgentEarnings(from, to),
  });
}

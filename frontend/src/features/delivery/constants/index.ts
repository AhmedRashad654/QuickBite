export const DELIVERY_TABS = {
  ACTIVE: "active",
  DELIVERED: "delivered",
  EARNINGS: "earnings",
} as const;

export type DeliveryTab = (typeof DELIVERY_TABS)[keyof typeof DELIVERY_TABS];

export const TASK_STATUS_LABELS: Record<string, string> = {
  assigned: "Assigned",
  picked: "Picked Up",
  delivered: "Delivered",
};

export const PING_INTERVAL_MS = 45_000;

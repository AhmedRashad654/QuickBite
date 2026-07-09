import { ORDER_STATUES } from "../types";

export const STATUS_VARIANTS: Record<string, string> = {
  pending_payment: "outline",
  placed: "secondary",
  accepted: "default",
  rejected: "destructive",
  preparing: "secondary",
  ready: "default",
  assigned: "outline",
  picked: "default",
  delivered: "default",
  cancelled: "destructive",
};

export const STATUS_LABELS: Record<string, string> = {
  pending_payment: "Pending Payment",
  placed: "Placed",
  accepted: "Accepted",
  rejected: "Rejected",
  preparing: "Preparing",
  ready: "Ready",
  assigned: "Assigned",
  picked: "Picked Up",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const filters = [
  { label: "All", value: undefined },
  { label: "Pending Payment", value: ORDER_STATUES.PENDING_PAYMENT },
  { label: "Placed", value: ORDER_STATUES.PLACED },
  { label: "Accepted", value: ORDER_STATUES.ACCEPTED },
  { label: "Preparing", value: ORDER_STATUES.PREPARING },
  { label: "Ready", value: ORDER_STATUES.READY },
  { label: "Assigned", value: ORDER_STATUES.ASSIGNED },
  { label: "Picked", value: ORDER_STATUES.PICKED },
  { label: "Delivered", value: ORDER_STATUES.DELIVERED },
  { label: "Cancelled", value: ORDER_STATUES.CANCELLED },
  { label: "Rejected", value: ORDER_STATUES.REJECTED },
];

export const currentYear = new Date().getUTCFullYear();
export const YEAR_OPTIONS = [
  currentYear,
  currentYear - 1,
  currentYear - 2,
  currentYear - 3,
];

import { Store, Users } from "lucide-react";

export const ADMIN_NAV_ITEMS = [
  { to: "/admin/restaurants", label: "Restaurants", icon: Store },
  { to: "/admin/agents", label: "Agents", icon: Users },
];

export const STATUS_BADGE: Record<string, string> = {
  active: "bg-green-100 text-green-700",
  pending: "bg-yellow-100 text-yellow-700",
  suspended: "bg-red-100 text-red-700",
  disabled: "bg-gray-100 text-gray-500",
};

export const RESTAURANT_STATUS_FILTERS = [
  { label: "All", value: "" },
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Disabled", value: "disabled" },
];

export const RESTAURANT_STATUSES = [
  { label: "Active", value: "active" },
  { label: "Pending", value: "pending" },
  { label: "Suspended", value: "suspended" },
  { label: "Disabled", value: "disabled" },
];

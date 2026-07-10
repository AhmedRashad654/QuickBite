import {
  ShoppingBag,
  Package,
  Store,
  Users,
  Settings,
  CreditCard,
} from "lucide-react";

export const NAV_ITEMS = [
  { to: "/restaurant/orders", label: "Orders", icon: ShoppingBag, end: true },
  { to: "/restaurant/products", label: "Products", icon: Package },
  { to: "/restaurant/branches", label: "Branches", icon: Store },
  { to: "/restaurant/members", label: "Members", icon: Users },
  { to: "/restaurant/settings", label: "Settings", icon: Settings },
  { to: "/restaurant/finance", label: "Finance", icon: CreditCard },
];

export const RESTAURANT_MESSAGES = {
  pending: {
    title: "The restaurant is under review.",
    description:
      "Your restaurant is currently inactive on the customer app. You can start adding branches, the menu, and team members to set up your account; however, none of these will be visible to customers until the account is activated by the administration.",
  },
  suspended: {
    title: "The restaurant is suspended.",
    description:
      "Your restaurant has been temporarily suspended by the administration. Access to some features might be restricted, and your branches are hidden from customers. Please contact support to resolve this.",
  },
  disabled: {
    title: "The restaurant is disabled.",
    description:
      "This restaurant account has been permanently disabled by the administration. It is completely hidden from the public system. Contact management for further details.",
  },
};

export const MEMBER_MESSAGES = {
  inactive: {
    title: "The account is inactive.",
    description:
      "Sorry, your access to this restaurant has been temporarily deactivated. Please contact the restaurant owner or management to activate your account.",
  },
  suspended: {
    title: "The account is suspended.",
    description:
      "Your staff account has been suspended due to administrative reasons or internal review. Please contact the business owner to reactivate your access.",
  },
};

export const STATUS_COLOR: Record<string, string> = {
  placed: "bg-blue-100 text-blue-700",
  accepted: "bg-green-100 text-green-700",
  preparing: "bg-yellow-100 text-yellow-700",
  ready: "bg-purple-100 text-purple-700",
  assigned: "bg-indigo-100 text-indigo-700",
  picked: "bg-gray-100 text-gray-700",
  delivered: "bg-gray-100 text-gray-500",
  cancelled: "bg-red-100 text-red-700",
  rejected: "bg-red-100 text-red-700",
};

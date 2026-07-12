export interface DeliveryTask {
  orderId: string;
  status: string;
  pickup: {
    branchId: number;
    lat: number | null;
    lng: number | null;
    name: string | null;
    addressText: string | null;
  };
  dropoff: { lat: number; lng: number; addressText: string };
  total: number;
  deliveryEarning: number;
  currency: string;
  paymentMethod: string;
  assignedAt: string | null;
  pickedAt: string | null;
  deliveredAt: string | null;
}

export interface DeliveryOffer {
  order_id: string;
  branch: {
    id: number;
    lat: number;
    lng: number;
    name: string;
    address_text: string;
  };
  dropoff: { lat: number; lng: number; address_text: string };
  total: number;
  currency: string;
  payment_method: string;
  expires_at: string;
}

export interface AgentEarningItem {
  orderId: string;
  amount: number;
  currency: string;
  earnedAt: string;
}

export interface AgentEarningsResponse {
  range: { from: string; to: string };
  totals: { count: number; sum: number; currency: string | null };
  items: AgentEarningItem[];
}

export interface AgentBalanceItem {
  currency: string;
  balance: number;
}

export interface AgentBalanceResponse {
  agent_id: number;
  balances: AgentBalanceItem[];
  asOf: string;
}

export interface AgentPayoutItem {
  id: number;
  amount: number;
  currency: string;
  status: string;
  provider_reference_id: string | null;
  createdAt: string;
}

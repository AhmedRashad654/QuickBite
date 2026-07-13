export type AdminRestaurantItem = {
  id: number;
  owner_id: number;
  name: string;
  logo_url: string | null;
  status: string;
  primary_country: string;
  created_at: string;
  total_branches: number;
  inactive_branches: number;
};

export type AdminAgentItem = {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  created_at: string;
};

export type AdminAgentBalance = {
  agent_id: number;
  balances: Array<{ currency: string; balance: number }>;
  asOf: string;
};

export type AdminAgentPayoutItem = {
  id: number;
  amount: number;
  currency: string;
  status: string;
  provider_reference_id: string | null;
  createdAt: string;
};

export type AdminRestaurantBalance = {
  restaurant_id: number;
  balances: Array<{ currency: string; balance: number }>;
  asOf: string;
};

export type CreatePayoutPayload = {
  amount: number;
  currency: string;
  provider_reference_id: string;
  note?: string;
};

export type AdminRestaurantPayoutItem = {
  id: number;
  amount: number;
  currency: string;
  status: string;
  provider_reference_id: string | null;
  createdAt: string;
};

export type AdminBranchItem = {
  id: number;
  restaurant_id: number;
  country_code: string;
  address_text: string;
  label: string;
  lat: number;
  lng: number;
  is_active: boolean;
  opens_at: string;
  closes_at: string;
  accept_orders: boolean;
  delivery_fee: number;
  currency: string;
  commission: number;
  created_at: string;
  updated_at: string;
};

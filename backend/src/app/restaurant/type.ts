import { RestaurantStatus } from "./enums.js";

export interface Restaurant {
    id: number;
    owner_id: number;
    name: string;
    logo_url: string | null;
    status: RestaurantStatus;
    primary_country: string;
    created_at: Date;
    updated_at: Date;
    status_updated_at: Date;
}

export interface AdminRestaurantItem {
  id: number;
  owner_id: number;
  name: string;
  logo_url: string | null;
  status: string;
  primary_country: string;
  created_at: Date;
  total_branches: number;
  inactive_branches: number;
}
export interface EarningsRange {
  from: Date;
  to: Date;
}

export interface AgentBalance {
  agent_id: number;
  currency: string;
  balance: number;
  updated_at: Date;
}

export interface PresenceMeta {
  lat: number;
  lng: number;
  lastSeenAt: number;
}

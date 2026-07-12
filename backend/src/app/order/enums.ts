export enum OrderStatus {
  PENDING_PAYMENT = 'pending_payment',
  PLACED = 'placed',
  ACCEPTED = 'accepted',
  REJECTED = 'rejected',
  PREPARING = 'preparing',
  READY = 'ready',
  ASSIGNED = 'assigned',
  PICKED = 'picked',
  DELIVERED = 'delivered',
  CANCELLED = 'cancelled',
  EXHAUSTED = 'exhausted',
}

export enum PaymentMethod {
  ONLINE = 'online',
  COD = 'cod',
}

export enum OrderType {
  DELIVERY = 'delivery',
  PICKUP = 'pickup',
}

export const CURRENCY = {
  EGP: "EGP",
  SAR: "SAR",
} as const;

export const COUNTRY = {
  EG: "EG",
  SA: "SA",
} as const;

export const PAYMENT_METHOD = {
  ONLINE : 'online',
  COD : 'cod',
}

export type Currency = (typeof CURRENCY)[keyof typeof CURRENCY];
export type Country = (typeof COUNTRY)[keyof typeof COUNTRY];
export type PaymentMethod = (typeof PAYMENT_METHOD)[keyof typeof PAYMENT_METHOD];
export const PAYMENT_METHOD = {
  online_payment: 'online_payment' as const,
  cash_on_delivery: 'cash_on_delivery' as const,
};

// Exporting types
export type TPaymentMethod = keyof typeof PAYMENT_METHOD;

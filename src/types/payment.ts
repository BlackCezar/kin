export const enum PaymentStatus {
  PAID = "PAID",
  VOID = "VOID",
  WAITING = "WAITING",
  CREATED = "CREATED",
  PROCESSING = "PROCESSING",
  CANCELED = "CANCELED",
  APPROVED = "APPROVED",
}

export interface IPayment {
  id: string;
  amount: number;
  status: PaymentStatus;
  description?: string;
  payload: any;
  tmpOrder: string;
  type: "sber" | "sbp" | "yookassa" | "yookassa_sbp";
}

export interface IPaymentType {
  code: string;
  isActive: boolean;
  title: string;
}

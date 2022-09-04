/**
 * 1. Initalized
 * 2. Pending
 */
export enum PaymentStatus {
  initalized = "INITALIZED",
  waitingForPayment = "WAITING_FOR_PAYMENT",
  pendingConfirmation = "PENDING_CONFIRMATION",
  paymentRecived = "PAYMENT_RECIVED",
  underpaid = "UNDERPAID",
  overpaid = "OVERPAID",
  completed = "COMPLETED",
  refunded = "REFUNDED",
  expired = "EXPIRED",
}

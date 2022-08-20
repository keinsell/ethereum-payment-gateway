/**
 * Payment Status stands for globally defined statuses that are used to define current state of payment declaration.
 *
 * 1. {@link PurchaseStatus.initalized **INITALIZED**}, payment declaration was created but it's not ready in our system yet to recive transaction.
 * 2. {@link PurchaseStatus.waitingForPayment **WAITING_FOR_PAYMENT**}, payment declaration will start to watch rotation wallet for payments, from now it's ready to be paid.
 * 3. {@link PurchaseStatus.pendingConfirmation **PENDING_CONFIRMATION**}, payment declaration seen payment on rotation wallet but will wait for at least one confirmation before proceeding.
 * 4. {@link PurchaseStatus.paymentRecived **PAYMENT_RECIVED**}, payment declaration confirmed deposit on rotation wallet. This can result in other status when conditions for **PAYMENT_RECIVED** will be not satified. For example: if end-customer will pay more than declared amount there we'll apply {@link PurchaseStatus.overpaid **OVERPAID**} status.
 * 5. {@link PurchaseStatus.overpaid **OVERPAID**} & {@link PurchaseStatus.underpaid **UNDERPAID**} situational statuses which will be applied when user will mistake amount sent to payment declaration. System will automatically try to resolve such issues, in case of **UNDERPAID** system will wait for additional payment from end-customer and if such will be not met until expiration time, transaction will be **REFUNDED**. If **OVERPAID** system will refund additional payment to end-customer by provided refund address, to reduce transaction size to previously set.
 * 6. {@link PurchaseStatus.delivery **DELIVERY**}, payment declaration is performing deliver to end-customer.
 * 7. {@link PurchaseStatus.refundPending **REFUND_PENDING**}, {@link PurchaseStatus.missingRefundAdress **MISSING_REFUND_ADDRESS**} are situational statuses of previously defined statuses, in cases where we aren't really able to perform refund for made transactions.
 * 8. {@link PurchaseStatus.completed **COMPLETED**}, {@link PurchaseStatus.chargeback **CHARGEBACK**} and {@link PurchaseStatus.expired **EXPIRED**}. Several statues that end payment delclaration just for different reasons.
 */
export enum PurchaseStatus {
  /** Default transaction status once they are created in system. */
  initalized = "INITALIZED",
  waitingForPayment = "WAITING_FOR_PAYMENT",
  pendingConfirmation = "PENDING_CONFIRMATION",
  paymentRecived = "PAYMENT_RECIVED",
  underpaid = "UNDERPAID",
  overpaid = "OVERPAID",
  delivery = "DELIVERY",
  refundPending = "REFUND_PENDING",
  missingRefundAdress = "MISSING_REFUND_ADDRESS",
  chargeback = "CHARGEBACK",
  expired = "EXPIRED",
  completed = "COMPLETED",
}

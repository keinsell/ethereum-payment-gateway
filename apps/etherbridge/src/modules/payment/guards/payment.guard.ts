import { Payment } from "../entities/payment.entity";

export class PaymentGuard {
  againstOverpaid(payment: Payment): boolean {
    return payment.paid > payment.amount;
  }

  againstExpired(payment: Payment): boolean {
    return payment.expiration < new Date();
  }
}

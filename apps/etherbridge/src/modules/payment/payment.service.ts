import { Payment } from "./entities/payment.entity";

export interface IPaymentService {
  initalizePayment(payment: Payment): Promise<Payment>;
}

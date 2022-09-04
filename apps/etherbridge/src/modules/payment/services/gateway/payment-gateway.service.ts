import { Payment } from "../../entities/payment.entity";

// TODO: PaymentService should use IPaymentGatewayService to reduce risk of failing payments by fail of one provided, from my actual progress on application (Sun 4 Sep) it seems nearly impossible to think about design of such service, so best option there will be write a zero-nesting service and then refactor it to use IPaymentGatewayService.

export interface IPaymentGatewayService {
  initalizePayment(currency: string, amount: number): Promise<Payment>;
}

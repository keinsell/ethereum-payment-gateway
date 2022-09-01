import { Payment } from "../../entities/payment.entity";

export interface IPaymentGatewayService {
  initalizePayment(currency: string, amount: number): Promise<Payment>;
}

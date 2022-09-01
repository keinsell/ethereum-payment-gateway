export interface IPaymentGatewayService {
  initalizePayment(currency: string, amount: number): Promise<Payment>;
}

import { EthereumPaymentService } from "./payment.service";

export namespace PaymentModule {
  export const service = new EthereumPaymentService();
}

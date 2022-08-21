import {
  PaymentCryptocurrency,
  PaymentCurrency,
} from "./payment-currency.enum";
import { PaymentGateway } from "./payment-gateway.enum";

export interface PaymentProperties {
  gateway: PaymentGateway;
  currency: PaymentCurrency | PaymentCryptocurrency;
  amount: number;
  paid: number;
  expiration: Date;
  creation: Date;
}

import Big from "big.js";
import { Dinero } from "dinero.js";
import { PaymentCryptocurrency } from "../../../modules/payment/entities/payment-currency.enum";

export interface ICurrencyRateProperties {
  currency: PaymentCryptocurrency;
  name: string;
  timestamp: Date;
  price: Dinero;
  maxSupply?: Big;
  circulatingSupply?: Big;
}

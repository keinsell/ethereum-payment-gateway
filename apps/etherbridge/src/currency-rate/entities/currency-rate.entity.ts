import Big from "big.js";
import { Dinero } from "dinero.js";
import { PurchaseCurrency } from "../../purchase/entities/purchase-currency.enum";

export interface ICurrencyRateProperties {
  currency: PurchaseCurrency;
  name: string;
  timestamp: Date;
  price: Dinero;
  maxSupply?: Big;
  circulatingSupply?: Big;
}

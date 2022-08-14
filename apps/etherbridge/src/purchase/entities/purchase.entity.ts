import Big from "big.js";
import { Dinero } from "dinero.js";
import { Entity } from "../../infra/entity";
import { PurchaseCurrency } from "./purchase-currency.enum";
import { PurchaseStatus } from "./purchase-status.enum";

export interface IPurchaseProperties {
  amount: Big;
  currency: PurchaseCurrency;
  paid: Big;
  esimatedPrice: Dinero;
  address: string;
  status: PurchaseStatus;
  expiration: Date;
  creation: Date;
}

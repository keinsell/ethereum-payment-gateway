import { Entity } from "../../../commons/entity/entity.impl";
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

export class Payment extends Entity implements PaymentProperties {
  gateway: PaymentGateway;
  currency: PaymentCurrency | PaymentCryptocurrency;
  amount: number;
  paid: number;
  expiration: Date;
  creation: Date;

  constructor(properties: PaymentProperties) {
    super();
    this.gateway = properties.gateway;
    this.currency = properties.currency;
    this.amount = properties.amount;
    this.paid = properties.paid;
    this.expiration = properties.expiration;
    this.creation = properties.creation;
  }
}

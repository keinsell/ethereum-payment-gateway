import { Entity } from "../../../commons/entity/entity.impl";
import { Wallet } from "../../wallet/entities/wallet.entity";
import {
  PaymentCryptocurrency,
  PaymentCurrency,
} from "./payment-currency.enum";
import { PaymentGateway } from "./payment-gateway.enum";
import { PaymentStatus } from "./payment-status.enum";

export interface PaymentProperties {
  gateway: PaymentGateway;
  currency: PaymentCurrency | PaymentCryptocurrency;
  amount: number;
  paid: number;
  expiration: Date;
  creation: Date;
  wallet: Wallet;
  status: PaymentStatus;
}

export class Payment extends Entity implements PaymentProperties {
  gateway: PaymentGateway;
  currency: PaymentCurrency | PaymentCryptocurrency;
  amount: number;
  paid: number;
  expiration: Date;
  creation: Date;
  wallet: Wallet;
  status: PaymentStatus;

  constructor(properties: PaymentProperties, id?: string) {
    super(id);
    this.gateway = properties.gateway;
    this.currency = properties.currency;
    this.amount = properties.amount;
    this.paid = properties.paid;
    this.expiration = properties.expiration;
    this.creation = properties.creation;
    this.wallet = properties.wallet;
    this.status = properties.status;
  }
}

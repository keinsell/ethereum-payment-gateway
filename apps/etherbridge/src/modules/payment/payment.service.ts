import { Dinero } from "dinero.js";
import { WalletModule } from "../wallet/wallet.module";
import { Payment } from "./entities/payment.entity";

// ? Probably there is need to expose diffrent DTOs per payment because credit-card will different than cryptocurrency.

export interface IPaymentService {
  initalizePayment(amount: Dinero): Promise<Payment>;
}

export class EthereumPaymentService implements IPaymentService {
  walletService = WalletModule.service;

  async initalizePayment(amount: Dinero): Promise<Payment> {
    const wallet = await this.walletService.getFreeWallet();
  }
}

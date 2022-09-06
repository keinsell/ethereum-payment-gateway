import BigNumber from "bignumber.js";
import { Dinero } from "dinero.js";
import ms from "ms";
import { WalletModule } from "../wallet/wallet.module";
import { PaymentCryptocurrency } from "./entities/payment-currency.enum";
import { PaymentGateway } from "./entities/payment-gateway.enum";
import { PaymentStatus } from "./entities/payment-status.enum";
import { Payment } from "./entities/payment.entity";
import { PaymentGuard } from "./guards/payment.guard";
import { PaymentRepository } from "./repository/payment.repository";

// ? Probably there is need to expose diffrent DTOs per payment because credit-card will different than cryptocurrency.

export interface IPaymentService {
  initalizePayment(amount: Dinero): Promise<Payment>;
  watchPayment(payment: Payment): Promise<void>;
  refreshStatus(payment: Payment): Promise<Payment>;
}

export class EthereumPaymentService implements IPaymentService {
  // TODO: PaymentGateway should be external class connected to cron or some task/mq queue which will automatically update status of payment. Additionaly there I think we should have some message queue to watch payment status instead doing it in cron which is significantly slower.

  gateway: PaymentGateway = PaymentGateway.internal;
  walletService = WalletModule.service;
  guard = new PaymentGuard();
  repository = new PaymentRepository();

  async initalizePayment(): Promise<Payment> {
    const wallet = await this.walletService.getFreeWallet();

    const payment = await this.repository.save(
      new Payment({
        gateway: this.gateway,
        currency: PaymentCryptocurrency.eth,
        amount: 1000,
        paid: 0,
        expiration: new Date(Date.now() + ms("3h")),
        creation: new Date(),
        wallet: wallet,
        status: PaymentStatus.initalized,
      })
    );

    return payment;
  }

  async watchPayment(payment: Payment): Promise<void> {}

  async refreshStatus(payment: Payment): Promise<Payment> {
    const { wallet } = payment;

    const updatedWallet = await this.walletService.synchronizeWalletBalance(
      wallet
    );

    payment.paid = new BigNumber(updatedWallet.balance.toString()).toNumber();

    if (this.guard.againstExpired(payment)) {
      payment.status = PaymentStatus.expired;
      return payment;
    }

    return payment;
  }
}

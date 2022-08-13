import { scheduleJob } from "node-schedule";
import { getBalanceOfAddress } from "../blockchain/blockchain.service";
import { DomesticEvent, KnownEvents } from "../infra/event";
import { findRotationWalletByAddress } from "../rotation-wallet/rotation-wallet.repository";
import {
  getOrGenerateFreeRotationWallet,
  updateConfirmedRotationWalletBalance,
} from "../rotation-wallet/rotation-wallet.service";
import {
  createNewPayment,
  findPaymentsWithStatus,
  IPayment,
  PaymentStatus,
  updatePaymentStatus,
} from "./payment.repository";

export async function initalizeNewPayment() {
  const availableRotationWallet = getOrGenerateFreeRotationWallet();

  const payment = createNewPayment({ wallet: availableRotationWallet });

  new DomesticEvent(KnownEvents.paymentInitalized, payment);

  return payment;
}

export async function watchPayment(payment: IPayment) {
  payment = updatePaymentStatus(payment, PaymentStatus.waitingForPayment);

  new DomesticEvent(KnownEvents.paymentWaitingForPayment, payment);
}

export async function watchPayments() {
  const payments = await findPaymentsWithStatus(
    PaymentStatus.waitingForPayment
  );

  for (const payment of payments) {
  }
}

scheduleJob("* * * * * *", async () => {
  const payments = await findPaymentsWithStatus(
    PaymentStatus.waitingForPayment
  );

  for (const payment of payments) {
    const rotationWallet = findRotationWalletByAddress(payment.address);

    if (!rotationWallet) {
      return;
    }

    updateConfirmedRotationWalletBalance(rotationWallet);

    if (rotationWallet.balance.gte(payment.amount)) {
      payment.status = PaymentStatus.confirmed;
      new DomesticEvent(KnownEvents.paymentConfirmed, payment);
    }

    if (payment.status === PaymentStatus.confirmed) {
      payment.status = PaymentStatus.completed;
      new DomesticEvent(KnownEvents.paymentCompleted, payment);
    }
  }
});

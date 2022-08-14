import { scheduleJob } from "node-schedule";
import { DomesticEvent, KnownEvents } from "../infra/event";
import { getBalanceDifferenceSince } from "../rotation-history/rotation-hisory.repository";
import {
  findRotationWalletByAddress,
  releaseRotationWallet,
} from "../rotation-wallet/rotation-wallet.repository";
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

function validatePaid(payment: IPayment) {
  if (payment.paid.eq(payment.amount)) {
    payment.status = PaymentStatus.confirmed;

    new DomesticEvent(KnownEvents.paymentConfirmed, payment);

    const rotationWallet = findRotationWalletByAddress(payment.address);

    if (rotationWallet) {
      releaseRotationWallet(rotationWallet);
    }

    return true;
  }
  return false;
}

function validateOverpaid(payment: IPayment) {
  if (payment.paid.gte(payment.amount)) {
    payment.status = PaymentStatus.overpaid;
    new DomesticEvent(KnownEvents.paymentOverpaid, payment);
    return true;
  }
  return false;
}

function validateUnderpaid(payment: IPayment) {
  if (payment.paid.lt(payment.amount) && payment.paid.gt(0)) {
    payment.status = PaymentStatus.underpaid;
    new DomesticEvent(KnownEvents.paymentUnderpaid, payment);
    return true;
  }
  return false;
}

function validateExpired(payment: IPayment) {
  if (payment.expiration.getTime() < new Date().getTime()) {
    payment.status = PaymentStatus.expired;
    new DomesticEvent(KnownEvents.paymentExpired, payment);
    return true;
  }
  return false;
}

export async function performPaymentCheck(payment: IPayment) {
  const rotationWallet = findRotationWalletByAddress(payment.address);

  if (!rotationWallet) {
    return;
  }

  updateConfirmedRotationWalletBalance(rotationWallet);

  const difference = getBalanceDifferenceSince(payment.creation);

  payment.paid = difference;

  validatePaid(payment);
  validateOverpaid(payment);
  validateUnderpaid(payment);
  validateExpired(payment);

  if (payment.status === PaymentStatus.confirmed) {
    payment.status = PaymentStatus.completed;
    new DomesticEvent(KnownEvents.paymentCompleted, payment);
  }
}

scheduleJob("* * * * * *", async () => {
  let payments = findPaymentsWithStatus(PaymentStatus.waitingForPayment);

  for await (const payment of payments) {
    await performPaymentCheck(payment);
  }
});

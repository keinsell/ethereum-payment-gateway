import { scheduleJob } from "node-schedule";
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

function validatePaid(payment: IPayment) {
  if (payment.paid.eq(payment.amount)) {
    payment.status = PaymentStatus.confirmed;
    new DomesticEvent(KnownEvents.paymentConfirmed, payment);
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

export async function performPaymentCheck(payment: IPayment) {
  const rotationWallet = findRotationWalletByAddress(payment.address);

  if (!rotationWallet) {
    return;
  }

  const updatedWalletBalance = await updateConfirmedRotationWalletBalance(
    rotationWallet
  );

  payment.paid = updatedWalletBalance.balance;

  validatePaid(payment);
  validateOverpaid(payment);
  validateUnderpaid(payment);

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

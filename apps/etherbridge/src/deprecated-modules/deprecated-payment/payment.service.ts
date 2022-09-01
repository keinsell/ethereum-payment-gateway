import Big from "big.js";
import { scheduleJob } from "node-schedule";
import {
  DomesticEvent,
  eventStorage,
  KnownEvents,
} from "../../infrastructure/event";
import { BlockchainModule } from "../../modules/blockchain/blockchain.module";
import { PurchaseInitalizedEvent } from "../../modules/purchase/events/purchase-initalized.event";
import { PurchaseOverpaidEvent } from "../../modules/purchase/events/purchase-overpaid.event";
import { PurchaseStartedWaitingForPayment } from "../../modules/purchase/events/purchase-started-watch-for-payment.event";
import { PurchaseUnderpaidEvent } from "../../modules/purchase/events/purchase-underpaid.event";
import { getConfirmedBalanceOnRotationWalletToDate } from "../deprecated-rotation-wallet-history/rotation-hisory.repository";
import {
  findRotationWalletByAddress,
  releaseRotationWallet,
} from "../deprecated-wallet/rotation-wallet.repository";
import {
  getOrGenerateFreeRotationWallet,
  payoutForWalletWithBiggestCapial,
} from "../deprecated-wallet/rotation-wallet.service";
import { PaymentCompletedEvent } from "./events/payment-completed.event";
import { ConfirmedDeclarationPaymentEvent } from "./events/payment-confirmed.event";
import { PaymentRecivedEvent } from "./events/payment-recived.event";
import {
  createNewPayment,
  findPaymentsById,
  findPaymentsWithStatus,
  IPayment,
  PaymentStatus,
  updatePayment,
  updatePaymentStatus,
} from "./payment.repository";

export async function initalizeNewPayment() {
  const availableRotationWallet = getOrGenerateFreeRotationWallet();

  const payment = createNewPayment({ wallet: availableRotationWallet });

  new PurchaseInitalizedEvent(payment);

  return payment;
}

export async function watchPayment(payment: IPayment) {
  payment = updatePaymentStatus(payment, PaymentStatus.waitingForPayment);

  new PurchaseStartedWaitingForPayment(payment);
}

function validatePaid(payment: IPayment) {
  if (payment.paid.eq(payment.amount)) {
    payment.status = PaymentStatus.confirmed;

    new ConfirmedDeclarationPaymentEvent(payment);

    const rotationWallet = findRotationWalletByAddress(payment.address);

    if (rotationWallet) {
      releaseRotationWallet(rotationWallet);
    }

    return true;
  }
  return false;
}

function validateOverpaid(payment: IPayment) {
  if (payment.paid.gt(payment.amount)) {
    payment.status = PaymentStatus.overpaid;

    new PurchaseOverpaidEvent(payment);

    // TODO: Refund additional payment to sender

    return true;
  }
  return false;
}

function validateUnderpaid(payment: IPayment) {
  if (payment.paid.lt(payment.amount) && payment.paid.gt(0)) {
    if (payment.status !== PaymentStatus.underpaid) {
      new PurchaseUnderpaidEvent(payment);
    }

    payment.status = PaymentStatus.underpaid;

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

function markPaymentAsSuccess(payment: IPayment) {
  payment.status = PaymentStatus.completed;
  updatePayment(payment);

  new PaymentCompletedEvent(payment);
}

function validateUnconfirmedPayment(payment: IPayment) {}

export async function performPaymentCheck(payment: IPayment) {
  const rotationWallet = findRotationWalletByAddress(payment.address);

  if (!rotationWallet) {
    return;
  }

  const difference =
    getConfirmedBalanceOnRotationWalletToDate(
      rotationWallet,
      payment.creation
    ) ?? new Big(0);

  payment.paid = difference;

  validateExpired(payment);

  validateUnconfirmedPayment(payment);

  const isPaid = validatePaid(payment);
  const isOverpaid = validateOverpaid(payment);
  const isUnderpaid = validateUnderpaid(payment);

  if (payment.status === PaymentStatus.confirmed) {
    new PaymentRecivedEvent(payment);
    payment.status = PaymentStatus.delivery;
  }

  releaseRotationWallet(rotationWallet);
}

scheduleJob("* * * * * *", async () => {
  let payments = findPaymentsWithStatus(PaymentStatus.waitingForPayment);

  payments = [...payments, ...findPaymentsWithStatus(PaymentStatus.underpaid)];

  for await (const payment of payments) {
    await performPaymentCheck(payment);
  }
});

scheduleJob("* * * * * *", async () => {
  let payments = findPaymentsWithStatus(PaymentStatus.delivery);

  for await (const payment of payments) {
    markPaymentAsSuccess(payment);
    await payoutForWalletWithBiggestCapial();
  }
});

import { Big } from "big.js";
import { nanoid } from "nanoid";
import { DomesticEvent, KnownEvents } from "./event";
import { randmizePaymentValue } from "./randomizer";
import {
  getRotationWalletByAddress,
  updateConfirmedRotationWalletBalance,
  useRotationWallet,
} from "./wallets";
import schedule from "node-schedule";

export enum PaymentStatus {
  initalized = "INITALIZED",
  waitingForPayment = "WAITING_FOR_PAYMENT",
  underpaid = "UNDERPAID",
  overpaid = "OVERPAID",
  paymentRecived = "PAYMENT_RECIVED",
  pendingConfirmation = "PENDING_CONFIRMALATION",
  confirmed = "CONFIRMED",
  refunded = "REFUNDED",
  completed = "COMPLETED",
}

export interface IPayment {
  id: string;
  amount: Big;
  address: string;
  status: PaymentStatus;
}

const PaymentState: IPayment[] = [];

export async function initalizePayment() {
  const availableRotationWallet = await useRotationWallet();

  const payment: IPayment = {
    id: nanoid(),
    amount: new Big(randmizePaymentValue()),
    address: availableRotationWallet.address,
    status: PaymentStatus.initalized,
  };

  PaymentState.push(payment);

  new DomesticEvent(KnownEvents.paymentInitalized, payment);

  // Update Status to WaitingForPayment
  payment.status = PaymentStatus.waitingForPayment;
  new DomesticEvent(KnownEvents.paymentWaitingForPayment, payment);

  PaymentState.splice(PaymentState.indexOf(payment), 1, payment);

  return payment;
}

export async function checkPayment(payment: IPayment) {
  const rotationWallet = getRotationWalletByAddress(payment.address);

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

export async function watchPayment(payment: IPayment) {
  payment.status = PaymentStatus.waitingForPayment;
  PaymentState.splice(PaymentState.indexOf(payment), 1, payment);

  // TODO: wait for payment
}

export async function startBackgroundCheckerService() {
  return schedule.scheduleJob("* * * * * *", async () => {
    const purchasesWithoutPayments = PaymentState.filter(
      (payment) => payment.status === PaymentStatus.waitingForPayment
    );
    for (const payment of purchasesWithoutPayments) {
      checkPayment(payment);
    }
  });
}

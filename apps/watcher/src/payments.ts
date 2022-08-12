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
import ms from "ms";

export enum PaymentStatus {
  /** Default transaction status once they are created in system. */
  initalized = "INITALIZED",
  /** Status of Paymment when it's added to our balance listener which will watch for payments. */
  waitingForPayment = "WAITING_FOR_PAYMENT",
  /** Status of {@link IPayment payment} when user will deposit too little, such transactions will wait until expiration date if deposit will be not satisfied to declared amount system should send refund transaction. */
  underpaid = "UNDERPAID",
  /**
   * Status of {@link IPayment payment} which happens when end-customer deposited too much capital than was previously declared by system. Such transaction will result in sending declared amount and refunding additional funds deposited by user.
   */
  overpaid = "OVERPAID",
  /**
   * Status of {@link IPayment payment} when we catch unconfirmed balance on our wallets, this step will result in {@link PaymentStatus.pendingConfirmation `PENDING_CONFIRMATION`} status as we should wait for at least one confirmation.
   */
  paymentRecived = "PAYMENT_RECIVED",
  pendingConfirmation = "PENDING_CONFIRMATION",
  confirmed = "CONFIRMED",
  /** Performing internal actions to complete transaction such as accouting goods which should be acciured by performing declared transaction. */
  delivery = "DELIVERY",
  /** Status where we returned deposited funds to end-customer as declared amount could not be satified and we could not take actions. */
  refunded = "REFUNDED",
  expired = "EXPIRED",
  completed = "COMPLETED",
  completedWithRefund = "COMPLETED_WITH_REFUND",
}

export interface IPayment {
  id: string;
  amount: Big;
  address: string;
  status: PaymentStatus;
  expiration: Date;
}

const PaymentState: IPayment[] = [];

export async function initalizePayment() {
  const availableRotationWallet = await useRotationWallet();

  const payment: IPayment = {
    id: nanoid(),
    amount: new Big(randmizePaymentValue()),
    address: availableRotationWallet.address,
    status: PaymentStatus.initalized,
    expiration: new Date(Date.now() + ms("15m")),
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
  // Update status to waiting for payment
  payment.status = PaymentStatus.waitingForPayment;
  PaymentState.splice(PaymentState.indexOf(payment), 1, payment);

  // TODO: Listen for unconfirmed payments until IPayment expiration time.

  // TODO: Listend for confirmed balance of Purchase

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

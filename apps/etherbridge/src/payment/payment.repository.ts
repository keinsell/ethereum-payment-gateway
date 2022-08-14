import Big from "big.js";
import ms from "ms";
import { nanoid } from "nanoid";
import random from "random-js";
import { IRotationWallet } from "../rotation-wallet/rotation-wallet.repository";

/**
 * Payment Status stands for globally defined statuses that are used to define current state of payment declaration.
 *
 * 1. {@link PaymentStatus.initalized **INITALIZED**}, payment declaration was created but it's not ready in our system yet to recive transaction.
 * 2. {@link PaymentStatus.waitingForPayment **WAITING_FOR_PAYMENT**}, payment declaration will start to watch rotation wallet for payments, from now it's ready to be paid.
 * 3. {@link PaymentStatus.pendingConfirmation **PENDING_CONFIRMATION**}, payment declaration seen payment on rotation wallet but will wait for at least one confirmation before proceeding.
 * 4. {@link PaymentStatus.paymentRecived **PAYMENT_RECIVED**}, payment declaration confirmed deposit on rotation wallet. This can result in other status when conditions for **PAYMENT_RECIVED** will be not satified. For example: if end-customer will pay more than declared amount there we'll apply {@link PaymentStatus.overpaid **OVERPAID**} status.
 * 5. {@link PaymentStatus.overpaid **OVERPAID**} & {@link PaymentStatus.underpaid **UNDERPAID**} situational statuses which will be applied when user will mistake amount sent to payment declaration. System will automatically try to resolve such issues, in case of **UNDERPAID** system will wait for additional payment from end-customer and if such will be not met until expiration time, transaction will be **REFUNDED**. If **OVERPAID** system will refund additional payment to end-customer by provided refund address, to reduce transaction size to previously set.
 * 6. {@link PaymentStatus.delivery **DELIVERY**}, payment declaration is performing deliver to end-customer.
 * 7. {@link PaymentStatus.refundPending **REFUND_PENDING**}, {@link PaymentStatus.missingRefundAdress **MISSING_REFUND_ADDRESS**} are situational statuses of previously defined statuses, in cases where we aren't really able to perform refund for made transactions.
 * 8. {@link PaymentStatus.completed **COMPLETED**}, {@link PaymentStatus.refunded **REFUNDED**} and {@link PaymentStatus.expired **EXPIRED**}. Several statues that end payment delclaration just for different reasons.
 */
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
}

export interface IPayment {
  id: string;
  amount: Big;
  currency: string;
  paid: Big;
  address: string;
  status: PaymentStatus;
  expiration: Date;
  creation: Date;
}

const PaymentState: IPayment[] = [];

export function getPaymentValue() {
  // create a Mersenne Twister-19937 that is auto-seeded based on time and other random values
  const engine = random.MersenneTwister19937.autoSeed();
  // create a distribution that will consistently produce integers within inclusive range [0, 99].
  // const distribution = random.integer(1, 100_000_000);
  const distribution = random.integer(1, 3);
  // generate a number that is guaranteed to be within [0, 99] without any particular bias.

  return distribution(engine); // / 1_000_000_000;
}

export function createNewPayment(data: { wallet: IRotationWallet }) {
  const createPayment: IPayment = {
    id: nanoid(),
    amount: Big(getPaymentValue()),
    currency: "ETH",
    address: data.wallet.address,
    status: PaymentStatus.initalized,
    paid: Big(0),
    expiration: new Date(Date.now() + ms("5m")),
    creation: new Date(),
  };

  PaymentState.push(createPayment);

  return createPayment;
}

export function updatePayment(payment: IPayment) {
  PaymentState.splice(PaymentState.indexOf(payment), 1, payment);
}

export function updatePaymentStatus(payment: IPayment, status: PaymentStatus) {
  payment.status = status;
  updatePayment(payment);
  return payment;
}

export function findPaymentsWithStatus(status: PaymentStatus) {
  return PaymentState.filter((payment) => payment.status === status);
}

export function findPaymentsById(id: string) {
  return PaymentState.find((payment) => payment.id === id);
}

export function updatePaymentPaid(payment: IPayment, paid: Big) {
  payment.paid = paid;
  updatePayment(payment);
  return payment;
}

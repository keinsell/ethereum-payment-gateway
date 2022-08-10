import Web3 from "web3";
import BigInt from "big.js";
import { nanoid } from "nanoid";
import ganache from "ganache";
import HDWalletProvider from "@truffle/hdwallet-provider";
import random from "random-js";
import signale from "signale";
import schedule from "node-schedule";
import chalk from "chalk";

const RPC_PROVIDER = "http://127.0.0.1:8545";

enum PaymentStatus {
  INITALIZED = "INITALIZED",
  PAYMENT_RECIVED = "PAYMENT_RECIVED",
  PENDING_CONFIRMALATION = "PENDING_CONFIRMALATION",
  CONFIRMED = "CONFIRMED",
  REFUNDED = "REFUNDED",
  COMPLETED = "COMPLETED",
}

interface IPaymentRequest {
  id: string;
  depositAddresss: string;
  amount: BigInt;
  status: PaymentStatus;
}

enum WalletState {
  BUSY = "BUSY",
  AVAILAIBLE = "AVAILAIBLE",
}

interface IRotationWallet {
  address: string;
  balance: BigInt;
  state: WalletState;
  privateKey: string;
}

// create a Mersenne Twister-19937 that is auto-seeded based on time and other random values
const engine = random.MersenneTwister19937.autoSeed();
// create a distribution that will consistently produce integers within inclusive range [0, 99].
const distribution = random.integer(1_000, 100_000);
// generate a number that is guaranteed to be within [0, 99] without any particular bias.
function getPaymentRequestValue(): number {
  return distribution(engine) / 1_000_000_000;
}

const provider = ganache.provider();
const web3 = new Web3(RPC_PROVIDER);

await provider.once("connect");

const mnemonicManager: HDWalletProvider = new HDWalletProvider(
  "motor garbage casino weather ugly symbol enemy truck play vehicle wall sing",
  RPC_PROVIDER
);

const rotationWalletsState: IRotationWallet[] = [];
const paymentRequestState: IPaymentRequest[] = [];

export async function createNewRotationWallet(): Promise<IRotationWallet> {
  const walletManager = new Web3(mnemonicManager);
  const generatedWallet = await walletManager.eth.accounts.create();

  const newWallet = {
    address: generatedWallet.address,
    balance: BigInt(0),
    state: WalletState.AVAILAIBLE,
    privateKey: generatedWallet.privateKey,
  };

  rotationWalletsState.push(newWallet);
  return newWallet;
}

export async function getAvailableRotationWallet(): Promise<IRotationWallet> {
  const availableWallet = rotationWalletsState.find(
    (wallet) => wallet.state === WalletState.AVAILAIBLE
  );
  if (availableWallet) {
    availableWallet.state = WalletState.BUSY;
    return availableWallet;
  } else {
    const newWallet = await createNewRotationWallet();
    newWallet.state = WalletState.BUSY;
    return newWallet;
  }
}

function PaymentRequestCreatedEvent(paymentRequest: IPaymentRequest) {
  signale.info(
    `Generated new payment request ${chalk.green(paymentRequest.id)}`
  );
  signale.log(
    `Escrow will await payment equal to ${chalk.yellowBright(
      paymentRequest.amount
    )} at ${chalk.yellowBright(paymentRequest.depositAddresss)}`
  );
}

export async function generatePaymentRequest() {
  const availableRotationWallet = await getAvailableRotationWallet();

  const paymentRequest: IPaymentRequest = {
    id: nanoid(5),
    depositAddresss: availableRotationWallet.address,
    amount: BigInt(getPaymentRequestValue()),
    status: PaymentStatus.INITALIZED,
  };

  paymentRequestState.push(paymentRequest);

  PaymentRequestCreatedEvent(paymentRequest);

  return paymentRequest;
}

async function checkAddressBalance(address: string): Promise<BigInt> {
  const balance = await web3.eth.getBalance(address);
  return BigInt(balance);
}

async function PaymentRequestPaidEvent(paymentRequest: IPaymentRequest) {
  signale.success(`Payment request ${paymentRequest.id} paid!`);
}

async function checkPaymentStatus(payment: IPaymentRequest) {
  const paymentBalance = await checkAddressBalance(payment.depositAddresss);

  // Once transaction appeared but not confirmed we should check that

  //   if (payment.status === PaymentStatus.PAYMENT_RECIVED) {
  //     payment.status = PaymentStatus.PENDING_CONFIRMALATION;
  //   }

  if (paymentBalance.gte(payment.amount)) {
    payment.status = PaymentStatus.PAYMENT_RECIVED;
    paymentRequestState.splice(
      paymentRequestState.indexOf(payment),
      1,
      payment
    );
    PaymentRequestPaidEvent(payment);
    return;
  }

  signale.pending(`${payment.id} is waiting for payment...`);
  return;
}

let checkPaymentQueueStatus: boolean = false;

async function performDeepCheckOfPaymentRequests() {
  if (checkPaymentQueueStatus) {
    return;
  }
  checkPaymentQueueStatus = true;
  for await (const payment of paymentRequestState) {
    await checkPaymentStatus(payment);
  }
  checkPaymentQueueStatus = false;
}

await generatePaymentRequest();
const job = schedule.scheduleJob(
  "1 * * * * *",
  performDeepCheckOfPaymentRequests
);

import { subscribeToEthereumTransactions } from "./blockchain.js";
import { initalizePayment, startBackgroundCheckerService } from "./payments.js";
import {
  useRotationWallet,
  watchForRotationWalletBalanceUpdate,
} from "./wallets.js";

startBackgroundCheckerService();
await initalizePayment();

import { initalizeNewPayment, watchPayment } from "./payment/payment.service";
import {
  pendingTransactionListener,
  transactionConfirmationListener,
} from "./rotation-wallet/rotation-wallet.service";

pendingTransactionListener();
transactionConfirmationListener();

const payment = await initalizeNewPayment();
await watchPayment(payment);
